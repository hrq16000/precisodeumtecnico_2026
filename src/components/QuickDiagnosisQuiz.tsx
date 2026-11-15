import { PRICING } from "@/data/pricingPolicy";
import { useState, useEffect } from "react";
import { TermsDialog } from "@/components/TermsDialog";
import { TERMS_SOURCE } from "@/lib/termsSource";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MessageCircle, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { trackQuizComplete, trackWhatsAppClick, trackEvent } from "@/lib/analytics";
import { openTriage } from "@/lib/triageFlag";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";

type Step = "problema" | "detalhe" | "urgencia" | "resultado";

interface Problema {
  id: string;
  label: string;
  emoji: string;
  description: string;
  detalhes: { id: string; label: string }[];
  diagnostico: (detalhes: string[], urgencia: string) => string;
  /** Display name of the service indicated for the user */
  servico: string;
  /** Slug used in /servicos/:slug — drives internal linking + analytics */
  servicoSlug: string;
  /** High-level category for analytics dashboards */
  categoria: "informatica" | "redes" | "seguranca";
  faixaPreco: string;
}

interface QuickDiagnosisQuizProps {
  /** Optional: city slug (e.g. "sao-jose-dos-pinhais"). Used in WhatsApp message + analytics. */
  city?: string;
  /** Optional: neighborhood slug or name. Used in WhatsApp message + analytics. */
  bairro?: string;
}

const PROBLEMAS: Problema[] = [
  {
    id: "lento",
    label: "Computador lento",
    emoji: "🐌",
    description: "Demora para abrir programas, travamentos e congelamentos.",
    detalhes: [
      { id: "boot", label: "Demora muito para ligar" },
      { id: "abas", label: "Trava ao abrir várias abas no navegador" },
      { id: "geral", label: "Fica lento em qualquer tarefa" },
      { id: "barulho", label: "Faz barulho ou esquenta muito" },
    ],
    diagnostico: () =>
      "Diagnóstico provável: HD lento, RAM insuficiente ou acúmulo de programas em segundo plano. Solução: upgrade SSD + RAM ou manutenção completa. Custo médio: R$ 380 a R$ 720 com peças.",
    servico: "Upgrade SSD + RAM / Manutenção completa",
    servicoSlug: "informatica",
    categoria: "informatica",
    faixaPreco: "R$ 380 a R$ 720",
  },
  {
    id: "virus",
    label: "Vírus / Malware",
    emoji: "🦠",
    description: "Pop-ups, navegador estranho, antivírus desligando sozinho.",
    detalhes: [
      { id: "popup", label: "Pop-ups e propagandas surgindo do nada" },
      { id: "browser", label: "Navegador abrindo sites estranhos" },
      { id: "antivirus", label: "Antivírus desligou e não liga" },
      { id: "criptografia", label: "Arquivos com extensão estranha (.locked, .crypto)" },
    ],
    diagnostico: (detalhes) => {
      if (detalhes.includes("criptografia")) {
        return "ATENÇÃO: possível ransomware. Não desligue o PC e não pague resgate. Atendimento de emergência. Custo: R$ 850 a R$ 2.500 (resposta a incidente).";
      }
      return "Diagnóstico provável: malware/adware ativo. Solução: protocolo de remoção em modo de segurança + scanners + limpeza de persistência. Custo: R$ 200 a R$ 350 com garantia de 30 dias.";
    },
    servico: "Remoção de vírus profissional",
    servicoSlug: "informatica",
    categoria: "seguranca",
    faixaPreco: "R$ 200 a R$ 350",
  },
  {
    id: "wifi",
    label: "Wi-Fi fraco",
    emoji: "📶",
    description: "Sinal cai, internet lenta, zonas mortas em casa.",
    detalhes: [
      { id: "comodos", label: "Não pega em alguns cômodos" },
      { id: "queda", label: "Cai a toda hora" },
      { id: "lenta", label: "Internet lenta mesmo perto do roteador" },
      { id: "muitos", label: "Muitos dispositivos conectados (10+)" },
    ],
    diagnostico: (detalhes) => {
      if (detalhes.includes("comodos") || detalhes.includes("muitos")) {
        return "Diagnóstico provável: roteador único não dá conta. Solução: sistema mesh (3 nós) + reservar IPs + canal otimizado. Custo: R$ 280 (mão de obra) + R$ 600 a R$ 1.800 (equipamento).";
      }
      return "Diagnóstico provável: configuração ruim ou roteador antigo. Solução: troca de canal, atualização de firmware ou substituição por Wi-Fi 6. Custo: R$ 150 a R$ 280 (mão de obra).";
    },
    servico: "Configuração de redes / Mesh",
    servicoSlug: "redes",
    categoria: "redes",
    faixaPreco: "R$ 150 a R$ 1.800",
  },
  {
    id: "formatacao",
    label: "Quero formatar",
    emoji: "💿",
    description: "Sistema instável, quero deixar como novo, vender ou doar.",
    detalhes: [
      { id: "backup", label: "Tenho arquivos importantes (preciso de backup)" },
      { id: "windows", label: "Sem licença do Windows" },
      { id: "office", label: "Quero Office instalado" },
      { id: "drivers", label: "Notebook de marca específica (drivers especiais)" },
    ],
    diagnostico: () =>
      "Diagnóstico: formatação completa profissional inclui backup, instalação limpa do Windows 11, drivers oficiais, Office e antivírus. Custo: R$ 180 a R$ 280, garantia de 90 dias.",
    servico: "Formatação profissional",
    servicoSlug: "informatica",
    categoria: "informatica",
    faixaPreco: "R$ 180 a R$ 280",
  },
];

const URGENCIA = [
  { id: "agora", label: "Agora! É urgente" },
  { id: "hoje", label: "Hoje ou amanhã" },
  { id: "semana", label: "Esta semana" },
  { id: "orcamento", label: "Só quero orçamento" },
];

function buildWhatsApp(
  p: Problema,
  detalhes: string[],
  urgencia: string,
  ctx: { city?: string; bairro?: string },
) {
  const det = p.detalhes.filter((d) => detalhes.includes(d.id)).map((d) => `• ${d.label}`).join("\n");
  const urg = URGENCIA.find((u) => u.id === urgencia)?.label ?? "";
  const local = [ctx.bairro && `bairro ${ctx.bairro}`, ctx.city && ctx.city.replace(/-/g, " ")]
    .filter(Boolean)
    .join(", ");
  const msg =
    `Olá! Fiz o quiz no site e gostaria de orçamento.\n\n` +
    `*Problema:* ${p.label}\n` +
    `*Serviço indicado:* ${p.servico}\n` +
    `*Categoria:* ${p.categoria}\n\n` +
    `*Checklist do que está acontecendo:*\n${det}\n\n` +
    `*Urgência:* ${urg}\n` +
    `*Faixa estimada:* ${p.faixaPreco}` +
    (local ? `\n*Localização:* ${local}` : "");
  return buildWhatsAppUrlFromText(msg);
}

export function QuickDiagnosisQuiz({ city, bairro }: QuickDiagnosisQuizProps = {}) {
  const [step, setStep] = useState<Step>("problema");
  const [problema, setProblema] = useState<Problema | null>(null);
  const [detalhes, setDetalhes] = useState<string[]>([]);
  const [urgencia, setUrgencia] = useState<string>("");

  // Fire quiz_complete once per resultado view
  useEffect(() => {
    if (step === "resultado" && problema) {
      trackQuizComplete({
        service: problema.servicoSlug,
        urgencia,
        city,
        bairro,
      });
    }
  }, [step, problema, urgencia, city, bairro]);

  const reset = () => {
    trackEvent("quiz_reset", { city, bairro });
    setStep("problema");
    setProblema(null);
    setDetalhes([]);
    setUrgencia("");
  };

  const toggleDetalhe = (id: string) => {
    setDetalhes((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  return (
    <section className="section-padding bg-secondary/40" aria-labelledby="quiz-title">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <Sparkles className="w-4 h-4" /> Diagnóstico em 30 segundos
          </div>
          <h2 id="quiz-title" className="font-display text-3xl md:text-4xl font-bold mb-3">
            Não sabe o que está acontecendo? A gente descobre.
          </h2>
          <p className="text-muted-foreground">
            Responda 3 perguntas rápidas e receba um diagnóstico provável + faixa de preço — direto no seu WhatsApp.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {step === "problema" && (
            <>
              <h3 className="font-semibold text-lg mb-4">1. Qual é o problema?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {PROBLEMAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProblema(p);
                      setStep("detalhe");
                    }}
                    className="text-left p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl" aria-hidden>{p.emoji}</span>
                      <div>
                        <div className="font-semibold">{p.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{p.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "detalhe" && problema && (
            <>
              <h3 className="font-semibold text-lg mb-1">2. O que mais acontece?</h3>
              <p className="text-sm text-muted-foreground mb-4">Marque tudo que se aplica (pode ser mais de um)</p>
              <div className="space-y-3">
                {problema.detalhes.map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/50"
                  >
                    <Checkbox
                      checked={detalhes.includes(d.id)}
                      onCheckedChange={() => toggleDetalhe(d.id)}
                      id={`d-${d.id}`}
                    />
                    <Label htmlFor={`d-${d.id}`} className="cursor-pointer flex-1">{d.label}</Label>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={reset}>Voltar</Button>
                <Button
                  onClick={() => setStep("urgencia")}
                  disabled={detalhes.length === 0}
                  className="flex-1"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {step === "urgencia" && problema && (
            <>
              <h3 className="font-semibold text-lg mb-4">3. Qual a urgência?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {URGENCIA.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setUrgencia(u.id);
                      setStep("resultado");
                    }}
                    className="text-left p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all font-medium"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" onClick={() => setStep("detalhe")}>Voltar</Button>
              </div>
            </>
          )}

          {step === "resultado" && problema && (
            <>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mb-5">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                  Diagnóstico provável
                </div>
                <p className="text-foreground leading-relaxed">{problema.diagnostico(detalhes, urgencia)}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="text-xs text-muted-foreground">Serviço indicado</div>
                  <div className="font-semibold mt-1">{problema.servico}</div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="text-xs text-muted-foreground">Faixa de preço</div>
                  <div className="font-semibold mt-1">{problema.faixaPreco}</div>
                </div>
              </div>

              <Button
                variant="whatsapp"
                size="lg"
                className="w-full"
                onClick={() => {
                  trackWhatsAppClick({
                    source: "quiz_result",
                    service: problema.servicoSlug,
                    city,
                    bairro,
                  });
                  // Suppress unused-import warning while preserving builder for analytics parity.
                  void buildWhatsApp;
                  openTriage({
                    source: `quiz:${problema.id}:${urgencia}`,
                    category: problema.categoria === "informatica" ? "pc" : undefined,
                  });
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Continuar a triagem técnica
              </Button>

              <button
                type="button"
                onClick={reset}
                className="mt-4 mx-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <RotateCcw className="w-4 h-4" /> Refazer o diagnóstico
              </button>
            </>
          )}
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          *Resultado orientativo. {PRICING.technicalVisit.description}{" "}
          <TermsDialog
            source={TERMS_SOURCE.quiz}
            triggerLabel="Termos de Orçamento Pré-Aprovado"
            triggerClassName="underline hover:text-primary cursor-pointer"
          />
          .
        </p>
      </div>
    </section>
  );
}
