import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cliente } from '@/types';
import { Copy, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface QRCodeGeneratorProps {
  cliente: Cliente;
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeGenerator({ cliente, isOpen, onClose }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [valor, setValor] = useState(cliente.saldoDevedor.toString());
  const [chavePix] = useState('comercioflex@exemplo.com'); // Chave PIX mock

  useEffect(() => {
    if (isOpen && valor) {
      generateQRCode();
    }
  }, [isOpen, valor, cliente]);

  const generateQRCode = async () => {
    try {
      // Dados do PIX (formato simplificado para demonstração)
      const pixData = {
        chave: chavePix,
        valor: parseFloat(valor),
        nome: 'ComercioFlex',
        cidade: 'São Paulo',
        identificador: `CLI${cliente.id}${Date.now()}`,
        descricao: `Pagamento - ${cliente.nome}`,
      };

      // Em uma implementação real, você geraria o código PIX seguindo o padrão EMV
      // Aqui vamos usar uma string simplificada para demonstração
      const pixString = `PIX|${pixData.chave}|${pixData.valor}|${pixData.nome}|${pixData.identificador}`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(pixString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code');
    }
  };

  const handleCopyPix = () => {
    const pixString = `PIX|${chavePix}|${valor}|ComercioFlex|CLI${cliente.id}${Date.now()}`;
    navigator.clipboard.writeText(pixString);
    toast.success('Código PIX copiado!');
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `qr-pix-${cliente.nome.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = qrCodeUrl;
      link.click();
      toast.success('QR Code baixado!');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code PIX - {cliente.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="valor">Valor do Pagamento</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
            />
            <p className="text-sm text-gray-600 mt-1">
              Saldo devedor atual: {formatCurrency(cliente.saldoDevedor)}
            </p>
          </div>

          {qrCodeUrl && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border inline-block">
                <img src={qrCodeUrl} alt="QR Code PIX" className="w-64 h-64" />
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Chave PIX:</strong> {chavePix}</p>
                <p><strong>Valor:</strong> {formatCurrency(parseFloat(valor))}</p>
                <p><strong>Beneficiário:</strong> ComercioFlex</p>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCopyPix} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar PIX
                </Button>
                <Button onClick={handleDownloadQR} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar QR
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>Mostre este QR Code para o cliente fazer o pagamento via PIX</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}