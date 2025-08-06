import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Store, 
  User, 
  Bell, 
  CreditCard, 
  Shield,
  Smartphone,
  Mail,
  Save
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export default function Configuracoes() {
  const [configuracoes, setConfiguracoes] = useState({
    // Dados da Empresa
    nomeEmpresa: 'Meu Comércio',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Flores, 123',
    telefone: '(11) 99999-9999',
    email: 'contato@meucomercio.com',
    
    // PIX
    chavePix: 'comercio@exemplo.com',
    
    // Notificações
    notificacoesPush: true,
    notificacoesEmail: true,
    notificacoesVencimento: true,
    
    // Limites
    limiteCredito: 1000,
    diasVencimento: 30,
    
    // Segurança
    autenticacaoDoisFatores: false,
    backupAutomatico: true,
  });

  const handleSave = () => {
    // Aqui você salvaria as configurações no backend
    toast.success('Configurações salvas com sucesso!');
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setConfiguracoes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Dados da Empresa</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
              <Input
                id="nomeEmpresa"
                value={configuracoes.nomeEmpresa}
                onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={configuracoes.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={configuracoes.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={configuracoes.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={configuracoes.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações PIX */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Configurações PIX</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chavePix">Chave PIX</Label>
              <Input
                id="chavePix"
                value={configuracoes.chavePix}
                onChange={(e) => handleInputChange('chavePix', e.target.value)}
                placeholder="Digite sua chave PIX"
              />
              <p className="text-sm text-gray-500 mt-1">
                Esta chave será usada para gerar QR Codes de pagamento
              </p>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="limiteCredito">Limite de Crédito Padrão</Label>
              <Input
                id="limiteCredito"
                type="number"
                value={configuracoes.limiteCredito}
                onChange={(e) => handleInputChange('limiteCredito', parseFloat(e.target.value))}
              />
              <p className="text-sm text-gray-500 mt-1">
                Limite padrão para novos clientes
              </p>
            </div>
            
            <div>
              <Label htmlFor="diasVencimento">Dias para Vencimento</Label>
              <Input
                id="diasVencimento"
                type="number"
                value={configuracoes.diasVencimento}
                onChange={(e) => handleInputChange('diasVencimento', parseInt(e.target.value))}
              />
              <p className="text-sm text-gray-500 mt-1">
                Prazo padrão para pagamento do fiado
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-gray-500">
                  Receba notificações no navegador
                </p>
              </div>
              <Switch
                checked={configuracoes.notificacoesPush}
                onCheckedChange={(checked) => handleInputChange('notificacoesPush', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-gray-500">
                  Receba relatórios por e-mail
                </p>
              </div>
              <Switch
                checked={configuracoes.notificacoesEmail}
                onCheckedChange={(checked) => handleInputChange('notificacoesEmail', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Vencimento</Label>
                <p className="text-sm text-gray-500">
                  Notificar sobre dívidas vencendo
                </p>
              </div>
              <Switch
                checked={configuracoes.notificacoesVencimento}
                onCheckedChange={(checked) => handleInputChange('notificacoesVencimento', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-gray-500">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Switch
                checked={configuracoes.autenticacaoDoisFatores}
                onCheckedChange={(checked) => handleInputChange('autenticacaoDoisFatores', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Automático</Label>
                <p className="text-sm text-gray-500">
                  Backup diário dos seus dados
                </p>
              </div>
              <Switch
                checked={configuracoes.backupAutomatico}
                onCheckedChange={(checked) => handleInputChange('backupAutomatico', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
              <Button variant="outline" className="w-full">
                <Smartphone className="h-4 w-4 mr-2" />
                Configurar 2FA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="text-gray-600">Versão:</Label>
              <p className="font-medium">ComercioFlex v1.0.0</p>
            </div>
            <div>
              <Label className="text-gray-600">Último Backup:</Label>
              <p className="font-medium">Hoje, 14:30</p>
            </div>
            <div>
              <Label className="text-gray-600">Status:</Label>
              <p className="font-medium text-green-600">Sistema Online</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}