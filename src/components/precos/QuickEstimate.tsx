/**
 * Estimativa rápida em 3 perguntas (página /precos).
 * Apenas apresentação: todos os valores e prazos vêm de PRICING/SLA
 * (fonte única em src/data/pricingPolicy.ts). Nenhuma promessa nova.
 */
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, RotateCcw } from "lucide-react";
import { PRICING, SLA } from "@/data/pricingPolicy";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics";

type EquipmentId =
  | "informatica"
  | "tv"
  | "celular"
  | "rede"
  | "cftv"
  | "eletrica"
  | "climatizacao";
type ModeId = "bancada" | "visita" | "coleta";
type UrgencyId = "fila" | "prioridade";

const EQUIPMENTS: { id: EquipmentId; label: string }[] = [
  { id: "informatica", label: "Computador ou notebook" },
  { id: "tv", label: "TV / Smart TV" },
  { id: "celular", label: "Celular ou tablet" },
  { id: "rede", label: "Wi-Fi e rede" },
  { id: "cftv", label: "CFTV e câmeras" },
  { id: "eletrica", label: "Elétrica" },
  { id: "climatizacao", label: "Ar-condicionado" },
];

/** Serviços que só existem no endereço do cliente (instalação/infra). */
const ON_SITE_ONLY: EquipmentId[] = ["rede", "cftv", "eletrica", "climatizacao"];

const MODES: { id: ModeId; label: string; hint: string }[] = [
  { id: "bancada", label: "Levo até a bancada", hint: "Entrega e retirada no nosso endereço" },
  { id: "visita", label: "Prefiro visita técnica", hint: "Atendimento no seu endereço" },
  { id: "coleta", label: "Quero coleta e entrega", hint: "Retirada e devolução no endereço" },
];

const URGENCIES: { id: UrgencyId; label: string }[] = [
  { id: "fila", label: "Posso aguardar a fila normal" },
  { id: "prioridade", label: "Preciso de prioridade" },
];

interface Result {
  route: ModeId;
  routeLabel: string;
  priceLabel: string;
  description: string;
  slaLabel: string;
}

function resolveResult(equipment: EquipmentId, mode: ModeId, urgency: UrgencyId): Result {
  const forcedOnSite = ON_SITE_ONLY.includes(equipment) && mode !== "visita";
  const route: ModeId = forcedOnSite ? "visita" : mode;

  const base =
    route === "bancada"
      ? PRICING.benchDiagnosis
      : route === "visita"
        ? PRICING.technicalVisit
        : PRICING.pickupDelivery;

  return {
    route,
    routeLabel:
      route === "bancada"
        ? "Diagnóstico em bancada"
        : route === "visita"
          ? "Visita técnica"
          : "Coleta e entrega personalizada",
    priceLabel: base.priceLabel,
    description: forcedOnSite
      ? `Esse tipo de serviço é executado no local: ${base.description}`
      : base.description,
    slaLabel:
      urgency === "prioridade"
        ? `Prazo mínimo de ${SLA.minLabel}. Pedidos com prioridade entram na primeira janela disponível, sem garantia de antecipação.`
        : `Prazo mínimo de ${SLA.minLabel}. Casos com encomenda de peça: ${SLA.minWithPartsLabel}.`,
  };
}

export function QuickEstimate() {
  const [equipment, setEquipment] = useState<EquipmentId | null>(null);
  const [mode, setMode] = useState<ModeId | null>(null);
  const [urgency, setUrgency] = useState<UrgencyId | null>(null);

  const result = useMemo<Result | null>(
    () => (equipment && mode && urgency ? resolveResult(equipment, mode, urgency) : null),
    [equipment, mode, urgency],
  );

  const equipmentLabel = EQUIPMENTS.find((e) => e.id === equipment)?.label ?? "";

  const waText = result
    ? `Olá! Fiz a estimativa rápida no site. Equipamento: ${equipmentLabel}. Atendimento: ${result.routeLabel} (${result.priceLabel}). Prioridade: ${urgency === "prioridade" ? "sim" : "não"}. [service=estimativa-rapida · source=precos · utm_source=whatsapp_cta]`
    : "";

  function handleAnswer(step: "equipamento" | "modalidade" | "urgencia", value: string) {
    trackEvent("price_estimate_answer", { step, value, pathname: "/precos" });
  }

  return (
    <Card id="estimativa-rapida-card" className="p-6 border-primary/20 bg-primary/5">
      <Badge variant="secondary" className="mb-3">3 perguntas</Badge>
      <h3 className="font-display text-xl md:text-2xl font-bold mb-1">
        Estimativa rápida de valor e prazo
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Responda 3 perguntas e mostramos a melhor opção de atendimento com o valor mínimo e o prazo
        mínimo praticados. O orçamento final é sempre confirmado por escrito após o diagnóstico.
      </p>

      <fieldset className="mb-5">
        <legend className="font-semibold mb-2 text-sm">1. O que precisa de atendimento?</legend>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENTS.map((e) => (
            <Button
              key={e.id}
              type="button"
              size="sm"
              variant={equipment === e.id ? "default" : "outline"}
              aria-pressed={equipment === e.id}
              data-estimate-equipment={e.id}
              onClick={() => {
                setEquipment(e.id);
                handleAnswer("equipamento", e.id);
              }}
            >
              {e.label}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-5">
        <legend className="font-semibold mb-2 text-sm">2. Como prefere o atendimento?</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {MODES.map((m) => (
            <Button
              key={m.id}
              type="button"
              variant={mode === m.id ? "default" : "outline"}
              aria-pressed={mode === m.id}
              data-estimate-mode={m.id}
              className="h-auto flex-col items-start gap-1 py-3 text-left whitespace-normal"
              onClick={() => {
                setMode(m.id);
                handleAnswer("modalidade", m.id);
              }}
            >
              <span className="font-semibold">{m.label}</span>
              <span className="text-xs opacity-80">{m.hint}</span>
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-2">
        <legend className="font-semibold mb-2 text-sm">3. Qual a urgência?</legend>
        <div className="flex flex-wrap gap-2">
          {URGENCIES.map((u) => (
            <Button
              key={u.id}
              type="button"
              size="sm"
              variant={urgency === u.id ? "default" : "outline"}
              aria-pressed={urgency === u.id}
              data-estimate-urgency={u.id}
              onClick={() => {
                setUrgency(u.id);
                handleAnswer("urgencia", u.id);
              }}
            >
              {u.label}
            </Button>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-6">
        {!result ? (
          <p className="text-sm text-muted-foreground">
            Selecione as três respostas para ver a melhor opção.
          </p>
        ) : (
          <div data-estimate-result className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Melhor opção para o seu caso
            </p>
            <p className="font-display text-lg font-bold">
              {result.routeLabel} — <span data-estimate-price>{result.priceLabel}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">{result.description}</p>
            <p className="text-sm text-muted-foreground mt-2">{result.slaLabel}</p>
            <p className="text-xs text-muted-foreground mt-3">{SLA.disclaimer}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="whatsapp" asChild>
                <a
                  href={buildWhatsAppUrlFromText(waText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source="pricing-quick-estimate"
                  data-service="estimativa rápida de preços"
                  aria-label="Enviar minha estimativa pelo WhatsApp"
                  onClick={() => {
                    trackWhatsAppClick({
                      source: "pricing-quick-estimate",
                      service: "estimativa-rapida",
                      source_component: "QuickEstimate",
                      cta_label: "Enviar estimativa no WhatsApp",
                    });
                    trackEvent("price_estimate_complete", {
                      equipment: equipment ?? undefined,
                      service_mode: result.route,
                      urgencia: urgency ?? undefined,
                      price_label: result.priceLabel,
                    });
                  }}
                >
                  <MessageCircle className="w-4 h-4" /> Enviar estimativa no WhatsApp
                </a>
              </Button>
              <Button variant="outline" data-triage-cta data-triage-source="precos_estimativa">
                Detalhar na triagem completa
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEquipment(null);
                  setMode(null);
                  setUrgency(null);
                }}
              >
                <RotateCcw className="w-4 h-4" /> Refazer
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
