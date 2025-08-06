import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import { toast } from '@/components/ui/sonner';

export default function Relatorios() {
  const [relatorios, setRelatorios] = useState({
    totalFiado: 0,
    totalInadimplencia: 0,
    saldoAtual: 0,
    vendasMes: 0,
    entradas: 0,
    saidas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatorios();
  }, []);

  const loadRelatorios = async () => {
    try {
      const data = await mockApi.getRelatorios();
      setRelatorios(data);
    } catch (error) {
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Dados para os gráficos
  const fluxoCaixaData = [
    { nome: 'Entradas', valor: relatorios.entradas },
    { nome: 'Saídas', valor: relatorios.saidas },
    { nome: 'Saldo', valor: relatorios.saldoAtual },
  ];

  const inadimplenciaData = [
    { nome: 'Em dia', valor: relatorios.totalFiado - relatorios.totalInadimplencia },
    { nome: 'Inadimplente', valor: relatorios.totalInadimplencia },
  ];

  const vendasMensaisData = [
    { mes: 'Jan', vendas: 2400 },
    { mes: 'Fev', vendas: 1398 },
    { mes: 'Mar', vendas: 9800 },
    { mes: 'Abr', vendas: 3908 },
    { mes: 'Mai', vendas: 4800 },
    { mes: 'Jun', vendas: relatorios.vendasMes },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Análise completa do seu negócio</p>
      </div>

      {/* Cards de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(relatorios.vendasMes)}
            </div>
            <p className="text-xs text-muted-foreground">
              Faturamento mensal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fiado em Aberto</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(relatorios.totalFiado)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total em dívidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(relatorios.totalInadimplencia)}
            </div>
            <p className="text-xs text-muted-foreground">
              {relatorios.totalFiado > 0 
                ? `${((relatorios.totalInadimplencia / relatorios.totalFiado) * 100).toFixed(1)}% do total`
                : '0% do total'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${relatorios.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(relatorios.saldoAtual)}
            </div>
            <p className="text-xs text-muted-foreground">
              Conta digital
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fluxo de Caixa */}
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fluxoCaixaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inadimplência */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Inadimplência</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inadimplenciaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {inadimplenciaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vendas Mensais */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução das Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={vendasMensaisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line 
                type="monotone" 
                dataKey="vendas" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Entradas:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(relatorios.entradas)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Saídas:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(relatorios.saidas)}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">Resultado:</span>
                  <span className={`font-bold text-lg ${
                    relatorios.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(relatorios.saldoAtual)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Margem de Lucro:</span>
                <span className="font-semibold">
                  {relatorios.entradas > 0 
                    ? `${((relatorios.saldoAtual / relatorios.entradas) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Inadimplência:</span>
                <span className="font-semibold text-red-600">
                  {relatorios.totalFiado > 0 
                    ? `${((relatorios.totalInadimplencia / relatorios.totalFiado) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ticket Médio:</span>
                <span className="font-semibold">
                  {formatCurrency(relatorios.vendasMes / 30)} {/* Aproximação */}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}