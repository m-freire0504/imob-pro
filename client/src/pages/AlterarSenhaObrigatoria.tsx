import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

export default function AlterarSenhaObrigatoria() {
  const [, setLocation] = useLocation();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [corretor, setCorretor] = useState<any>(null);

  useEffect(() => {
    // Verificar se o usuário veio do login
    const corretorData = localStorage.getItem("corretor");
    const senhaTemporaria = localStorage.getItem("senhaTemporaria");

    if (!corretorData || !senhaTemporaria) {
      setLocation("/login-corretor");
      return;
    }

    setCorretor(JSON.parse(corretorData));
  }, [setLocation]);

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (novaSenha.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (novaSenha === localStorage.getItem("senhaTemporaria")) {
      toast.error("A nova senha não pode ser igual à senha temporária");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/corretor/alterar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          corretorId: corretor.id,
          senhaAtual: localStorage.getItem("senhaTemporaria"),
          novaSenha,
        }),
      });

      const data = await response.json();

      if (data.sucesso) {
        // Limpar dados temporários
        localStorage.removeItem("senhaTemporaria");

        toast.success("Senha alterada com sucesso!");
        setLocation("/");
      } else {
        toast.error(data.motivo || "Erro ao alterar senha");
      }
    } catch (error) {
      toast.error("Erro ao alterar senha");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!corretor) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Alterar Senha</CardTitle>
          <CardDescription>Primeiro acesso - Altere sua senha temporária</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Por segurança, você deve alterar sua senha temporária no primeiro acesso.
            </AlertDescription>
          </Alert>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Bem-vindo,</strong> {corretor.nome}!
            </p>
          </div>

          <form onSubmit={handleAlterarSenha} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="novaSenha" className="text-sm font-medium">
                Nova Senha
              </label>
              <Input
                id="novaSenha"
                type="password"
                placeholder="••••••••"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
              <p className="text-xs text-gray-500">Mínimo 8 caracteres</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmarSenha" className="text-sm font-medium">
                Confirmar Senha
              </label>
              <Input
                id="confirmarSenha"
                type="password"
                placeholder="••••••••"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Alterando...
                </>
              ) : (
                "Alterar Senha"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Sua senha será criptografada com segurança</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
