# Guia de Implementação - Sistema de Gestão Imobiliária

Este documento fornece instruções passo a passo para implementar as funcionalidades avançadas do sistema.

## 1. Formulários e Validação de Dados

### Status: ✅ PARCIALMENTE IMPLEMENTADO

O componente `FormImovel.tsx` foi criado com validação completa usando Zod e React Hook Form.

**Próximos passos:**
1. Criar componentes similares para outros módulos:
   - `FormProprietario.tsx`
   - `FormInquilino.tsx`
   - `FormLead.tsx`
   - `FormCorretor.tsx`

2. Integrar os formulários nas páginas correspondentes:
```tsx
// client/src/pages/Imoveis.tsx
import { FormImovel } from "@/components/FormImovel";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Imoveis() {
  const [showForm, setShowForm] = useState(false);
  const proprietarios = trpc.proprietarios.list.useQuery();

  return (
    <div>
      {showForm && (
        <FormImovel
          proprietarios={proprietarios.data || []}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

---

## 2. Upload de Fotos e Galeria

### Status: ⏳ NÃO INICIADO

**Implementação recomendada:**

1. Criar componente `PhotoUploader.tsx`:
```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { storagePut } from "@/server/storage";

export function PhotoUploader({ imovelId, onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} não é uma imagem válida`);
          continue;
        }

        // Comprimir imagem
        const compressed = await compressImage(file);
        
        // Upload para S3
        const fileKey = `imoveis/${imovelId}/${Date.now()}-${file.name}`;
        const { url } = await storagePut(fileKey, compressed, file.type);
        
        // Salvar referência no banco
        await trpc.fotosImoveis.create.mutate({
          imovelId,
          url,
          fileKey,
        });
      }
      toast.success("Fotos enviadas com sucesso!");
      onUploadSuccess?.();
    } catch (error) {
      toast.error("Erro ao enviar fotos");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onDragOver={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
    >
      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-2 text-sm">Arraste fotos aqui ou clique para selecionar</p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => uploadFiles(Array.from(e.target.files || []))}
        className="hidden"
        id="photo-input"
      />
      <label htmlFor="photo-input">
        <Button variant="outline" asChild>
          <span>Selecionar Fotos</span>
        </Button>
      </label>
    </div>
  );
}

async function compressImage(file: File): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(file);
  });
}
```

2. Criar componente `PhotoGallery.tsx`:
```tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function PhotoGallery({ imovelId }) {
  const fotos = trpc.fotosImoveis.getByImovelId.useQuery({ imovelId });
  const updateMutation = trpc.fotosImoveis.update.useMutation();
  const deleteMutation = trpc.fotosImoveis.delete.useMutation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {fotos.data?.map((foto) => (
        <Card key={foto.id} className="relative overflow-hidden group">
          <img src={foto.url} alt="Foto" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateMutation.mutate({ id: foto.id, capa: 1 })}
            >
              <Star className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteMutation.mutate({ id: foto.id })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

---

## 3. Busca e Filtros Avançados

### Status: ⏳ NÃO INICIADO

**Implementação recomendada:**

Adicionar procedimentos tRPC para busca:
```ts
// server/routers.ts
imoveis: router({
  search: protectedProcedure.input(z.object({
    query: z.string().optional(),
    tipo: z.string().optional(),
    precoMin: z.number().optional(),
    precoMax: z.number().optional(),
    cidade: z.string().optional(),
    status: z.string().optional(),
    limit: z.number().default(20),
    offset: z.number().default(0),
  })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    
    let query = db.select().from(imoveis);
    
    if (input.query) {
      query = query.where(
        or(
          like(imoveis.titulo, `%${input.query}%`),
          like(imoveis.descricao, `%${input.query}%`)
        )
      );
    }
    
    if (input.tipo) {
      query = query.where(eq(imoveis.tipo, input.tipo));
    }
    
    if (input.precoMin) {
      query = query.where(gte(imoveis.precoVenda, input.precoMin));
    }
    
    if (input.precoMax) {
      query = query.where(lte(imoveis.precoVenda, input.precoMax));
    }
    
    if (input.cidade) {
      query = query.where(eq(imoveis.cidade, input.cidade));
    }
    
    if (input.status) {
      query = query.where(eq(imoveis.status, input.status));
    }
    
    return query.limit(input.limit).offset(input.offset);
  }),
}),
```

Criar componente `SearchFilters.tsx`:
```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    query: "",
    tipo: "",
    precoMin: "",
    precoMax: "",
    cidade: "",
    status: "",
  });

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <Input
        placeholder="Buscar por título ou descrição..."
        value={filters.query}
        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select value={filters.tipo} onValueChange={(v) => setFilters({ ...filters, tipo: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="apartamento">Apartamento</SelectItem>
            <SelectItem value="casa">Casa</SelectItem>
            <SelectItem value="terreno">Terreno</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Preço mín"
          value={filters.precoMin}
          onChange={(e) => setFilters({ ...filters, precoMin: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Preço máx"
          value={filters.precoMax}
          onChange={(e) => setFilters({ ...filters, precoMax: e.target.value })}
        />

        <Input
          placeholder="Cidade"
          value={filters.cidade}
          onChange={(e) => setFilters({ ...filters, cidade: e.target.value })}
        />
      </div>

      <Button onClick={() => onSearch(filters)} className="w-full">
        Buscar
      </Button>
    </div>
  );
}
```

---

## 4. Integração com Google Maps

### Status: ⏳ NÃO INICIADO

**Implementação recomendada:**

Use o componente `Map.tsx` que já está disponível no template:

```tsx
import { Map } from "@/components/Map";
import { useEffect, useState } from "react";

export function ImovelMap({ imovel }) {
  const [mapReady, setMapReady] = useState(false);

  const handleMapReady = (map: google.maps.Map, service: any) => {
    if (imovel.latitude && imovel.longitude) {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(imovel.latitude),
          lng: parseFloat(imovel.longitude),
        },
        map,
        title: imovel.titulo,
      });

      map.setCenter(marker.getPosition()!);
    }
    setMapReady(true);
  };

  return (
    <div className="w-full h-96">
      <Map onMapReady={handleMapReady} />
    </div>
  );
}
```

---

## 5. Sistema de Notificações

### Status: ⏳ NÃO INICIADO

**Implementação recomendada:**

Usar o sistema de notificações integrado do Manus:

```ts
// server/routers.ts
import { notifyOwner } from "./_core/notification";

transacoes: router({
  create: protectedProcedure.input(z.object({
    // ... campos
  })).mutation(async ({ input }) => {
    const result = await db.createTransacao(input);
    
    // Notificar sobre nova venda
    await notifyOwner({
      title: "Nova Venda Registrada",
      content: `Venda de ${input.valor} registrada em ${new Date().toLocaleDateString()}`,
    });
    
    return result;
  }),
}),
```

Criar componente `NotificationCenter.tsx`:
```tsx
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </Button>
      
      {/* Dropdown com notificações */}
    </div>
  );
}
```

---

## 6. Geração de Relatórios em PDF

### Status: ⏳ NÃO INICIADO

**Implementação recomendada:**

```tsx
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function gerarRelatorioPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");
  
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
}

// Usar em um componente
<Button onClick={() => gerarRelatorioPDF("relatorio-vendas", "vendas.pdf")}>
  Baixar PDF
</Button>
```

---

## 7. Exportação de Dados para Excel

### Status: ⏳ NÃO INICIADO

**Implementação recomendada:**

```tsx
import * as XLSX from "xlsx";

export function exportarParaExcel(dados: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// Usar em um componente
const imoveis = trpc.imoveis.list.useQuery();

<Button onClick={() => exportarParaExcel(imoveis.data || [], "imoveis")}>
  Exportar para Excel
</Button>
```

---

## 8. Melhorias de UX

### Status: ⏳ NÃO INICIADO

**Implementação recomendada:**

1. **Modais de Confirmação:**
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Deletar</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
    <AlertDialogDescription>
      Esta ação não pode ser desfeita.
    </AlertDialogDescription>
    <AlertDialogAction onClick={handleDelete}>
      Deletar
    </AlertDialogAction>
    <AlertDialogCancel>Cancelar</AlertDialogCancel>
  </AlertDialogContent>
</AlertDialog>
```

2. **Loading States:**
```tsx
import { Skeleton } from "@/components/ui/skeleton";

{isLoading ? (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
) : (
  // conteúdo
)}
```

3. **Paginação:**
```tsx
import { Button } from "@/components/ui/button";

<div className="flex justify-between items-center mt-4">
  <Button onClick={() => setPage(page - 1)} disabled={page === 0}>
    Anterior
  </Button>
  <span>Página {page + 1}</span>
  <Button onClick={() => setPage(page + 1)}>
    Próxima
  </Button>
</div>
```

---

## Próximos Passos

1. **Escolha uma funcionalidade** da lista acima
2. **Implemente seguindo o guia** fornecido
3. **Teste completamente** antes de passar para a próxima
4. **Commit e push** para o GitHub
5. **Crie um checkpoint** no Manus

## Recursos Úteis

- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [XLSX Documentation](https://github.com/SheetJS/sheetjs)
- [Google Maps API](https://developers.google.com/maps)

---

**Última atualização:** 2025-11-03
