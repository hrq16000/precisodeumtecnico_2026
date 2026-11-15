import { SYMPTOMS, type Symptom, type ServiceMode } from "@/data/symptoms";

// ---------------------------------------------------------------------------
// Triagem — Finite State Machine (FSM) leve via useReducer.
// ---------------------------------------------------------------------------

export type Category = "tv" | "celular" | "console" | "notebook" | "pc" | "som";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "tv", label: "TV", emoji: "📺" },
  { value: "celular", label: "Celular", emoji: "📱" },
  { value: "console", label: "Console (PS/Xbox/Switch)", emoji: "🎮" },
  { value: "notebook", label: "Notebook", emoji: "💻" },
  { value: "pc", label: "PC / Desktop", emoji: "🖥️" },
  { value: "som", label: "Som / Áudio", emoji: "🔊" },
];

export type Step =
  | "category"
  | "device"
  | "symptom"
  | "branch"      // bifurcação crítica (gate/upload/cep)
  | "contact"
  | "accept"
  | "submitting"
  | "done"
  | "error";

export interface TriageState {
  step: Step;
  sessionId: string;
  category?: Category;
  brand: string;
  model: string;
  symptomSlug?: string;
  symptomCustom?: string;
  cep: string;
  bairro: string;
  mediaPaths: string[];           // chaves no bucket triage-media
  contact: { name: string; phone: string; email: string };
  accepts: { bancada: boolean; visita: boolean; sla: boolean };
  acknowledgedGate: boolean;       // confirmação do step de coleta
  error?: string;
}

export type Action =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SET_CATEGORY"; value: Category }
  | { type: "SET_DEVICE"; brand: string; model: string }
  | { type: "SET_SYMPTOM"; slug: string; custom?: string }
  | { type: "SET_LOCATION"; cep: string; bairro: string }
  | { type: "ACK_GATE" }
  | { type: "ADD_MEDIA"; path: string }
  | { type: "REMOVE_MEDIA"; path: string }
  | { type: "SET_CONTACT"; field: keyof TriageState["contact"]; value: string }
  | { type: "TOGGLE_ACCEPT"; key: keyof TriageState["accepts"]; value: boolean }
  | { type: "START_SUBMIT" }
  | { type: "SUBMIT_OK" }
  | { type: "SUBMIT_ERR"; message: string }
  | { type: "RESET" };

export function makeInitialState(): TriageState {
  // sessionId = pasta dentro do bucket privado triage-media.
  // Gerado no cliente; a policy de storage exige 8..64 chars.
  const sessionId =
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36)
    ).replace(/-/g, "");
  return {
    step: "category",
    sessionId,
    brand: "",
    model: "",
    cep: "",
    bairro: "",
    mediaPaths: [],
    contact: { name: "", phone: "", email: "" },
    accepts: { bancada: false, visita: false, sla: false },
    acknowledgedGate: false,
  };
}

export function getSymptom(state: TriageState): Symptom | undefined {
  if (!state.symptomSlug) return undefined;
  return SYMPTOMS.find((s) => s.slug === state.symptomSlug);
}

/** Próximo passo dado o sintoma corrente. Lógica de bifurcação centralizada. */
export function nextOf(step: Step, state: TriageState): Step {
  const symptom = getSymptom(state);
  switch (step) {
    case "category":
      return "device";
    case "device":
      return "symptom";
    case "symptom":
      // Há sempre uma etapa de "branch" antes do contato:
      //  - coleta → gate (R$300–500 + SLA)
      //  - bancada/visita com mídia obrigatória → uploader
      //  - visita rápida → CEP/bairro
      //  - bancada simples sem mídia → pula direto pro contato
      if (!symptom) return "contact";
      if (symptom.triage.mode === "coleta") return "branch";
      if (symptom.triage.mediaRequired) return "branch";
      if (symptom.triage.mode === "visita") return "branch";
      return "contact";
    case "branch":
      return "contact";
    case "contact":
      return "accept";
    case "accept":
      return "submitting";
    case "submitting":
      return "done";
    default:
      return step;
  }
}

export function prevOf(step: Step): Step {
  switch (step) {
    case "device": return "category";
    case "symptom": return "device";
    case "branch": return "symptom";
    case "contact": return "branch";
    case "accept": return "contact";
    default: return step;
  }
}

export function canAdvance(state: TriageState): boolean {
  const sym = getSymptom(state);
  switch (state.step) {
    case "category":
      return !!state.category;
    case "device":
      return state.brand.trim().length >= 2 && state.model.trim().length >= 1;
    case "symptom":
      return !!state.symptomSlug || (state.symptomCustom?.trim().length ?? 0) >= 5;
    case "branch": {
      if (!sym) return true;
      if (sym.triage.mode === "coleta") return state.acknowledgedGate;
      if (sym.triage.mediaRequired) {
        // exige pelo menos 3 fotos + 1 vídeo (heurística pelo path)
        const photos = state.mediaPaths.filter((p) => /\.(jpe?g|png|webp|heic)$/i.test(p)).length;
        const videos = state.mediaPaths.filter((p) => /\.(mp4|mov|webm|m4v)$/i.test(p)).length;
        return photos >= 3 && videos >= 1;
      }
      if (sym.triage.mode === "visita") {
        return state.cep.replace(/\D/g, "").length >= 8 && state.bairro.trim().length >= 2;
      }
      return true;
    }
    case "contact": {
      const c = state.contact;
      const phoneDigits = c.phone.replace(/\D/g, "");
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email);
      return c.name.trim().length >= 2 && phoneDigits.length >= 10 && emailOk;
    }
    case "accept":
      return state.accepts.bancada && state.accepts.visita && state.accepts.sla;
    default:
      return false;
  }
}

/** Retorna o motivo específico pelo qual o passo atual não pode avançar (para UX). */
export function advanceHint(state: TriageState): string | null {
  const sym = getSymptom(state);
  switch (state.step) {
    case "category":
      return state.category ? null : "Selecione a categoria do aparelho.";
    case "device":
      if (state.brand.trim().length < 2) return "Informe a marca (mín. 2 letras).";
      if (state.model.trim().length < 1) return "Informe o modelo.";
      return null;
    case "symptom":
      if (!state.symptomSlug && (state.symptomCustom?.trim().length ?? 0) < 5) {
        return "Escolha um sintoma da lista ou descreva com pelo menos 5 caracteres.";
      }
      return null;
    case "branch": {
      if (!sym) return null;
      if (sym.triage.mode === "coleta" && !state.acknowledgedGate)
        return "Confirme o gate: clique em 'Entendi, quero uma solução definitiva'.";
      if (sym.triage.mediaRequired) {
        const photos = state.mediaPaths.filter((p) => /\.(jpe?g|png|webp|heic)$/i.test(p)).length;
        const videos = state.mediaPaths.filter((p) => /\.(mp4|mov|webm|m4v)$/i.test(p)).length;
        if (photos < 3) return `Envie mais ${3 - photos} foto(s) do defeito.`;
        if (videos < 1) return "Envie 1 vídeo curto mostrando o defeito.";
      }
      if (sym.triage.mode === "visita") {
        if (state.cep.replace(/\D/g, "").length < 8) return "Informe um CEP válido (8 dígitos).";
        if (state.bairro.trim().length < 2) return "Informe o bairro.";
      }
      return null;
    }
    case "contact": {
      const c = state.contact;
      if (c.name.trim().length < 2) return "Informe seu nome completo.";
      const phoneDigits = c.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10) return "Informe um WhatsApp válido com DDD.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) return "Informe um e-mail válido.";
      return null;
    }
    case "accept":
      if (!state.accepts.bancada) return "Confirme ciência das condições da modalidade.";
      if (!state.accepts.visita) return "Confirme ciência dos prazos técnicos.";
      if (!state.accepts.sla) return "Confirme leitura dos Termos e Condições.";
      return null;
    default:
      return null;
  }
}


export function reducer(state: TriageState, action: Action): TriageState {
  switch (action.type) {
    case "NEXT":
      if (!canAdvance(state)) return state;
      return { ...state, step: nextOf(state.step, state) };
    case "BACK":
      return { ...state, step: prevOf(state.step), error: undefined };
    case "SET_CATEGORY":
      return { ...state, category: action.value };
    case "SET_DEVICE":
      return { ...state, brand: action.brand, model: action.model };
    case "SET_SYMPTOM":
      return { ...state, symptomSlug: action.slug, symptomCustom: action.custom };
    case "SET_LOCATION":
      return { ...state, cep: action.cep, bairro: action.bairro };
    case "ACK_GATE":
      return { ...state, acknowledgedGate: true };
    case "ADD_MEDIA":
      return { ...state, mediaPaths: [...state.mediaPaths, action.path] };
    case "REMOVE_MEDIA":
      return { ...state, mediaPaths: state.mediaPaths.filter((p) => p !== action.path) };
    case "SET_CONTACT":
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };
    case "TOGGLE_ACCEPT":
      return { ...state, accepts: { ...state.accepts, [action.key]: action.value } };
    case "START_SUBMIT":
      return { ...state, step: "submitting", error: undefined };
    case "SUBMIT_OK":
      return { ...state, step: "done" };
    case "SUBMIT_ERR":
      return { ...state, step: "error", error: action.message };
    case "RESET":
      return makeInitialState();
    default:
      return state;
  }
}

/**
 * Monta o payload final que vai para a tabela `leads`. Mantém
 * compatibilidade com as colunas adicionadas na migration da Fase A.
 */
export interface TriagePayload {
  name: string;
  email: string;
  phone: string;
  city?: string;
  neighborhood?: string;
  category?: string;
  brand?: string;
  model?: string;
  symptom?: string;
  symptom_slug?: string;
  service_mode?: ServiceMode;
  estimated_ticket_min?: number;
  estimated_ticket_max?: number;
  sla_days_min?: number;
  sla_days_max?: number;
  media_urls: string[];
  triage_payload: Record<string, unknown>;
  triage_completed: boolean;
  terms_accepted: boolean;
  terms_accepted_at: string;
  source: string;
  message?: string;
}

export function buildPayload(state: TriageState, source: string): TriagePayload {
  const sym = getSymptom(state);
  const now = new Date().toISOString();
  return {
    name: state.contact.name.trim(),
    email: state.contact.email.trim(),
    phone: state.contact.phone.trim(),
    city: undefined,
    neighborhood: state.bairro || undefined,
    category: state.category,
    brand: state.brand || undefined,
    model: state.model || undefined,
    symptom: sym?.label ?? state.symptomCustom,
    symptom_slug: sym?.slug,
    service_mode: sym?.triage.mode,
    estimated_ticket_min: sym?.triage.ticketMin,
    estimated_ticket_max: sym?.triage.ticketMax,
    sla_days_min: sym?.triage.slaMinDays,
    sla_days_max: sym?.triage.slaMaxDays,
    media_urls: state.mediaPaths,
    triage_completed: true,
    terms_accepted: true,
    terms_accepted_at: now,
    source,
    message: state.symptomCustom,
    triage_payload: {
      sessionId: state.sessionId,
      category: state.category,
      brand: state.brand,
      model: state.model,
      symptomSlug: state.symptomSlug,
      symptomCustom: state.symptomCustom,
      cep: state.cep,
      bairro: state.bairro,
      mediaPaths: state.mediaPaths,
      accepts: state.accepts,
      acknowledgedGate: state.acknowledgedGate,
    },
  };
}
