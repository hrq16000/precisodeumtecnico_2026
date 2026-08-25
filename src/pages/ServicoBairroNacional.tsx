import { useParams, Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, MessageCircle, ShieldCheck, Clock, ArrowRight, CheckCircle2, Wrench,
} from "lucide-react";
import {
  resolvePilotCombination,
  getPilotBairrosForCity,
  getOtherPilotServices,
  getPilotCityConfig,
  pilotServices,
} from "@/data/nationalServiceCoverage";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick, trackCtaClick } from "@/lib/analytics";
// FAQ (Rodada 32.1): perguntas ancoradas na localidade + termos comerciais
// oficiais, com paridade 1:1 entre DOM e FAQPage (RegionalSymptomFAQ).
import { RegionalSymptomFAQ } from "@/components/seo/RegionalSymptomFAQ";
import { buildBairroFaqs } from "@/data/localFaq";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickLocalityPhotos } from "@/data/publicPhotos";

/**
 * Rodada 24.1 — Página nacional serviço × cidade × bairro.
 * Rota: /servico-em-nacional/:city/:bairro/:service
 *
 * - Só renderiza quando resolvePilotCombination() valida os 3 slugs contra a
 *   fonte única (`nationalServiceCoverage`).
 * - Combinação inválida ou não habilitada → NotFound (não indexável).
 * - Não fabrica ratings/técnicos/clientes. Copy premium, sem promessa de preço.
 * - CTA principal abre TRIAGEM (evento global). WhatsApp secundário preserva
 *   contexto (service/city/neighborhood/source/utm) via buildWhatsAppUrl().
 */
export default function ServicoBairroNacional() {
  const { city: citySlug, bairro: bairroSlug, service: serviceSlug } = useParams<{
    city: string;
    bairro: string;
    service: string;
  }>();

  const combo = resolvePilotCombination(citySlug, bairroSlug, serviceSlug);

  // Combinação inválida ou não habilitada — fallback com noindex efetivo.
  // Cobre: cidade inexistente, bairro fora da cidade, serviço inexistente e
  // combinação existente porém não habilitada no piloto. NUNCA emite Service
  // schema nem canonical self da URL inválida.
  if (!combo) {
    const cityCfg = getPilotCityConfig(citySlug ?? "");
    const suggestions = cityCfg ? getPilotBairrosForCity(citySlug ?? "").slice(0, 4) : [];
    const availableCities = cityCfg ? [] : ["sao-paulo", "rio-de-janeiro", "brasilia", "salvador", "campinas"];

    return (
      <Layout>
        <SEOHead
          title="Combinação não disponível — Atendimento nacional"
          description="Esta combinação de serviço/bairro ainda não está publicada. Fale com a nossa central para indicarmos um técnico verificado."
          canonical="https://precisodeumtecnico.com/atendimento-nacional"
          noindex
        />
        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">Combinação ainda não publicada</h1>
          <p className="text-muted-foreground mb-8">
            Ainda não temos uma página dedicada para essa combinação de cidade,
            bairro e serviço. Nossa rede nacional pode indicar um técnico
            verificado — fale com a central para triagem imediata.
          </p>
          {suggestions.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-3">Bairros publicados no piloto:</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {suggestions.map((b) => (
                  <Link
                    key={b.slug}
                    to={`/atendimento-nacional/${citySlug}/${b.slug}`}
                    className="px-4 py-2 rounded-full bg-muted hover:bg-primary/10 text-sm"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </>
          )}
          {availableCities.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-3">Cidades habilitadas no piloto:</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {availableCities.map((c) => (
                  <Link
                    key={c}
                    to={`/atendimento-nacional/${c}`}
                    className="px-4 py-2 rounded-full bg-muted hover:bg-primary/10 text-sm capitalize"
                  >
                    {c.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </>
          )}
          <Button asChild size="lg" data-triage-source="matrix-fallback">
            <Link to="/atendimento-nacional">Ver atendimento nacional</Link>
          </Button>
        </section>
      </Layout>
    );
  }

  const { city, bairro, service, path, url } = combo;

  const h1 = `${service.label} em ${bairro.name}, ${city.name}`;
  const title = `${service.label} em ${bairro.name}, ${city.name} — ${city.state}`;
  const description = `Rede nacional de técnicos verificados para ${service.seoNoun} em ${bairro.name}, ${city.name} (${city.stateName}). Orçamento formal antes do serviço, sem improviso e sem desvalorização da mão de obra.`;

  const whatsappLink = buildWhatsAppUrl({
    service: service.label.toLowerCase(),
    city: city.name,
    neighborhood: bairro.name,
    sourcePage: path,
  });

  const breadcrumbs = [
    { name: "Início",              url: "https://precisodeumtecnico.com/" },
    { name: "Atendimento Nacional", url: "https://precisodeumtecnico.com/atendimento-nacional" },
    { name: `${city.name} - ${city.state}`, url: `https://precisodeumtecnico.com/atendimento-nacional/${city.slug}` },
    { name: bairro.name,           url: `https://precisodeumtecnico.com/atendimento-nacional/${city.slug}/${bairro.slug}` },
    { name: service.label,         url },
  ];

  // Service schema — sem aggregateRating / reviewCount / ratingValue fabricados.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.label} em ${bairro.name}, ${city.name}`,
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
    serviceType: service.seoNoun,
  };

  const otherServices = getOtherPilotServices(service.slug, 5);
  const otherBairros = getPilotBairrosForCity(city.slug).filter((b) => b.slug !== bairro.slug).slice(0, 5);

  // Sem FAQ template — schema FAQPage suspenso até haver curadoria por combinação.


  const openTriage = () => {
    trackCtaClick({
      surface: "matrix_nacional",
      cta_id: "hero_triage",
      label: `Iniciar triagem — ${service.label} em ${bairro.name}, ${city.name}`,
      destination: path,
      service: service.label,
      city: city.slug,
      bairro: bairro.slug,
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("triage:open", {
        detail: {
          source: `matrix-nacional:${service.slug}:${city.slug}:${bairro.slug}`,
          category: service.triageCategory,
        },
      }));
    }
  };

  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        canonical={url}
        breadcrumbs={breadcrumbs}
        structuredData={[serviceSchema]}

      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/70 mb-6">
            <Link to="/" className="hover:text-primary-foreground">Início</Link>
            <span>/</span>
            <Link to="/atendimento-nacional" className="hover:text-primary-foreground">Atendimento Nacional</Link>
            <span>/</span>
            <Link to={`/atendimento-nacional/${city.slug}`} className="hover:text-primary-foreground">{city.name}</Link>
            <span>/</span>
            <Link to={`/atendimento-nacional/${city.slug}/${bairro.slug}`} className="hover:text-primary-foreground">{bairro.name}</Link>
            <span>/</span>
            <span className="text-primary-foreground">{service.label}</span>
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
              {h1}
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl">
              Rede nacional de técnicos verificados. Diagnóstico técnico e
              orçamento formal antes de qualquer serviço, sem improviso e sem
              desvalorização da mão de obra.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-2 rounded-full">
                <Clock className="h-5 w-5 text-accent" />
                <span>Central via WhatsApp</span>
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

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={openTriage}
                data-triage-source={`matrix-nacional:${service.slug}:${city.slug}:${bairro.slug}`}
                data-service={service.slug}
                data-city={city.slug}
                data-neighborhood={bairro.slug}
                aria-label={`Iniciar triagem técnica para ${service.label} em ${bairro.name}, ${city.name}`}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14 px-8"
              >
                <Wrench className="mr-2 h-6 w-6" />
                Iniciar triagem técnica
              </Button>

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg h-14 px-8"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source="matrix-nacional-hero"
                  data-service={service.slug}
                  data-city={city.name}
                  data-neighborhood={bairro.name}
                  aria-label={`Chamar técnico para ${service.label} em ${bairro.name}, ${city.name} pelo WhatsApp`}
                  onClick={() =>
                    trackWhatsAppClick({
                      source: "matrix_nacional_hero",
                      service: service.slug,
                      city: city.slug,
                      bairro: bairro.slug,
                    })
                  }
                >
                  <MessageCircle className="mr-2 h-6 w-6" />
                  Falar com a central
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Posicionamento */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Por que escolher a rede nacional em {bairro.name}
          </h2>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Técnicos verificados</strong>: parceiros homologados por processo próprio, sem intermediários improvisados.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Cobertura em {city.name}</strong>: {service.label.toLowerCase()} para uso residencial, profissional e corporativo em {bairro.name}.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Orçamento por escrito</strong> antes de qualquer serviço, com garantia formal.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Sem leilão de preço</strong>: trabalho técnico de qualidade tem valor — e vale a pena.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Interlinks controlados */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 grid gap-10 md:grid-cols-2 max-w-5xl">
          {otherServices.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Outros serviços em {bairro.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/servico-em-nacional/${city.slug}/${bairro.slug}/${s.slug}`}
                    onClick={() =>
                      trackCtaClick({
                        surface: "matrix_nacional",
                        cta_id: "other_service_chip",
                        label: s.label,
                        destination: `/servico-em-nacional/${city.slug}/${bairro.slug}/${s.slug}`,
                        service: s.label,
                        city: city.slug,
                        bairro: bairro.slug,
                      })
                    }
                    className="px-4 py-2 bg-muted hover:bg-primary/10 rounded-full text-sm"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {otherBairros.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Outros bairros em {city.name} com {service.label}
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherBairros.map((b) => (
                  <Link
                    key={b.slug}
                    to={`/servico-em-nacional/${city.slug}/${b.slug}/${service.slug}`}
                    onClick={() =>
                      trackCtaClick({
                        surface: "matrix_nacional",
                        cta_id: "other_bairro_chip",
                        label: b.name,
                        destination: `/servico-em-nacional/${city.slug}/${b.slug}/${service.slug}`,
                        service: service.label,
                        city: city.slug,
                        bairro: b.slug,
                      })
                    }
                    className="px-4 py-2 bg-muted hover:bg-primary/10 rounded-full text-sm"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to={`/atendimento-nacional/${city.slug}/${bairro.slug}`}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-sm text-primary"
          >
            Ver {bairro.name} completa
          </Link>
          <Link
            to={`/atendimento-nacional/${city.slug}`}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-sm text-primary"
          >
            Ver {city.name} completa
          </Link>
          <Link
            to="/atendimento-nacional"
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-sm text-primary"
          >
            Atendimento nacional
          </Link>
        </div>

        <Card className="container mx-auto mt-10 max-w-3xl">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">
                Pronto para iniciar {service.label.toLowerCase()} em {bairro.name}?
              </p>
              <p className="text-sm text-muted-foreground">
                Triagem guiada em 6 etapas — orçamento formal antes de qualquer visita.
              </p>
            </div>
            <Button
              size="lg"
              onClick={openTriage}
              data-triage-source={`matrix-nacional-footer:${service.slug}:${city.slug}:${bairro.slug}`}
              data-service={service.slug}
              data-city={city.slug}
              data-neighborhood={bairro.slug}
              aria-label={`Iniciar triagem — ${service.label} em ${bairro.name}, ${city.name}`}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Iniciar triagem
            </Button>
          </CardContent>
        </Card>
      </section>

      <PublicPhotoBand
        title={`${service.label}: como o serviço é executado`}
        intro={`Referências visuais reais do tipo de trabalho envolvido em ${service.seoNoun} para quem está em ${bairro.name}, ${city.name}.`}
        photos={pickLocalityPhotos(city.slug, `${service.slug}-${city.slug}-${bairro.slug}`, 3)}
      />

      <RegionalSymptomFAQ
        cityName={city.name}
        neighborhoodName={bairro.name}
        seedSlug={`${service.slug}-${city.slug}-${bairro.slug}`}
        count={2}
        localFaqs={buildBairroFaqs({
          bairroName: bairro.name,
          cityName: city.name,
          intro: bairro.descriptor,
          nearby: otherBairros.map((b) => b.name),
        })}
        localFaqsHeading={`${service.label} em ${bairro.name}`}
      />


    </Layout>
  );
}

// Referência estática (evita import não-usado nas asserções de tipo).
void pilotServices;
