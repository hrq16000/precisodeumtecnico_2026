import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";
import { trackCtaClick, trackEvent, type CtaSurface } from "@/lib/analytics";

const AD_TYPES = [
  "Banner de topo (leaderboard)",
  "Bloco no meio do conteúdo",
  "Patrocínio de localidade",
  "Conteúdo patrocinado identificado",
] as const;

const PERIODS = ["Mensal", "Trimestral", "Campanha pontual"] as const;

/**
 * Formulário curto de solicitação de proposta de mídia.
 * Não persiste dados: monta a mensagem e entrega no fluxo de WhatsApp —
 * canal único de contato do portal.
 */
export function MediaProposalForm() {
  const [segment, setSegment] = useState("");
  const [territory, setTerritory] = useState("");
  const [adType, setAdType] = useState<string>(AD_TYPES[0]);
  const [period, setPeriod] = useState<string>(PERIODS[0]);
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const message = useMemo(
    () =>
      [
        "Solicitação de proposta de mídia (portal precisodeumtecnico.com)",
        `Segmento do anunciante: ${segment || "não informado"}`,
        `Cidade/bairro de interesse: ${territory || "não informado"}`,
        `Tipo de anúncio: ${adType}`,
        `Período: ${period}`,
        `Contato: ${contact || "não informado"}`,
        notes ? `Observações: ${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [segment, territory, adType, period, contact, notes],
  );

  const valid = segment.trim().length >= 2 && territory.trim().length >= 2;

  function handleSubmit() {
    const channel = "whatsapp";
    trackEvent("media_proposal_submit", {
      channel,
      ad_type: adType,
      period,
      has_territory: territory.trim().length > 0,
    });
    trackCtaClick({
      surface: "advertising" satisfies CtaSurface,

      cta_id: "media_proposal_whatsapp",
      label: "Enviar por WhatsApp",
      destination: "/anuncie#proposta",
    });

    window.open(buildWhatsAppUrlFromText(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      id="proposta"
      className="rounded-lg border border-border bg-card p-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2 className="text-xl font-semibold md:text-2xl">Solicitar proposta de mídia</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Leva menos de um minuto. Respondemos com posições livres, período e valores para o
        território escolhido.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="mp-segment">Segmento do anunciante</Label>
          <Input
            id="mp-segment"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            placeholder="Ex.: loja de peças de informática"
            maxLength={80}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Texto livre. Exemplos: “assistência de celulares”, “provedor de internet”.
          </p>
        </div>

        <div>
          <Label htmlFor="mp-territory">Cidade e/ou bairro</Label>
          <Input
            id="mp-territory"
            value={territory}
            onChange={(e) => setTerritory(e.target.value)}
            placeholder="Ex.: Curitiba - Batel"
            maxLength={80}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Formato “Cidade - Bairro”. Exemplos: “Curitiba - Portão”, “São José dos Pinhais”.
          </p>
        </div>

        <div>
          <Label htmlFor="mp-adtype">Tipo de anúncio</Label>
          <select
            id="mp-adtype"
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {AD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="mp-period">Período desejado</Label>
          <select
            id="mp-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="mp-contact">Seu contato (nome e WhatsApp)</Label>
          <Input
            id="mp-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Ex.: Ana Souza · responsável de marketing"
            maxLength={120}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="mp-notes">Observações (opcional)</Label>
          <Textarea
            id="mp-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Datas preferidas, campanha sazonal, materiais já prontos…"
            maxLength={400}
            rows={3}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit" disabled={!valid} className="min-h-11">
          <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          Enviar por WhatsApp
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Os dados preenchidos aqui não são armazenados pelo portal: eles apenas montam a mensagem
        enviada no aplicativo escolhido.
      </p>
    </form>
  );
}
