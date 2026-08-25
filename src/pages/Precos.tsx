import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { servicesData } from "@/data/services";
import { citiesData, curitibaBairros } from "@/data/regions";
import { MessageCircle, Check } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { PRICING, SLA } from "@/data/pricingPolicy";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { PageTableOfContents } from "@/components/layout/PageTableOfContents";
import { RelatedLinksSection } from "@/components/seo/RelatedLinksSection";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";
import { parsePriceBRL } from "@/lib/priceSpec";
import { QuickEstimate } from "@/components/precos/QuickEstimate";


const whatsappLink = buildWhatsAppUrl({ service: "preços e condições de assistência técnica", sourcePage: "/precos" });

interface Row {
  service: string;
  example: string;
  price: string;
}

const priceTable: Row[] = [
  { service: "Visita técnica + diagnóstico (até 30 min)", example: "Avaliação no local, abatida do orçamento", price: "R$ 99,99" },
  { service: "Diagnóstico em bancada (até 30 min)", example: "No nosso endereço, abatido em caso de fechamento", price: "R$ 99,99" },
  { service: "Coleta e entrega personalizada (até 2h)", example: "Valor mínimo pré-aprovado; varia por distância", price: "A partir de R$ 299,99" },
  { service: "Formatação de PC/Notebook", example: "Windows 11 com backup e drivers", price: "R$ 150 a R$ 250" },
  { service: "Remoção de vírus", example: "Sem formatar, com varredura completa", price: "R$ 120 a R$ 200" },
  { service: "Upgrade SSD 480GB", example: "SSD + clonagem do sistema", price: "R$ 350 a R$ 450" },
  { service: "Upgrade memória RAM 8GB", example: "Memória + instalação", price: "R$ 200 a R$ 320" },
  { service: "Limpeza interna + pasta térmica", example: "Desktop ou notebook", price: "R$ 120 a R$ 180" },
  { service: "Instalação de Wi-Fi mesh (3 pontos)", example: "Equipamento + configuração", price: "R$ 1.500 a R$ 2.500" },
  { service: "Configuração de roteador", example: "Senhas, canais e segurança", price: "R$ 80 a R$ 150" },
  { service: "Cabeamento de rede CAT6 (por ponto)", example: "Ponto novo até 15m", price: "R$ 180 a R$ 280" },
  { service: "Kit CFTV residencial 4 câmeras", example: "DVR + 4 câmeras Full HD + HD 1TB + instalação", price: "A partir de R$ 1.500" },
  { service: "Kit CFTV residencial 8 câmeras", example: "DVR 8 canais + 8 câmeras + HD 2TB", price: "A partir de R$ 2.700" },
  { service: "Câmera adicional (ponto)", example: "Câmera + instalação avulsa", price: "R$ 150 a R$ 250" },
  { service: "Troca de disjuntor", example: "Disjuntor monopolar de boa marca", price: "R$ 80 a R$ 150" },
  { service: "Instalação de tomada 20A/220V", example: "Para chuveiro, ar ou cooktop", price: "R$ 120 a R$ 220" },
  { service: "Reforma de quadro de distribuição", example: "Troca completa com DR e DPS", price: "R$ 600 a R$ 1.500" },
  { service: "Instalação de split (até 12.000 BTUs)", example: "Distância padrão 3m, materiais básicos", price: "A partir de R$ 450" },
  { service: "Limpeza profunda de ar-condicionado", example: "Lavagem química completa", price: "R$ 220 a R$ 350" },
  { service: "Recarga de gás (R32/R410A)", example: "Inclui detecção de vazamento", price: "R$ 250 a R$ 450" },
  { service: "Troca de tela de celular", example: "Peça compatível com garantia conforme o serviço", price: "Sob consulta" },
  { service: "Troca de bateria de notebook", example: "Bateria nova + instalação", price: "R$ 280 a R$ 600" },
  { service: "Instalação de impressora em rede", example: "Multifuncional Wi-Fi configurada", price: "R$ 100 a R$ 180" },
  { service: "Recuperação de dados (HD/SSD)", example: "Diagnóstico R$ 99,99 (deduzido se aprovar); serviço sob orçamento", price: "Sob consulta" },
];

const faqs = [
  { question: "Os preços são fixos?", answer: "São faixas reais praticadas em Curitiba e região metropolitana. Após a visita técnica, formalizamos um orçamento por escrito antes de iniciar qualquer serviço — sem surpresas." },
  { question: "A visita técnica é cobrada mesmo se eu não aprovar?", answer: "A visita é R$ 99,99 e cobre deslocamento + diagnóstico. Se o serviço for aprovado, esse valor é abatido do orçamento final." },
  { question: "Como é documentado o serviço?", answer: "O valor é informado por escrito antes da execução e a garantia é definida conforme o serviço realizado. Peças, componentes ou materiais adicionais são orçados separadamente e só seguem com sua aprovação." },
  { question: "Atendem aos finais de semana?", answer: "Sim, com agendamento 24 horas via WhatsApp. Atendimento presencial 8h às 22h, com chamados emergenciais 24h." },
  { question: "Quais são os prazos?", answer: COMMERCIAL_TERMS.minimumQueueText + " " + SLA.disclaimer },
];

export default function Precos() {
  const url = "https://precisodeumtecnico.com/precos";
  const ogImage = "https://precisodeumtecnico.com/og/guias-precos.jpg";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: "Preços", item: url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  // PriceSpecification derivado do MESMO array renderizado na tabela — o gate
  // scripts/check-price-schema.ts falha o build se os números divergirem.
  const offerCatalog = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Tabela de Preços — Preciso de Um Técnico",
    itemListElement: priceTable
      .map((r, i) => {
        const spec = parsePriceBRL(r.price);
        if (!spec) return null;
        return {
          "@type": "Offer",
          position: i + 1,
          name: r.service,
          description: r.example,
          priceCurrency: "BRL",
          availability: "https://schema.org/InStock",
          areaServed: "Curitiba e Região Metropolitana",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "BRL",
            ...(spec.min === spec.max
              ? { price: spec.min }
              : { minPrice: spec.min, maxPrice: spec.max }),
            valueAddedTaxIncluded: true,
          },
        };
      })
      .filter(Boolean),
  };


  return (
    <Layout>
      <SEOHead
        title="Preços de Assistência Técnica em Curitiba"
        description="Tabela completa e transparente de preços: informática, redes Wi-Fi, CFTV, elétrica, ar-condicionado e celulares. Visita a partir de R$ 99,99."
        canonical={url}
        ogImage={ogImage}
        keywords="preço técnico curitiba, tabela de preços assistência técnica, quanto custa técnico"
        structuredData={[buildLocalBusinessSchema({ url }), breadcrumb, faqSchema, offerCatalog]}
      />

      <section className="bg-gradient-to-br from-foreground to-primary/20 text-background py-16">
        <div className="container-custom">
          <Reveal>
            <Badge variant="secondary" className="mb-3">Preços transparentes</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Tabela de preços 2026</h1>
            <p className="text-lg text-background/80 max-w-2xl reading-width">
              Faixas reais praticadas em Curitiba e Região Metropolitana. Visita técnica + diagnóstico a partir de
              R$ 99,99 — abatido do orçamento se aprovado.
            </p>
            {/* Rodada 3P — CTA na primeira dobra, mesmo fluxo de triagem. */}
            <div className="mt-6">
              <Button
                size="lg"
                className="min-h-11"
                data-triage-cta
                data-triage-source="precos_hero"
              >
                Descrever meu atendimento
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pt-8">
        <div className="container-custom max-w-5xl">
          <Reveal><TrustStrip /></Reveal>
          <Reveal>
            <PageTableOfContents
              className="mt-6"
              items={[
                { id: "estimativa-rapida", label: "Estimativa rápida" },
                { id: "tabela-de-precos", label: "Tabela de preços" },
                { id: "coleta-e-entrega", label: "Coleta e entrega" },
                { id: "precos-por-servico", label: "Preços por serviço" },
                { id: "atendimento-nas-cidades", label: "Atendimento nas cidades" },
                { id: "bairros-de-curitiba", label: "Bairros de Curitiba" },
                { id: "perguntas-frequentes", label: "Perguntas frequentes" },
              ]}
            />
          </Reveal>
        </div>
      </section>

      <section className="pt-10">
        <div className="container-custom max-w-5xl">
          <h2 id="estimativa-rapida" data-toc-anchor className="sr-only">
            Estimativa rápida de valor e prazo
          </h2>
          <Reveal><QuickEstimate /></Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <h2 id="tabela-de-precos" data-toc-anchor className="sr-only">
            Tabela de preços por serviço
          </h2>
          <Reveal>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Serviço</th>
                      <th className="px-4 py-3 font-semibold">Exemplo</th>
                      <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Faixa de preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceTable.map((r, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{r.service}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.example}</td>
                        <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {[
                "Visita abatida no orçamento quando o serviço é aprovado",
                "Valor informado por escrito antes da execução",
                "Garantia conforme o serviço realizado",
              ].map((b) => (
                <div key={b} className="flex items-start gap-2 p-4 rounded-lg bg-secondary/40">
                  <Check className="w-5 h-5 text-primary mt-0.5" /> <span>{b}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Coleta e entrega — fluxo em 4 passos */}
          <Reveal>
            <h2 id="coleta-e-entrega" data-toc-anchor className="font-display text-2xl md:text-3xl font-bold mt-16 mb-2">
              Como funciona a coleta e entrega
            </h2>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              {PRICING.pickupDelivery.description}
            </p>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  t: "1. Triagem online",
                  d: "Você preenche a triagem com fotos e/ou vídeos do equipamento. Sem triagem completa, o atendimento não é iniciado.",
                },
                {
                  t: "2. Coleta com seguro",
                  d: "Retirada agendada no endereço informado, com logística com seguro incluída no valor mínimo pré-aprovado.",
                },
                {
                  t: "3. Diagnóstico técnico",
                  d: "Avaliação em bancada e tentativa de reparos compatíveis com a situação, dentro das possibilidades técnicas sem substituição de peças.",
                },
                {
                  t: "4. Aprovação e retorno",
                  d: "Se houver necessidade de peça, componente ou material, o valor é informado separadamente e só seguimos após sua aprovação.",
                },
              ].map((s) => (
                <li key={s.t} className="p-5 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold mb-1">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              {COMMERCIAL_TERMS.preApprovedPolicyText}
            </p>
          </Reveal>


          {/* Hub-and-spoke: services */}
          <Reveal>
            <h2 id="precos-por-servico" data-toc-anchor className="font-display text-2xl md:text-3xl font-bold mt-16 mb-4">Veja preços por serviço</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(servicesData).map((s) => (
                <Link
                  key={s.slug}
                  to={`/servicos/${s.slug}`}
                  className="p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/40 transition-colors text-sm"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Hub-and-spoke: cities */}
          <Reveal>
            <h2 id="atendimento-nas-cidades" data-toc-anchor className="font-display text-2xl md:text-3xl font-bold mt-16 mb-4">Atendimento nas cidades</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(citiesData).map((c) => (
                <Link
                  key={c.slug}
                  to={`/regioes/${c.slug}`}
                  className="p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/40 transition-colors text-sm"
                >
                  {c.name}/{c.state}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Bairros de Curitiba */}
          <Reveal>
            <h2 id="bairros-de-curitiba" data-toc-anchor className="font-display text-2xl md:text-3xl font-bold mt-16 mb-4">Bairros de Curitiba</h2>
            <div className="flex flex-wrap gap-2">
              {curitibaBairros.map((b) => {
                const slug = b
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "");
                return (
                  <Link
                    key={b}
                    to={`/regioes/curitiba/${slug}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {b}
                  </Link>
                );
              })}
            </div>
          </Reveal>

          {/* FAQ */}
          <Reveal>
            <h2 id="perguntas-frequentes" data-toc-anchor className="font-display text-2xl md:text-3xl font-bold mt-16 mb-4">Perguntas frequentes</h2>
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem data-faq-item key={i} value={`p-${i}`}>
                  <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.question}</AccordionTrigger>
                  <AccordionContent data-faq-answer>{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal>
            <Card className="p-6 mt-12 bg-primary/5 border-primary/20 text-center">
              <h3 className="font-display text-xl md:text-2xl font-bold mb-2">Quer um orçamento sob medida?</h3>
              <p className="text-muted-foreground mb-4">Mande seu cenário no WhatsApp e respondemos em minutos com a faixa real para o seu caso.</p>
              <Button variant="whatsapp" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="pricing" data-service="preços e condições de assistência técnica" aria-label="Tirar dúvida sobre preços pelo WhatsApp">
                  <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
                </a>
              </Button>
            </Card>
          </Reveal>
        </div>
      </section>

      <RelatedLinksSection surface="cta_section" items={["areas", "servicos", "faq"]} />
    </Layout>
  );
}
