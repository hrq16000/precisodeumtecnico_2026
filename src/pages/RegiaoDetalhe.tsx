import { useParams, Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Phone, MessageCircle, ArrowRight, CheckCircle, Clock, Shield, 
  Award, Monitor, Camera, Wind, Zap, Wifi, Laptop, Building2, Home,
  Star, Users, FileText, Smartphone, Gamepad2
} from "lucide-react";
import { citiesData, formatNeighborhoodSlug, formatNameFromSlug, getCityBySlug } from "@/data/regions";
import { OfferHighlight } from "@/components/marketing/OfferHighlight";
import { buildOfferSchema } from "@/components/seo/OfferSchema";
import { buildReviewsSchema } from "@/data/testimonials";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildCityFaqs } from "@/data/localFaq";
import { LocalityPhotoBand } from "@/components/media/LocalityPhotoBand";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  { icon: Monitor, name: "Informática", href: "/servicos/informatica", desc: "Formatação, manutenção, upgrade" },
  { icon: Camera, name: "CFTV", href: "/servicos/cftv", desc: "Câmeras de segurança" },
  { icon: Wind, name: "Ar-Condicionado", href: "/servicos/ar-condicionado", desc: "Instalação e manutenção" },
  { icon: Laptop, name: "Notebooks", href: "/servicos/notebooks", desc: "Reparo especializado" },
  { icon: Zap, name: "Elétrica", href: "/servicos/eletrica", desc: "Instalações elétricas" },
  { icon: Wifi, name: "Redes", href: "/servicos/redes", desc: "Wi-Fi e cabeamento" },
  { icon: Smartphone, name: "Celulares", href: "/servicos/celulares", desc: "Troca de tela e bateria" },
  { icon: Gamepad2, name: "Games", href: "/servicos/games", desc: "PS4, PS5, Xbox, Switch" },
];

const RegiaoDetalhe = () => {
  const { city, neighborhood } = useParams<{ city: string; neighborhood?: string }>();
  const cityData = city ? getCityBySlug(city) : null;
  
  const cityName = cityData?.name || (city ? formatNameFromSlug(city) : "");
  const neighborhoodName = neighborhood ? formatNameFromSlug(neighborhood) : "";
  const whatsappLink = buildWhatsAppUrl({
    service: "assistência técnica",
    city: cityName || undefined,
    neighborhood: neighborhoodName || undefined,
  });
  
  const pageTitle = neighborhood 
    ? `Técnico em ${neighborhoodName}, ${cityName}`
    : `Técnico em ${cityName}`;
    
  const pageDescription = neighborhood
    ? `Assistência técnica especializada no bairro ${neighborhoodName} em ${cityName} - PR. Informática, elétrica, CFTV, ar-condicionado, notebooks. Atendimento 24h via WhatsApp. Visita técnica a partir de R$ 99,99.`
    : cityData?.seoDescription || `Assistência técnica em ${cityName} - PR. Técnicos especializados em informática, elétrica, CFTV, ar-condicionado. Atendimento 24h via WhatsApp. A partir de R$ 99,99.`;

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Preciso de Um Técnico - ${pageTitle}`,
    "description": pageDescription,
    "url": `https://precisodeumtecnico.com/regioes/${city}${neighborhood ? `/${neighborhood}` : ''}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": "PR",
      "addressCountry": "BR"
    },
    "areaServed": {
      "@type": neighborhood ? "Neighborhood" : "City",
      "name": neighborhood ? neighborhoodName : cityName
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    }
  };

  const pageUrl = `https://precisodeumtecnico.com/regioes/${city}${neighborhood ? `/${neighborhood}` : ''}`;
  const offerSchema = buildOfferSchema({
    serviceName: `Assistência técnica em ${neighborhood ? neighborhoodName + ", " + cityName : cityName}`,
    areaServed: neighborhood ? `${neighborhoodName}, ${cityName}` : cityName,
    url: pageUrl,
  });
  const reviewsSchema = buildReviewsSchema();

  // Rodada 32 — FAQ da cidade: só em páginas de cidade (não em bairro, que tem
  // sua própria FAQ curada), montada a partir da cobertura real de bairros.
  const cityFaqs = !neighborhood && cityData
    ? buildCityFaqs({
        cityName: cityData.name,
        neighborhoods: cityData.neighborhoods,
        serviceAreas: cityData.serviceAreas,
        description: cityData.description,
      })
    : [];

  // Rodada 25.1 — Bloco 0: FAQ regional removida.
  // Era template que só trocava nome de bairro/cidade em 200+ páginas.
  // FAQPage só será reemitido em páginas com curadoria real.


  return (
    <Layout>
      <SEOHead
        title={`${pageTitle} | Assistência Técnica 24h | Preciso de Um Técnico`}
        description={pageDescription}
        canonical={pageUrl}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Regiões", url: "https://precisodeumtecnico.com/regioes" },
          { name: cityName, url: `https://precisodeumtecnico.com/regioes/${city}` },
          ...(neighborhood ? [{ name: neighborhoodName, url: pageUrl }] : []),
        ]}
        service={{
          name: `Assistência técnica em ${neighborhood ? `${neighborhoodName}, ${cityName}` : cityName}`,
          description: pageDescription,
          priceMinBRL: 99.99,
          areaServed: neighborhood ? `${neighborhoodName}, ${cityName}` : cityName,
        }}
        faq={cityFaqs.length > 0 ? cityFaqs : undefined}
        structuredData={[localSchema, offerSchema, reviewsSchema].filter(Boolean) as object[]}

      />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 tech-grid opacity-10" />
        
        <div className="relative container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <Link to="/regioes" className="hover:text-white transition-colors">Regiões</Link>
            <span>/</span>
            {neighborhood ? (
              <>
                <Link to={`/regioes/${city}`} className="hover:text-white transition-colors">{cityName}</Link>
                <span>/</span>
                <span className="text-white">{neighborhoodName}</span>
              </>
            ) : (
              <span className="text-white">{cityName}</span>
            )}
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 text-success border border-success/30">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">
                  {neighborhood ? `${neighborhoodName}, ${cityName}` : cityName} - PR
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {neighborhood ? (
                  <>
                    Assistência Técnica no
                    <span className="text-success block">{neighborhoodName}</span>
                    <span className="text-2xl md:text-3xl mt-2 text-white/80 block">{cityName} - Paraná</span>
                  </>
                ) : (
                  <>
                    Assistência Técnica em
                    <span className="text-success block">{cityName}</span>
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                {neighborhood ? (
                  `Técnicos especializados prontos para atender no bairro ${neighborhoodName}. Informática, elétrica, CFTV, ar-condicionado, notebooks, celulares e games. Agendamento 24h via WhatsApp!`
                ) : (
                  cityData?.description || `Assistência técnica completa em ${cityName}. Técnicos certificados para atender residências e empresas com garantia em todos os serviços.`
                )}
              </p>

              {/* Price Badge */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="price-tag">
                  A partir de R$ 99,99
                </div>
                <span className="text-white/70 text-sm">até 30 min de serviço</span>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Nota Fiscal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Garantia 90 dias a 1 ano</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Técnicos Certificados</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source={neighborhood ? "neighborhood-detail" : "region-detail"}
                  data-service="assistência técnica"
                  data-city={cityName}
                  {...(neighborhood ? { "data-neighborhood": neighborhoodName } : {})}
                  aria-label={`Falar com técnico em ${neighborhood ? `${neighborhoodName}, ${cityName}` : cityName}`}
                  onClick={() => trackWhatsAppClick({ source: neighborhood ? "neighborhood-detail" : "region-detail", city: cityName, bairro: neighborhoodName || undefined })}
                >
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-success hover:bg-success/90 cta-glow gap-3">
                    <MessageCircle className="w-6 h-6" />
                    Chamar Técnico Agora
                  </Button>
                </a>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card bg-white/10 backdrop-blur-md border-white/20 text-center">
                <Clock className="w-10 h-10 text-success mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">24h</div>
                <div className="text-white/70 text-sm">Agendamento</div>
              </div>
              <div className="stat-card bg-white/10 backdrop-blur-md border-white/20 text-center">
                <Shield className="w-10 h-10 text-success mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">1 Ano</div>
                <div className="text-white/70 text-sm">Garantia</div>
              </div>
              <div className="stat-card bg-white/10 backdrop-blur-md border-white/20 text-center">
                <Star className="w-10 h-10 text-success mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">Local</div>
                <div className="text-white/70 text-sm">Técnicos da região</div>
              </div>
              <div className="stat-card bg-white/10 backdrop-blur-md border-white/20 text-center">
                <FileText className="w-10 h-10 text-success mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">NF</div>
                <div className="text-white/70 text-sm">Nota Fiscal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta âncora — preço + termos com hierarquia forte */}
      <section className="bg-background py-8">
        <div className="container-custom max-w-4xl">
          <OfferHighlight region={`${neighborhood ? neighborhoodName + ", " : ""}${cityName}`} />
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="badge-primary mb-4">Serviços Disponíveis</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Serviços Técnicos em {neighborhood ? neighborhoodName : cityName}
            </h2>
            <p className="text-muted-foreground">
              Técnicos especializados prontos para atender você. Diagnóstico por R$ 99,99 (deduzido se aprovar) e orçamento sem compromisso via WhatsApp.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.href}
                to={service.href}
                onClick={() => trackCtaClick({ surface: "city_page", cta_id: "city_service_card", label: service.name, destination: service.href, service: service.name, city: city!, bairro: neighborhood })}
                className="region-card group hover:border-primary/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-4 transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {service.desc}
                </p>
                <span className="text-xs text-primary font-medium flex items-center gap-1">
                  Saiba mais <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods Section (only for city pages) */}
      {!neighborhood && cityData && cityData.neighborhoods.length > 0 && (
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="badge-primary mb-4">
                <Home className="w-4 h-4 mr-1" />
                Bairros Atendidos
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Todos os Bairros de {cityName}
              </h2>
              <p className="text-muted-foreground">
                Atendemos <strong>{cityData.neighborhoods.length} bairros</strong> em {cityName} com técnicos especializados.
                Clique no seu bairro para ver mais informações.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cityData.neighborhoods.map((bairro) => (
                <Link
                  key={bairro}
                  to={`/regioes/${city}/${formatNeighborhoodSlug(bairro)}`}
                  onClick={() => trackCtaClick({ surface: "city_page", cta_id: "city_bairro_chip", label: bairro, destination: `/regioes/${city}/${formatNeighborhoodSlug(bairro)}`, city: city!, bairro: formatNeighborhoodSlug(bairro) })}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
                >
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                    {bairro}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO Content Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {neighborhood 
                ? `Assistência Técnica no ${neighborhoodName}, ${cityName}`
                : `Assistência Técnica em ${cityName} - Paraná`
              }
            </h2>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              {neighborhood ? (
                <>
                  <p>
                    Procurando um <strong>técnico de informática no {neighborhoodName}</strong>? A <strong>Preciso de Um Técnico</strong> 
                    oferece atendimento especializado para moradores e empresas do bairro {neighborhoodName} em {cityName}, Paraná.
                  </p>
                  
                  <p>
                    Nossa equipe de técnicos certificados está pronta para resolver problemas com 
                    <strong> computadores, notebooks, instalação de câmeras de segurança (CFTV), ar-condicionado, 
                    serviços elétricos, configuração de redes Wi-Fi, reparo de celulares e consoles de games</strong> diretamente no seu endereço.
                  </p>

                  <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                    Por que escolher a Preciso de Um Técnico no {neighborhoodName}?
                  </h3>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span><strong>Atendimento rápido:</strong> Técnicos próximos ao {neighborhoodName} para atendimento ágil</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span><strong>Agendamento 24h:</strong> Via WhatsApp, a qualquer hora do dia ou da noite</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span><strong>Visita técnica:</strong> Atendimento das 8h às 22h no seu endereço</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span><strong>Preço justo:</strong> Visitas a partir de R$ 99,99 até 30 minutos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span><strong>Garantia:</strong> Todos os serviços com garantia de 90 dias a 1 ano</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                      <span><strong>Nota Fiscal:</strong> Emissão de NF para todos os serviços</span>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    A <strong>Preciso de Um Técnico</strong> é a sua melhor opção para <strong>assistência técnica em {cityName}</strong>. 
                    Com uma equipe de técnicos qualificados e certificados, oferecemos serviços completos para residências e empresas em toda a cidade.
                  </p>
                  
                  <p>
                    {cityData?.description || `Atendemos todos os bairros de ${cityName} com serviços de informática, 
                    notebooks, instalação de câmeras de segurança, ar-condicionado, serviços elétricos, configuração de redes e muito mais.`}
                  </p>

                  <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                    Serviços Técnicos em {cityName}
                  </h3>

                  <ul className="grid md:grid-cols-2 gap-2">
                    <li>• Formatação e manutenção de computadores</li>
                    <li>• Reparo de notebooks e ultrabooks</li>
                    <li>• Instalação de câmeras de segurança (CFTV)</li>
                    <li>• Instalação e manutenção de ar-condicionado</li>
                    <li>• Serviços elétricos residenciais e comerciais</li>
                    <li>• Configuração de redes e Wi-Fi Mesh</li>
                    <li>• Reparo de celulares e tablets</li>
                    <li>• Conserto de games e consoles</li>
                  </ul>

                  {cityData?.features && (
                    <>
                      <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                        Diferenciais em {cityName}
                      </h3>
                      <ul className="space-y-2">
                        {cityData.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Back navigation */}
            {neighborhood && (
              <div className="mt-12">
                <Link to={`/regioes/${city}`}>
                  <Button variant="outline" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    Ver todos os bairros de {cityName}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section — específica da cidade (Rodada 32) */}
      {cityFaqs.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container-custom max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              Perguntas frequentes — {cityName}
            </h2>
            <Accordion type="single" collapsible>
              {cityFaqs.map((f, i) => (
                <AccordionItem data-faq-item key={i} value={`city-faq-${i}`}>
                  <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.question}</AccordionTrigger>
                  <AccordionContent data-faq-answer>{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}


      <CTASection />
      <LocalityPhotoBand
        title={"Referências visuais do atendimento nesta região"}
        intro={"Fotos reais de bancada, redes, CFTV e elétrica — o mesmo escopo técnico atendido aqui."}
      />

    </Layout>
  );
};

export default RegiaoDetalhe;
