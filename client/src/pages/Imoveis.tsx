import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Imoveis() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imóveis</h1>
          <p className="text-muted-foreground mt-2">Gerencie o estoque de imóveis da imobiliária</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Imóvel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Imóveis</CardTitle>
          <CardDescription>Todos os imóveis cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum imóvel cadastrado ainda. Clique em "Novo Imóvel" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
