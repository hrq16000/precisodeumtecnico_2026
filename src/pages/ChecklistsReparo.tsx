import { useCallback } from "react";
import { Link } from "@/lib/router-compat";
import { Download, Printer, CheckCircle2, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { REPAIR_CHECKLISTS, checklistToText } from "@/data/repairChecklists";
import { openTriage } from "@/lib/triageFlag";
import { trackCtaClick } from "@/lib/analytics";

const CANONICAL = "https://precisodeumtecnico.com/checklists-de-reparo";

const FAQ = [
  {
    question: "Os checklists substituem o atendimento técnico?",
    answer:
      "Não. Eles servem para eliminar as causas simples (energia, cabo, configuração) e para você chegar à triagem com informação precisa. Quando o problema persiste, o diagnóstico presencial ou em bancada continua necessário.",
  },
  {
    question: "Posso imprimir ou baixar os checklists?",
    answer:
      "Sim. Cada checklist tem botão de download em arquivo de texto e opção de impressão da página inteira. O arquivo é gerado no seu próprio navegador, sem cadastro e sem envio de dados.",
  },
  {
    question: "Seguir o checklist pode piorar o problema?",
    answer:
      "Todos os passos são verificações externas e seguras: nenhum deles pede abrir o equipamento, mexer em fiação interna ou forçar peças. Cada checklist ainda traz um ponto de parada explícito, indicando quando você deve interromper os testes.",
  },
  {
    question: "Depois de rodar o checklist, o que eu envio na triagem?",
    answer:
      "Informe o modelo do equipamento, quais passos você já executou e o que observou (LED, ruído, mensagem de erro). Esse contexto encurta o diagnóstico e reduz a chance de retorno.",
  },
];

const ChecklistsReparo = () => {
  const download = useCallback((slug: string) => {
    const item = REPAIR_CHECKLISTS.find((c) => c.slug === slug);
    if (!item) return;
    trackCtaClick({
      surface: "service_page",
      cta_id: "checklist_download",
      destination: `/checklists-de-reparo#${slug}`,
    });
    const blob = new Blob([checklistToText(item)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-${slug}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const howToSchemas = REPAIR_CHECKLISTS.map((c) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: c.title,
    description: c.intro,
    url: `${CANONICAL}#${c.slug}`,
    totalTime: "PT15M",
    step: c.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Passo ${i + 1}`,
      text: s,
    })),
  }));

  return (
    <Layout>
      <SEOHead
        title="Checklists rápidos de reparo para baixar e imprimir"
        description="Baixe checklists gratuitos para notebook que não liga, computador lento, Wi-Fi instável, TV sem imagem e backup antes do reparo. Passos seguros, sem abrir o aparelho."
        canonical={CANONICAL}
        keywords="checklist notebook não liga, checklist computador lento, checklist wifi caindo, checklist tv sem imagem"
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Checklists de reparo", url: CANONICAL },
        ]}
        faq={FAQ}
        structuredData={howToSchemas}
      />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Checklists rápidos de reparo para baixar e imprimir
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Antes de contratar qualquer serviço, vale eliminar as causas simples. Estes checklists
            reúnem as mesmas verificações que um técnico faz nos primeiros minutos de atendimento —
            todas externas, seguras e sem abrir o equipamento. Baixe, imprima e leve o resultado
            para a triagem: quanto mais preciso for o relato, menor o tempo (e o custo) do
            diagnóstico.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" aria-hidden />
              Imprimir todos
            </Button>
            <Button
              onClick={() => {
                trackCtaClick({ surface: "service_page", cta_id: "checklists_triage", destination: "/triagem" });
                openTriage({ source: "checklists" });
              }}
            >
              Já testei, quero um técnico
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
            </Button>
          </div>
        </header>

        <nav aria-label="Sumário" className="mt-10 rounded-xl border border-border bg-muted/30 p-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Nesta página</h2>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {REPAIR_CHECKLISTS.map((c) => (
              <li key={c.slug}>
                <a href={`#${c.slug}`} className="text-primary hover:underline text-sm">
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 space-y-10">
          {REPAIR_CHECKLISTS.map((c) => (
            <section key={c.slug} id={c.slug} className="rounded-2xl border border-border bg-card p-5 md:p-7 scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground">{c.title}</h2>
              <p className="mt-2 text-muted-foreground">{c.intro}</p>
              <ol className="mt-4 space-y-2">
                {c.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-lg bg-destructive/10 text-foreground text-sm p-3">
                <strong>Quando parar: </strong>
                {c.stopCondition}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => download(c.slug)}>
                  <Download className="w-4 h-4 mr-2" aria-hidden />
                  Baixar checklist (.txt)
                </Button>
                <Button asChild variant="ghost">
                  <Link to={c.relatedHref}>{c.relatedLabel}</Link>
                </Button>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground">Perguntas frequentes sobre os checklists</h2>
          <dl className="mt-4 space-y-4">
            {FAQ.map((f) => (
              <div key={f.question} className="rounded-xl border border-border p-4">
                <dt className="font-semibold text-foreground">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>

      <CTASection />
    </Layout>
  );
};

export default ChecklistsReparo;
