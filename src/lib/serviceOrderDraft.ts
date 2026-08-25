/**
 * Abertura de Ordem de Serviço: geração de código único, persistência local
 * do rascunho e síntese da mensagem de WhatsApp.
 */
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";

export type OsMode = "visita" | "coleta";

export interface OsDraft {
  protocol: string;
  name: string;
  equipment: string;
  brandModel: string;
  problem: string;
  mode: OsMode;
  city: string;
  neighborhood: string;
  reference: string;
  preferredWindow: string;
  acceptedTerms: boolean;
  createdAt: string;
}

export const OS_DRAFT_KEY = "pdt_os_open_draft_v1";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Código único rastreável no formato OS-AAAA-XXXXXX. */
export function generateOsProtocol(now = new Date()): string {
  let suffix = "";
  const bytes = new Uint8Array(6);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];
  return `OS-${now.getFullYear()}-${suffix}`;
}

export function emptyDraft(): OsDraft {
  return {
    protocol: "",
    name: "",
    equipment: "",
    brandModel: "",
    problem: "",
    mode: "visita",
    city: "",
    neighborhood: "",
    reference: "",
    preferredWindow: "",
    acceptedTerms: false,
    createdAt: "",
  };
}

export function saveOsDraft(draft: OsDraft): void {
  try {
    localStorage.setItem(OS_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* noop */
  }
}

export function readOsDraft(): OsDraft | null {
  try {
    const raw = localStorage.getItem(OS_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OsDraft>;
    return { ...emptyDraft(), ...parsed };
  } catch {
    return null;
  }
}

export function clearOsDraft(): void {
  try {
    localStorage.removeItem(OS_DRAFT_KEY);
  } catch {
    /* noop */
  }
}

export interface OsFieldError {
  field: keyof OsDraft;
  label: string;
}

export function validateDraft(d: OsDraft): OsFieldError[] {
  const errors: OsFieldError[] = [];
  if (d.name.trim().length < 2) errors.push({ field: "name", label: "Nome (mín. 2 caracteres)" });
  if (d.equipment.trim().length < 2) errors.push({ field: "equipment", label: "Equipamento" });
  if (d.problem.trim().length < 5) errors.push({ field: "problem", label: "Descrição do problema (mín. 5 caracteres)" });
  if (d.city.trim().length < 2) errors.push({ field: "city", label: "Cidade" });
  if (!d.acceptedTerms) errors.push({ field: "acceptedTerms", label: "Aceite dos termos" });
  return errors;
}

const MODE_LABEL: Record<OsMode, string> = {
  visita: "Visita técnica (presencial, até 30 min por bloco)",
  coleta: "Coleta para laboratório avançado",
};

/** Mensagem enxuta, organizada e sem ambiguidade para o WhatsApp. */
export function buildOsMessage(d: OsDraft): string {
  const lines: string[] = [
    "*ABERTURA DE ORDEM DE SERVIÇO*",
    `Código: *${d.protocol}*`,
    "",
    "*Cliente*",
    `• Nome: ${d.name.trim()}`,
    `• Cidade: ${d.city.trim()}`,
  ];
  if (d.neighborhood.trim()) lines.push(`• Bairro: ${d.neighborhood.trim()}`);
  if (d.reference.trim()) lines.push(`• Referência: ${d.reference.trim()}`);

  lines.push("", "*Equipamento*", `• Item: ${d.equipment.trim()}`);
  if (d.brandModel.trim()) lines.push(`• Marca/Modelo: ${d.brandModel.trim()}`);
  lines.push(`• Problema: ${d.problem.trim()}`);

  lines.push("", "*Atendimento*", `• Modalidade: ${MODE_LABEL[d.mode]}`);
  if (d.preferredWindow.trim()) lines.push(`• Preferência de horário: ${d.preferredWindow.trim()}`);
  lines.push(
    d.mode === "visita"
      ? "• Termos da visita técnica: LIDOS E ACEITOS (escopo, custos logísticos e protocolo de segurança)."
      : "• Termos de coleta e laboratório: LIDOS E ACEITOS (valores mínimos, prazos, riscos e política de retirada).",
  );

  lines.push("", `Origem: source=abrir-os · service=abertura de ordem de serviço · utm_source=whatsapp_cta`);
  return lines.join("\n");
}

export function buildOsWhatsAppUrl(d: OsDraft): string {
  return buildWhatsAppUrlFromText(buildOsMessage(d));
}
