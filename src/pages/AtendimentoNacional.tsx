import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, ShieldCheck, Clock, Users, ArrowRight, Globe2 } from "lucide-react";
import { nationalCities, groupedByRegion } from "@/data/nationalCities";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";

const regionOrder: Array<keyof ReturnType<typeof groupedByRegion>> = [
  "Sudeste",
  "Sul",
  "Nordeste",
  "Centro-Oeste",
  "Norte",
];

const AtendimentoNacional = () => {
  const grouped = groupedByRegion();
  const whatsappLink = buildWhatsAppUrl({ service: "atendimento técnico nacional", sourcePage: "/atendimento-nacional" });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: "Atendimento Nacional", item: "https://precisodeumtecnico.com/atendimento-nacional" },
    ],
  };

  return (
    <Layout>
      <SEOHead
        title="Técnico em Todo o Brasil — Rede de Prestadores Parceiros | Preciso de Um Técnico"
        description={`Rede nacional com técnicos parceiros em ${nationalCities.length}+ cidades do Brasil: São Paulo, Rio, BH, Brasília, Salvador, Recife, Porto Alegre, Manaus e muito mais. Informática, redes, CFTV, elétrica. Orçamento via WhatsApp.`}
        canonical="https://precisodeumtecnico.com/atendimento-nacional"
        keywords="técnico em todo brasil, assistência técnica nacional, técnico informática são paulo, técnico rio de janeiro, suporte de ti brasil"
        service={{
          name: "Assistência técnica em todo o Brasil",
          description:
            "Atendimento técnico em informática, redes, CFTV e elétrica com rede de prestadores parceiros homologados em mais de " +
            nationalCities.length +
            " cidades brasileiras.",
          areaServed: "Brasil",
        }}
        structuredData={[
          buildLocalBusinessSchema({
            url: "https://precisodeumtecnico.com/atendimento-nacional",
            description:
              "Sede em Curitiba (PR) com rede nacional de técnicos parceiros homologados para atendimento em todo o Brasil.",
            extraAreas: nationalCities.slice(0, 12).map((c) => c.name),
          }),
          breadcrumb,
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary-glow text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-xs font-semibold uppercase tracking-wider mb-4">
              <Globe2 className="w-4 h-4" />
              Cobertura Nacional
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Técnico em <span className="text-accent">todo o Brasil</span> via rede de prestadores parceiros
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Sede em <strong>Curitiba (PR)</strong>, com <strong>rede de técnicos parceiros</strong> homologados em mais de
              {" "}{nationalCities.length} cidades brasileiras. Acionamento rápido via WhatsApp, orçamento sem compromisso e
              garantia em todos os serviços.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="whatsapp" size="lg" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="national-service" data-service="atendimento técnico nacional" aria-label="Solicitar atendimento pelo WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                  Solicitar atendimento na minha cidade
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/servicos">Ver serviços disponíveis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-10 bg-background border-b border-border/60">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: MapPin, label: `${nationalCities.length}+ cidades cobertas` },
            { icon: Users, label: "Parceiros homologados" },
            { icon: Clock, label: "WhatsApp 24h" },
            { icon: ShieldCheck, label: "Garantia em todos os serviços" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <item.icon className="w-7 h-7 text-primary" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cities by region */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">
              Onde encontramos um técnico parceiro para você
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Selecione sua região. Mesmo que sua cidade não esteja listada, fale conosco no WhatsApp —
              conseguimos acionar um parceiro próximo na maioria das cidades brasileiras.
            </p>
          </div>

          <div className="space-y-10">
            {regionOrder.map((region) => {
              const list = grouped[region];
              if (!list?.length) return null;
              return (
                <div key={region}>
                  <h3 className="font-display text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3">
                    <span className="w-1.5 h-7 bg-accent rounded-full" />
                    {region}
                    <span className="text-sm font-normal text-muted-foreground">({list.length} cidades)</span>
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {list.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to={`/atendimento-nacional/${c.slug}`}
                          className="group flex items-center justify-between gap-3 p-4 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all"
                        >
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate">
                              {c.name} <span className="text-muted-foreground font-normal">– {c.state}</span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{c.stateName}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16 bg-secondary/40">
        <div className="container-custom">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
            Como funciona o atendimento via parceiros
          </h2>
          <ol className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { n: 1, t: "Você chama no WhatsApp", d: "Conte o problema, a cidade e o bairro. Resposta em minutos, 24 horas por dia." },
              { n: 2, t: "Acionamos um parceiro", d: "Encaminhamos para um técnico parceiro homologado e mais próximo da sua região." },
              { n: 3, t: "Orçamento e execução", d: "Visita técnica, orçamento por escrito e serviço com garantia. Sem surpresas." },
            ].map((s) => (
              <li key={s.n} className="bg-card rounded-xl p-6 border border-border/60 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mb-3">
                  {s.n}
                </div>
                <h3 className="font-semibold text-lg mb-1">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="text-center mt-10">
            <Button variant="whatsapp" size="lg" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="national-service" data-service="atendimento técnico nacional" aria-label="Falar com a central pelo WhatsApp">
                <MessageCircle className="w-5 h-5" />
                Falar com a central agora
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AtendimentoNacional;
