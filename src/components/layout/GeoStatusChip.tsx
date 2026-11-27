import { useEffect } from "react";
import { Loader2, MapPin, CheckCircle2 } from "lucide-react";
import { useUserRegion } from "@/hooks/useUserRegion";
import { trackGeoCityAutofillOnce } from "@/lib/geoAutofill";
import { cn } from "@/lib/utils";

/**
 * Chip de status da localização exibido no hero.
 * - "Detectando..." com spinner enquanto a cidade é resolvida (IP/CEP)
 * - "Detectado" quando veio de IP (aproximado)
 * - "Confirmado" quando veio de GPS ou preenchimento manual
 *
 * Não altera layout do hero: é um chip inline com transição suave de opacidade.
 */
export function GeoStatusChip({ className }: { className?: string }) {
  const { region, loading } = useUserRegion();
  const confirmed = region.source === "gps" || region.source === "manual";
  const label = [region.city, region.region].filter(Boolean).join(", ");

  useEffect(() => {
    if (loading) return;
    if (region.source !== "ip") return;
    trackGeoCityAutofillOnce({
      city: region.city,
      uf: region.region,
      source: region.source,
    });
  }, [loading, region.city, region.region, region.source]);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("home-location:open"))}
      aria-label="Alterar localização do atendimento"
      data-testid="geo-status-chip"
      data-geo-status={loading ? "loading" : confirmed ? "confirmed" : "detected"}
      className={cn(
        "inline-flex items-center gap-2 min-h-10 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        loading ? "opacity-70" : "opacity-100",
        className,
      )}
      aria-live="polite"
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 motion-safe:animate-spin" aria-hidden="true" />
          <span>Detectando sua cidade...</span>
        </>
      ) : (
        <>
          {confirmed ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
          ) : (
            <MapPin className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />
          )}
          <span>
            <strong className="font-semibold">{confirmed ? "Confirmado" : "Detectado"}:</strong>{" "}
            {label || "Brasil"}
          </span>
        </>
      )}
      <span className="underline underline-offset-2">Alterar</span>
    </button>
  );
}
