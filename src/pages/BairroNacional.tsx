import { useParams, Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import NotFound from "./NotFound";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, MessageCircle, ShieldCheck, Clock, ArrowRight, CheckCircle2,
  Monitor, Laptop, Camera, Zap, Wifi, Wind, Smartphone, Gamepad2,
} from "lucide-react";
import { getNationalCityBySlug } from "@/data/nationalCities";
import {
  getNationalBairro,
  getBairrosForCity,
  suggestBairros,
} from "@/data/nationalBairros";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick, trackCtaClick } from "@/lib/analytics";
import { RegionalSymptomFAQ } from "@/components/seo/RegionalSymptomFAQ";
import { InternalLinkCluster } from "@/components/seo/InternalLinkCluster";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";
import { buildBairroFaqs } from "@/data/localFaq";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickLocalityPhotos } from "@/data/publicPhotos";
// FAQ regional (Rodada 27+): derivada de src/data/symptoms.ts, adaptada
// automaticamente por cidade/bairro sem inventar preços ou prazos.


const services = [
  { icon: Monitor, name: "Informática", href: "/servicos/informatica" },
  { icon: Laptop, name: "Notebooks", href: "/servicos/notebooks" },
  { icon: Camera, name: "CFTV / Câmeras", href: "/servicos/cftv" },
  { icon: Zap, name: "Elétrica", href: "/servicos/eletrica" },
  { icon: Wifi, name: "Redes / Wi-Fi", href: "/servicos/redes" },
  { icon: Wind, name: "Ar-Condicionado", href: "/servicos/ar-condicionado" },
  { icon: Smartphone, name: "Celulares", href: "/servicos/celulares" },
  { icon: Gamepad2, name: "Games", href: "/servicos/games" },
];

/**
 * Página de bairro nacional (Rodada 22.1).
 * Rota: /atendimento-nacional/:city/:bairro
 * - Só renderiza se `city` e `bairro` existirem nos datasets curados.
 * - Sem estatísticas fabricadas (nada de aggregateRating/reviewCount fake).
 * - SEO: title/description/canonical/og:* únicos, BreadcrumbList + Service schema.
 * - CTA único: WhatsApp com cidade+bairro no ?text= (utm_source=whatsapp_cta).
 */
export default function BairroNacional() {
  const { city: citySlug, bairro: bairroSlug } = useParams<{
    city: string;
    bairro: string;
  }>();

  const city = citySlug ? getNationalCityBySlug(citySlug) : null;
  // Cidade inexistente → 404 real (noindex), nunca 200 com redirect.
  if (!city) return <NotFound />;

  const bairro = bairroSlug ? getNationalBairro(citySlug!, bairroSlug) : null;

  // Bairro inexistente → página de sugestões, não 404 cego.
  if (!bairro) {
    const suggestions = suggestBairros(citySlug!);
    return (
      <Layout>
        <SEOHead
          title={`Bairro não catalogado em ${city.name}`}
          description={`Ainda não temos página dedicada para esse bairro em ${city.name}. Fale com nossa central e indicamos um técnico parceiro na região.`}
          canonical={`https://precisodeumtecnico.com/atendimento-nacional/${city.slug}`}
          noindex
        />
        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">
            Bairro ainda não catalogado em {city.name}
          </h1>
          <p className="text-muted-foreground mb-8">
            Não temos uma página dedicada para <strong>{bairroSlug}</strong> em
            {" "}{city.name} — {city.state}. Nossa rede nacional cobre a região;
            fale com a central e indicamos um técnico parceiro homologado.
          </p>
          {suggestions.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-3">
                Bairros de {city.name} que já publicamos:
              </h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {suggestions.map((b) => (
                  <Link
                    key={b.slug}
                    to={`/atendimento-nacional/${city.slug}/${b.slug}`}
                    className="px-4 py-2 rounded-full bg-muted hover:bg-primary/10 text-sm"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </>
          )}
          <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#20BD5A] text-white">
            <a
              href={buildWhatsAppUrl({ service: "assistência técnica", city: city.name, sourcePage: `/atendimento-nacional/${city.slug}` })}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="bairro-nacional-fallback"
              data-service="assistencia-tecnica"
              data-city={city.name}
              aria-label={`Chamar técnico em ${city.name} pelo WhatsApp`}
              onClick={() => trackWhatsAppClick({ source: "bairro_nacional_fallback", city: city.slug })}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar com a central de {city.name}
            </a>
          </Button>
        </section>
      </Layout>
    );
  }

  const url = `https://precisodeumtecnico.com/atendimento-nacional/${city.slug}/${bairro.slug}`;
  const pageTitle = `Assistência técnica premium em ${bairro.name}, ${city.name} — ${city.state}`;
  const description = `Rede nacional de técnicos certificados atendendo ${bairro.name}, ${city.name} (${city.stateName}). Do reparo emergencial ao atendimento corporativo — sem improviso e sem desvalorização da mão de obra. Orçamento formal via WhatsApp.`;

  const whatsappLink = buildWhatsAppUrl({
    service: "assistência técnica",
    city: city.name,
    neighborhood: bairro.name,
    sourcePage: `/atendimento-nacional/${city.slug}/${bairro.slug}`,
  });

  const breadcrumbs = [
    { name: "Início", url: "https://precisodeumtecnico.com/" },
    { name: "Atendimento Nacional", url: "https://precisodeumtecnico.com/atendimento-nacional" },
    { name: `${city.name} - ${city.state}`, url: `https://precisodeumtecnico.com/atendimento-nacional/${city.slug}` },
    { name: bairro.name, url },
  ];

  // Service schema SEM aggregateRating / reviewCount fabricados.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Assistência técnica em ${bairro.name}, ${city.name}`,
    description,
    provider: {
      "@type": "Organization",
      name: "Preciso de Um Técnico",
      url: "https://precisodeumtecnico.com",
    },
    areaServed: {
      "@type": "Place",
      name: `${bairro.name}, ${city.name} - ${city.state}`,
      containedInPlace: {
        "@type": "City",
        name: city.name,
        containedInPlace: { "@type": "State", name: city.stateName, addressCountry: "BR" },
      },
    },
    serviceType: "Assistência técnica em informática, notebooks, redes, CFTV, elétrica e ar-condicionado",
  };

  // Bairros vizinhos (mesma cidade), exceto o atual.
  const nearby = getBairrosForCity(city.slug).filter((b) => b.slug !== bairro.slug).slice(0, 6);

  return (
    <Layout>
      <SEOHead
        title={pageTitle}
        description={description}
        canonical={url}
        breadcrumbs={breadcrumbs}
        structuredData={[serviceSchema, buildLocalBusinessSchema({ city: city.name, state: city.uf, neighborhood: bairro.name, extraAreas: [city.name] })]}
      />


      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/70 mb-6">
            <Link to="/" className="hover:text-primary-foreground">Início</Link>
            <span>/</span>
            <Link to="/atendimento-nacional" className="hover:text-primary-foreground">Atendimento Nacional</Link>
            <span>/</span>
            <Link to={`/atendimento-nacional/${city.slug}`} className="hover:text-primary-foreground">{city.name}</Link>
            <span>/</span>
            <span className="text-primary-foreground">{bairro.name}</span>
          </nav>

          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-accent" />
              <span className="text-accent font-semibold">
                {bairro.name}, {city.name} — {city.state}
                {bairro.descriptor ? ` · ${bairro.descriptor}` : ""}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Assistência técnica premium em {bairro.name}, {city.name}
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl">
              Rede nacional de técnicos certificados. Do reparo emergencial ao
              atendimento corporativo — sem improviso e sem desvalorização da
              mão de obra.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-2 rounded-full">
                <Clock className="h-5 w-5 text-accent" />
                <span>Central 24h via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-2 rounded-full">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span>Prestadores homologados</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span>Orçamento formal antes do serviço</span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg h-14 px-8"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-source="bairro-nacional-hero"
                data-service="assistencia-tecnica"
                data-city={city.name}
                data-neighborhood={bairro.name}
                aria-label={`Chamar técnico em ${bairro.name}, ${city.name} pelo WhatsApp`}
                onClick={() =>
                  trackWhatsAppClick({
                    source: "bairro_nacional_hero",
                    city: city.slug,
                    bairro: bairro.slug,
                  })
                }
              >
                <MessageCircle className="mr-2 h-6 w-6" />
                Falar com a central agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            Serviços atendidos em {bairro.name}
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
            Do micro em celulares ao ambiente residencial, empresarial e
            corporativo. Do básico ao projeto ultra-exigente.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.name} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {s.name}
                    </h3>
                    <Link
                      to={s.href}
                      onClick={() =>
                        trackCtaClick({
                          surface: "bairro_nacional",
                          cta_id: "service_card",
                          label: s.name,
                          destination: s.href,
                          service: s.name,
                          city: city.slug,
                          bairro: bairro.slug,
                        })
                      }
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

      {/* Posicionamento premium */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Por que uma rede premium em {bairro.name}?
          </h2>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Técnicos certificados</strong>:
                homologados por processo próprio — sem intermediários improvisados.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Cobertura completa</strong>: do
                atendimento residencial ao contrato corporativo de manutenção.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Orçamento por escrito</strong>{" "}
                antes de qualquer serviço, com garantia formal.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Nada de leilão de preço</strong>:
                trabalho técnico de qualidade tem valor — e vale a pena.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <PublicPhotoBand
        title={`Como é o trabalho técnico que atende ${bairro.name}`}
        intro={`Fotos reais de bancada, rede e infraestrutura — o mesmo tipo de serviço que a rede executa em ${bairro.name}, ${city.name}.`}
        photos={pickLocalityPhotos(city.slug, `${city.slug}-${bairro.slug}`, 3)}
      />

      <RegionalSymptomFAQ
        cityName={city.name}
        neighborhoodName={bairro.name}
        seedSlug={`${city.slug}-${bairro.slug}`}
        count={3}
        localFaqs={buildBairroFaqs({
          bairroName: bairro.name,
          cityName: city.name,
          intro: bairro.descriptor,
          nearby: nearby.map((b) => b.name),
        })}
        localFaqsHeading={`Atendimento em ${bairro.name}`}
      />


      <InternalLinkCluster
        city={city.name}
        citySlug={city.slug}
        neighborhood={bairro.name}
        neighborhoodSlug={bairro.slug}
      />



      {/* Bairros vizinhos */}
      {nearby.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Outros bairros atendidos em {city.name}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {nearby.map((b) => (
                <Link
                  key={b.slug}
                  to={`/atendimento-nacional/${city.slug}/${b.slug}`}
                  onClick={() =>
                    trackCtaClick({
                      surface: "bairro_nacional",
                      cta_id: "nearby_bairro_chip",
                      label: b.name,
                      destination: `/atendimento-nacional/${city.slug}/${b.slug}`,
                      city: city.slug,
                      bairro: b.slug,
                    })
                  }
                  className="px-4 py-2 bg-muted hover:bg-primary/10 rounded-full text-sm"
                >
                  {b.name}
                </Link>
              ))}
              <Link
                to={`/atendimento-nacional/${city.slug}`}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-sm text-primary"
              >
                Ver {city.name} completa →
              </Link>
            </div>
          </div>
        </section>
      )}

    </Layout>
  );
}
