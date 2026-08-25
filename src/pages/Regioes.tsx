import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Building2, Home, Phone, MessageCircle, CheckCircle, Users, Star, Clock, Shield } from "lucide-react";
import { getMainCities, getOtherCities, formatNeighborhoodSlug } from "@/data/regions";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const whatsappLink = buildWhatsAppUrl({ service: "assistência técnica", sourcePage: "/regioes" });

const Regioes = () => {
  const mainCities = getMainCities();
  const otherCities = getOtherCities();

  const regionSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Preciso de Um Técnico",
    "description": "Assistência técnica em Curitiba e Região Metropolitana",
    "url": "https://precisodeumtecnico.com/regioes",
    "areaServed": [
      ...mainCities.map(city => ({ "@type": "City", "name": city.name })),
      ...otherCities.map(city => ({ "@type": "City", "name": city.name }))
    ],
    "priceRange": "$$"
  };

  return (
    <Layout>
      <SEOHead
        title="Técnico em Curitiba e Região Metropolitana | Preciso de Um Técnico"
        description="Assistência técnica em Curitiba, São José dos Pinhais, Pinhais, Colombo, Araucária e toda região metropolitana. 18+ cidades, 200+ bairros. Técnicos especializados. WhatsApp 24h. A partir de R$ 99,99."
        canonical="https://precisodeumtecnico.com/regioes"
        schema={regionSchema}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 tech-grid opacity-10" />
        
        <div className="relative container-custom text-center">
          <div className="max-w-4xl mx-auto animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 text-success border border-success/30 mb-6">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">Curitiba e Região Metropolitana</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Técnicos Especializados em <span className="text-success">Toda a Região</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Mais de 100 técnicos parceiros prontos para atender você. 
              Informática, elétrica, CFTV, ar-condicionado, notebooks e muito mais.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">18+</div>
                <div className="text-white/70">Cidades</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">200+</div>
                <div className="text-white/70">Bairros</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">100+</div>
                <div className="text-white/70">Técnicos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">15k+</div>
                <div className="text-white/70">Clientes</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-10 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>A partir de R$ 99,99</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span>Garantia de 90 dias a 1 ano</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-success" />
                <span>Agendamento 24h</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                data-wa-source="regioes"
                data-service="assistência técnica na sua região"
                aria-label="Falar no WhatsApp sobre atendimento na sua região"
                href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-success hover:bg-success/90 cta-glow gap-3">
                  <MessageCircle className="w-6 h-6" />
                  Chamar Técnico Agora
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Cities */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="badge-primary mb-4">
              <Building2 className="w-4 h-4 mr-1" />
              Principais Cidades
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cobertura Completa nas Maiores Cidades
            </h2>
            <p className="text-muted-foreground">
              Atendemos as principais cidades da região metropolitana com técnicos especializados e tempo de resposta rápido.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {mainCities.map((city) => (
              <article key={city.slug} className="region-card">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={`/regioes/${city.slug}`}
                      className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {city.name}
                    </Link>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {city.description}
                    </p>
                    {city.population && (
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Pop. {city.population}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {city.neighborhoods.length} bairros
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {city.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="badge-success text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Neighborhoods Preview */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Principais Bairros Atendidos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {city.neighborhoods.slice(0, 10).map((neighborhood) => (
                      <Link
                        key={neighborhood}
                        to={`/regioes/${city.slug}/${formatNeighborhoodSlug(neighborhood)}`}
                        className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {neighborhood}
                      </Link>
                    ))}
                    {city.neighborhoods.length > 10 && (
                      <Link
                        to={`/regioes/${city.slug}`}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        +{city.neighborhoods.length - 10} bairros
                      </Link>
                    )}
                  </div>
                </div>

                <Link to={`/regioes/${city.slug}`}>
                  <Button className="w-full gap-2">
                    Ver todos os bairros de {city.name}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="badge-primary mb-4">
              <Home className="w-4 h-4 mr-1" />
              Outras Cidades
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Região Metropolitana Completa
            </h2>
            <p className="text-muted-foreground">
              Também atendemos outras cidades da região metropolitana de Curitiba com a mesma qualidade e profissionalismo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherCities.map((city) => (
              <Link
                key={city.slug}
                to={`/regioes/${city.slug}`}
                className="region-card group text-center hover:border-primary/50"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mx-auto mb-3 transition-colors">
                  <MapPin className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {city.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {city.neighborhoods.length} bairros
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              Assistência Técnica em Curitiba e Região
            </h2>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                A <strong>Preciso de Um Técnico</strong> é a maior rede de assistência técnica de Curitiba e região metropolitana. 
                Com mais de <strong>100 técnicos parceiros</strong> espalhados por toda a região, oferecemos atendimento rápido 
                e profissional para resolver seus problemas técnicos.
              </p>
              
              <p>
                Atendemos <strong>mais de 18 cidades</strong> e <strong>200 bairros</strong>, incluindo Curitiba, São José dos Pinhais, 
                Pinhais, Colombo, Araucária, Campo Largo, Almirante Tamandaré, Fazenda Rio Grande, Piraquara e muito mais.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                Serviços Disponíveis em Toda a Região
              </h3>
              
              <ul className="grid md:grid-cols-2 gap-2">
                <li>• Formatação e manutenção de computadores</li>
                <li>• Reparo de notebooks e ultrabooks</li>
                <li>• Instalação de câmeras de segurança (CFTV)</li>
                <li>• Instalação e manutenção de ar-condicionado</li>
                <li>• Serviços elétricos residenciais e comerciais</li>
                <li>• Configuração de redes e Wi-Fi</li>
                <li>• Reparo de celulares e tablets</li>
                <li>• Conserto de games e consoles</li>
              </ul>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                Por Que Escolher a Preciso de Um Técnico?
              </h3>

              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Agendamento 24h:</strong> Entre em contato via WhatsApp a qualquer hora</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Atendimento das 8h às 22h:</strong> Visitas técnicas em horários convenientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Preço justo:</strong> A partir de R$ 99,99 até 30 minutos de serviço</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Garantia:</strong> Todos os serviços com garantia de 90 dias a 1 ano</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Nota Fiscal:</strong> Emitimos NF para todos os serviços realizados</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brasil Coverage */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-success" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Técnicos em Todo o Brasil
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Além da região metropolitana de Curitiba, temos técnicos parceiros em diversas 
              cidades do Brasil. Entre em contato via WhatsApp e verificamos a disponibilidade 
              na sua região!
            </p>
            
            <a
              data-wa-source="regioes"
              data-service="assistência técnica na sua região"
              aria-label="Falar no WhatsApp sobre atendimento na sua região"
              href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
                <MessageCircle className="w-5 h-5" />
                Verificar Disponibilidade
              </Button>
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Regioes;
