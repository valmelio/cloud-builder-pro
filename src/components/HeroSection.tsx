import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroFintech from "@/assets/hero-fintech.jpg";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                O <span className="bg-gradient-hero bg-clip-text text-transparent">Super App</span> do 
                Pequeno Comerciante
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Fiado digital + maquininha + conta digital + empréstimo para capital de giro. 
                Tudo em um só lugar para fazer seu negócio crescer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary shadow-primary text-lg px-8">
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Sem taxa de setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>14 dias grátis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src={heroFintech} 
                  alt="ComercioFlex Dashboard" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-xl rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;