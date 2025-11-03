import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Atividades() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atividades</h1>
          <p className="text-muted-foreground mt-2">Acompanhe as atividades dos corretores</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Atividade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atividades</CardTitle>
          <CardDescription>Ligações, visitas e reuniões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma atividade registrada ainda.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
