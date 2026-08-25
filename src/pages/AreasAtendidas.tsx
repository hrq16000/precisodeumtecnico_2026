import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/home/CTASection";
import { PageTableOfContents } from "@/components/layout/PageTableOfContents";
import { RelatedLinksSection } from "@/components/seo/RelatedLinksSection";
import { MapPin, Clock, Route as RouteIcon, CheckCircle2, MessageCircle, Quote } from "lucide-react";
import { getAllCities, formatNeighborhoodSlug } from "@/data/regions";
import { getEnabledNationalCities } from "@/data/nationalCities";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";
import { testimonials } from "@/data/testimonials";

const CANONICAL = "https://precisodeumtecnico.com/areas-atendidas";

/** Mensagem pré-preenchida consistente por cidade/bairro (encoding no helper). */
function buildAreaMessage(city: string, bairro?: string): string {
  return [
    "Olá! Preciso de um técnico.",
    `Cidade: ${city}`,
    bairro ? `Bairro: ${bairro}` : "",
    "Vim pela página de áreas atendidas do site.",
  ]
    .filter(Boolean)
    .join(" ");
}

function openAreaWhatsApp(city: string, bairro?: string) {
  const text = buildAreaMessage(city, bairro);
  trackEvent("whatsapp_click", {
    surface: "regions_section",
    cta_id: bairro ? "areas_wa_bairro" : "areas_wa_city",
    city,
    bairro,
    wa_message: text,
  });
  trackCtaClick({
    surface: "regions_section",
    cta_id: bairro ? "areas_wa_bairro" : "areas_wa_city",
    label: "Falar no WhatsApp",
    destination: "/areas-atendidas",
    city,
    bairro,
  });
  window.open(buildWhatsAppUrlFromText(text), "_blank", "noopener,noreferrer");
}


const FAQ = [
  {
    question: "Como sei se o meu bairro é atendido?",
    answer:
      "Todos os bairros listados nesta página têm rota de atendimento ativa. Basta abrir a página do bairro e iniciar a triagem: o formulário confirma cidade, bairro e a janela de coleta ou visita disponível.",
  },
  {
    question: "Vocês atendem fora de Curitiba e da Região Metropolitana?",
    answer:
      "Sim. Além de Curitiba e RMC (onde há visita técnica e coleta com veículo próprio), operamos atendimento nacional com suporte remoto e logística de envio do equipamento para bancada.",
  },
  {
    question: "Qual é o prazo de deslocamento por região?",
    answer:
      "Em Curitiba e nos bairros mais próximos a janela costuma ser D+0 ou D+1. Em cidades da região metropolitana o prazo varia de 48 a 72 horas úteis, conforme a distância e o trânsito da rota.",
  },
  {
    question: "O deslocamento tem custo?",
    answer:
      "A visita técnica tem taxa mínima de R$ 99,99, que cobre o deslocamento e o diagnóstico presencial. A coleta para bancada é de R$ 299,99 e inclui retirada e devolução do equipamento.",
  },
  {
    question: "Consigo confirmar o bairro sem ligar?",
    answer:
      "Sim. Todo o atendimento começa pela triagem online, sem telefone: você informa cidade e bairro, descreve o problema e recebe a confirmação da rota já com o resumo do caso.",
  },
];

const AreasAtendidas = () => {
  const cities = getAllCities();
  const nationalCities = getEnabledNationalCities();
  const totalBairros = cities.reduce((acc, c) => acc + c.neighborhoods.length, 0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Preciso de Um Técnico",
    description:
      "Áreas atendidas de assistência técnica em Curitiba, Região Metropolitana e atendimento nacional.",
    url: CANONICAL,
    areaServed: [
      ...cities.map((c) => ({ "@type": "City", name: c.name })),
      ...nationalCities.map((c) => ({ "@type": "City", name: c.name })),
    ],
    priceRange: "$$",
  };

  return (
    <Layout>
      <SEOHead
        title="Áreas atendidas: cidades e bairros | Preciso de Um Técnico"
        description="Mapa completo das áreas atendidas: Curitiba, Região Metropolitana e atendimento nacional. Veja cidades, bairros, prazos de deslocamento e abra a triagem do seu bairro."
        canonical={CANONICAL}
        schema={schema}
        faq={FAQ}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Áreas atendidas", url: CANONICAL },
        ]}
      />

      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container-custom text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 text-success border border-success/30 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">Cobertura real, rota por rota</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Áreas atendidas: cidades e bairros
          </h1>
          <p className="text-lg text-white/80">
            {cities.length} cidades na Região de Curitiba, {totalBairros} bairros mapeados e
            atendimento nacional para envio de equipamento. Escolha o seu bairro e abra a triagem
            direto pela página local.
          </p>
        </div>
      </section>

      <div>
        <section className="py-12 lg:py-16 bg-background">

          <div className="container-custom">
            <PageTableOfContents
              className="mb-10"
              items={[
                { id: "cobertura-curitiba-rmc", label: "Curitiba e Região Metropolitana" },
                ...(nationalCities.length > 0
                  ? [{ id: "cobertura-nacional", label: "Atendimento nacional" }]
                  : []),
                { id: "cobertura-prova-social", label: "Quem já foi atendido" },
                { id: "cobertura-faq", label: "Perguntas sobre cobertura" },

              ]}
            />
            <div className="grid gap-6 md:grid-cols-3 mb-12">

              {[
                {
                  icon: Clock,
                  title: "Janela por distância",
                  text: "Curitiba em D+0/D+1, RMC entre 48 e 72 horas úteis conforme a rota.",
                },
                {
                  icon: RouteIcon,
                  title: "Coleta com veículo próprio",
                  text: "Retirada e devolução do equipamento sem depender de transportadora.",
                },
                {
                  icon: CheckCircle2,
                  title: "Confirmação sem telefone",
                  text: "A triagem online confirma cidade, bairro e o próximo passo do atendimento.",
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-border bg-card">
                  <item.icon className="w-6 h-6 text-success mb-3" />
                  <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                  <p className="text-muted-foreground text-sm">{item.text}</p>
                </div>
              ))}
            </div>

            <h2 id="cobertura-curitiba-rmc" className="text-2xl md:text-3xl font-bold mb-6 scroll-mt-24">
              Curitiba e Região Metropolitana
            </h2>
            <div className="space-y-8">
              {cities.map((city) => (
                <div key={city.slug} className="p-6 rounded-xl border border-border bg-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="text-xl font-semibold">
                      <Link
                        to={`/regioes/${city.slug}`}
                        className="hover:text-success transition-colors"
                        onClick={() =>
                          trackCtaClick({
                            surface: "regions_section",
                            cta_id: "areas_city_link",
                            destination: `/regioes/${city.slug}`,
                            city: city.name,
                          })
                        }
                      >
                        {city.name} — {city.state}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {city.neighborhoods.length} bairros atendidos
                      </span>
                      <button
                        type="button"
                        data-testid={`areas-wa-${city.slug}`}
                        onClick={() => openAreaWhatsApp(city.name)}
                        className="inline-flex items-center gap-2 min-h-11 rounded-full border border-success px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success hover:text-success-foreground"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        Falar no WhatsApp
                      </button>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{city.description}</p>

                  <ul className="flex flex-wrap gap-2">
                    {city.neighborhoods.map((bairro) => (
                      <li key={`${city.slug}-${bairro}`}>
                        <Link
                          to={`/regioes/${city.slug}/${formatNeighborhoodSlug(bairro)}`}
                          className="inline-block px-3 py-1.5 rounded-full border border-border text-sm hover:border-success hover:text-success transition-colors"
                          onClick={() =>
                            trackCtaClick({
                              surface: "regions_section",
                              cta_id: "areas_bairro_chip",
                              destination: `/regioes/${city.slug}/${formatNeighborhoodSlug(bairro)}`,
                              city: city.name,
                              bairro,
                            })
                          }
                        >
                          {bairro}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 id="cobertura-prova-social" className="text-2xl md:text-3xl font-bold mt-14 mb-6 scroll-mt-24">
              Quem já foi atendido na região
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.slice(0, 6).map((t) => (
                <figure key={`${t.name}-${t.location}`} className="p-5 rounded-xl border border-border bg-card">
                  <Quote className="w-5 h-5 text-success mb-2" aria-hidden="true" />
                  <blockquote className="text-sm text-muted-foreground">{t.text}</blockquote>
                  <figcaption className="mt-3 text-sm font-medium">
                    {t.name} · <span className="text-muted-foreground">{t.location}</span>
                    <span className="block text-xs text-muted-foreground">{t.service}</span>
                  </figcaption>
                </figure>
              ))}
            </div>



            {nationalCities.length > 0 && (
              <>
                <h2 id="cobertura-nacional" className="text-2xl md:text-3xl font-bold mt-14 mb-4 scroll-mt-24">
                  Atendimento nacional
                </h2>
                <p className="text-muted-foreground mb-6 max-w-3xl">
                  Fora da Região de Curitiba o atendimento é feito por suporte remoto e por envio do
                  equipamento para a bancada, com as mesmas regras de orçamento e garantia.
                </p>
                <ul className="flex flex-wrap gap-2">
                  {nationalCities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        to={`/atendimento-nacional/${city.slug}`}
                        className="inline-block px-3 py-1.5 rounded-full border border-border text-sm hover:border-success hover:text-success transition-colors"
                        onClick={() =>
                          trackCtaClick({
                            surface: "cidade_nacional",
                            cta_id: "areas_national_chip",
                            destination: `/atendimento-nacional/${city.slug}`,
                            city: city.name,
                          })
                        }
                      >
                        {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 id="cobertura-faq" className="text-2xl md:text-3xl font-bold mt-14 mb-6 scroll-mt-24">
              Perguntas sobre cobertura
            </h2>
            <div className="space-y-4 max-w-3xl">
              {FAQ.map((item) => (
                <div key={item.question} className="p-5 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold mb-2">{item.question}</h3>
                  <p className="text-muted-foreground text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RelatedLinksSection surface="regions_section" items={["precos", "servicos", "faq"]} />

        <CTASection />
      </div>

    </Layout>
  );
};

export default AreasAtendidas;
