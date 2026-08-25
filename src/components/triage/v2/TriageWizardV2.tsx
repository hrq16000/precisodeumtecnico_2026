import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Zap, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TriageDebugExport } from "@/components/triage/v2/TriageDebugExport";
import { supabase } from "@/integrations/supabase/client";
import { sendLeadNotification } from "@/lib/lead-notification.functions";
import {
  EQUIPMENTS, PRICING, URGENCY_OPTIONS, TERMS_VERSION,
  routeLabel, getReferenceRangeFor, type EquipmentId,
} from "@/data/triage/config";
import { getQuestionsForEquipment, type Question } from "@/data/triage/questions";
import {
  activeQuestions, buildTriageSummary, buildWhatsAppTriageMessage,
  determineServiceRoute, getFirstIncompleteField, getPricingRules,
  makeInitialStateV2, reducerV2, STEP_ORDER, validateCurrentStep,
  type StepId, type TriageStateV2,
  SCHEDULING_SLOTS,
  formatSchedulingPreference,
} from "@/lib/triage/engine";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { pushLocalAnalyticsEvent } from "@/lib/localAnalytics";
import {
  readGeoPrefill, persistTriageGeo, GEO_PREFILL_LABEL,
  GEO_PREFILL_CONFIDENCE, GEO_CONFIDENCE_LABEL,
} from "@/lib/geoPrefill";
import { persistTriageEvent } from "@/lib/triageEventBuffer";
import { readTriageDraft, saveTriageDraft, clearTriageDraft, mergeTriageDraft } from "@/lib/triage/draft";

import { trackWhatsAppClick } from "@/lib/analytics";
import { logWaEvent } from "@/lib/waAudit";
import { captureTriageQualification } from "@/lib/sentry";

interface Props {
  source?: string;
  onClose?: () => void;
}

const STEP_LABELS: Record<StepId, string> = {
  equipment: "1 · Equipamento",
  deviceDetails: "2 · Identificação",
  symptom: "3 · Problema",
  contextualAnswers: "4 · Detalhes",
  serviceRoute: "5 · Modalidade",
  termsAccepted: "6 · Termos",
  review: "7 · Revisão",
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function TriageWizardV2({ source = "triagem", onClose }: Props) {
  const [state, rawDispatch] = useReducer(reducerV2, undefined, () =>
    mergeTriageDraft(makeInitialStateV2(), readTriageDraft()),
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const transitioningRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const lastStepRef = useRef<StepId | null>(null);
  // Marca triagem concluída para suprimir triage_abandoned no unmount.
  const completedRef = useRef(false);
  // Suprime auto-advance após BACK: só volta a valer quando o usuário
  // realmente altera um campo (dispatch SET_*) no passo atual.
  const suppressAutoAdvanceRef = useRef(false);

  // Wrapper: BACK ativa supressão; qualquer SET_* limpa.
  const dispatch = useCallback((action: Parameters<typeof rawDispatch>[0]) => {
    if (action.type === "BACK") {
      suppressAutoAdvanceRef.current = true;
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      pushLocalAnalyticsEvent({
        event: "triage_back",
        source,
        step_id: lastStepRef.current ?? undefined,
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      persistTriageEvent({
        event: "triage_back",
        source,
        step_id: lastStepRef.current ?? undefined,
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });

    } else if (action.type.startsWith("SET_")) {
      suppressAutoAdvanceRef.current = false;
    }
    rawDispatch(action);
  }, [source]);

  // ---------- efeitos de body[data-triage-open] gerenciados pelo Dialog pai
  // (GlobalTriageLauncher aplica ao abrir/fechar)

  // ---------- analytics de passo
  useEffect(() => {
    // Libera a trava de transição assim que a etapa realmente muda: o timeout
    // de 400ms é apenas fallback e, sob renders mais lentos (StrictMode /
    // dispositivos fracos), poderia engolir o próximo clique do usuário.
    transitioningRef.current = false;
    if (lastStepRef.current === state.currentStep) return;
    lastStepRef.current = state.currentStep;
    const idx = STEP_ORDER.indexOf(state.currentStep);
    pushLocalAnalyticsEvent({
      event: "triage_step",
      source,
      step_id: state.currentStep,
      step_index: idx,
      completion_status: idx === 0 ? "started" : "in_progress",
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, [state.currentStep, source]);


  // ---------- limpeza de timers + evento de abandono no unmount
  useEffect(() => () => {
    if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    if (!completedRef.current) {
      const stepId = lastStepRef.current;
      pushLocalAnalyticsEvent({
        event: "triage_abandoned",
        source,
        step_id: stepId ?? undefined,
        step_index: stepId ? STEP_ORDER.indexOf(stepId) : undefined,
        completion_status: "abandoned",
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
    }
  }, [source]);

  // ---------- prefill geográfico (rota > manual persistido > GPS > IP)
  const geoPrefill = useMemo(() => readGeoPrefill(), []);
  const geoAppliedRef = useRef(false);
  useEffect(() => {
    if (geoAppliedRef.current) return;
    const nb = geoPrefill.neighborhood?.trim();
    const ct = geoPrefill.city?.trim();
    if (!nb && !ct) return;
    if (state.contact.neighborhood.trim() && (state.contact.city ?? "").trim()) return;
    geoAppliedRef.current = true;
    if (nb && !state.contact.neighborhood.trim()) {
      rawDispatch({ type: "SET_CONTACT", field: "neighborhood", value: nb });
    }
    if (ct && !(state.contact.city ?? "").trim()) {
      rawDispatch({ type: "SET_CONTACT", field: "city", value: ct });
    }
    pushLocalAnalyticsEvent({
      event: "triage_geo_prefill",
      source: `${source}:geo-${geoPrefill.source}`,
      city: geoPrefill.city,
      neighborhood: nb,
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, [geoPrefill, state.contact.neighborhood, state.contact.city, source]);

  // ---------- persistência de cidade/bairro entre re-renders e reaberturas
  useEffect(() => {
    persistTriageGeo({ city: state.contact.city, neighborhood: state.contact.neighborhood });
  }, [state.contact.city, state.contact.neighborhood]);

  // ---------- rascunho do funil (sobrevive a recarregamento, TTL de 6h)
  useEffect(() => {
    if (completedRef.current) return;
    saveTriageDraft(state);
  }, [state]);


  // ---------- foco automático no primeiro campo inválido
  useEffect(() => {
    const id = getFirstIncompleteField(state);
    if (!id) return;
    const el = document.getElementById(`triage-field-${id}`);
    if (el && "focus" in el) {
      window.setTimeout(() => (el as HTMLElement).focus({ preventScroll: true }), 30);
    }
  }, [state.currentStep]); // eslint-disable-line react-hooks/exhaustive-deps


  // ---------- helpers de navegação com trava
  const cancelPendingAutoAdvance = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const goNext = useCallback(() => {
    if (transitioningRef.current) return;
    const v = validateCurrentStep(state);
    if (!v.ok) {
      dispatch({ type: "NEXT" }); // aplica erros para exibir
      // rola até primeiro erro
      const firstErr = Object.keys(v.errors)[0];
      const el = firstErr ? document.getElementById(`triage-field-${firstErr}`) : null;
      el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
      (el as HTMLElement | null)?.focus?.();
      return;
    }
    transitioningRef.current = true;
    // Evita corrida: cancela qualquer auto-advance pendente da mesma etapa.
    cancelPendingAutoAdvance();
    // Diferencia avanço MANUAL do auto-advance (ambos disparam NEXT).
    pushLocalAnalyticsEvent({
      event: "triage_step_next",
      source,
      step_id: state.currentStep,
      step_index: STEP_ORDER.indexOf(state.currentStep),
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    dispatch({ type: "NEXT" });
    window.setTimeout(() => { transitioningRef.current = false; }, 400);
  }, [state, source, dispatch, cancelPendingAutoAdvance]);

  const goBack = useCallback(() => {
    if (transitioningRef.current) return;
    cancelPendingAutoAdvance();
    dispatch({ type: "BACK" });
  }, [dispatch, cancelPendingAutoAdvance]);


  // ---------- auto-advance quando etapa fica completa
  const canAdvanceNow = useMemo(() => validateCurrentStep(state).ok, [state]);

  useEffect(() => {
    if (!canAdvanceNow) return;
    if (state.currentStep === "review") return;
    if (suppressAutoAdvanceRef.current) return;
    // steps que NÃO fazem auto-advance (precisam de confirmação do usuário)
    if (["termsAccepted", "serviceRoute"].includes(state.currentStep)) return;
    if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    const delay = prefersReducedMotion() ? 0 : 500;
    advanceTimerRef.current = window.setTimeout(() => {
      if (transitioningRef.current) return;
      if (suppressAutoAdvanceRef.current) return;
      transitioningRef.current = true;
      pushLocalAnalyticsEvent({
        event: "triage_auto_advance",
        source,
        step_id: state.currentStep,
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      persistTriageEvent({
        event: "triage_auto_advance",
        source,
        step_id: state.currentStep,
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });

      advanceTimerRef.current = null;
      rawDispatch({ type: "NEXT" });
      window.setTimeout(() => { transitioningRef.current = false; }, 400);
    }, delay);
    return () => { if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current); };
  }, [canAdvanceNow, state.currentStep, source]);

  // ---------- submit final
  const submitLockRef = useRef(false);
  const handleSubmit = async () => {
    // Trava de duplo clique: só a primeira chamada executa.
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    cancelPendingAutoAdvance();
    setSubmitting(true);
    setSubmitError(null);

    const pricing = getPricingRules(state);
    const summary = buildTriageSummary(state);
    const message = buildWhatsAppTriageMessage(state);
    const modeMap: Record<string, string> = { remoto: "bancada", visita: "visita", coleta: "coleta" };

    try {
      const payload = {
        name: state.contact.name.trim(),
        email: state.contact.email.trim(),
        phone: state.contact.phone.trim(),
        neighborhood: state.contact.neighborhood.trim() || undefined,
        city: state.contact.city?.trim() || undefined,
        category: state.equipment,
        brand: state.deviceDetails.brand || state.deviceDetails.equipment_name,
        model: state.deviceDetails.model,
        symptom: summary.symptom,
        symptom_slug: state.symptom,
        service_mode: pricing ? modeMap[pricing.route] : undefined,
        estimated_ticket_min: pricing?.minimum ?? PRICING.minimumAny,
        estimated_ticket_max: pricing?.minimum ?? PRICING.minimumAny,
        sla_days_min: pricing?.route === "coleta" ? 3 : 0,
        sla_days_max: pricing?.route === "coleta" ? 60 : 7,
        media_urls: [] as string[],
        triage_completed: true,
        terms_accepted: true,
        terms_accepted_at: state.termsAcceptedAt ?? new Date().toISOString(),
        source,
        message,
        triage_payload: {
          sessionId: state.sessionId,
          version: state.version,
          termsVersion: TERMS_VERSION,
          equipment: state.equipment,
          deviceDetails: state.deviceDetails,
          symptom: state.symptom,
          symptomCustom: state.symptomCustom,
          contextualAnswers: state.contextualAnswers,
          urgency: state.urgency,
          serviceRoute: pricing?.route,
          termsAccepted: state.termsAccepted,
          finalNotes: state.finalNotes,
        },
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
        referrer: typeof document !== "undefined" ? document.referrer.slice(0, 1000) : null,
      };

      const { error } = await supabase.from("leads").insert(payload as never);
      if (error) throw error;

      try {
        await supabase.from("terms_acceptances").insert({
          name: payload.name, phone: payload.phone, email: payload.email,
          service: `triagem-v2:${state.equipment}:${pricing?.route ?? "n/a"} [v${TERMS_VERSION}]`,
        } as never);
      } catch { /* não bloqueia */ }

      try {
        await sendLeadNotification({
          data: {
            name: payload.name, email: payload.email, phone: payload.phone,
            service: summary.symptom ?? state.equipment,
            ...(state.contact.neighborhood.trim() ? { city: state.contact.neighborhood.trim() } : {}),
            message,
          },
        });
      } catch { /* não bloqueia */ }

      // Analytics — qualificação curta (nome, bairro, urgência, sintoma)
      completedRef.current = true;
      // Funil concluído: descarta o rascunho para não reabrir com dados antigos.
      clearTriageDraft();
      const pageUrl = typeof window !== "undefined" ? window.location.href : undefined;
      const qualification = {
        lead_name: state.contact.name.trim().split(" ")[0],
        neighborhood: state.contact.neighborhood.trim(),
        city: state.contact.city?.trim() || undefined,
        urgency: state.urgency,
        priority: summary.priority ? "1" : "0",
        scheduling_preference: schedulingPreference,
        symptom_slug: state.symptom,
        symptom_label: summary.symptom,
        category: state.equipment,
        service_route: pricing?.route,
        page_url: pageUrl,
      };
      pushLocalAnalyticsEvent({
        event: "triage_qualification",
        source,
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        ...qualification,
      });
      persistTriageEvent({
        event: "triage_qualification",
        source,
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        ...qualification,
      });
      captureTriageQualification({
        firstName: qualification.lead_name,
        neighborhood: qualification.neighborhood,
        urgency: state.urgency,
        symptom: state.symptom,
        category: state.equipment,
        route: pricing?.route,
        pageUrl,
      });
      pushLocalAnalyticsEvent({
        event: "triage_complete",
        source,
        completion_status: "completed",
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      // Drena o buffer persistente — acumulava BACK / auto-advance /
      // intercept desde a abertura; agora expõe em
      // window.__PDT_TRIAGE_BUFFER_FLUSHED__.
      try {
        const { flushTriageEventBuffer } = await import("@/lib/triageEventBuffer");
        flushTriageEventBuffer();
      } catch { /* noop */ }

      trackWhatsAppClick({
        source: "triage",
        service: state.equipment ?? "triagem",
        source_component: "triage_wizard_v2",
        cta_label: "Agendar agora",
      });
      void logWaEvent({ source: "triage-v2", href: null, kind: "whatsapp", category: state.equipment ?? null, bypass: true, sessionId: state.sessionId });

      // Abre WhatsApp — o mesmo deep-link é reaproveitado no fallback de
      // popup bloqueado (mensagem idêntica, sem regenerar contexto).
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      let win: Window | null = null;
      try {
        win = typeof window !== "undefined" ? window.open(url, "_blank", "noopener,noreferrer") : null;
      } catch {
        win = null;
      }
      // `win.closed === true` logo após open() indica bloqueio silencioso
      // (Safari/iOS e extensões de bloqueio de popup).
      const blocked = !win || win.closed;
      if (blocked) {
        setCopyFallback(message);
        pushLocalAnalyticsEvent({
          event: "triage_popup_blocked",
          source,
          surface: "wa_fallback",
          page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
          service: state.equipment ?? undefined,
        });
        persistTriageEvent({
          event: "triage_popup_blocked",
          source,
          surface: "wa_fallback",
          page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        });
      }

    } catch (e) {
      setSubmitError((e as Error).message || "Falha ao registrar. Tente novamente.");
    } finally {
      setSubmitting(false);
      submitLockRef.current = false;
    }

  };

  // ---------- render por etapa
  const eqOpt = state.equipment ? EQUIPMENTS.find((e) => e.id === state.equipment) : undefined;
  const questionnaire = state.equipment ? getQuestionsForEquipment(state.equipment) : undefined;
  const stepIdx = STEP_ORDER.indexOf(state.currentStep);
  const progressPct = Math.round(((stepIdx + 1) / STEP_ORDER.length) * 100);
  const errors = state.validationErrors;

  const renderField = (q: Question, value: string, onChange: (v: string) => void) => {
    const fieldId = `triage-field-${q.id}`;
    const errorMsg = errors[q.id];
    const baseClass = "space-y-1.5";
    if (q.type === "single" && q.options) {
      return (
        <div key={q.id} className={baseClass}>
          <Label className="text-sm font-medium">
            {q.label} {q.required && <span aria-hidden className="text-destructive">*</span>}
          </Label>
          <div id={fieldId} role="radiogroup" aria-label={q.label} className="grid gap-2 sm:grid-cols-2">
            {q.options.map((opt) => {
              const selected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(opt.value)}
                  className={cn(
                    "min-h-[44px] rounded-lg border-2 px-3 py-2.5 text-left text-sm transition",
                    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                    selected ? "border-primary bg-primary/5 shadow-xs" : "border-border hover:border-primary/40",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {errorMsg && <p role="alert" className="text-xs text-destructive">{errorMsg}</p>}
        </div>
      );
    }
    if (q.type === "textarea") {
      return (
        <div key={q.id} className={baseClass}>
          <Label htmlFor={fieldId}>
            {q.label} {q.required && <span aria-hidden className="text-destructive">*</span>}
          </Label>
          <Textarea
            id={fieldId}
            value={value}
            maxLength={2000}
            placeholder={q.placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!errorMsg}
          />
          {errorMsg && <p role="alert" className="text-xs text-destructive">{errorMsg}</p>}
        </div>
      );
    }
    return (
      <div key={q.id} className={baseClass}>
        <Label htmlFor={fieldId}>
          {q.label} {q.required && <span aria-hidden className="text-destructive">*</span>}
        </Label>
        <Input
          id={fieldId}
          value={value}
          maxLength={120}
          placeholder={q.placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!errorMsg}
        />
        {errorMsg && <p role="alert" className="text-xs text-destructive">{errorMsg}</p>}
      </div>
    );
  };

  const summary = buildTriageSummary(state);
  const pricing = getPricingRules(state);
  const schedulingPreference = formatSchedulingPreference(state);

  return (
    <div className="mx-auto flex h-full max-h-[100dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-none bg-card sm:h-auto sm:max-h-[92dvh] sm:rounded-2xl sm:border sm:border-border sm:shadow-xl">
      {/* HEADER fixo */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Zap className="h-4 w-4 text-primary" aria-hidden />
          <span>Triagem técnica</span>
          <span className="hidden rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground sm:inline">
            {STEP_LABELS[state.currentStep]}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Fechar triagem"
            className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </header>

      {/* Progress */}
      <div className="h-1 w-full bg-muted" aria-hidden>
        <div
          className={cn("h-full bg-primary transition-[width]", canAdvanceNow && "animate-pulse")}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="sr-only" aria-live="polite">Etapa {stepIdx + 1} de {STEP_ORDER.length}: {STEP_LABELS[state.currentStep]}</div>

      {/* BODY scrollable */}
      <div ref={scrollAnchorRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {/* STEP 1: EQUIPAMENTO */}
        {state.currentStep === "equipment" && (
          <section className="space-y-3">
            <h2 className="text-base font-bold">Qual é o equipamento?</h2>
            <p className="text-xs text-muted-foreground">Selecione uma opção para começar.</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EQUIPMENTS.map((e) => {
                const selected = state.equipment === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => dispatch({ type: "SET_EQUIPMENT", value: e.id })}
                    className={cn(
                      "min-h-[76px] rounded-xl border-2 p-3 text-left transition active:scale-[0.98]",
                      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                      selected ? "border-primary bg-primary/5 shadow-xs" : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className="text-xl leading-none" aria-hidden>{e.emoji}</div>
                    <div className="mt-1.5 text-sm font-semibold">{e.label}</div>
                  </button>
                );
              })}
            </div>
            {errors.equipment && <p role="alert" className="text-xs text-destructive">{errors.equipment}</p>}
          </section>
        )}

        {/* STEP 2: DEVICE DETAILS */}
        {state.currentStep === "deviceDetails" && questionnaire && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Identificação — {eqOpt?.label}</h2>
            {questionnaire.device.map((q) =>
              renderField(q, state.deviceDetails[q.id] ?? "", (v) => dispatch({ type: "SET_DEVICE_FIELD", id: q.id, value: v })),
            )}
          </section>
        )}

        {/* STEP 3: SYMPTOM */}
        {state.currentStep === "symptom" && questionnaire && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">O que aconteceu?</h2>
            {questionnaire.symptom
              .filter((q) => !q.when || q.when({ ...state.deviceDetails, symptom: state.symptom ?? "" }))
              .map((q) => {
                if (q.isSymptom) {
                  return renderField(q, state.symptom ?? "", (v) => {
                    const label = q.options?.find((o) => o.value === v)?.label;
                    dispatch({ type: "SET_SYMPTOM", value: v, label });
                  });
                }
                return renderField(q, state.symptomCustom ?? "", (v) =>
                  dispatch({ type: "SET_SYMPTOM", value: state.symptom ?? "", custom: v }),
                );
              })}
          </section>
        )}

        {/* STEP 4: CONTEXTUAL */}
        {state.currentStep === "contextualAnswers" && questionnaire && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Mais alguns detalhes</h2>
            {activeQuestions(questionnaire.contextual, { ...state.deviceDetails, ...state.contextualAnswers, symptom: state.symptom ?? "" }).map((q) =>
              renderField(q, state.contextualAnswers[q.id] ?? "", (v) => dispatch({ type: "SET_CONTEXTUAL", id: q.id, value: v })),
            )}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Urgência <span aria-hidden className="text-destructive">*</span></Label>
              <div id="triage-field-urgency" role="radiogroup" aria-label="Urgência" className="grid gap-2">
                {URGENCY_OPTIONS.map((u) => {
                  const selected = state.urgency === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => dispatch({ type: "SET_URGENCY", value: u.id })}
                      className={cn(
                        "min-h-[44px] rounded-lg border-2 px-3 py-2.5 text-left text-sm transition",
                        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                        selected ? "border-primary bg-primary/5 shadow-xs" : "border-border hover:border-primary/40",
                      )}
                    >
                      {u.label}
                    </button>
                  );
                })}
              </div>
              {errors.urgency && <p role="alert" className="text-xs text-destructive">{errors.urgency}</p>}
            </div>
          </section>
        )}

        {/* STEP 5: SERVICE ROUTE */}
        {state.currentStep === "serviceRoute" && pricing && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Modalidade indicada: {pricing.routeLabel}</h2>
            <p className="text-sm leading-relaxed text-foreground">{pricing.explanation}</p>
            <ul className="space-y-1.5 rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <li><strong>Valor mínimo:</strong> R$ {pricing.minimum.toFixed(2).replace(".", ",")}</li>
              <li><strong>Prazo:</strong> {pricing.slaText}</li>
              {pricing.route === "visita" && (
                <li className="text-xs text-muted-foreground">
                  R$ {PRICING.visitaFee.toFixed(2).replace(".", ",")} por até {PRICING.visitaWindowMinutes} minutos.
                  Cada novo período de até {PRICING.visitaWindowMinutes} minutos pode gerar nova cobrança de
                  R$ {PRICING.visitaFee.toFixed(2).replace(".", ",")}, limitado a 4 blocos (2 horas).
                  A visita não garante reparo; peças não inclusas.
                </li>
              )}
              {pricing.route === "coleta" && (
                <li className="text-xs text-muted-foreground">
                  Até R$ {PRICING.coletaAutoApprovedCap},00 o procedimento compatível pode ser executado sem nova autorização;
                  acima disso, aguardamos sua aprovação. Peças não inclusas.
                </li>
              )}
            </ul>
            {errors.serviceRoute && <p role="alert" className="text-xs text-destructive">{errors.serviceRoute}</p>}
          </section>
        )}

        {/* STEP 6: TERMOS */}
        {state.currentStep === "termsAccepted" && pricing && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Ciência e aceite</h2>
            <p className="text-sm leading-relaxed">
              Esta triagem é obrigatória e registra sua ciência sobre a modalidade indicada,
              os valores mínimos, os prazos e as condições do atendimento. O WhatsApp será aberto
              somente para agendar o atendimento indicado.
            </p>

            <label htmlFor="triage-field-minimum" className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Checkbox
                id="triage-field-minimum"
                checked={!!state.termsAccepted.minimum}
                onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "minimum", value: !!v })}
              />
              <span className="text-sm">
                Estou ciente de que o valor mínimo desta modalidade é
                <strong> R$ {pricing.minimum.toFixed(2).replace(".", ",")}</strong>, com peças não inclusas.
              </span>
            </label>
            {errors.minimum && <p role="alert" className="text-xs text-destructive">{errors.minimum}</p>}

            {pricing.route === "coleta" && (
              <>
                <label htmlFor="triage-field-cancel" className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    id="triage-field-cancel"
                    checked={!!state.termsAccepted.cancel}
                    onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "cancel", value: !!v })}
                  />
                  <span className="text-sm">
                    Estou ciente de que, em caso de cancelamento, desistência ou não aprovação do orçamento,
                    será cobrado <strong>R$ {PRICING.cancelDiagnosticFee.toFixed(2).replace(".", ",")}</strong> pelo diagnóstico,
                    análise e permanência do equipamento na fila técnica.
                  </span>
                </label>
                {errors.cancel && <p role="alert" className="text-xs text-destructive">{errors.cancel}</p>}

                <label htmlFor="triage-field-sla" className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    id="triage-field-sla"
                    checked={!!state.termsAccepted.sla}
                    onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "sla", value: !!v })}
                  />
                  <span className="text-sm">
                    Estou ciente de que o prazo estimado é de 3 a 60 dias úteis e pode ser maior
                    em caso de encomenda ou indisponibilidade de peças.
                  </span>
                </label>
                {errors.sla && <p role="alert" className="text-xs text-destructive">{errors.sla}</p>}
              </>
            )}

            {pricing.route === "visita" && (
              <>
                <label htmlFor="triage-field-visit" className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    id="triage-field-visit"
                    checked={!!state.termsAccepted.visit}
                    onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "visit", value: !!v })}
                  />
                  <span className="text-sm">
                    Estou ciente de que a visita técnica para PC/Notebook custa <strong>R$ 99,99</strong> por
                    até 30 minutos, e que cada novo período de até 30 minutos pode gerar nova cobrança de R$ 99,99,
                    limitado a 4 blocos (2 horas). A visita não garante o reparo e peças não estão inclusas.
                    Se for identificada necessidade de bancada, o atendimento será convertido em coleta e entrega.
                  </span>
                </label>
                {errors.visit && <p role="alert" className="text-xs text-destructive">{errors.visit}</p>}
              </>
            )}

            {pricing.route === "remoto" && (
              <>
                <label htmlFor="triage-field-remote" className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    id="triage-field-remote"
                    checked={!!state.termsAccepted.remote}
                    onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "remote", value: !!v })}
                  />
                  <span className="text-sm">
                    Estou ciente de que o atendimento remoto será realizado em horário combinado no WhatsApp,
                    depende de acesso à internet e de o computador estar em condições de operar.
                  </span>
                </label>
                {errors.remote && <p role="alert" className="text-xs text-destructive">{errors.remote}</p>}
              </>
            )}

            <p className="text-xs text-muted-foreground">
              Registro de ciência e aceite eletrônico · versão {TERMS_VERSION}
            </p>
          </section>
        )}

        {/* STEP 7: REVIEW + CONTACT */}
        {state.currentStep === "review" && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Revisar e agendar</h2>

            {summary.priority && (
              <p
                data-testid="triage-priority-badge"
                className="inline-flex items-center gap-2 rounded-full border-2 border-destructive/40 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
              >
                Prioridade · urgência informada em até 3 dias úteis
              </p>
            )}


            <dl className="space-y-1.5 rounded-lg border border-border bg-muted/30 p-3 text-sm">
              {summary.equipment && <div><dt className="inline font-medium">Equipamento: </dt><dd className="inline">{summary.equipment}</dd></div>}
              {summary.brandModel && <div><dt className="inline font-medium">Marca/modelo: </dt><dd className="inline">{summary.brandModel}</dd></div>}
              {summary.age && <div><dt className="inline font-medium">Idade: </dt><dd className="inline">{summary.age}</dd></div>}
              {summary.symptom && <div><dt className="inline font-medium">Problema: </dt><dd className="inline">{summary.symptom}</dd></div>}
              {summary.contextual.map((c) => (
                <div key={c.label}><dt className="inline font-medium">{c.label}: </dt><dd className="inline">{c.value}</dd></div>
              ))}
              {summary.urgency && <div><dt className="inline font-medium">Urgência: </dt><dd className="inline">{summary.urgency}</dd></div>}
              {summary.route && <div><dt className="inline font-medium">Modalidade: </dt><dd className="inline">{summary.route}</dd></div>}
              {summary.minimum && <div><dt className="inline font-medium">Valor mínimo: </dt><dd className="inline">{summary.minimum}</dd></div>}
              {summary.sla && <div><dt className="inline font-medium">Prazo: </dt><dd className="inline">{summary.sla}</dd></div>}
            </dl>

            {(() => {
              const ref = getReferenceRangeFor(state.equipment, state.symptom);
              if (!ref) return null;
              return (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Referência aproximada, não vinculante</p>
                  <p>{ref.label}: aproximadamente R$ {ref.from.toLocaleString("pt-BR")} a R$ {ref.to.toLocaleString("pt-BR")}.</p>
                  {ref.note && <p>{ref.note}</p>}
                  <p className="mt-1">Valores finais só são definidos após avaliação técnica.</p>
                </div>
              );
            })()}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="triage-field-name">Nome</Label>
                <Input id="triage-field-name" value={state.contact.name} maxLength={120}
                  aria-describedby="triage-hint-name"
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "name", value: e.target.value })}
                  aria-invalid={!!errors.name} placeholder="Ex.: Ana Paula Ribeiro" />
                <p id="triage-hint-name" className="text-xs text-muted-foreground mt-1">
                  Nome e sobrenome, só letras. Ex.: “Ana Paula Ribeiro”.
                </p>
                {errors.name && <p role="alert" className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="triage-field-phone">WhatsApp (com DDD)</Label>
                <Input id="triage-field-phone" value={state.contact.phone} inputMode="tel" maxLength={20}
                  aria-describedby="triage-hint-phone"
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })}
                  aria-invalid={!!errors.phone} placeholder="(41) 99999-0000" />
                <p id="triage-hint-phone" className="text-xs text-muted-foreground mt-1">
                  Formato (DD) 9XXXX-XXXX, 10 ou 11 dígitos. Ex.: “(41) 99999-0000”.
                </p>
                {errors.phone && <p role="alert" className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="triage-field-city">Cidade do atendimento</Label>
                <Input id="triage-field-city" value={state.contact.city ?? ""} maxLength={120}
                  aria-describedby="triage-hint-city"
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "city", value: e.target.value })}
                  placeholder="Ex.: Curitiba, São José dos Pinhais, Pinhais" />
                <p id="triage-hint-city" className="text-xs text-muted-foreground mt-1">
                  Só o nome da cidade, sem estado nem sigla. Ex.: “Curitiba”, “São José dos Pinhais”.
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="triage-field-neighborhood">Bairro do atendimento</Label>
                <Input id="triage-field-neighborhood" value={state.contact.neighborhood} maxLength={120}
                  aria-describedby="triage-hint-neighborhood"
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "neighborhood", value: e.target.value })}
                  aria-invalid={!!errors.neighborhood} placeholder="Ex.: Centro, Boqueirão, Portão" />
                <p id="triage-hint-neighborhood" className="text-xs text-muted-foreground mt-1">
                  Nome do bairro, sem rua ou número. Ex.: “Centro”, “Boqueirão”, “Portão”.
                </p>
                {errors.neighborhood && <p role="alert" className="text-xs text-destructive">{errors.neighborhood}</p>}
                {!errors.neighborhood && geoAppliedRef.current && geoPrefill.source !== "none" && (
                  <p data-testid="triage-geo-hint" className="text-xs text-muted-foreground mt-1">
                    {GEO_PREFILL_LABEL[geoPrefill.source]} — edite se precisar.
                  </p>
                )}
                {geoPrefill.source !== "none" && (
                  <p
                    data-testid="triage-geo-confidence"
                    data-confidence={GEO_PREFILL_CONFIDENCE[geoPrefill.source]}
                    className="mt-1 inline-flex items-center rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {GEO_CONFIDENCE_LABEL[GEO_PREFILL_CONFIDENCE[geoPrefill.source]]}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="triage-field-email">E-mail</Label>
                <Input id="triage-field-email" value={state.contact.email} type="email" maxLength={200}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })}
                  aria-invalid={!!errors.email} />
                {errors.email && <p role="alert" className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Preferência de agendamento (opcional) */}
              <div>
                <Label htmlFor="triage-field-preferred-date">Data preferida (opcional)</Label>
                <Input
                  id="triage-field-preferred-date"
                  type="date"
                  value={state.scheduling?.preferredDate ?? ""}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => dispatch({ type: "SET_SCHEDULING", field: "preferredDate", value: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Período preferido (opcional)</Label>
                <div role="radiogroup" aria-label="Período preferido" className="mt-1 grid gap-2">
                  {SCHEDULING_SLOTS.map((slot) => {
                    const selected = state.scheduling?.preferredSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() =>
                          dispatch({
                            type: "SET_SCHEDULING",
                            field: "preferredSlot",
                            value: selected ? "" : slot.id,
                          })
                        }
                        className={cn(
                          "min-h-[44px] rounded-lg border-2 px-3 py-2 text-left text-sm transition",
                          "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                          selected ? "border-primary bg-primary/5 shadow-xs" : "border-border hover:border-primary/40",
                        )}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="triage-final-notes">Observação adicional (opcional)</Label>
                <Textarea id="triage-final-notes" value={state.finalNotes ?? ""} maxLength={1000}
                  onChange={(e) => dispatch({ type: "SET_FINAL_NOTES", value: e.target.value })} />
              </div>
            </div>

            {schedulingPreference && (
              <p data-testid="triage-scheduling-confirm" className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                Vamos confirmar no WhatsApp a preferência <strong className="text-foreground">{schedulingPreference}</strong>.
                Se precisar mudar, responda <strong className="text-foreground">REAGENDAR</strong> na conversa que enviamos outras opções.
              </p>
            )}

            {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}

            {copyFallback && (
              <div data-testid="triage-wa-fallback" role="alert" className="space-y-2 rounded-lg border border-amber-500 bg-amber-50 p-3 text-sm text-amber-900">
                <p>Não foi possível abrir o WhatsApp automaticamente. Copie a mensagem e envie:</p>
                <pre data-testid="triage-wa-fallback-message" className="max-h-40 overflow-auto whitespace-pre-wrap rounded-sm bg-white p-2 text-xs">{copyFallback}</pre>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-testid="triage-wa-fallback-copy"
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(copyFallback); setCopied(true); } catch { /* noop */ }
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" /> {copied ? "Copiado!" : "Copiar mensagem"}
                </Button>
                <a
                  data-wa-source="triage-wa-fallback"
                  data-service="assistência técnica"
                  aria-label="Abrir conversa no WhatsApp com o resumo da triagem"
                  data-testid="triage-wa-fallback-link"
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copyFallback)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="ml-2 text-sm font-semibold text-primary underline"
                >
                  Abrir WhatsApp
                </a>

              </div>
            )}
          </section>
        )}
      </div>

      <TriageDebugExport />

      {/* FOOTER fixo */}
      <footer className="sticky bottom-0 z-10 flex items-center justify-between gap-2 border-t border-border bg-card px-4 py-3">
        <Button variant="ghost" onClick={goBack} disabled={stepIdx === 0 || submitting} aria-label="Voltar">
          <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>
        <div className="text-xs text-muted-foreground">
          Etapa {stepIdx + 1}/{STEP_ORDER.length}
        </div>
        {state.currentStep === "review" ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || !canAdvanceNow}
            className="min-w-[160px]"
          >
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando…</> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Agendar agora</>}
          </Button>
        ) : (
          <Button onClick={goNext} disabled={submitting} aria-label="Próxima etapa">
            Continuar <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </footer>
    </div>
  );
}
