import { useLocation, Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Home, MessageCircle, Search } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const NotFound = () => {
  const location = useLocation();

  // Rodada 25.2.1 — emissão de `virtual_page_view` é responsabilidade única
  // do tracker global `useRoutePageview` (route_type="not_found" resolvido
  // pelo fallback do resolver). Não emitimos manualmente aqui para evitar
  // dois emissores lógicos convergindo no mesmo tick.

  const whatsappLink = buildWhatsAppUrl({ service: "assistência técnica", sourcePage: "/404" });

  return (
    <Layout>
      <SEOHead
        title="Página Não Encontrada | Preciso de Um Técnico"
        description="A página que você está procurando não foi encontrada. Volte para a página inicial ou entre em contato conosco."
        canonical={`https://precisodeumtecnico.com${location.pathname}`}
        noindex
      />
      
      <section
        data-testid="not-found"
        className="section-padding bg-background min-h-[60vh] flex items-center"
      >
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <span className="text-8xl md:text-9xl font-display font-bold text-gradient">404</span>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Página Não Encontrada
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Desculpe, a página que você está procurando não existe ou foi movida. 
              Mas não se preocupe, estamos aqui para ajudar!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link to="/">
                  <Home className="w-5 h-5" />
                  Voltar ao Início
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/servicos">
                  <Search className="w-5 h-5" />
                  Ver Serviços
                </Link>
              </Button>
              <Button variant="whatsapp" size="lg" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="not-found" data-service="assistência técnica" aria-label="Falar com técnico pelo WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                  Falar Conosco
                </a>
              </Button>
            </div>

            <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
              <h2 className="font-bold text-card-foreground mb-4">Você pode estar procurando:</h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/servicos/informatica" className="px-4 py-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-sm">
                  Informática
                </Link>
                <Link to="/servicos/eletrica" className="px-4 py-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-sm">
                  Elétrica
                </Link>
                <Link to="/servicos/cftv" className="px-4 py-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-sm">
                  CFTV / Câmeras
                </Link>
                <Link to="/regioes/curitiba" className="px-4 py-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-sm">
                  Curitiba
                </Link>
                <Link to="/contato" className="px-4 py-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-sm">
                  Contato
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
