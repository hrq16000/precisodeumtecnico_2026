import { useParams, Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, Phone, Clock, Shield, Star, CheckCircle2, 
  Monitor, Laptop, Camera, Zap, Wifi, Thermometer,
  Smartphone, Gamepad2, ArrowRight, MessageCircle
} from "lucide-react";
import { citiesData, getCityBySlug, formatNeighborhoodSlug, formatNameFromSlug, curitibaBairros } from "@/data/regions";
import { getBairroContent } from "@/data/sjpBairroContent";
import { buildBairroFaqs } from "@/data/localFaq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QuickDiagnosisQuiz } from "@/components/QuickDiagnosisQuiz";
import { OfferHighlight } from "@/components/marketing/OfferHighlight";
import { buildOfferSchema } from "@/components/seo/OfferSchema";
import { buildReviewsSchema } from "@/data/testimonials";
import { trackWhatsAppClick, trackCtaClick } from "@/lib/analytics";
import NotFound from "./NotFound";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";
import { LocalityPhotoBand } from "@/components/media/LocalityPhotoBand";

const serviceIcons: Record<string, any> = {
  "Informática": Monitor,
  "CFTV": Camera,
  "Elétrica": Zap,
  "Ar-Condicionado": Thermometer,
  "Notebooks": Laptop,
  "Redes": Wifi,
  "Celulares": Smartphone,
  "Games": Gamepad2
};

const servicesList = [
  { name: "Informática", slug: "informatica", description: "Formatação, limpeza, upgrade, remoção de vírus" },
  { name: "Notebooks", slug: "notebooks", description: "Troca de tela, teclado, bateria, SSD" },
  { name: "CFTV", slug: "cftv", description: "Câmeras de segurança, DVR, acesso remoto" },
  { name: "Elétrica", slug: "eletrica", description: "Instalações, reparos, disjuntores, tomadas" },
  { name: "Redes", slug: "redes", description: "Cabeamento, Wi-Fi, switches, roteadores" },
  { name: "Ar-Condicionado", slug: "ar-condicionado", description: "Instalação, manutenção, limpeza, gás" },
  { name: "Celulares", slug: "celulares", description: "Troca de tela, bateria, conectores" },
  { name: "Games", slug: "games", description: "Conserto de consoles, PS4, PS5, Xbox" }
];

export default function BairroDetalhe() {
  const { city, neighborhood } = useParams<{ city: string; neighborhood: string }>();
  
  const cityData = city ? getCityBySlug(city) : null;
  
  if (!cityData || !neighborhood) {
    return <NotFound />;
  }

  const neighborhoodName = formatNameFromSlug(neighborhood);
  const formattedNeighborhoods = cityData.neighborhoods.map(n => formatNeighborhoodSlug(n));
  
  // Check if neighborhood exists
  if (!formattedNeighborhoods.includes(neighborhood)) {
    return <NotFound />;
  }

  const pageTitle = `Técnico em ${neighborhoodName} - ${cityData.name}`;
  const pageDescription = `Assistência técnica no bairro ${neighborhoodName}, ${cityData.name}. Informática, elétrica, CFTV, notebooks, ar-condicionado. Atendimento 24h via WhatsApp. Técnico vai até você! A partir de R$ 99,99.`;

  const whatsappMessage = `Olá! Preciso de um técnico no bairro ${neighborhoodName}, ${cityData.name}. Podem me ajudar?`;
  const whatsappLink = buildWhatsAppUrlFromText(whatsappMessage);

  // Get nearby neighborhoods (up to 6)
  const currentIndex = formattedNeighborhoods.indexOf(neighborhood);
  const nearbyNeighborhoods = cityData.neighborhoods
    .filter((_, i) => i !== currentIndex)
    .slice(0, 6);

  const bairroContent = getBairroContent(city!, neighborhood, neighborhoodName);

  // FAQ específica do bairro (Rodada 32): derivada do texto curado (tempo médio
  // e serviços citados) + vizinhança real + termos comerciais oficiais.
  const localFaqs = buildBairroFaqs({
    bairroName: neighborhoodName,
    cityName: cityData.name,
    intro: bairroContent.intro,
    nearby: nearbyNeighborhoods,
  });

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Preciso de Um Técnico - ${neighborhoodName}`,
    "description": pageDescription,
    "url": `https://precisodeumtecnico.com/regioes/${city}/${neighborhood}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityData.name,
      "addressRegion": "PR",
      "addressCountry": "BR",
      "streetAddress": neighborhoodName
    },
    "areaServed": {
      "@type": "Place",
      "name": `${neighborhoodName}, ${cityData.name}`
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const pageUrl = `https://precisodeumtecnico.com/regioes/${city}/${neighborhood}`;
  const offerSchema = buildOfferSchema({
    serviceName: `Assistência técnica em ${neighborhoodName}, ${cityData.name}`,
    areaServed: `${neighborhoodName}, ${cityData.name}`,
    url: pageUrl,
  });
  const reviewsSchema = buildReviewsSchema();

  return (
    <Layout>
      <SEOHead
        title={`${pageTitle} | Assistência Técnica 24h`}
        description={pageDescription}
        canonical={pageUrl}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Regiões", url: "https://precisodeumtecnico.com/regioes" },
          { name: cityData.name, url: `https://precisodeumtecnico.com/regioes/${city}` },
          { name: neighborhoodName, url: pageUrl },
        ]}
        service={{
          name: `Assistência técnica em ${neighborhoodName}, ${cityData.name}`,
          description: pageDescription,
          areaServed: `${neighborhoodName}, ${cityData.name}`,
        }}
        structuredData={[localBusinessSchema, faqSchema, offerSchema, reviewsSchema].filter(Boolean) as object[]}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptLTYgNmgtNnY2aDZ2LTZ6bTYgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-primary-foreground/70 mb-6">
            <Link to="/" className="hover:text-primary-foreground transition-colors">Início</Link>
            <span>/</span>
            <Link to="/regioes" className="hover:text-primary-foreground transition-colors">Regiões</Link>
            <span>/</span>
            <Link to={`/regioes/${city}`} className="hover:text-primary-foreground transition-colors">{cityData.name}</Link>
            <span>/</span>
            <span className="text-primary-foreground">{neighborhoodName}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-accent" />
              <span className="text-accent font-semibold">{neighborhoodName}, {cityData.name} - PR</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Técnico em {neighborhoodName}
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl">
              Assistência técnica especializada no bairro {neighborhoodName}. 
              Atendimento imediato 24 horas via WhatsApp. Técnico vai até você!
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-2 rounded-full">
                <Clock className="h-5 w-5 text-accent" />
                <span>Atendimento 24h</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-2 rounded-full">
                <Shield className="h-5 w-5 text-accent" />
                <span>Garantia em todos os serviços</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-accent" />
                <span>Técnicos verificados</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg h-14 px-8"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="neighborhood-detail" data-service="assistência técnica" data-city={cityData.name} data-neighborhood={neighborhoodName} aria-label={`Chamar técnico em ${neighborhoodName} pelo WhatsApp`} onClick={() => trackWhatsAppClick({ source: "bairro_cta", city: city!, bairro: neighborhood })}>
                  <MessageCircle className="mr-2 h-6 w-6" />
                  Chamar Técnico Agora
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta âncora — preço + termos com hierarquia forte */}
      <section className="bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <OfferHighlight region={`${neighborhoodName}, ${cityData.name}`} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Serviços Disponíveis em {neighborhoodName}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Técnicos especializados prontos para atender no bairro {neighborhoodName}, {cityData.name}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesList.map((service) => {
              const IconComponent = serviceIcons[service.name] || Monitor;
              return (
                <Card key={service.slug} className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    <Link 
                      to={`/servicos/${service.slug}`}
                      onClick={() => trackCtaClick({ surface: "bairro_page", cta_id: "bairro_service_card", label: service.name, destination: `/servicos/${service.slug}`, service: service.name, city: city!, bairro: neighborhood })}
                      className="inline-flex items-center text-primary font-medium text-sm hover:underline"
                    >
                      Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Assistência Técnica no Bairro {neighborhoodName}
              </h2>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {bairroContent.intro}
              </p>

              <h3 className="text-2xl font-bold text-foreground mb-4 mt-8">
                Por que escolher nossos técnicos em {neighborhoodName}?
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {bairroContent.highlights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Principais serviços técnicos em {neighborhoodName}
              </h3>

              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Atendemos diversas necessidades técnicas no bairro {neighborhoodName}, incluindo:
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span><strong>Informática:</strong> Formatação, limpeza, upgrade, remoção de vírus em computadores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span><strong>Notebooks:</strong> Troca de tela, teclado, bateria, SSD, reparo de dobradiças</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span><strong>CFTV:</strong> Instalação de câmeras de segurança, DVR, acesso remoto pelo celular</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span><strong>Elétrica:</strong> Instalações, reparos, troca de disjuntores, tomadas e interruptores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span><strong>Redes:</strong> Cabeamento estruturado, Wi-Fi, configuração de roteadores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span><strong>Ar-Condicionado:</strong> Instalação, manutenção, limpeza e carga de gás</span>
                </li>
              </ul>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-8">
                <h4 className="text-xl font-bold text-foreground mb-3">
                  📍 Atendimento Rápido em {neighborhoodName}
                </h4>
                <p className="text-muted-foreground mb-4">
                  Nossos técnicos conhecem bem a região do {neighborhoodName} e podem chegar 
                  rapidamente até você. Não perca tempo procurando – chame agora via WhatsApp!
                </p>
                <Button asChild className="bg-[#25D366] hover:bg-[#20BD5A] text-white">
                  <a
                    data-wa-source="neighborhood-detail"
                    data-service="assistência técnica no bairro"
                    aria-label="Falar no WhatsApp sobre assistência técnica no bairro"
                    href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick({ source: "bairro_cta", city: city!, bairro: neighborhood })}>
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chamar Técnico no {neighborhoodName}
                  </a>
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Quiz diagnóstico */}
      <QuickDiagnosisQuiz city={city!} bairro={neighborhoodName} />

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Perguntas frequentes — {neighborhoodName}
          </h2>
          <Accordion type="single" collapsible>
            {localFaqs.map((f, i) => (
              <AccordionItem data-faq-item key={i} value={`faq-${i}`}>
                <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent data-faq-answer>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Outros bairros atendidos em {cityData.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {nearbyNeighborhoods.map((bairro) => (
              <Link
                key={bairro}
                to={`/regioes/${city}/${formatNeighborhoodSlug(bairro)}`}
                onClick={() => trackCtaClick({ surface: "bairro_page", cta_id: "nearby_bairro_chip", label: bairro, destination: `/regioes/${city}/${formatNeighborhoodSlug(bairro)}`, city: city!, bairro: formatNeighborhoodSlug(bairro) })}
                className="px-4 py-2 bg-muted hover:bg-primary/10 rounded-full text-foreground hover:text-primary transition-colors text-sm"
              >
                {bairro}
              </Link>
            ))}
            <Link
              to={`/regioes/${city}`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Ver todos os bairros
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Precisa de um técnico em {neighborhoodName}?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Atendimento imediato 24 horas. O técnico vai até você!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg h-14 px-10"
          >
            <a
              data-wa-source="neighborhood-detail"
              data-service="assistência técnica no bairro"
              aria-label="Falar no WhatsApp sobre assistência técnica no bairro"
              href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick({ source: "bairro_cta", city: city!, bairro: neighborhood })}>
              <MessageCircle className="mr-2 h-6 w-6" />
              Chamar Técnico Agora
            </a>
          </Button>
        </div>
      </section>
      <LocalityPhotoBand
        title={"Referências visuais do atendimento neste bairro"}
        intro={"Fotos reais de bancada, redes, CFTV e elétrica — o mesmo escopo técnico atendido aqui."}
      />

    </Layout>
  );
}
