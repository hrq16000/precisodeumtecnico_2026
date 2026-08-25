import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { PcAssemblyPolicySections } from "@/components/marketing/PcAssemblyPolicySections";
import { EquipmentValuationTerms } from "@/components/marketing/EquipmentValuationTerms";
import { PcQuoteWizard } from "@/components/marketing/PcQuoteWizard";
import { PC_ASSEMBLY_POLICY } from "@/data/pcAssemblyPolicy";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { PackageCheck, ArrowRight, MessageCircle } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/politica-de-pecas-do-cliente";

const FAQ = [
  {
    question: "Vocês montam PC com peças compradas pelo cliente?",
    answer: PC_ASSEMBLY_POLICY.customerParts.rules[0].text,
  },
  {
    question: "Preciso comprovar a origem das peças?",
    answer: PC_ASSEMBLY_POLICY.customerParts.rules[1].text,
  },
  {
    question: "Como é registrado o estado da peça na entrada?",
    answer: PC_ASSEMBLY_POLICY.customerParts.rules[2].text,
  },
  {
    question: "E se a peça do cliente estiver com defeito?",
    answer: PC_ASSEMBLY_POLICY.customerParts.rules[3].text,
  },
  {
    question: "Qual o prazo enquanto a peça está em troca com o fornecedor?",
    answer: PC_ASSEMBLY_POLICY.customerParts.rules[4].text,
  },
  {
    question: "A garantia da peça é igual à garantia da montagem?",
    answer: `${PC_ASSEMBLY_POLICY.warranty.labor.text} ${PC_ASSEMBLY_POLICY.warranty.parts.text}`,
  },
];

const PoliticaPecasCliente = () => {
  const waUrl = buildWhatsAppUrl({
    service: "montagem de PC com peças do cliente",
    sourcePage: "/politica-de-pecas-do-cliente",
  });

  return (
    <Layout>
      <SEOHead
        title="Política de Peças do Cliente | Montagem de PC em Curitiba"
        description="Veja as regras para montar seu PC com peças próprias: compatibilidade, procedência, integridade no recebimento, prazos de troca e garantia da peça versus mão de obra."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
          { name: "Montagem de PC Gamer", url: "https://precisodeumtecnico.com/servicos/pc-gamer" },
          { name: "Política de peças do cliente", url: CANONICAL },
        ]}
        service={{
          name: "Montagem de PC com peças fornecidas pelo cliente",
          description: PC_ASSEMBLY_POLICY.scope.summary,
          areaServed: "Curitiba e Região Metropolitana",
        }}
        faq={FAQ}
      />

      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <PackageCheck className="h-4 w-4" aria-hidden="true" />
            Regras claras antes da montagem
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Política de peças do cliente
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Compatibilidade, procedência, integridade no recebimento, prazos de troca e o que a
            garantia da mão de obra cobre — e o que fica com a garantia da peça.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="parts-policy"
              data-service="montagem de PC com peças do cliente"
              aria-label="Falar no WhatsApp sobre montagem com peças próprias"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Enviar lista de peças
            </a>
            <Link
              to="/servicos/pc-gamer"
              className="inline-flex items-center gap-2 border border-border bg-card text-card-foreground font-semibold px-6 py-3 rounded-xl hover:bg-accent/40 transition-colors"
            >
              Ver montagem de PC Gamer
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/servicos/pc-gamer/como-funciona"
              className="inline-flex items-center gap-2 border border-border bg-card text-card-foreground font-semibold px-6 py-3 rounded-xl hover:bg-accent/40 transition-colors"
            >
              Como funciona (etapas e prazos)
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-14">
          <PcAssemblyPolicySections />

          <PcQuoteWizard sourcePage="/politica-de-pecas-do-cliente" />

          <EquipmentValuationTerms />

          <section aria-labelledby="faq-pecas-cliente">
            <h2
              id="faq-pecas-cliente"
              className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6"
            >
              Perguntas frequentes sobre peças do cliente
            </h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <article key={item.question} className="p-5 rounded-xl bg-card border border-border/50">
                  <h3 className="font-bold text-card-foreground mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Ainda em dúvida sobre a lista de peças? Mande a configuração que conferimos a
              compatibilidade antes de qualquer serviço.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp sobre montagem com peças do cliente"
              data-wa-source="parts-policy-footer"
              data-service="montagem de PC com peças do cliente"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Conferir minha lista de peças
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PoliticaPecasCliente;
