import { useState, useEffect } from 'react';
import { Plus, Search, Check, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Cliente, Divida } from '@/types';
import { mockApi } from '@/services/mockApi';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Fiado() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [formData, setFormData] = useState({
    valor: '',
    descricao: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientesData, dividasData] = await Promise.all([
        mockApi.getClientes(),
        mockApi.getDividas(),
      ]);
      setClientes(clientesData);
      setDividas(dividasData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCliente || !formData.valor || !formData.descricao) {
      toast.error('Preencha todos os campos');
      return;
    }

    const cliente = clientes.find(c => c.id === selectedCliente);
    if (!cliente) {
      toast.error('Cliente não encontrado');
      return;
    }

    const valor = parseFloat(formData.valor);
    if (cliente.saldoDevedor + valor > cliente.limiteCredito) {
      toast.error('Valor excede o limite de crédito do cliente');
      return;
    }

    try {
      await mockApi.createDivida({
        clienteId: selectedCliente,
        valor,
        descricao: formData.descricao,
        data: new Date().toISOString(),
        pago: false,
      });

      toast.success('Compra no fiado registrada com sucesso');
      setIsDialogOpen(false);
      setSelectedCliente('');
      setFormData({ valor: '', descricao: '' });
      loadData();
    } catch (error) {
      toast.error('Erro ao registrar compra');
    }
  };

  const handlePagarDivida = async (dividaId: string) => {
    if (!confirm('Confirmar pagamento desta dívida?')) return;

    try {
      await mockApi.pagarDivida(dividaId);
      toast.success('Pagamento registrado com sucesso');
      loadData();
    } catch (error) {
      toast.error('Erro ao registrar pagamento');
    }
  };

  const getDividasComClientes = () => {
    return dividas.map(divida => ({
      ...divida,
      cliente: clientes.find(c => c.id === divida.clienteId),
    })).filter(item => item.cliente);
  };

  const filteredDividas = getDividasComClientes().filter(item =>
    item.cliente!.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Fiado</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Fiado</h1>
          <p className="text-gray-600">Gerencie as vendas no fiado</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedCliente('');
              setFormData({ valor: '', descricao: '' });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Venda Fiado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Venda no Fiado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome} - Limite: {formatCurrency(cliente.limiteCredito)}
                      </SelectItem>
                    ))}
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
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva os itens comprados..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar Venda
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por cliente ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredDividas.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <h3 className="font-semibold">{item.cliente!.nome}</h3>
                    <Badge variant={item.pago ? 'default' : 'destructive'}>
                      {item.pago ? 'Pago' : 'Em aberto'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{item.descricao}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(item.data)}</span>
                    </div>
                    {item.pago && item.dataPagamento && (
                      <div className="flex items-center space-x-1">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Pago em {formatDate(item.dataPagamento)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold mb-2">
                    {formatCurrency(item.valor)}
                  </div>
                  {!item.pago && (
                    <Button
                      size="sm"
                      onClick={() => handlePagarDivida(item.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Marcar como Pago
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDividas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma venda no fiado encontrada</p>
        </div>
      )}
    </div>
  );
}