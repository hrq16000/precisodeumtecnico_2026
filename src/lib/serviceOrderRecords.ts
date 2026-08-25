/**
 * Registro local das Ordens de Serviço abertas no portal.
 *
 * Guarda o que foi acordado na abertura (equipamento, modalidade, termos
 * aceitos e a mensagem sintetizada) para consulta futura pelo código único
 * em /consultar-os. Nenhum dado sensível sai do navegador do cliente.
 */
import type { OsDraft, OsMode } from "@/lib/serviceOrderDraft";
import { buildOsMessage } from "@/lib/serviceOrderDraft";
import { VISIT_TERMS, COLLECTION_TERMS } from "@/data/serviceOrderTerms";

export const OS_RECORDS_KEY = "pdt_os_records_v1";

export const OS_STATUS_FLOW = [
  { id: "aberta", label: "Aberta", hint: "O.S. registrada e enviada para a central." },
  { id: "aguardando-coleta", label: "Aguardando coleta/visita", hint: "Agendamento em confirmação com o cliente." },
  { id: "em-laboratorio", label: "Em laboratório", hint: "Diagnóstico e execução do reparo aprovado." },
  { id: "concluida", label: "Concluída", hint: "Serviço finalizado e equipamento devolvido." },
] as const;

export type OsStatus = (typeof OS_STATUS_FLOW)[number]["id"] | "cancelada";

export interface OsTermsSnapshot {
  title: string;
  items: string[];
}

export interface OsRecord {
  protocol: string;
  createdAt: string;
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
  terms: OsTermsSnapshot[];
  message: string;
  status: OsStatus;
  history: { status: OsStatus; at: string }[];
}

export const OS_MODE_LABEL: Record<OsMode, string> = {
  visita: "Visita técnica presencial",
  coleta: "Coleta para laboratório avançado",
};

export function statusLabel(status: OsStatus): string {
  if (status === "cancelada") return "Cancelada";
  return OS_STATUS_FLOW.find((s) => s.id === status)?.label ?? "Aberta";
}

export function statusIndex(status: OsStatus): number {
  const i = OS_STATUS_FLOW.findIndex((s) => s.id === status);
  return i < 0 ? 0 : i;
}

/** Normaliza o código digitado (aceita minúsculas, espaços e sem prefixo). */
export function normalizeOsCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

function readAll(): OsRecord[] {
  try {
    const raw = localStorage.getItem(OS_RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OsRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAll(records: OsRecord[]): void {
  try {
    localStorage.setItem(OS_RECORDS_KEY, JSON.stringify(records.slice(0, 30)));
  } catch {
    /* noop */
  }
}

export function recordFromDraft(draft: OsDraft): OsRecord {
  const now = new Date().toISOString();
  const terms = (draft.mode === "visita" ? VISIT_TERMS : COLLECTION_TERMS).map((g) => ({
    title: g.title,
    items: [...g.items],
  }));
  return {
    protocol: draft.protocol,
    createdAt: draft.createdAt || now,
    name: draft.name.trim(),
    equipment: draft.equipment.trim(),
    brandModel: draft.brandModel.trim(),
    problem: draft.problem.trim(),
    mode: draft.mode,
    city: draft.city.trim(),
    neighborhood: draft.neighborhood.trim(),
    reference: draft.reference.trim(),
    preferredWindow: draft.preferredWindow.trim(),
    acceptedTerms: draft.acceptedTerms,
    terms,
    message: buildOsMessage(draft),
    status: "aberta",
    history: [{ status: "aberta", at: now }],
  };
}

export function saveOsRecord(record: OsRecord): void {
  const rest = readAll().filter((r) => r.protocol !== record.protocol);
  writeAll([record, ...rest]);
}

export function listOsRecords(): OsRecord[] {
  return readAll();
}

export function findOsRecord(code: string): OsRecord | null {
  const wanted = normalizeOsCode(code);
  if (!wanted) return null;
  return (
    readAll().find(
      (r) => normalizeOsCode(r.protocol) === wanted || normalizeOsCode(r.protocol).endsWith(wanted),
    ) ?? null
  );
}
