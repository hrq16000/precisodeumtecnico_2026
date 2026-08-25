import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
  Star,
  Share2,
  RefreshCw,
  Smartphone,
  Hash,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode } from "@/components/QrCode";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics";
import { buildWhatsAppUrl, buildWhatsAppUrlFromText } from "@/lib/whatsapp";
import { Checkbox } from "@/components/ui/checkbox";
import {
  OS_STAGES,
  stageIndex,
  normalizeProtocol,
  normalizePhone,
  isValidPhone,
  formatEta,
  progressPercent,
  slaState,
  SLA_LABEL,
  registerLookupAttempt,
  formatPhoneBR,
  OS_CONSENT_KEY,
  type ServiceOrderStatus,
} from "@/lib/serviceOrder";
import { SITE_ORIGIN, buildReviewLink } from "@/lib/reviews";

const faq = [
  {
    question: "Onde encontro o número da minha Ordem de Serviço?",
    answer:
      "O número da OS (protocolo) é enviado no WhatsApp assim que o orçamento é gerado e também aparece impresso no checklist e na Ordem de Serviço entregue ao final do atendimento.",
  },
  {
    question: "Posso consultar apenas com o meu celular, sem o número da OS?",
    answer:
      "Sim. Informe o mesmo número de celular usado no atendimento e a consulta lista as Ordens de Serviço mais recentes vinculadas a ele, com etapa atual e prazo. Por segurança e LGPD, esta consulta pública nunca exibe nome, e-mail, endereço ou as fotos enviadas na triagem — esse material fica restrito ao atendimento no WhatsApp.",
  },
  {
    question: "A consulta mostra meus dados pessoais?",
    answer:
      "Não. A consulta pública exibe apenas etapa atual, prazo estimado, serviço, cidade/bairro e observação técnica. Nome, telefone, e-mail e anexos nunca são exibidos nesta página.",
  },
  {
    question: "Com que frequência o status é atualizado?",
    answer:
      "A cada mudança de etapa: agendamento, diagnóstico, envio do orçamento, execução, testes finais e conclusão. A página também se atualiza sozinha a cada 45 segundos enquanto estiver aberta.",
  },
  {
    question: "O prazo pode mudar depois do orçamento aprovado?",
    answer:
      "Pode, quando depende de peça de terceiros ou de aprovação de escopo adicional. Qualquer alteração de prazo é comunicada no WhatsApp e refletida aqui, com destaque quando a etapa estiver perto do prazo.",
  },
  {
    question: "Qual é o formato correto do número da OS?",
    answer:
      "O protocolo segue o formato OS-ANO-NÚMERO, por exemplo OS-2026-0001. A consulta aceita letras minúsculas e espaços, mas não aceita números com menos de 4 caracteres nem apenas o nome do cliente.",
  },
  {
    question: "Como compartilho o acompanhamento com outra pessoa?",
    answer:
      "Depois de consultar, use o botão de copiar link, o envio direto por WhatsApp ou o QR code exibido junto ao resultado. O link já vem com o número da OS e abre direto na etapa atual, sem cadastro e sem expor dados pessoais.",
  },
];

const PROTOCOL_HINT = "Use o formato OS-ANO-NÚMERO (ex.: OS-2026-0001).";
const PHONE_HINT = "Informe o celular com DDD (ex.: 41 99999-0000).";
const POLL_MS = 45_000;
const SLOW_MS = 7_000;

type Mode = "protocol" | "phone";

export default function StatusOrdemServico() {
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>(params.get("tel") ? "phone" : "protocol");
  const [protocol, setProtocol] = useState(params.get("os") ?? "");
  const [phone, setPhone] = useState(formatPhoneBR(params.get("tel") ?? ""));
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [order, setOrder] = useState<ServiceOrderStatus | null>(null);
  const [list, setList] = useState<ServiceOrderStatus[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [blocked, setBlocked] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [consent, setConsentState] = useState(false);
  const [consentMissing, setConsentMissing] = useState(false);
  const slowTimer = useRef<number | null>(null);

  // Consentimento LGPD da consulta pública — restaurado entre visitas.
  useEffect(() => {
    try {
      setConsentState(window.localStorage?.getItem(OS_CONSENT_KEY) === "granted");
    } catch {
      /* storage indisponível — decisão vale só nesta sessão */
    }
  }, []);

  function setConsent(next: boolean) {
    setConsentState(next);
    if (next) setConsentMissing(false);
    try {
      window.localStorage?.setItem(OS_CONSENT_KEY, next ? "granted" : "denied");
    } catch {
      /* ignore */
    }
    trackEvent("os_status_consent", { consent: next ? "granted" : "denied" });
  }

  /** Remove o resultado em tela e apaga os rastros locais da consulta. */
  function discardLookupData() {
    setOrder(null);
    setList(null);
    resetFeedback();
    setPhone("");
    setProtocol("");
    setParams({}, { replace: true });
    try {
      window.localStorage?.removeItem(OS_CONSENT_KEY);
    } catch {
      /* ignore */
    }
    setConsentState(false);
    trackEvent("os_status_discard", {});
  }


  const whatsappHelpUrl = buildWhatsAppUrl({
    service: "acompanhamento de Ordem de Serviço",
  });

  /** Link público da consulta, preservando os UTMs de origem do usuário. */
  const shareUrl = useMemo(() => {
    if (!order) return "";
    const url = new URL("/status-os", SITE_ORIGIN);
    url.searchParams.set("os", order.protocol);
    params.forEach((value, key) => {
      if (key.startsWith("utm_")) url.searchParams.set(key, value);
    });
    return url.toString();
  }, [order, params]);

  /** Envio pronto por WhatsApp com o link da OS e os mesmos UTMs. */
  const shareWhatsAppUrl = useMemo(() => {
    if (!order || !shareUrl) return "";
    return buildWhatsAppUrlFromText(
      `Acompanhe a Ordem de Serviço ${order.protocol}: ${shareUrl} [service=acompanhamento de OS · source=status_os_share · utm_source=whatsapp_cta]`,
    );
  }, [order, shareUrl]);

  /** Link de avaliação reenviado mantendo os mesmos UTMs da origem. */
  const reviewUrl = useMemo(() => {
    if (!order) return "";
    const base = new URL(
      buildReviewLink({
        protocol: order.protocol,
        service: order.service ?? undefined,
        city: order.city ?? undefined,
        neighborhood: order.neighborhood ?? undefined,
        source: "status_os",
      }),
    );
    params.forEach((value, key) => {
      if (key.startsWith("utm_")) base.searchParams.set(key, value);
    });
    return base.toString();
  }, [order, params]);

  function resetFeedback() {
    setInvalid(false);
    setNotFound(false);
    setBlocked(null);
    setUnavailable(false);
  }

  const fetchByProtocol = useCallback(async (normalized: string) => {
    const { data, error } = await supabase.rpc("get_service_order_status", {
      _protocol: normalized,
    });
    if (error) throw error;
    return (Array.isArray(data) ? (data as ServiceOrderStatus[]) : []) ?? [];
  }, []);

  const fetchByPhone = useCallback(async (digits: string) => {
    const { data, error } = await supabase.rpc("get_service_orders_by_phone", {
      _phone: digits,
    });
    if (error) throw error;
    return (Array.isArray(data) ? (data as ServiceOrderStatus[]) : []) ?? [];
  }, []);

  async function runLookup(kind: Mode, value: string, silent = false) {
    const normalized = kind === "protocol" ? normalizeProtocol(value) : normalizePhone(value);
    const valid = kind === "protocol" ? normalized.length >= 4 : isValidPhone(normalized);
    if (!valid) {
      resetFeedback();
      setInvalid(true);
      setOrder(null);
      setList(null);
      return;
    }
    if (!silent) {
      const rate = registerLookupAttempt();
      if (!rate.allowed) {
        resetFeedback();
        setBlocked(rate.retryInSeconds);
        trackEvent("os_status_rate_limited", { mode: kind });
        return;
      }
      resetFeedback();
      setLoading(true);
      setOrder(null);
      setList(null);
      setSlow(false);
      slowTimer.current = window.setTimeout(() => setSlow(true), SLOW_MS);
      trackEvent("os_status_lookup", { mode: kind, value_length: normalized.length });
    }
    try {
      const rows = kind === "protocol" ? await fetchByProtocol(normalized) : await fetchByPhone(normalized);
      setLastSync(new Date());
      if (!rows.length) {
        if (!silent) setNotFound(true);
        return;
      }
      if (kind === "phone" && rows.length > 1) {
        setList(rows);
        setOrder(rows[0]);
      } else {
        setList(null);
        setOrder(rows[0]);
      }
    } catch {
      if (!silent) setUnavailable(true);
    } finally {
      if (!silent) {
        setLoading(false);
        setSlow(false);
        if (slowTimer.current) window.clearTimeout(slowTimer.current);
      }
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setConsentMissing(true);
      return;
    }
    if (mode === "protocol") {
      const normalized = normalizeProtocol(protocol);
      setParams(normalized ? { os: normalized } : {}, { replace: true });
      void runLookup("protocol", normalized);
    } else {
      const digits = normalizePhone(phone);
      setParams(digits ? { tel: digits } : {}, { replace: true });
      void runLookup("phone", digits);
    }
  }

  // Atualização automática (polling leve) enquanto a aba estiver visível.
  useEffect(() => {
    if (!order) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void runLookup("protocol", order.protocol, true);
    }, POLL_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.protocol]);

  async function copyShareLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackEvent("os_status_share_copy", { has_utm: shareUrl.includes("utm_") });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const current = order ? stageIndex(order.status) : -1;
  const percent = order ? progressPercent(order.status) : 0;
  const sla = order ? slaState(order) : "none";
  const slaTone =
    sla === "late"
      ? "border-destructive/40 bg-destructive/5 text-destructive"
      : sla === "near"
        ? "border-primary/40 bg-primary/5 text-primary"
        : "border-border bg-secondary/40 text-muted-foreground";

  const stampFor = (i: number) => {
    if (!order) return null;
    if (i === 0) return new Date(order.created_at);
    if (i === current) return new Date(order.updated_at);
    return null;
  };

  const fallbackBlock = (
    <div className="flex flex-wrap gap-3 mt-4">
      <Button variant="whatsapp" size="sm" asChild>
        <a
          href={whatsappHelpUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp sobre a Ordem de Serviço"
          data-wa-source="status-os-fallback"
          data-service="acompanhamento de Ordem de Serviço"
          onClick={() =>
            trackWhatsAppClick({
              source: "status_os_fallback",
              service: "acompanhamento de Ordem de Serviço",
              source_component: "StatusOrdemServico",
              cta_label: "Falar no WhatsApp",
            })
          }
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Falar no WhatsApp
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link to="/contato">Outros canais de contato</Link>
      </Button>
    </div>
  );

  return (
    <Layout>
      <SEOHead
        title="Status da Ordem de Serviço | Consulta por OS ou celular"
        description="Consulte o andamento do seu atendimento técnico pelo número da Ordem de Serviço ou pelo celular cadastrado: etapa atual, barra de progresso, prazo estimado e observações. Sem cadastro."
        canonical={`${SITE_ORIGIN}/status-os`}
        breadcrumbs={[
          { name: "Início", url: `${SITE_ORIGIN}/` },
          { name: "Status da OS", url: `${SITE_ORIGIN}/status-os` },
        ]}
        faq={faq}
      />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Acompanhamento
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Status da Ordem de Serviço
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Consulte pelo número da OS ou apenas pelo celular usado no atendimento. Você vê a etapa
            atual, o progresso, o prazo estimado e as observações do técnico — sem cadastro e sem
            exposição de dados pessoais.
          </p>

          <div className="inline-flex rounded-lg border border-border p-1 mb-4" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "protocol"}
              onClick={() => {
                setMode("protocol");
                resetFeedback();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md inline-flex items-center gap-2 ${mode === "protocol" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <Hash className="w-4 h-4" /> Número da OS
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "phone"}
              onClick={() => {
                setMode("phone");
                resetFeedback();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md inline-flex items-center gap-2 ${mode === "phone" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <Smartphone className="w-4 h-4" /> Meu celular
            </button>
          </div>

          <form onSubmit={onSubmit} className="mb-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="os-input" className="sr-only">
                {mode === "protocol" ? "Número da Ordem de Serviço" : "Celular cadastrado"}
              </label>
              <Input
                id="os-input"
                value={mode === "protocol" ? protocol : phone}
                onChange={(e) =>
                  mode === "protocol"
                    ? setProtocol(e.target.value)
                    : setPhone(formatPhoneBR(e.target.value))
                }
                inputMode={mode === "phone" ? "tel" : "text"}
                maxLength={mode === "phone" ? 16 : 24}
                placeholder={mode === "protocol" ? "Ex.: OS-2026-0001" : "Ex.: (41) 99999-0000"}
                autoComplete="off"
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" className="h-12 min-w-[10rem]" disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Consultando..." : "Consultar"}
              </Button>
            </div>

            <div
              className={`mt-4 rounded-lg border p-4 ${consentMissing ? "border-destructive/60 bg-destructive/5" : "border-border bg-secondary/30"}`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id="os-consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  aria-describedby="os-consent-text"
                  aria-label="Autorizo a consulta do status da minha Ordem de Serviço"
                  className="mt-0.5"
                />
                <label htmlFor="os-consent" id="os-consent-text" className="text-sm text-muted-foreground leading-snug">
                  <span className="font-medium text-foreground">
                    Autorizo a consulta do status desta Ordem de Serviço.
                  </span>{" "}
                  Usamos o número informado apenas para localizar o atendimento. A página exibe
                  somente etapa, prazo, serviço e cidade/bairro — nunca nome, e-mail, endereço ou as
                  fotos enviadas na triagem. Nada é armazenado no seu navegador além desta
                  autorização, que você pode descartar a qualquer momento. Detalhes na{" "}
                  <Link to="/politica-privacidade" className="text-primary underline">
                    Política de Privacidade
                  </Link>
                  .
                </label>
              </div>
              {consentMissing && (
                <p role="alert" className="mt-2 text-sm font-medium text-destructive">
                  Marque a autorização acima para consultar.
                </p>
              )}
              {consent && (
                <button
                  type="button"
                  onClick={discardLookupData}
                  className="mt-3 text-xs font-medium text-muted-foreground underline min-h-11 sm:min-h-0"
                >
                  Descartar consulta e apagar autorização deste dispositivo
                </button>
              )}
            </div>
          </form>

          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-border bg-card p-6 mb-10"
            >
              <span className="sr-only">Consultando Ordem de Serviço…</span>
              <div className="h-5 w-40 rounded-sm bg-secondary animate-pulse mb-3" />
              <div className="h-3 w-2/3 rounded-sm bg-secondary animate-pulse mb-6" />
              <div className="h-2 w-full rounded-full bg-secondary animate-pulse mb-6" />
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-secondary animate-pulse shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 w-1/3 rounded-sm bg-secondary animate-pulse mb-2" />
                      <div className="h-3 w-3/4 rounded-sm bg-secondary animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && slow && (
            <div role="status" className="rounded-lg border border-border bg-secondary/40 p-4 mb-10">
              <p className="text-sm text-foreground font-medium mb-1">
                A consulta está demorando mais que o normal.
              </p>
              <p className="text-sm text-muted-foreground">
                Você pode aguardar mais alguns segundos ou falar direto com a equipe técnica. Se o
                problema persistir, o sistema de consulta pode estar indisponível no momento.
              </p>
              {fallbackBlock}
            </div>
          )}


          {invalid && (
            <div
              role="alert"
              className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 mb-10"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">
                  {mode === "protocol" ? "Número de OS inválido." : "Celular inválido."}
                </p>
                <p className="text-muted-foreground">
                  {mode === "protocol" ? PROTOCOL_HINT : PHONE_HINT}
                </p>
              </div>
            </div>
          )}

          {blocked !== null && (
            <div role="alert" className="rounded-lg border border-border bg-secondary/40 p-4 mb-10">
              <p className="text-sm font-semibold text-foreground mb-1">
                Muitas consultas em pouco tempo.
              </p>
              <p className="text-sm text-muted-foreground">
                Aguarde {blocked} segundos e tente novamente. Se precisar de retorno imediato, fale
                com a equipe.
              </p>
              {fallbackBlock}
            </div>
          )}

          {unavailable && (
            <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 mb-10">
              <p className="text-sm font-semibold text-foreground mb-1">
                Não foi possível consultar agora.
              </p>
              <p className="text-sm text-muted-foreground">
                O serviço de consulta está temporariamente indisponível. Tente novamente em instantes
                ou peça o status pelo WhatsApp.
              </p>
              {fallbackBlock}
            </div>
          )}

          {notFound && (
            <div
              role="status"
              className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 mb-10"
            >
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-1">
                    {mode === "protocol"
                      ? "Não encontramos nenhuma OS com esse número."
                      : "Não encontramos Ordens de Serviço para esse celular."}
                  </p>
                  <p className="text-muted-foreground">
                    {mode === "protocol" ? PROTOCOL_HINT : PHONE_HINT} Se o atendimento foi
                    solicitado há poucos minutos, o registro pode ainda não estar publicado.
                  </p>
                </div>
              </div>
              {fallbackBlock}
            </div>
          )}

          {list && list.length > 1 && (
            <div className="rounded-xl border border-border bg-card p-4 mb-6">
              <p className="text-sm font-semibold text-foreground mb-3">
                {list.length} Ordens de Serviço vinculadas a este celular
              </p>
              <div className="flex flex-wrap gap-2">
                {list.map((o) => (
                  <button
                    key={o.protocol}
                    type="button"
                    onClick={() => setOrder(o)}
                    className={`rounded-lg border px-3 py-2 text-sm ${o.protocol === order?.protocol ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
                  >
                    {o.protocol} · {OS_STAGES[stageIndex(o.status)].label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {order && (
            <div className="rounded-xl border border-border bg-card p-6 mb-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h2 className="font-display text-xl font-bold text-foreground">
                  OS {order.protocol}
                </h2>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" aria-hidden="true" />
                  Atualizado em {new Date(order.updated_at).toLocaleString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                {[order.service, order.equipment, [order.neighborhood, order.city].filter(Boolean).join(" - ")]
                  .filter(Boolean)
                  .join(" · ") || "Atendimento técnico"}
              </p>

              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>
                    Etapa {current + 1} de {OS_STAGES.length}
                  </span>
                  <span>{percent}% concluído</span>
                </div>
                <div
                  className="h-2 w-full rounded-full bg-secondary overflow-hidden"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progresso da Ordem de Serviço"
                >
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <p className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm mb-5 ${slaTone}`}>
                <Clock className="w-4 h-4" aria-hidden="true" />
                {SLA_LABEL[sla]}
                {order.eta_date && ` · previsão ${formatEta(order.eta_date)}`}
              </p>

              <ol className="space-y-4">
                {OS_STAGES.map((stage, i) => {
                  const done = i < current;
                  const active = i === current;
                  return (
                    <li key={stage.key} className="flex gap-3">
                      {done || active ? (
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 mt-0.5 ${active ? "text-primary" : "text-muted-foreground"}`}
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground/40" aria-hidden="true" />
                      )}
                      <div>
                        <p
                          className={`font-semibold ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {stage.label}
                          {active && <span className="ml-2 text-xs font-normal">(etapa atual)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                        <p className="text-xs text-muted-foreground/80 mt-0.5">{stage.slaText}</p>
                        {stampFor(i) && (
                          <p className="text-xs font-medium text-foreground/80 mt-1">
                            {i === 0 ? "Registrado em" : "Atualizado em"}{" "}
                            <time dateTime={stampFor(i)!.toISOString()}>
                              {stampFor(i)!.toLocaleString("pt-BR")}
                            </time>
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              {order.public_note && (
                <p className="mt-6 rounded-lg bg-secondary/40 p-4 text-sm text-foreground">
                  <strong className="block mb-1">Observação do técnico</strong>
                  {order.public_note}
                </p>
              )}

              <div className="mt-6 border-t border-border pt-6 flex flex-col sm:flex-row gap-6 sm:items-center">
                <QrCode
                  value={shareUrl}
                  alt={`QR code para acompanhar a OS ${order.protocol}`}
                  size={128}
                  className="rounded-lg border border-border bg-background p-2 shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">
                    Aponte a câmera do celular para acompanhar esta OS, ou compartilhe o link com
                    quem estiver acompanhando o atendimento.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" variant="outline" size="sm" onClick={copyShareLink}>
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Link copiado" : "Copiar link da OS"}
                    </Button>
                    <Button variant="whatsapp" size="sm" asChild>
                      <a
                        href={shareWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Compartilhar a Ordem de Serviço no WhatsApp"
                        data-wa-source="status-os-share"
                        data-service="acompanhamento de Ordem de Serviço"
                        onClick={() =>
                          trackWhatsAppClick({
                            source: "status_os_share",
                            service: "acompanhamento de Ordem de Serviço",
                            city: order.city ?? undefined,
                            bairro: order.neighborhood ?? undefined,
                            source_component: "StatusOrdemServico",
                            cta_label: "Enviar OS no WhatsApp",
                          })
                        }
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Enviar no WhatsApp
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={reviewUrl}
                        onClick={() => trackEvent("os_review_link_resend", { source: "status_os" })}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Reenviar link de avaliação
                      </a>
                    </Button>
                  </div>
                  {lastSync && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Sincronizado automaticamente às {lastSync.toLocaleTimeString("pt-BR")} · a página
                      se atualiza sozinha a cada 45 segundos.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Dúvidas sobre o acompanhamento
            </h2>
            <dl className="space-y-4">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-foreground">{item.question}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{item.answer}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-muted-foreground mt-6 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Serviço concluído?{" "}
              <Link to="/como-avaliar" className="text-primary underline">
                Veja como avaliar o atendimento
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
