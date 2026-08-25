import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { ShieldCheck, Trash2, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { SITE_ORIGIN } from "@/lib/reviews";

const SCOPES = [
  { value: "todos", label: "Todos os meus dados (cadastro, atendimento e anexos)" },
  { value: "anexos", label: "Somente fotos e vídeos que enviei na triagem" },
  { value: "avaliacao", label: "Somente minha avaliação publicada no site" },
] as const;

const faq = [
  {
    question: "Em quanto tempo o pedido de exclusão é atendido?",
    answer:
      "Em até 15 dias corridos, conforme a LGPD. Você recebe a confirmação no WhatsApp ou e-mail informado, com a data em que a exclusão foi executada.",
  },
  {
    question: "Existem dados que não podem ser apagados?",
    answer:
      "Sim. Registros de ordem de serviço, aceites de termos e documentos fiscais são mantidos pelo prazo legal de guarda (5 anos) para defesa em eventual reclamação e cumprimento de obrigação legal, conforme o art. 16 da LGPD.",
  },
  {
    question: "As fotos e vídeos enviados na triagem são apagados?",
    answer:
      "Sim. Anexos de diagnóstico são excluídos no pedido e, por padrão, são descartados automaticamente em até 90 dias após a conclusão do serviço.",
  },
  {
    question: "Preciso informar o número da OS?",
    answer:
      "Não é obrigatório, mas informar o protocolo acelera a localização do seu registro e evita pedidos de confirmação adicionais.",
  },
];

export default function ExclusaoDeDados() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    protocol: "",
    scope: "todos",
    details: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2 || form.phone.trim().length < 5) {
      setError("Informe seu nome completo e um telefone/WhatsApp válido.");
      return;
    }
    setSending(true);
    const { error: insertError } = await supabase.from("data_deletion_requests").insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      protocol: form.protocol.trim() || null,
      scope: form.scope,
      details: form.details.trim() || null,
      status: "pending",
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
    });
    setSending(false);
    if (insertError) {
      setError("Não foi possível registrar o pedido agora. Tente novamente em instantes.");
      return;
    }
    trackEvent("data_deletion_request", { scope: form.scope });
    setSent(true);
  }

  return (
    <Layout>
      <SEOHead
        title="Exclusão de Dados e Anexos (LGPD) | Preciso de Um Técnico"
        description="Solicite a exclusão dos seus dados pessoais e dos arquivos anexados no atendimento técnico. Pedido registrado com protocolo, prazo de retenção informado e confirmação enviada ao cliente."
        canonical={`${SITE_ORIGIN}/exclusao-de-dados`}
        breadcrumbs={[
          { name: "Início", url: `${SITE_ORIGIN}/` },
          { name: "Exclusão de dados", url: `${SITE_ORIGIN}/exclusao-de-dados` },
        ]}
        faq={faq}
      />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            LGPD
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Exclusão de dados e anexos
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Você pode pedir a exclusão dos seus dados pessoais e dos arquivos enviados durante a
            triagem. O pedido é registrado, tratado em até 15 dias corridos e confirmado no contato
            que você informar.
          </p>

          <div className="rounded-xl border border-border bg-secondary/30 p-5 mb-10 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-foreground mb-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Retenção legal
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Anexos de diagnóstico: excluídos no pedido (descarte padrão em até 90 dias).</li>
              <li>Leads e triagens sem contratação: excluídos no pedido (retenção padrão de 12 meses).</li>
              <li>
                Ordens de serviço, aceites e notas: mantidos por 5 anos por obrigação legal e defesa
                em reclamação (art. 16, LGPD) — os demais campos são anonimizados.
              </li>
            </ul>
            <p className="mt-3">
              Detalhes completos na{" "}
              <Link to="/politica-privacidade" className="text-primary underline">
                Política de Privacidade e LGPD
              </Link>
              .
            </p>
          </div>

          {sent ? (
            <div
              role="status"
              className="rounded-xl border border-primary/40 bg-primary/5 p-6 mb-10 flex gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">Pedido registrado com sucesso.</p>
                <p className="text-sm text-muted-foreground">
                  Vamos confirmar a exclusão no contato informado em até 15 dias corridos. Guarde
                  esta data como comprovação do seu pedido:{" "}
                  {new Date().toLocaleDateString("pt-BR")}.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5 mb-10" noValidate>
              <div>
                <label htmlFor="dd-name" className="block text-sm font-medium mb-1.5">
                  Nome completo *
                </label>
                <Input
                  id="dd-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  maxLength={200}
                  className="h-12"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="dd-phone" className="block text-sm font-medium mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <Input
                    id="dd-phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    inputMode="tel"
                    maxLength={50}
                    className="h-12"
                  />
                </div>
                <div>
                  <label htmlFor="dd-email" className="block text-sm font-medium mb-1.5">
                    E-mail (opcional)
                  </label>
                  <Input
                    id="dd-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={320}
                    className="h-12"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="dd-protocol" className="block text-sm font-medium mb-1.5">
                  Número da OS (opcional)
                </label>
                <Input
                  id="dd-protocol"
                  value={form.protocol}
                  onChange={(e) => setForm({ ...form, protocol: e.target.value })}
                  placeholder="Ex.: OS-2026-0001"
                  maxLength={40}
                  className="h-12"
                />
              </div>
              <fieldset>
                <legend className="block text-sm font-medium mb-2">O que deseja excluir?</legend>
                <div className="space-y-2">
                  {SCOPES.map((s) => (
                    <label
                      key={s.value}
                      className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer min-h-[48px]"
                    >
                      <input
                        type="radio"
                        name="scope"
                        value={s.value}
                        checked={form.scope === s.value}
                        onChange={() => setForm({ ...form, scope: s.value })}
                        className="mt-1"
                      />
                      <span className="text-sm text-foreground">{s.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="dd-details" className="block text-sm font-medium mb-1.5">
                  Detalhes (opcional)
                </label>
                <Textarea
                  id="dd-details"
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  maxLength={2000}
                  rows={4}
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full sm:w-auto h-12" disabled={sending}>
                <Trash2 className="w-4 h-4 mr-2" />
                {sending ? "Enviando..." : "Solicitar exclusão"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Ao enviar, você concorda que usaremos os dados acima apenas para localizar e excluir
                seus registros e confirmar o atendimento do pedido.
              </p>
            </form>
          )}

          <div className="rounded-xl border border-border p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Perguntas frequentes sobre exclusão de dados
            </h2>
            <dl className="space-y-4">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-foreground">{item.question}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </Layout>
  );
}
