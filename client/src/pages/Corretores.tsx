import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Corretores() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Corretores</h1>
          <p className="text-muted-foreground mt-2">Gerencie os corretores da imobiliária</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Corretor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Corretores</CardTitle>
          <CardDescription>Todos os corretores cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum corretor cadastrado ainda.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
