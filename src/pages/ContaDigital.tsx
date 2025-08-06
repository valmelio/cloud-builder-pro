import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MovimentacaoFinanceira } from '@/types';
import { mockApi } from '@/services/mockApi';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ContaDigital() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoFinanceira[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'entrada' as 'entrada' | 'saida',
    valor: '',
    descricao: '',
    categoria: '',
  });

  const categorias = {
    entrada: [
      { value: 'vendas', label: 'Vendas' },
      { value: 'fiado', label: 'Pagamento Fiado' },
      { value: 'cartao', label: 'Vendas Cartão' },
      { value: 'outros', label: 'Outros' },
    ],
    saida: [
      { value: 'estoque', label: 'Compra de Mercadorias' },
      { value: 'aluguel', label: 'Aluguel' },
      { value: 'funcionarios', label: 'Funcionários' },
      { value: 'impostos', label: 'Impostos' },
      { value: 'outros', label: 'Outros' },
    ],
  };

  useEffect(() => {
    loadMovimentacoes();
  }, []);

  const loadMovimentacoes = async () => {
    try {
      const data = await mockApi.getMovimentacoes();
      setMovimentacoes(data);
    } catch (error) {
      toast.error('Erro ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.valor || !formData.descricao || !formData.categoria) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await mockApi.createMovimentacao({
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        descricao: formData.descricao,
        categoria: formData.categoria,
        data: new Date().toISOString(),
      });

      toast.success('Movimentação registrada com sucesso');
      setIsDialogOpen(false);
      setFormData({ tipo: 'entrada', valor: '', descricao: '', categoria: '' });
      loadMovimentacoes();
    } catch (error) {
      toast.error('Erro ao registrar movimentação');
    }
  };

  const calcularSaldo = () => {
    return movimentacoes.reduce((saldo, mov) => {
      return mov.tipo === 'entrada' ? saldo + mov.valor : saldo - mov.valor;
    }, 0);
  };

  const calcularTotalEntradas = () => {
    return movimentacoes
      .filter(mov => mov.tipo === 'entrada')
      .reduce((total, mov) => total + mov.valor, 0);
  };

  const calcularTotalSaidas = () => {
    return movimentacoes
      .filter(mov => mov.tipo === 'saida')
      .reduce((total, mov) => total + mov.valor, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const getCategoriaLabel = (categoria: string, tipo: 'entrada' | 'saida') => {
    const cats = categorias[tipo];
    return cats.find(c => c.value === categoria)?.label || categoria;
  };

  const saldoAtual = calcularSaldo();
  const totalEntradas = calcularTotalEntradas();
  const totalSaidas = calcularTotalSaidas();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Conta Digital</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conta Digital</h1>
          <p className="text-gray-600">Controle suas movimentações financeiras</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setFormData({ tipo: 'entrada', valor: '', descricao: '', categoria: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Movimentação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Movimentação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value: 'entrada' | 'saida') => 
                    setFormData({ ...formData, tipo: value, categoria: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0,00"
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias[formData.tipo].map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva a movimentação..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(saldoAtual)}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo disponível
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalEntradas)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receitas totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalSaidas)}
            </div>
            <p className="text-xs text-muted-foreground">
              Despesas totais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          {movimentacoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma movimentação registrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {movimentacoes.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      mov.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {mov.tipo === 'entrada' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{mov.descricao}</div>
                      <div className="text-sm text-gray-600">
                        {getCategoriaLabel(mov.categoria, mov.tipo)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(mov.data)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {mov.tipo === 'entrada' ? '+' : '-'}{formatCurrency(mov.valor)}
                    </div>
                    <Badge variant={mov.tipo === 'entrada' ? 'default' : 'destructive'}>
                      {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}