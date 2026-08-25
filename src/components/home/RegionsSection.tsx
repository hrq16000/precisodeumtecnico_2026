import { Link } from "@/lib/router-compat";
import { MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics";
const mainCities = [{
  name: "Curitiba",
  href: "/regioes/curitiba",
  neighborhoods: ["Centro", "Batel", "Água Verde", "Portão", "Bacacheri", "Boa Vista"],
  isMain: true
}, {
  name: "São José dos Pinhais",
  href: "/regioes/sao-jose-dos-pinhais",
  neighborhoods: ["Centro", "Afonso Pena", "Boneca do Iguaçu", "Costeira"],
  isMain: true
}];
const otherCities = [{
  name: "Pinhais",
  href: "/regioes/pinhais"
}, {
  name: "Colombo",
  href: "/regioes/colombo"
}, {
  name: "Araucária",
  href: "/regioes/araucaria"
}, {
  name: "Campo Largo",
  href: "/regioes/campo-largo"
}, {
  name: "Fazenda Rio Grande",
  href: "/regioes/fazenda-rio-grande"
}, {
  name: "Almirante Tamandaré",
  href: "/regioes/almirante-tamandare"
}, {
  name: "Piraquara",
  href: "/regioes/piraquara"
}, {
  name: "Campina Grande do Sul",
  href: "/regioes/campina-grande-do-sul"
}, {
  name: "Quatro Barras",
  href: "/regioes/quatro-barras"
}, {
  name: "Campo Magro",
  href: "/regioes/campo-magro"
}, {
  name: "Itaperuçu",
  href: "/regioes/itaperucu"
}, {
  name: "Rio Branco do Sul",
  href: "/regioes/rio-branco-do-sul"
}];
export function RegionsSection() {
  return <section className="section-padding bg-secondary/30" id="regioes">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Área de Atendimento
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Atendemos{" "}
            <span className="text-gradient text-primary-foreground">Curitiba e Região</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Técnicos especializados em toda a Região Metropolitana de Curitiba. 
            Atendimento presencial das 08h às 22h, com agendamento 24h via WhatsApp.
          </p>
        </div>

        {/* Main Cities */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {mainCities.map(city => <Link key={city.name} to={city.href} onClick={() => trackCtaClick({ surface: "regions_section", cta_id: "main_city_card", label: city.name, destination: city.href, city: city.name })} className="group bg-card rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 border border-border/50 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl text-card-foreground group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <span className="text-muted-foreground text-sm">Todos os bairros</span>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {city.neighborhoods.map(neighborhood => <div key={neighborhood} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    {neighborhood}
                  </div>)}
              </div>
              <p className="text-primary text-sm font-medium mt-4">
                + dezenas de outros bairros
              </p>
            </Link>)}
        </div>

        {/* Other Cities */}
        <div className="bg-card rounded-2xl p-8 card-shadow border border-border/50">
          <h3 className="font-display font-bold text-xl text-card-foreground mb-6 text-center">
            Outras Cidades da Região Metropolitana
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {otherCities.map(city => <Link key={city.name} to={city.href} onClick={() => trackCtaClick({ surface: "regions_section", cta_id: "other_city_chip", label: city.name, destination: city.href, city: city.name })} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {city.name}
              </Link>)}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/regioes" onClick={() => trackCtaClick({ surface: "regions_section", cta_id: "view_all_regions", label: "Ver todas as regiões", destination: "/regioes" })}>
              Ver todas as regiões
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>;
}