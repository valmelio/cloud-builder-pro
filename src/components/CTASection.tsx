import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl opacity-90">
            Junte-se a mais de 10.000 comerciantes que já estão usando o ComercioFlex 
            para crescer de forma inteligente e segura.
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Setup em 5 minutos</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Sem taxa de adesão</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Suporte brasileiro</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8"
            >
              Começar Grátis por 14 Dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 text-lg px-8"
            >
              Falar com Especialista
            </Button>
          </div>

          <p className="text-sm opacity-80">
            Não é necessário cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;