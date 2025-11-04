import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Instagram, Twitter, MessageCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido"),
  creci: z.string().min(3, "CRECI inválido"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  equipe: z.string().optional(),
  metaVendas: z.number().optional(),
  metaLocacoes: z.number().optional(),
  metaCaptacoes: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormCorretorProps {
  onSuccess?: () => void;
  initialData?: Partial<FormValues>;
}

export function FormCorretor({ onSuccess, initialData }: FormCorretorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createMutation = trpc.corretores.create.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      nome: initialData?.nome || "",
      cpf: initialData?.cpf || "",
      creci: initialData?.creci || "",
      email: initialData?.email || "",
      telefone: initialData?.telefone || "",
      whatsapp: initialData?.whatsapp || "",
      instagram: initialData?.instagram || "",
      twitter: initialData?.twitter || "",
      equipe: initialData?.equipe || "",
      metaVendas: initialData?.metaVendas || 0,
      metaLocacoes: initialData?.metaLocacoes || 0,
      metaCaptacoes: initialData?.metaCaptacoes || 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await createMutation.mutateAsync(data);
      toast.success("Corretor cadastrado com sucesso! Uma senha temporária foi enviada por email.");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao cadastrar corretor");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Corretor</CardTitle>
        <CardDescription>Cadastre um novo corretor no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome *</label>
                <Input
                  placeholder="Nome completo"
                  {...form.register("nome")}
                  disabled={isLoading}
                />
                {form.formState.errors.nome && (
                  <p className="text-xs text-red-500">{form.formState.errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CPF *</label>
                <Input
                  placeholder="000.000.000-00"
                  {...form.register("cpf")}
                  disabled={isLoading}
                />
                {form.formState.errors.cpf && (
                  <p className="text-xs text-red-500">{form.formState.errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CRECI *</label>
                <Input
                  placeholder="123456"
                  {...form.register("creci")}
                  disabled={isLoading}
                />
                {form.formState.errors.creci && (
                  <p className="text-xs text-red-500">{form.formState.errors.creci.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  {...form.register("email")}
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <Input
                  placeholder="(11) 99999-9999"
                  {...form.register("telefone")}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </label>
                <Input
                  placeholder="(11) 99999-9999"
                  {...form.register("whatsapp")}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Redes Sociais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </label>
                <Input
                  placeholder="@usuario"
                  {...form.register("instagram")}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  X (Twitter)
                </label>
                <Input
                  placeholder="@usuario"
                  {...form.register("twitter")}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Informações Profissionais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Informações Profissionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Equipe</label>
                <Input
                  placeholder="Nome da equipe"
                  {...form.register("equipe")}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meta de Vendas</label>
                <Input
                  type="number"
                  placeholder="0"
                  {...form.register("metaVendas", { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meta de Locações</label>
                <Input
                  type="number"
                  placeholder="0"
                  {...form.register("metaLocacoes", { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meta de Captações</label>
                <Input
                  type="number"
                  placeholder="0"
                  {...form.register("metaCaptacoes", { valueAsNumber: true })}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar Corretor"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
