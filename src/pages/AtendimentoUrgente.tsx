import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Clock, Zap, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { openTriage } from "@/lib/triageFlag";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/analytics";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";

const CANONICAL = "https://precisodeumtecnico.com/atendimento-urgente";

/** Janela comercial declarada no LocalBusiness (08h–22h, horário de Brasília). */
const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;

function nowInSaoPaulo(): Date {
  const s = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
  return new Date(s);
}

const FAQ = [
  {
    question: "O que significa “atendimento urgente” aqui?",
    answer:
      "Significa prioridade na fila de triagem e tentativa de encaixe na mesma janela do dia, quando há técnico disponível na sua região. Não é promessa de reparo imediato: a confirmação depende da agenda em aberto e da disponibilidade de peça.",
  },
  {
    question: "Vocês atendem fora do horário comercial?",
    answer:
      "A triagem funciona 24 horas e o seu caso entra na fila mesmo de madrugada. O deslocamento do técnico, porém, acontece dentro da janela de 08h às 22h. Casos registrados fora desse período são confirmados logo na abertura.",
  },
  {
    question: "Urgência tem custo adicional?",
    answer:
      "A taxa de deslocamento segue a mesma política publicada: visita técnica a partir de R$ 99,99 por bloco de até 30 minutos e coleta com entrega a partir de R$ 299,99. Encaixes fora de rota podem exigir aprovação específica, sempre informada antes.",
  },
  {
    question: "Qual informação acelera o atendimento urgente?",
    answer:
      "Equipamento, sintoma exato, bairro e desde quando o problema começou. Com esses quatro dados o técnico já sai com as peças e ferramentas prováveis, o que reduz retorno e tempo de parada.",
  },
];

const AtendimentoUrgente = () => {
  const [now, setNow] = useState<Date>(() => nowInSaoPaulo());

  useEffect(() => {
    const id = window.setInterval(() => setNow(nowInSaoPaulo()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const status = useMemo(() => {
    const h = now.getHours();
    const open = h >= OPEN_HOUR && h < CLOSE_HOUR;
    if (open) {
      return {
        open: true,
        label: "Atendimento aberto agora",
        detail: `Estamos dentro da janela de atendimento (08h às 22h). São ${String(h).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} em Curitiba — abra a triagem e o seu caso entra na fila prioritária de hoje.`,
      };
    }
    const hoursToOpen = h < OPEN_HOUR ? OPEN_HOUR - h : 24 - h + OPEN_HOUR;
    return {
      open: false,
      label: "Fora da janela de deslocamento",
      detail: `Agora são ${String(h).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} em Curitiba. A triagem continua recebendo o seu caso 24h e a confirmação sai em aproximadamente ${hoursToOpen}h, na abertura das 08h.`,
    };
  }, [now]);

  const waText = status.open
    ? "Olá! Preciso de atendimento URGENTE agora. [service=urgente · source=urgencia · utm_source=whatsapp_cta]"
    : "Olá! Quero registrar um atendimento URGENTE para o próximo horário disponível. [service=urgente · source=urgencia · utm_source=whatsapp_cta]";

  return (
    <Layout>
      <SEOHead
        title="Atendimento urgente agora: veja a disponibilidade em tempo real"
        description="Precisa de técnico urgente em Curitiba? Confira a disponibilidade da janela atual (08h às 22h), registre o caso na triagem 24h e receba prioridade na fila do dia."
        canonical={CANONICAL}
        keywords="técnico urgente curitiba, assistência técnica agora, atendimento emergencial informática"
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Atendimento urgente", url: CANONICAL },
        ]}
        faq={FAQ}
        structuredData={[buildLocalBusinessSchema({ url: CANONICAL })]}
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Preciso de ajuda urgente agora
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Esta página confirma, em tempo real, se você está dentro da janela de atendimento e leva
          direto ao canal certo. Sem formulário longo, sem fila de telefone: o caso é registrado na
          triagem e entra com prioridade na rota do dia.
        </p>

        <div
          className={`mt-8 rounded-2xl border p-6 ${
            status.open ? "border-primary bg-primary/5" : "border-border bg-muted/40"
          }`}
          role="status"
          aria-live="polite"
          data-testid="urgent-availability"
        >
          <p className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Clock className="w-5 h-5 text-primary" aria-hidden />
            {status.label}
          </p>
          <p className="mt-2 text-muted-foreground">{status.detail}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button
              size="lg"
              onClick={() => {
                trackCtaClick({ surface: "cta_section", cta_id: "urgent_triage", destination: "/triagem" });
                openTriage({ source: "urgencia" });
              }}
            >
              <Zap className="w-4 h-4 mr-2" aria-hidden />
              Abrir triagem prioritária
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              onClick={() =>
                trackWhatsAppClick({ source: "urgencia", service: "urgente", city: "Curitiba" })
              }
            >
              <a
                data-wa-source="atendimento-urgente"
                data-service="atendimento técnico urgente"
                aria-label="Falar no WhatsApp sobre atendimento urgente"
                href={buildWhatsAppUrlFromText(waText)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" aria-hidden />
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground">Como funciona a prioridade</h2>
          <ol className="mt-4 space-y-3 text-muted-foreground">
            <li>
              <strong className="text-foreground">1. Registro imediato.</strong> A triagem coleta
              equipamento, sintoma, cidade e bairro em menos de um minuto e marca o caso como
              urgente.
            </li>
            <li>
              <strong className="text-foreground">2. Checagem de rota.</strong> O caso é comparado
              com as rotas já abertas na sua região. Encaixe no mesmo dia depende de haver janela
              livre — isso é dito com clareza, nunca prometido no escuro.
            </li>
            <li>
              <strong className="text-foreground">3. Confirmação da janela.</strong> Você recebe a
              faixa de horário e a modalidade aplicável (visita ou coleta) com o valor antes de
              qualquer deslocamento.
            </li>
            <li>
              <strong className="text-foreground">4. Diagnóstico e aprovação.</strong> Nenhum
              reparo começa sem o seu aceite do orçamento fechado.
            </li>
          </ol>
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" aria-hidden />
            Enquanto o técnico não chega
          </h2>
          <p className="mt-2 text-muted-foreground">
            Boa parte das urgências se resolve — ou fica muito mais barata — com cinco minutos de
            verificação. Use o checklist do seu sintoma antes do atendimento.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/checklists-de-reparo">
                Ver checklists rápidos
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/area-de-atendimento-curitiba">Conferir a cobertura do meu bairro</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/precos">Ver preços e condições</Link>
            </Button>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground">Perguntas frequentes sobre urgência</h2>
          <dl className="mt-4 space-y-4">
            {FAQ.map((f) => (
              <div key={f.question} className="rounded-xl border border-border p-4">
                <dt className="font-semibold text-foreground">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Layout>
  );
};

export default AtendimentoUrgente;
