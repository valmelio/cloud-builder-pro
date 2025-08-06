import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import localBusiness from "@/assets/local-business.jpg";

const testimonials = [
  {
    name: "Maria Silva",
    business: "Mercearia do Bairro",
    image: localBusiness,
    rating: 5,
    testimonial: "O ComercioFlex revolucionou meu negócio! Agora posso dar fiado de forma segura e organizada. As vendas aumentaram 40% em 3 meses."
  },
  {
    name: "João Santos",
    business: "Padaria Central",
    image: localBusiness,
    rating: 5,
    testimonial: "A maquininha virtual é fantástica! Não preciso mais de equipamento físico e o dinheiro cai na hora. Recomendo para todos os colegas."
  },
  {
    name: "Ana Costa",
    business: "Loja da Esquina",
    image: localBusiness,
    rating: 5,
    testimonial: "O empréstimo para capital de giro veio na hora certa. Consegui comprar mais mercadoria e aumentar meu estoque sem burocracia."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Quem usa, recomenda
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Veja como o ComercioFlex está transformando negócios pelo Brasil
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-card transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                
                <p className="text-muted-foreground italic">
                  "{testimonial.testimonial}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;