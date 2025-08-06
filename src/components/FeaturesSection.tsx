import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Smartphone, 
  PiggyBank, 
  TrendingUp, 
  Shield, 
  Users,
  QrCode,
  BarChart3,
  MessageCircle
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Fiado Digital",
    description: "QR Code personalizado para cada cliente com score de confiança automático e limites inteligentes."
  },
  {
    icon: CreditCard,
    title: "Maquininha Virtual",
    description: "Aceite cartões pelo celular sem precisar de equipamento. Taxa competitiva e saque no mesmo dia."
  },
  {
    icon: PiggyBank,
    title: "Conta Digital",
    description: "Conta gratuita com PIX, TEDs e boletos. Controle total das suas finanças em um só lugar."
  },
  {
    icon: TrendingUp,
    title: "Empréstimo Capital de Giro",
    description: "Crédito baseado no histórico do seu negócio com aprovação em até 24h e juros competitivos."
  },
  {
    icon: BarChart3,
    title: "IA Preditiva",
    description: "Análise inteligente do fluxo de caixa que sugere quando dar mais crédito e prevê demandas."
  },
  {
    icon: MessageCircle,
    title: "Cobrança Automática",
    description: "WhatsApp integrado para cobrança automática com links de pagamento e lembretes inteligentes."
  },
  {
    icon: Shield,
    title: "Seguro Contra Calote",
    description: "Proteção automática contra inadimplência inclusa em todos os planos sem custo adicional."
  },
  {
    icon: Users,
    title: "Rede Colaborativa",
    description: "Score compartilhado entre comerciantes da região para aumentar a segurança do crediário."
  }
];

const FeaturesSection = () => {
  return (
    <section id="recursos" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Tudo que seu negócio precisa
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma solução completa para modernizar seu pequeno comércio e aumentar suas vendas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;