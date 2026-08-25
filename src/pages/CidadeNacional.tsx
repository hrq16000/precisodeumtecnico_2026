import { useParams, Link } from "@/lib/router-compat";
import { Helmet } from "@/lib/helmet-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import {
  MapPin, MessageCircle, ShieldCheck, Clock, CheckCircle, ArrowRight,
  Monitor, Laptop, Camera, Zap, Wifi, Wind, Smartphone, Gamepad2,
} from "lucide-react";
import { getNationalCityBySlug, nationalCities } from "@/data/nationalCities";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { RegionalSymptomFAQ } from "@/components/seo/RegionalSymptomFAQ";
import { InternalLinkCluster } from "@/components/seo/InternalLinkCluster";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";
import { buildCityFaqs } from "@/data/localFaq";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickLocalityPhotos } from "@/data/publicPhotos";
import { nationalBairrosByCity } from "@/data/nationalBairros";
import NotFound from "./NotFound";


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

const CidadeNacional = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getNationalCityBySlug(slug) : null;

  // Cidade inexistente → 404 real (noindex), nunca 200 com redirect: evita
  // duplicidade de conteúdo e URLs infinitas indexáveis.
  if (!city) return <NotFound />;

  const url = `https://precisodeumtecnico.com/atendimento-nacional/${city.slug}`;
  const ogImage = `https://precisodeumtecnico.com/og/cidade/${city.slug}.jpg`;
  const heroBase = `/hero/cidade/${city.slug}`;
  const heroWebpSrcSet = `${heroBase}-800.webp 800w, ${heroBase}-1200.webp 1200w, ${heroBase}-1600.webp 1600w`;
  const heroJpgFallback = `${heroBase}-800.jpg`;
  const heroPreload = `${heroBase}-1200.webp`;
  const whatsappLink = buildWhatsAppUrl({ city: city.name });

  const title = `Técnico em ${city.name} - ${city.state} | Rede de Parceiros | Preciso de Um Técnico`;
  const description = `Precisa de um técnico em ${city.name} (${city.stateName})? Acionamos um prestador parceiro homologado para informática, redes, CFTV, elétrica, ar-condicionado e mais. Orçamento via WhatsApp 24h.`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: "Atendimento Nacional", item: "https://precisodeumtecnico.com/atendimento-nacional" },
      { "@type": "ListItem", position: 3, name: `${city.name} - ${city.state}`, item: url },
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Assistência Técnica em ${city.name} - ${city.state}`,
    description,
    image: ogImage,
    provider: {
      "@type": "Organization",
      name: "Preciso de Um Técnico",
      url: "https://precisodeumtecnico.com",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "State", name: city.stateName, addressCountry: "BR" },
    },
    serviceType: "Assistência técnica em informática, redes, CFTV, elétrica e ar-condicionado",
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: "99.99",
      availability: "https://schema.org/InStock",
      url,
    },
  };

  // Rodada 25.1 — Bloco 0: FAQ removida (template puro com troca de tokens).
  // Curadoria por cidade voltará em Bloco D.


  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        canonical={url}
        ogImage={ogImage}
        type="service"
        keywords={`técnico em ${city.name}, assistência técnica ${city.name}, técnico informática ${city.name} ${city.state}, suporte ti ${city.name}`}
        structuredData={[breadcrumb, service, buildLocalBusinessSchema({ city: city.name, state: city.uf, extraAreas: [city.name] })]}
      />
      <Helmet>
        {/* Preload the LCP hero in modern format with responsive srcset */}
        <link
          rel="preload"
          as="image"
          href={heroPreload}
          imageSrcSet={heroWebpSrcSet}
          imageSizes="100vw"
          type="image/webp"
          fetchPriority="high"
        />
        {/* og:image tags são injetadas pela hospedagem — não emitir here para evitar duplicidade. */}
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-glow text-primary-foreground py-14 md:py-20">
        {/* City-specific hero illustration */}
        <div className="absolute inset-0 pointer-events-none">
          <picture>
            <source type="image/webp" srcSet={heroWebpSrcSet} sizes="100vw" />
            <img
              src={heroJpgFallback}
              alt={`Assistência técnica em ${city.name} - ${city.state}`}
              className="w-full h-full object-cover opacity-30 md:opacity-40"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width={1600}
              height={900}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
        </div>

        <div className="container-custom relative">
          <nav className="text-xs md:text-sm text-primary-foreground/80 mb-4">
            <Link to="/" className="hover:text-accent">Início</Link>
            <span className="mx-2">/</span>
            <Link to="/atendimento-nacional" className="hover:text-accent">Atendimento Nacional</Link>
            <span className="mx-2">/</span>
            <span>{city.name} - {city.state}</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-xs">
              <MapPin className="w-4 h-4" />
              {city.region} • {city.stateName}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-xs">
              Técnico em <span className="text-accent">{city.name} – {city.state}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-6 leading-relaxed">
              Atendimento em {city.name} ({city.stateName}) via nossa <strong>rede de prestadores parceiros</strong>{" "}
              homologados. Informática, redes, CFTV, elétrica, ar-condicionado e mais —
              com visita técnica a partir de <strong>R$ 99,99</strong> e garantia em todos os serviços.
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 mb-6 text-sm">
              {(city.highlights ?? []).map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-accent shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button variant="whatsapp" size="lg" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="national-city" data-service="assistência técnica" data-city={city.name} aria-label={`Solicitar técnico em ${city.name} pelo WhatsApp`}>
                  <MessageCircle className="w-5 h-5" />
                  Solicitar técnico em {city.name}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/precos">Ver tabela de preços</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-primary-foreground/70">
              Visita técnica a partir de R$ 99,99.{" "}
              <Link to="/termos-orcamento-pre-aprovado" className="underline hover:text-accent">
                Termos do orçamento pré-aprovado
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 bg-background border-b border-border/60">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: ShieldCheck, label: "Parceiros homologados" },
            { icon: Clock, label: "WhatsApp 24h" },
            { icon: CheckCircle, label: "Orçamento por escrito" },
            { icon: ShieldCheck, label: "Garantia em todos os serviços" },
          ].map((it, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <it.icon className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium text-foreground">{it.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Serviços disponíveis em {city.name}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            A rede de parceiros cobre as principais demandas técnicas residenciais e empresariais.
            Selecione um serviço para ver detalhes ou fale direto no WhatsApp.
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {services.map((s) => (
              <li key={s.name}>
                <Link
                  to={s.href}
                  className="group flex flex-col items-start gap-2 p-4 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <s.icon className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-foreground">{s.name}</span>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* About + FAQ */}
      <section className="py-12 md:py-16 bg-secondary/40">
        <div className="container-custom grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Assistência técnica em {city.name} – {city.state}
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground space-y-4">
              <p>
                A <strong>Preciso de Um Técnico</strong> é uma plataforma com sede em Curitiba (PR) que
                conecta clientes a técnicos qualificados em todo o Brasil. Em <strong>{city.name}</strong>{" "}
                ({city.stateName}), o atendimento é realizado pela nossa <strong>rede de prestadores
                parceiros</strong> homologados, que passam por verificação documental e avaliação de qualidade.
              </p>
              <p>
                Atendemos demandas residenciais e empresariais: manutenção e formatação de computadores,
                conserto de notebooks, instalação e configuração de redes Wi-Fi, projetos de CFTV e câmeras
                de segurança, instalação e manutenção de ar-condicionado split, pequenos serviços elétricos,
                reparo de celulares e consoles de videogame.
              </p>
              <p>
                Todo serviço começa por um <strong>orçamento por escrito</strong> antes da execução. A visita
                técnica com diagnóstico parte de <strong>R$ 99,99</strong> e, caso o serviço seja aprovado,
                o valor pode ser descontado conforme as condições do{" "}
                <Link to="/termos-orcamento-pre-aprovado" className="text-primary underline">
                  orçamento pré-aprovado
                </Link>.
              </p>
            </div>
          </div>

          {/* FAQ regional derivada de src/data/symptoms.ts (seleção determinística por cidade) */}

        </div>
      </section>

      <PublicPhotoBand
        title={`Serviços técnicos que a rede executa em ${city.name}`}
        intro={`Referências visuais reais de bancada, redes e infraestrutura — o mesmo escopo atendido em ${city.name} (${city.stateName}).`}
        photos={pickLocalityPhotos(city.slug, city.slug, 3)}
      />

      <RegionalSymptomFAQ
        cityName={city.name}
        seedSlug={city.slug}
        count={3}
        localFaqs={buildCityFaqs({
          cityName: city.name,
          neighborhoods: (nationalBairrosByCity[city.slug] ?? []).map((b) => b.name),
          serviceAreas: [
            "manutenção e formatação de computadores",
            "conserto de notebooks",
            "redes e Wi-Fi",
            "CFTV e câmeras",
            "pequenos serviços elétricos",
          ],
          description: city.highlights?.[0],
        })}
        localFaqsHeading={`Atendimento em ${city.name}`}
      />


      <InternalLinkCluster city={city.name} citySlug={city.slug} />



      {/* Related cities */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <h2 className="font-display text-xl md:text-2xl font-semibold mb-6">
            Outras cidades atendidas na região {city.region}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {nationalCities
              .filter((c) => c.region === city.region && c.slug !== city.slug)
              .slice(0, 12)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/atendimento-nacional/${c.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {c.name} – {c.state}
                  </Link>
                </li>
              ))}
          </ul>
          <div className="mt-8">
            <Link to="/atendimento-nacional" className="text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
              Ver todas as cidades atendidas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Precisa de um técnico em {city.name} agora?
          </h2>
          <p className="text-primary-foreground/90 mb-6">
            Acione nossa central no WhatsApp. Resposta em minutos, 24 horas por dia.
          </p>
          <Button variant="whatsapp" size="lg" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="national-city" data-service="assistência técnica" data-city={city.name} aria-label={`Falar com técnico em ${city.name} pelo WhatsApp`}>
              <MessageCircle className="w-5 h-5" />
              Chamar agora pelo WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CidadeNacional;
