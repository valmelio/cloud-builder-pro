import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Essencial",
    price: "R$ 29",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "Fiado digital para até 100 clientes",
      "Maquininha virtual",
      "Conta digital gratuita",
      "Cobrança por WhatsApp",
      "Suporte por chat"
    ],
    popular: false
  },
  {
    name: "Profissional",
    price: "R$ 79",
    period: "/mês",
    description: "Mais vendas e controle",
    features: [
      "Fiado digital ilimitado",
      "Maquininha virtual + física",
      "Conta digital + cartão",
      "Empréstimo até R$ 50.000",
      "IA preditiva incluída",
      "Seguro contra calote",
      "Suporte prioritário"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "R$ 149",
    period: "/mês",
    description: "Para múltiplas lojas",
    features: [
      "Tudo do Profissional",
      "Múltiplas lojas/filiais",
      "Empréstimo até R$ 200.000",
      "Rede colaborativa premium",
      "Dashboard avançado",
      "Gerente de conta dedicado",
      "Integração com ERPs"
    ],
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="precos" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis por 14 dias e escolha o plano ideal para seu negócio crescer
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-primary shadow-primary scale-105' : ''} hover:shadow-card transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Mais Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-primary shadow-primary' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.popular ? 'Começar Agora' : 'Escolher Plano'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Todos os planos incluem 14 dias grátis • Sem fidelidade • Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;