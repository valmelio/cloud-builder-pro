import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, CreditCard } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ComercioFlex
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#recursos" className="text-foreground/80 hover:text-primary transition-colors">
            Recursos
          </a>
          <a href="#precos" className="text-foreground/80 hover:text-primary transition-colors">
            Preços
          </a>
          <a href="#contato" className="text-foreground/80 hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline">
            Entrar
          </Button>
          <Button className="bg-gradient-primary shadow-primary">
            Começar Grátis
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <a 
              href="#recursos" 
              className="block text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Recursos
            </a>
            <a 
              href="#precos" 
              className="block text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </a>
            <a 
              href="#contato" 
              className="block text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </a>
            <div className="space-y-2 pt-4">
              <Button variant="outline" className="w-full">
                Entrar
              </Button>
              <Button className="w-full bg-gradient-primary shadow-primary">
                Começar Grátis
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;