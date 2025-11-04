import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Instagram, Twitter, MessageCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  origem: z.string().optional(),
  status: z.enum(["novo", "contatado", "qualificado", "negociacao", "convertido", "perdido"]),
  observacoes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormLeadProps {
  onSuccess?: () => void;
  initialData?: Partial<FormValues>;
}

export function FormLead({ onSuccess, initialData }: FormLeadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createMutation = trpc.leads.create.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      nome: initialData?.nome || "",
      telefone: initialData?.telefone || "",
      whatsapp: initialData?.whatsapp || "",
      email: initialData?.email || "",
      instagram: initialData?.instagram || "",
      twitter: initialData?.twitter || "",
      origem: initialData?.origem || "",
      status: initialData?.status || "novo",
      observacoes: initialData?.observacoes || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await createMutation.mutateAsync(data);
      toast.success("Lead cadastrado com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao cadastrar lead");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Lead/Cliente</CardTitle>
        <CardDescription>Cadastre um novo cliente ou lead para acompanhamento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Dados Básicos</h3>
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
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  {...form.register("email")}
                  disabled={isLoading}
                />
              </div>

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

          {/* Status e Origem */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Informações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value as any)}
                >
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contatado">Contatado</SelectItem>
                    <SelectItem value="qualificado">Qualificado</SelectItem>
                    <SelectItem value="negociacao">Negociação</SelectItem>
                    <SelectItem value="convertido">Convertido</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Origem</label>
                <Select
                  value={form.watch("origem") || ""}
                  onValueChange={(value) => form.setValue("origem", value)}
                >
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="portal">Portal de Imóveis</SelectItem>
                    <SelectItem value="indicacao">Indicação</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <Textarea
              placeholder="Notas adicionais sobre o cliente..."
              {...form.register("observacoes")}
              disabled={isLoading}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar Lead"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
