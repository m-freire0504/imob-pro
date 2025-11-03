import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Inquilinos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquilinos</h1>
          <p className="text-muted-foreground mt-2">Gerencie os inquilinos</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Inquilino
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Inquilinos</CardTitle>
          <CardDescription>Todos os inquilinos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum inquilino cadastrado ainda.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
