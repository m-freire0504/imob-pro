import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const formSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  titulo: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  finalidade: z.enum(["venda", "locacao", "ambos"]),
  proprietarioId: z.coerce.number().min(1, "Proprietário é obrigatório"),
  
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  endereco: z.string().min(5, "Endereço é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  
  areaUtil: z.coerce.number().min(1, "Área útil é obrigatória"),
  areaTotal: z.coerce.number().min(1, "Área total é obrigatória"),
  quartos: z.coerce.number().min(0),
  suites: z.coerce.number().min(0),
  banheiros: z.coerce.number().min(1),
  vagas: z.coerce.number().min(0),
  
  precoVenda: z.coerce.number().optional(),
  valorLocacao: z.coerce.number().optional(),
  valorCondominio: z.coerce.number().optional(),
  valorIptu: z.coerce.number().optional(),
  
  matriculaIptu: z.string().optional(),
  numeroReloglioLuz: z.string().optional(),
  numeroRelogioAgua: z.string().optional(),
  numeroMedidorGas: z.string().optional(),
  
  descricao: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormImovelProps {
  proprietarios: Array<{ id: number; nome: string }>;
  onSuccess?: () => void;
}

export function FormImovel({ proprietarios, onSuccess }: FormImovelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createMutation = trpc.imoveis.create.useMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      codigo: "",
      titulo: "",
      tipo: "apartamento",
      finalidade: "venda",
      proprietarioId: 0,
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      areaUtil: 0,
      areaTotal: 0,
      quartos: 0,
      suites: 0,
      banheiros: 1,
      vagas: 0,
      descricao: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await createMutation.mutateAsync({
        ...values,
        proprietarioId: values.proprietarioId,
      });
      toast.success("Imóvel cadastrado com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao cadastrar imóvel");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Dados principais do imóvel</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seção 1: Básico */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="IMV-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Anúncio</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartamento 3 quartos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartamento">Apartamento</SelectItem>
                          <SelectItem value="casa">Casa</SelectItem>
                          <SelectItem value="terreno">Terreno</SelectItem>
                          <SelectItem value="comercial">Comercial</SelectItem>
                          <SelectItem value="sala">Sala</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="finalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finalidade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="venda">Venda</SelectItem>
                          <SelectItem value="locacao">Locação</SelectItem>
                          <SelectItem value="ambos">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proprietarioId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proprietário</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proprietarios.map((prop) => (
                            <SelectItem key={prop.id} value={prop.id.toString()}>
                              {prop.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Seção 2: Localização */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Localização</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="12345-678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua Principal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complemento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Apto 42" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Centro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="São Paulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Seção 3: Características */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Características</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="areaUtil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área Útil (m²)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="areaTotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área Total (m²)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="150" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quartos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quartos</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="suites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suítes</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="banheiros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banheiros</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vagas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vagas de Garagem</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção 4: Valores */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Valores</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="precoVenda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Venda (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valorLocacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor de Locação (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valorCondominio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Condomínio (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valorIptu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor IPTU (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção 5: Concessionárias */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">Dados de Concessionárias</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="matriculaIptu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matrícula IPTU</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numeroReloglioLuz"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número Relógio Luz</FormLabel>
                        <FormControl>
                          <Input placeholder="987654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numeroRelogioAgua"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número Relógio Água</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numeroMedidorGas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número Medidor Gás</FormLabel>
                        <FormControl>
                          <Input placeholder="987654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção 6: Descrição */}
              <div className="space-y-4 border-t pt-4">
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva as características e diferenciais do imóvel..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Máximo 1000 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Salvando..." : "Cadastrar Imóvel"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
