import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Home, Users, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Imóveis Disponíveis", value: "24", icon: Home, color: "bg-blue-100 text-blue-600" },
    { label: "Leads Ativos", value: "18", icon: Users, color: "bg-green-100 text-green-600" },
    { label: "Comissões Pendentes", value: "R$ 12.500", icon: DollarSign, color: "bg-yellow-100 text-yellow-600" },
    { label: "Vendas este Mês", value: "5", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
  ];

  const vendaData = [
    { mes: "Jan", vendas: 4, locacoes: 2 },
    { mes: "Fev", vendas: 3, locacoes: 4 },
    { mes: "Mar", vendas: 5, locacoes: 3 },
    { mes: "Abr", vendas: 6, locacoes: 5 },
    { mes: "Mai", vendas: 5, locacoes: 4 },
    { mes: "Jun", vendas: 7, locacoes: 6 },
  ];

  const statusData = [
    { name: "Disponível", value: 24, fill: "#3b82f6" },
    { name: "Vendido", value: 12, fill: "#10b981" },
    { name: "Alugado", value: 8, fill: "#f59e0b" },
    { name: "Reservado", value: 5, fill: "#ef4444" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo ao Sistema de Gestão Imobiliária</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas e Locações</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill="#3b82f6" />
                <Bar dataKey="locacoes" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Imóveis</CardTitle>
            <CardDescription>Distribuição atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas transações e atualizações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Novo imóvel cadastrado</p>
                <p className="text-sm text-muted-foreground">Apartamento na Rua Principal, 123</p>
              </div>
              <span className="text-sm text-muted-foreground">Há 2 horas</span>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Venda finalizada</p>
                <p className="text-sm text-muted-foreground">Casa em Condomínio Fechado</p>
              </div>
              <span className="text-sm text-muted-foreground">Há 5 horas</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Novo lead cadastrado</p>
                <p className="text-sm text-muted-foreground">João Silva - Procura apartamento 3 quartos</p>
              </div>
              <span className="text-sm text-muted-foreground">Há 1 dia</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
