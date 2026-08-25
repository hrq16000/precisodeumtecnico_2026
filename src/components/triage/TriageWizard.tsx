import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link } from "@/lib/router-compat";
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Loader2,
  ShieldAlert, Zap, X, Send, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { sendLeadNotification } from "@/lib/lead-notification.functions";
import { SYMPTOMS } from "@/data/symptoms";
import {
  CATEGORIES, advanceHint, buildPayload, canAdvance, getSymptom, makeInitialState, reducer,
  type Category, type TriagePayload,
} from "./triageMachine";
import { MediaUploader } from "./MediaUploader";
import { buildTriageWhatsAppUrl, currentSourcePage, readStoredLocation, type TriageWhatsAppResult } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { logWaEvent } from "@/lib/waAudit";
import { pushLocalAnalyticsEvent } from "@/lib/localAnalytics";

interface TriageWizardProps {
  /** Categoria pré-selecionada (vinda do CTA da página). */
  initialCategory?: Category;
  /** Slug do sintoma pré-selecionado (vindo de hub /sintomas/:slug). */
  initialSymptomSlug?: string;
  /** Origem (rastreável em leads.source) — ex.: "hero", "float", "bairro_centro". */
  source?: string;
  /** Fechamento quando renderizado em Dialog/Sheet. */
  onClose?: () => void;
}

const STEP_LABELS: Record<string, string> = {
  category: "1 · Categoria",
  device: "2 · Aparelho",
  symptom: "3 · Sintoma",
  branch: "4 · Detalhes",
  contact: "5 · Contato",
  accept: "6 · Aceite",
};


const STEP_ORDER: string[] = ["category", "device", "symptom", "branch", "contact", "accept"];

export function TriageWizard({
  initialCategory, initialSymptomSlug, source = "triagem-preview", onClose,
}: TriageWizardProps) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const s = makeInitialState();
    if (initialCategory) s.category = initialCategory;
    if (initialSymptomSlug) {
      const found = SYMPTOMS.find((sy) => sy.slug === initialSymptomSlug);
      if (found) {
        s.symptomSlug = found.slug;
        s.category = found.category as Category;
      }
    }
    return s;
  });
  const [lastPayload, setLastPayload] = useState<TriagePayload | null>(null);
  const [triageWhatsApp, setTriageWhatsApp] = useState<TriageWhatsAppResult | null>(null);
  const [exited, setExited] = useState(false);
  const lastStepRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastStepRef.current === state.step) return;
    lastStepRef.current = state.step;
    const idx = STEP_ORDER.indexOf(state.step);
    if (state.step === "done") {
      pushLocalAnalyticsEvent({
        event: "triage_complete",
        source,
        completion_status: "completed",
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      return;
    }
    if (state.step === "submitting" || state.step === "error") return;
    if (idx < 0) return;
    pushLocalAnalyticsEvent({
      event: "triage_step",
      source,
      step_id: state.step,
      step_index: idx,
      completion_status: idx === 0 ? "started" : "in_progress",
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, [state.step, source]);


  const stepIdx = Math.max(0, STEP_ORDER.indexOf(state.step));
  const progressPct = state.step === "done"
    ? 100
    : Math.round(((stepIdx + 1) / STEP_ORDER.length) * 100);

  const sym = getSymptom(state);
  const symptomsForCat = useMemo(
    () => (state.category ? SYMPTOMS.filter((s) => s.category === state.category) : SYMPTOMS),
    [state.category],
  );

  const hint = advanceHint(state);

  const buildWhatsAppResult = (payload: TriagePayload): TriageWhatsAppResult => {
    const stored = readStoredLocation();
    const storedIsUsable = stored.source !== "default";
    const city = payload.city || (storedIsUsable ? stored.city : undefined);
    const neighborhood = payload.neighborhood || (storedIsUsable ? stored.neighborhood : undefined);
    const addressOrReference = [storedIsUsable ? stored.address : undefined, state.cep && `CEP ${state.cep}`]
      .filter(Boolean)
      .join(" · ") || undefined;

    return buildTriageWhatsAppUrl({
      category: payload.category,
      brand: payload.brand,
      model: payload.model,
      symptom: payload.symptom || payload.message,
      serviceMode: payload.service_mode,
      city,
      neighborhood,
      addressOrReference,
      slaDaysMin: payload.sla_days_min,
      slaDaysMax: payload.sla_days_max,
      mediaCount: payload.media_urls.length,
      sourceDetail: payload.source,
      pagePath: currentSourcePage(),
    });
  };

  const handleWhatsAppContinue = () => {
    if (!triageWhatsApp) return;
    trackWhatsAppClick({
      source: "triage",
      service: triageWhatsApp.serviceTag,
      city: triageWhatsApp.city,
      bairro: triageWhatsApp.neighborhood,
      has_full_address: false,
      source_component: "triage_wizard_success",
      cta_label: "Continuar no WhatsApp",
    });
    void logWaEvent({
      source: "triage",
      href: null,
      kind: "whatsapp",
      category: lastPayload?.category ?? null,
      bypass: true,
      sessionId: lastPayload?.triage_payload?.sessionId as string | undefined,
    });
  };

  const handleSubmit = async () => {
    dispatch({ type: "START_SUBMIT" });
    const payload = buildPayload(state, source);

    // Guarda dupla: valor mínimo R$ 99,99 obrigatório em visita/bancada; R$ 299,99 em coleta.
    // O trigger no BD reforça. Fonte única: src/data/pricingPolicy.ts.
    const mode = payload.service_mode;
    if (mode === "visita" || mode === "bancada") {
      if (!payload.estimated_ticket_min || payload.estimated_ticket_min < 99.99) {
        payload.estimated_ticket_min = 99.99;
      }
    }
    if (mode === "coleta") {
      if (!payload.estimated_ticket_min || payload.estimated_ticket_min < 299.99) {
        payload.estimated_ticket_min = 299.99;
      }
    }


    setLastPayload(payload);
    setTriageWhatsApp(buildWhatsAppResult(payload));
    try {
      const enriched = {
        ...payload,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
        referrer: typeof document !== "undefined" ? document.referrer.slice(0, 1000) : null,
      };
      const { error } = await supabase.from("leads").insert(enriched as never);
      if (error) throw error;

      // P0 Legal: registra evidência separada e auditável dos 3 aceites.
      // Não bloqueia o sucesso do funil se este registro falhar — apenas loga.
      try {
        const acceptedSummary = [
          state.accepts.bancada && "taxa-diagnostico-99-pre-aprovado-299",
          state.accepts.visita && "prazos-celular-1a3d-tvplaca-15a60d",
          state.accepts.sla && "termos-condicoes-garantia",
        ].filter(Boolean).join("|");
        await supabase.from("terms_acceptances").insert({
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          service: `triagem:${payload.symptom ?? payload.category ?? "geral"} [${acceptedSummary}]`,
        } as never);
      } catch (legalErr) {
        // eslint-disable-next-line no-console
        console.warn("[triage] terms_acceptances insert failed:", legalErr);
      }

      // Notifica o time (email via Resend) — fire-and-forget.
      try {
        const service = payload.symptom ?? payload.category;
        await sendLeadNotification({
          data: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            ...(service ? { service } : {}),
            ...(payload.city ? { city: payload.city } : {}),
            message:
              `[TRIAGEM] ${payload.category ?? ""} ${payload.brand ?? ""} ${payload.model ?? ""}\n` +
              `Sintoma: ${payload.symptom ?? "(custom)"}\n` +
              `Modo: ${payload.service_mode ?? "—"} · Ticket R$ ${payload.estimated_ticket_min ?? "?"}–${payload.estimated_ticket_max ?? "?"}\n` +
              `Mídias: ${payload.media_urls.length} · Origem: ${payload.source}`,
          },
        });
      } catch (_notifyErr) { /* não bloqueia */ }

      dispatch({ type: "SUBMIT_OK" });
    } catch (e) {
      dispatch({ type: "SUBMIT_ERR", message: (e as Error).message || "Falha ao enviar." });
    }
  };

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Zap className="h-4 w-4 text-primary" />
          Triagem técnica
          {!exited && state.step !== "submitting" && state.step !== "done" && state.step !== "error" && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {STEP_LABELS[state.step] ?? state.step}
            </span>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        )}
      </header>

      {/* Progress bar */}
      {!exited && !["submitting", "done", "error"].includes(state.step) && (
        <div className="h-1 w-full bg-muted" aria-hidden>
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Body */}
      <div key={exited ? "exited" : state.step} className="space-y-5 px-5 py-6 animate-in fade-in slide-in-from-bottom-1 duration-300">
        {exited && (
          <section className="space-y-4 py-4 text-center">
            <h2 className="text-xl font-bold">Agradecemos o seu tempo.</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nosso foco é oferecer um serviço técnico definitivo, transparente e de altíssima qualidade.
              Entendemos que este pode não ser o seu momento. Sempre que pensar{" "}
              <em>"preciso de uma solução"</em> altamente qualificada para resolver problemas sem dor de cabeça,
              acesse:
            </p>
            <a
              href="https://www.precisodeumtecnico.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-primary underline underline-offset-4"
            >
              www.precisodeumtecnico.com
            </a>
            <p className="text-sm text-muted-foreground">Estaremos de portas abertas.</p>
            {onClose && (
              <Button variant="outline" onClick={onClose} className="mt-4">Fechar</Button>
            )}
          </section>
        )}

        {!exited && state.step === "category" && (
          <section>
            <h2 className="mb-3 text-lg font-bold">Qual é o aparelho?</h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => dispatch({ type: "SET_CATEGORY", value: c.value })}
                  className={cn(
                    "min-h-[88px] rounded-xl border-2 p-4 text-left transition active:scale-[0.98]",
                    state.category === c.value
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="text-2xl">{c.emoji}</div>
                  <div className="mt-1 text-sm font-semibold">{c.label}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {!exited && state.step === "device" && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Marca e modelo</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={state.brand}
                  maxLength={80}
                  onChange={(e) => dispatch({ type: "SET_DEVICE", brand: e.target.value, model: state.model })}
                  placeholder="Samsung, LG, Sony…"
                />
              </div>
              <div>
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={state.model}
                  maxLength={120}
                  onChange={(e) => dispatch({ type: "SET_DEVICE", brand: state.brand, model: e.target.value })}
                  placeholder="Ex.: 55Q60T / iPhone 13 / PS5 Slim"
                />
              </div>
            </div>
          </section>
        )}

        {!exited && state.step === "symptom" && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Qual o sintoma?</h2>
            <div className="space-y-2">
              {symptomsForCat.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => dispatch({ type: "SET_SYMPTOM", slug: s.slug })}
                  className={cn(
                    "flex min-h-[64px] w-full items-start justify-between gap-3 rounded-xl border-2 p-3.5 text-left transition active:scale-[0.99]",
                    state.symptomSlug === s.slug
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div>
                    <p className="font-semibold">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.shortDescription}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
            <div className="pt-2">
              <Label htmlFor="custom">Outro sintoma (descreva)</Label>
              <Textarea
                id="custom"
                value={state.symptomCustom ?? ""}
                maxLength={5000}
                onChange={(e) => dispatch({ type: "SET_SYMPTOM", slug: "", custom: e.target.value })}
                placeholder="Descreva o defeito com o máximo de detalhes…"
              />
            </div>
          </section>
        )}

        {!exited && state.step === "branch" && sym && (
          <section className="space-y-4">
            {/* === 4a · COLETA (gate impositivo) — copy de autoridade === */}
            {sym.triage.mode === "coleta" && (
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-amber-500 bg-amber-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                    <div className="space-y-3">
                      <h3 className="text-lg font-extrabold leading-tight">
                        Diagnóstico Transparente: Foco na Solução.
                      </h3>
                      <p className="text-sm leading-relaxed">
                        Identificamos que o sintoma do seu equipamento requer{" "}
                        <strong>análise profunda em laboratório</strong>. Não trabalhamos com
                        especulações rápidas ou achismos que não resolvem o problema.
                        Nosso compromisso é entregar o equipamento funcionando.
                      </p>
                      <ul className="space-y-2 rounded-lg border border-amber-600/30 bg-amber-500/10 p-3 text-sm">
                        <li>
                          <strong>Modalidade Exclusiva:</strong> Coleta e Entrega.
                        </li>
                        <li>
                          <strong>Orçamento pré-aprovado estimado:</strong>{" "}
                          de <strong>R$ {sym.triage.ticketMin.toLocaleString("pt-BR")}</strong> a{" "}
                          <strong>R$ {sym.triage.ticketMax.toLocaleString("pt-BR")}</strong>{" "}
                          <em>(só cobramos o reparo se houver solução).</em>
                        </li>
                        <li className="text-xs text-muted-foreground">
                          Prazo realista: <strong>{sym.triage.slaMinDays} a {sym.triage.slaMaxDays} dias úteis</strong>.{" "}
                          <Link to="/termos-orcamento-pre-aprovado" className="underline">
                            Ver Termos e Condições
                          </Link>.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => dispatch({ type: "ACK_GATE" })}
                    className={cn(
                      "h-12 flex-1 bg-green-600 text-white hover:bg-green-700",
                      state.acknowledgedGate && "ring-2 ring-green-300",
                    )}
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Entendi, quero uma solução definitiva
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-12 text-muted-foreground"
                    onClick={() => setExited(true)}
                  >
                    Não tenho interesse no momento
                  </Button>
                </div>
              </div>
            )}

            {/* === 4b · UPLOADER (sintoma de tela/display) === */}
            {sym.triage.mediaRequired && sym.triage.mode !== "coleta" && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold">Envie 3 fotos e 1 vídeo curto</h2>
                <p className="text-sm text-muted-foreground">
                  Sem essas mídias não conseguimos diagnosticar à distância — o atendimento será cancelado.
                </p>
                <MediaUploader
                  sessionId={state.sessionId}
                  paths={state.mediaPaths}
                  onAdd={(path) => dispatch({ type: "ADD_MEDIA", path })}
                  onRemove={(path) => dispatch({ type: "REMOVE_MEDIA", path })}
                />
              </div>
            )}

            {/* === 4c · VISITA RÁPIDA (CEP/bairro) === */}
            {sym.triage.mode === "visita" && !sym.triage.mediaRequired && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold">Onde será a visita?</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={state.cep}
                      onChange={(e) => dispatch({ type: "SET_LOCATION", cep: e.target.value, bairro: state.bairro })}
                      placeholder="80000-000"
                      maxLength={9}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={state.bairro}
                      maxLength={120}
                      onChange={(e) => dispatch({ type: "SET_LOCATION", cep: state.cep, bairro: e.target.value })}
                      placeholder="Centro, Batel…"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Visita técnica de 30 min: <strong>R$ 99,99</strong>. Abatido em caso de fechamento.
                </p>
              </div>
            )}
          </section>
        )}

        {!exited && state.step === "contact" && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Seu contato</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  className="h-11"
                  value={state.contact.name}
                  maxLength={200}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "name", value: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp</Label>
                <Input
                  id="phone"
                  className="h-11"
                  inputMode="tel"
                  value={state.contact.phone}
                  maxLength={50}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })}
                  placeholder="(41) 9 9999-9999"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  className="h-11"
                  inputMode="email"
                  value={state.contact.email}
                  maxLength={320}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })}
                />
              </div>
            </div>
          </section>
        )}

        {!exited && state.step === "accept" && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold">Aceite obrigatório</h2>
            <p className="text-sm text-muted-foreground">
              Marque os três itens para liberar o envio. Estes termos ficam registrados no momento do envio.
            </p>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-border p-4 text-sm transition hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <Checkbox
                  className="mt-0.5"
                  checked={state.accepts.bancada}
                  onCheckedChange={(v) =>
                    dispatch({ type: "TOGGLE_ACCEPT", key: "bancada", value: v === true })
                  }
                />
                <span>
                  Estou ciente de que o atendimento presencial possui taxa mínima de{" "}
                  <strong>R$ 99,99 (bancada ou visita técnica com laudo em até 30 min)</strong>{" "}
                  e que coleta/entrega personalizada tem mínimo pré-aprovado de <strong>R$ 299,99</strong>.
                </span>

              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-border p-4 text-sm transition hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <Checkbox
                  className="mt-0.5"
                  checked={state.accepts.visita}
                  onCheckedChange={(v) =>
                    dispatch({ type: "TOGGLE_ACCEPT", key: "visita", value: v === true })
                  }
                />
                <span>
                  Compreendo e aceito os prazos técnicos estipulados para a solução definitiva:{" "}
                  <strong>1 a 3 dias úteis para celulares</strong> e{" "}
                  <strong>15 a 60 dias úteis para TVs, Som ou Placas</strong>.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-border p-4 text-sm transition hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <Checkbox
                  className="mt-0.5"
                  checked={state.accepts.sla}
                  onCheckedChange={(v) =>
                    dispatch({ type: "TOGGLE_ACCEPT", key: "sla", value: v === true })
                  }
                />
                <span>
                  Li e concordo com os{" "}
                  <Link to="/termos-orcamento-pre-aprovado" className="font-semibold underline">
                    Termos e Condições de Serviço e Garantia
                  </Link>.
                </span>
              </label>
            </div>
          </section>
        )}

        {!exited && state.step === "submitting" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Enviando triagem segura…</p>
          </div>
        )}

        {!exited && state.step === "done" && (
          <div className="space-y-3 py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-xl font-bold">Triagem enviada!</h2>
            <p className="text-sm text-muted-foreground">
              Em até 24h um técnico responde no seu WhatsApp com o próximo passo.
            </p>
            {triageWhatsApp && (
              <div className="mx-auto mt-5 max-w-sm space-y-3">
                <Button variant="whatsapp" size="lg" className="w-full" asChild>
                  <a
                    href={triageWhatsApp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa-source="triage"
                    data-service={triageWhatsApp.serviceTag}
                    data-city={triageWhatsApp.city}
                    data-neighborhood={triageWhatsApp.neighborhood}
                    aria-label="Continuar atendimento técnico no WhatsApp com os dados da triagem"
                    onClick={handleWhatsAppContinue}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Continuar no WhatsApp
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  A mensagem já vai preenchida com os dados informados na triagem.
                </p>
              </div>
            )}
          </div>
        )}

        {!exited && state.step === "error" && (
          <div className="space-y-3 py-6 text-center">
            <p className="font-bold text-destructive">Falha ao enviar.</p>
            <p className="text-sm text-muted-foreground">{state.error}</p>
            <Button onClick={() => dispatch({ type: "BACK" })} variant="outline">Voltar</Button>
          </div>
        )}
      </div>

      {/* Footer nav */}
      {!exited && !["submitting", "done", "error"].includes(state.step) && (
        <footer className="border-t border-border px-5 py-3">
          {hint && (
            <p
              role="status"
              aria-live="polite"
              data-testid="triage-hint"
              className="mb-2 text-xs font-medium text-amber-600"
            >
              ⚠ {hint}
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-12"
              onClick={() => dispatch({ type: "BACK" })}
              disabled={state.step === "category"}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>
            {state.step === "accept" ? (
              <Button type="button" size="lg" className="h-12 bg-green-600 text-white hover:bg-green-700" onClick={handleSubmit} disabled={!canAdvance(state)}>
                <Send className="mr-2 h-4 w-4" /> Enviar triagem
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                className="h-12"
                onClick={() => dispatch({ type: "NEXT" })}
                disabled={!canAdvance(state)}
              >
                Avançar <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

export default TriageWizard;
