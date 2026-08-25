import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { PC_ASSEMBLY_POLICY } from "@/data/pcAssemblyPolicy";
import { PRICING, SLA } from "@/data/pricingPolicy";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ShieldCheck, MessageCircle, AlertTriangle, ArrowRight } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/garantia-e-cobertura";

const COVERED = [
  PC_ASSEMBLY_POLICY.warranty.labor,
  PC_ASSEMBLY_POLICY.warranty.configuration,
  PC_ASSEMBLY_POLICY.warranty.parts,
];

const FAQ = [
  {
    question: "O que a garantia cobre?",
    answer: `${PC_ASSEMBLY_POLICY.warranty.labor.text} ${PC_ASSEMBLY_POLICY.warranty.configuration.text}`,
  },
  {
    question: "A peça também tem garantia com vocês?",
    answer: PC_ASSEMBLY_POLICY.warranty.parts.text,
  },
  {
    question: "O que não está coberto?",
    answer: `Não estão cobertos: ${PC_ASSEMBLY_POLICY.warranty.exclusions.join("; ")}.`,
  },
  {
    question: "Como aciono a garantia?",
    answer:
      "O acionamento é feito pela triagem online, com o número do comprovante de entrega, descrição do sintoma e fotos ou vídeos do equipamento. Sem esse registro não conseguimos abrir o retorno de garantia.",
  },
  {
    question: "Qual o prazo de atendimento em garantia?",
    answer: `${COMMERCIAL_TERMS.minimumQueueText} ${SLA.disclaimer}`,
  },
  {
    question: "Vou pagar alguma coisa se o problema não for de garantia?",
    answer: `Se a análise mostrar causa fora da cobertura, o atendimento vira um novo serviço: diagnóstico ou visita a ${COMMERCIAL_TERMS.diagnosisFee.priceLabel} por bloco de até 30 minutos, e atendimento com coleta a partir de ${PRICING.pickupDelivery.priceLabel}.`,
  },
];

const GarantiaCobertura = () => {
  const waUrl = buildWhatsAppUrl({
    service: "acionamento de garantia",
    sourcePage: "/garantia-e-cobertura",
  });

  return (
    <Layout>
      <SEOHead
        title="Garantia e Cobertura dos Serviços | Preciso de Um Técnico"
        description="Regras de garantia dos nossos serviços em Curitiba: o que está coberto (mão de obra e configuração), o que é garantia da peça, exclusões, prazos e como acionar pela triagem."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
          { name: "Garantia e cobertura", url: CANONICAL },
        ]}
        faq={FAQ}
      />

      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Regras por escrito
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Garantia e cobertura dos serviços
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            O que está incluído, o que é responsabilidade da peça, o que fica de fora, os prazos
            praticados e o passo a passo para acionar a garantia.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="garantia-hero"
              data-service="acionamento de garantia"
              aria-label="Acionar garantia pela triagem no WhatsApp"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Acionar garantia pela triagem
            </a>
            <Link
              to="/termos-orcamento-pre-aprovado"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Termos do orçamento pré-aprovado
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">O que está coberto</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {COVERED.map((item) => (
              <article key={item.title} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Exclusões
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">
            O que a garantia não cobre
          </h2>
          <ul className="mt-6 space-y-2 text-sm text-foreground/90 list-disc pl-5">
            {PC_ASSEMBLY_POLICY.warranty.exclusions.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Prazos (SLA)</h2>
          <ul className="mt-6 space-y-2 text-sm text-foreground/90 list-disc pl-5">
            <li>Fila mínima: {SLA.minLabel}.</li>
            <li>Com encomenda de peças: {SLA.minWithPartsLabel}.</li>
            <li>Faixa máxima estimada: {SLA.maxLabel}.</li>
            <li>{SLA.disclaimer}</li>
            <li>{COMMERCIAL_TERMS.minimumQueueText}</li>
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Como acionar</h2>
          <ol className="mt-6 space-y-3 text-sm text-foreground/90 list-decimal pl-5">
            <li>Abra a triagem online e informe o número do comprovante de entrega.</li>
            <li>Descreva o sintoma atual e envie fotos e/ou vídeos do equipamento.</li>
            <li>
              Nossa central confirma se o caso está dentro da cobertura e agenda a coleta ou a
              visita conforme o serviço original.
            </li>
            <li>
              Fora da cobertura, informamos o valor antes de qualquer execução — nada é feito sem
              aprovação.
            </li>
          </ol>
          <div className="mt-8">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="garantia-final"
              data-service="acionamento de garantia"
              aria-label="Abrir triagem de garantia no WhatsApp"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Abrir triagem de garantia
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="mt-6 space-y-5">
            {FAQ.map((f) => (
              <article key={f.question} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">{f.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GarantiaCobertura;
