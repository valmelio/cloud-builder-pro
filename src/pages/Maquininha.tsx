import { useState, useEffect } from 'react';
import { CreditCard, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VendaCartao } from '@/types';
import { mockApi } from '@/services/mockApi';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Maquininha() {
  const [vendas, setVendas] = useState<VendaCartao[]>([]);
  const [loading, setLoading] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [formData, setFormData] = useState({
    valor: '',
    parcelas: '1',
    bandeira: 'visa',
  });

  useEffect(() => {
    loadVendas();
  }, []);

  const loadVendas = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getVendasCartao();
      setVendas(data);
    } catch (error) {
      toast.error('Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.valor) {
      toast.error('Informe o valor da venda');
      return;
    }

    const valor = parseFloat(formData.valor);
    if (valor <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    setProcessando(true);
    
    try {
      const venda = await mockApi.processarVendaCartao({
        valor,
        parcelas: parseInt(formData.parcelas),
        bandeira: formData.bandeira,
        data: new Date().toISOString(),
      });

      if (venda.status === 'aprovada') {
        toast.success('Venda aprovada com sucesso!');
      } else {
        toast.error('Venda negada. Tente novamente.');
      }

      setFormData({ valor: '', parcelas: '1', bandeira: 'visa' });
      loadVendas();
    } catch (error) {
      toast.error('Erro ao processar venda');
    } finally {
      setProcessando(false);
    }
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

  const getBandeiraIcon = (bandeira: string) => {
    const icons: { [key: string]: string } = {
      visa: '💳',
      mastercard: '💳',
      elo: '💳',
      amex: '💳',
    };
    return icons[bandeira] || '💳';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'bg-green-100 text-green-800';
      case 'negada':
        return 'bg-red-100 text-red-800';
      case 'processando':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovada':
        return <Check className="h-4 w-4" />;
      case 'negada':
        return <X className="h-4 w-4" />;
      case 'processando':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maquininha Digital</h1>
        <p className="text-gray-600">Processe vendas no cartão de crédito e débito</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Venda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Nova Venda</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="valor">Valor da Venda</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0,00"
                  disabled={processando}
                />
              </div>

              <div>
                <Label htmlFor="parcelas">Parcelas</Label>
                <Select 
                  value={formData.parcelas} 
                  onValueChange={(value) => setFormData({ ...formData, parcelas: value })}
                  disabled={processando}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}x {i === 0 ? '(à vista)' : `de ${formatCurrency(parseFloat(formData.valor || '0') / (i + 1))}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bandeira">Bandeira</Label>
                <Select 
                  value={formData.bandeira} 
                  onValueChange={(value) => setFormData({ ...formData, bandeira: value })}
                  disabled={processando}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="elo">Elo</SelectItem>
                    <SelectItem value="amex">American Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={processando}
              >
                {processando ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Processar Venda
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resumo do Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Vendas Aprovadas:</span>
                <span className="font-semibold">
                  {vendas.filter(v => v.status === 'aprovada').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Faturado:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(
                    vendas
                      .filter(v => v.status === 'aprovada')
                      .reduce((sum, v) => sum + v.valor, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vendas Negadas:</span>
                <span className="font-semibold text-red-600">
                  {vendas.filter(v => v.status === 'negada').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa de Aprovação:</span>
                <span className="font-semibold">
                  {vendas.length > 0 
                    ? `${((vendas.filter(v => v.status === 'aprovada').length / vendas.length) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : vendas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma venda processada hoje</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendas.map((venda) => (
                <div key={venda.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getBandeiraIcon(venda.bandeira)}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {formatCurrency(venda.valor)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {venda.parcelas}x - {venda.bandeira.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(venda.data)}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(venda.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(venda.status)}
                      <span className="capitalize">{venda.status}</span>
                    </div>
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}