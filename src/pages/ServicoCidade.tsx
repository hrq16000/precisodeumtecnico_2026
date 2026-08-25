import { useParams, Link, Navigate } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/Reveal";
import { servicesData } from "@/data/services";
import { citiesData } from "@/data/regions";
import { OfferHighlight } from "@/components/marketing/OfferHighlight";
import { buildOfferSchema } from "@/components/seo/OfferSchema";
import { buildReviewsSchema } from "@/data/testimonials";
import { CheckCircle2, MapPin, Phone, MessageCircle, Clock, Shield, Star, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { LocalityPhotoBand } from "@/components/media/LocalityPhotoBand";

// whatsappLink personalizado por rota dentro do componente

export default function ServicoCidade() {
  const { city, service } = useParams<{ city: string; service: string }>();

  const cityData = city ? citiesData[city] : undefined;
  const serviceData = service ? servicesData[service] : undefined;

  if (!cityData || !serviceData) {
    return <Navigate to="/404" replace />;
  }

  const title = `${serviceData.title} em ${cityData.name} | ${cityData.state} - Atendimento 24h`;
  const description = `${serviceData.title} em ${cityData.name}/${cityData.state}. Técnicos certificados, visita a partir de R$ 99,99, garantia, nota fiscal. Atendimento 24h via WhatsApp em todos os bairros de ${cityData.name}.`;
  const url = `https://precisodeumtecnico.com/servico-em/${cityData.slug}/${serviceData.slug}`;

  // Rodada 25.1 — Bloco 0: as 3 perguntas templatizadas por cidade foram
  // removidas (só trocavam o nome). Mantemos apenas as FAQs curadas do
  // serviço (fonte: servicesData) via SEOHead.faq — sem faqSchema manual
  // paralelo, sem duplicidade contra o Helmet.
  const serviceFaqs = serviceData.faqs;


  const localServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceData.title} em ${cityData.name}`,
    serviceType: serviceData.title,
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de Um Técnico",
      areaServed: { "@type": "City", name: cityData.name, addressRegion: cityData.state },
    },
    areaServed: { "@type": "City", name: cityData.name },
    offers: {
      "@type": "Offer",
      price: "99.99",
      priceCurrency: "BRL",
      url,
    },
  };

  const offerSchema = buildOfferSchema({
    serviceName: `${serviceData.title} em ${cityData.name}`,
    areaServed: cityData.name,
    url,
  });
  const reviewsSchema = buildReviewsSchema();

  // Related cross-links
  const otherServices = Object.values(servicesData)
    .filter((s) => s.slug !== serviceData.slug)
    .slice(0, 6);
  const otherCities = Object.values(citiesData)
    .filter((c) => c.slug !== cityData.slug)
    .slice(0, 8);

  const whatsappLink = buildWhatsAppUrl({
    service: serviceData.title,
    city: cityData.name,
  });

  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        canonical={url}
        keywords={[
          ...serviceData.keywords,
          `${serviceData.title.toLowerCase()} ${cityData.name.toLowerCase()}`,
          `técnico ${cityData.name.toLowerCase()}`,
          `assistência técnica ${cityData.name.toLowerCase()}`,
        ].join(", ")}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
          { name: serviceData.title, url: `https://precisodeumtecnico.com/servicos/${serviceData.slug}` },
          { name: cityData.name, url },
        ]}
        service={{
          name: `${serviceData.title} em ${cityData.name}`,
          description,
          priceMinBRL: 99.99,
          areaServed: `${cityData.name}, ${cityData.state}`,
        }}
        structuredData={[localServiceSchema, offerSchema, reviewsSchema].filter(Boolean) as object[]}
        faq={serviceFaqs}
      />


      {/* Hero */}
      <section className="relative bg-gradient-to-br from-foreground via-foreground to-primary/20 text-background py-16 md:py-24">
        <div className="container-custom">
          <Reveal>
            <nav className="text-xs sm:text-sm text-background/60 mb-4 flex flex-wrap gap-2 items-center">
              <Link to="/" className="hover:text-background">Início</Link>
              <span>/</span>
              <Link to={`/servicos/${serviceData.slug}`} className="hover:text-background">{serviceData.title}</Link>
              <span>/</span>
              <span className="text-background">{cityData.name}</span>
            </nav>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{cityData.name} — {cityData.state}</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              {serviceData.title} em <span className="text-primary">{cityData.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-background/80 mb-8 max-w-3xl">
              {serviceData.subtitle} — atendimento técnico em todos os bairros de {cityData.name} com visita a partir de R$ 99,99, garantia e nota fiscal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="whatsapp" asChild>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source="service-city"
                  data-service={serviceData.title}
                  data-city={cityData.name}
                  aria-label={`Falar com técnico — ${serviceData.title} em ${cityData.name}`}
                >
                  <MessageCircle className="w-5 h-5" /> Chamar Técnico Agora
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-8 text-sm">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Atendimento 24h</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Garantia até 1 ano</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Atendimento local verificado</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Oferta âncora — preço (R$ 99,99) + termos com hierarquia forte */}
      <section className="bg-background pt-8">
        <div className="container-custom max-w-4xl">
          <OfferHighlight region={`${cityData.name} — ${cityData.state}`} serviceSlug={serviceData.slug} />
        </div>
      </section>

      {/* Long content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
              Por que escolher nossa {serviceData.title.toLowerCase()} em {cityData.name}?
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {serviceData.longDescription}
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Em {cityData.name}, atendemos residências, comércios e empresas com técnicos formados e experientes. Nossa cobertura inclui todos os bairros — do centro às regiões periféricas — com tempo médio de chegada entre 1 e 4 horas após a aprovação do orçamento via WhatsApp.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Diferente de assistências comuns, oferecemos diagnóstico no local, orçamento transparente, peças originais e garantia por escrito. Emitimos nota fiscal e seguimos os Termos de Orçamento Pré-Aprovado, que protegem cliente e técnico em qualquer reparo realizado em {cityData.name}.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 mt-12">O que está incluso</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {serviceData.includedServices.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 mt-12">Preços de referência em {cityData.name}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceData.pricing.slice(0, 6).map((p) => (
                <Card key={p.name} className="p-4 hover-lift">
                  <div className="flex justify-between gap-2 mb-1">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-primary font-bold whitespace-nowrap">{p.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Valores de referência sujeitos a diagnóstico. Visita técnica + diagnóstico R$ 99,99. Orçamento Pré-Aprovado a partir de R$ 299,99 (não inclui peças, componentes, materiais ou itens adicionais).{" "}
              <Link to="/termos-orcamento-pre-aprovado" className="underline hover:text-primary">Ver termos</Link>.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 mt-12">Perguntas frequentes — {serviceData.title} em {cityData.name}</h2>
            <Accordion type="single" collapsible>
              {serviceFaqs.map((faq, i) => (
                <AccordionItem data-faq-item key={i} value={`item-${i}`}>
                  <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent data-faq-answer>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          {/* Internal linking */}
          <Reveal>
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-xl font-bold mb-4">Outros serviços em {cityData.name}</h3>
                <ul className="space-y-2">
                  {otherServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/servico-em/${cityData.slug}/${s.slug}`}
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" /> {s.title} em {cityData.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold mb-4">{serviceData.title} em outras cidades</h3>
                <ul className="space-y-2">
                  {otherCities.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/servico-em/${c.slug}/${serviceData.slug}`}
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" /> {serviceData.title} em {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <LocalityPhotoBand
        title={"Como o serviço é executado na prática"}
        intro={"Fotos reais de bancada, redes e infraestrutura — referência visual do escopo atendido nesta cidade."}
      />

    </Layout>
  );
}
