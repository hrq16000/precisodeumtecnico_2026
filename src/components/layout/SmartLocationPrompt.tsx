import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, MapPin, RotateCcw } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOCATION_UPDATED_EVENT, useUserRegion } from "@/hooks/useUserRegion";
import { useLocation } from "@/lib/router-compat";
import { reverseGeocode } from "@/lib/reverseGeocode";
import { accuracyBucket, trackLocationEvent } from "@/lib/locationTelemetry";

const KEY = "user_location_full_v1";
const REGION_KEY = "user_region_v1";
const PROMPTED = "user_location_prompted_v2";
const BLOCKED_PATHS = ["/admin", "/auth", "/diagnostics", "/precos"];

interface StoredLocation {
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  uf?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  source?: "manual" | "gps" | "ip";
  savedAt?: string;
  detectedAt?: string;
  reverseGeocodedAt?: string;
}

function readStored(): StoredLocation | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredLocation) : null;
  } catch { return null; }
}

function confidenceLabel(accuracy?: number): { label: string; tone: "text-green-600" | "text-amber-600" | "text-destructive" } | null {
  const b = accuracyBucket(accuracy);
  if (!b) return null;
  if (b === "high") return { label: `Alta precisão (~${Math.round(accuracy!)}m)`, tone: "text-green-600" };
  if (b === "medium") return { label: `Precisão média (~${Math.round(accuracy!)}m)`, tone: "text-amber-600" };
  return { label: `Baixa precisão (~${Math.round(accuracy!)}m)`, tone: "text-destructive" };
}

export function SmartLocationPrompt() {
  const { region } = useUserRegion();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsWarning, setGpsWarning] = useState<string | null>(null);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [form, setForm] = useState<StoredLocation>({});

  // Na Home, localização detalhada é voluntária: o chip abre o mesmo diálogo,
  // sem interromper a primeira leitura nem alterar a coleta de GPS.
  useEffect(() => {
    const openFromHome = () => {
      setForm(readStored() ?? { city: region.city, uf: region.region, source: "ip" });
      setOpen(true);
      trackLocationEvent("prompt_shown", { source: region.source });
      try { sessionStorage.setItem(PROMPTED, "1"); } catch { /* noop */ }
    };
    window.addEventListener("home-location:open", openFromHome);
    return () => window.removeEventListener("home-location:open", openFromHome);
  }, [region.city, region.region, region.source]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname === "/") return;
    if (BLOCKED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      setOpen(false);
      return;
    }
    if (readStored()) return;
    try { if (sessionStorage.getItem(PROMPTED)) return; } catch { /* noop */ }

    const t = setTimeout(() => {
      if (document.querySelector('[role="dialog"]')) return;
      setForm({ city: region.city, uf: region.region, source: "ip" });
      setOpen(true);
      trackLocationEvent("prompt_shown", { source: region.source });
      try { sessionStorage.setItem(PROMPTED, "1"); } catch { /* noop */ }
    }, 5000);
    return () => clearTimeout(t);
  }, [pathname, region.city, region.region, region.source]);

  const persist = (payload: StoredLocation) => {
    try { localStorage.setItem(KEY, JSON.stringify(payload)); } catch { /* noop */ }
    try { window.dispatchEvent(new Event(LOCATION_UPDATED_EVENT)); } catch { /* noop */ }
    trackLocationEvent("location_persisted", {
      source: payload.source,
      has_city: !!payload.city,
      has_neighborhood: !!payload.neighborhood,
      has_address: !!payload.street,
      has_coords: payload.latitude != null && payload.longitude != null,
      accuracy_bucket: accuracyBucket(payload.accuracy),
    });
  };

  const save = (source: StoredLocation["source"] = "manual") => {
    if (!form.city && source !== "gps") return;
    persist({ ...form, source, savedAt: new Date().toISOString() });
    trackLocationEvent("manual_save", { source, has_city: !!form.city });
    setOpen(false);
  };

  const useGps = () => {
    setGpsError(null); setGpsWarning(null); setGpsSuccess(false);
    if (!("geolocation" in navigator)) {
      setGpsError("Geolocalização indisponível neste navegador. Preencha manualmente.");
      trackLocationEvent("gps_error", { reason: "unavailable", fallback: "manual" });
      return;
    }
    trackLocationEvent("gps_request");
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const detectedAt = new Date().toISOString();
        trackLocationEvent("gps_success", { accuracy_bucket: accuracyBucket(accuracy) });

        const base: StoredLocation = {
          ...form, latitude, longitude, accuracy,
          source: "gps", detectedAt, savedAt: detectedAt,
        };

        const rg = await reverseGeocode(latitude, longitude);
        if (rg.ok && rg.data) {
          const a = rg.data;
          const next: StoredLocation = {
            ...base,
            city: a.city || base.city,
            uf: a.uf || base.uf,
            state: a.state || base.state,
            neighborhood: a.neighborhood || base.neighborhood,
            street: a.street || base.street,
            number: a.number || base.number,
            postalCode: a.postalCode || base.postalCode,
            country: a.country || base.country || "BR",
            reverseGeocodedAt: new Date().toISOString(),
            savedAt: new Date().toISOString(),
          };
          setForm(next); persist(next); setGpsSuccess(true);
          trackLocationEvent("reverse_geocode_ok", {
            from_cache: rg.fromCache, duration_ms: rg.durationMs, status: rg.status,
            has_city: !!next.city, has_neighborhood: !!next.neighborhood,
          });
          if (!next.city) setGpsWarning("Localização aproximada detectada. Confirme a cidade abaixo.");
        } else {
          setForm(base); persist(base); setGpsSuccess(true);
          setGpsWarning("Localização aproximada detectada, mas não foi possível obter o endereço. Ajuste manualmente se preferir.");
          trackLocationEvent("reverse_geocode_fail", {
            duration_ms: rg.durationMs, status: rg.status, reason: rg.reason,
            fallback: "gps", has_coords: true,
          });
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        const denied = err.code === err.PERMISSION_DENIED;
        const timeout = err.code === err.TIMEOUT;
        setGpsError(
          denied
            ? "Permissão negada. Preencha manualmente sua cidade e bairro."
            : "Não foi possível obter sua localização. Preencha manualmente.",
        );
        trackLocationEvent(denied ? "gps_denied" : "gps_error", {
          error: String(err.code),
          reason: denied ? "denied" : timeout ? "timeout" : "position_unavailable",
          fallback: "manual",
        });
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const updateField = (patch: Partial<StoredLocation>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (gpsSuccess) {
      const payload: StoredLocation = {
        ...next,
        source: next.latitude != null ? "gps" : "manual",
        savedAt: new Date().toISOString(),
      };
      persist(payload);
      trackLocationEvent("manual_edit", { source: payload.source });
    }
  };

  const resetLocation = () => {
    try { localStorage.removeItem(KEY); } catch { /* noop */ }
    try { localStorage.removeItem(REGION_KEY); } catch { /* noop */ }
    try { sessionStorage.removeItem(PROMPTED); } catch { /* noop */ }
    try { window.dispatchEvent(new Event(LOCATION_UPDATED_EVENT)); } catch { /* noop */ }
    trackLocationEvent("location_reset", { fallback: "ip" });
    setForm({}); setGpsSuccess(false); setGpsError(null); setGpsWarning(null);
    setConfirmReset(false);
    setOpen(false);
  };

  const dismiss = () => {
    if (form.city && !gpsSuccess && !readStored()) {
      persist({ city: form.city, uf: form.uf, source: "ip", savedAt: new Date().toISOString() });
      trackLocationEvent("ip_fallback", { has_city: !!form.city });
    }
    setOpen(false);
  };

  const conf = confidenceLabel(form.accuracy);

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(v) : dismiss())}>
      <DialogContent className="sm:max-w-md" data-testid="smart-location-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Onde você está?
          </DialogTitle>
          <DialogDescription>
            Confirme sua localização para agilizarmos o atendimento e o orçamento.
            Enviamos junto no WhatsApp quando você chamar um técnico.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Button type="button" variant="outline" onClick={useGps} disabled={gpsLoading}
              className="w-full" data-testid="smart-location-gps">
              {gpsLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
              {gpsLoading ? "Detectando..." : "Usar minha localização (GPS)"}
            </Button>
          </div>
          {gpsSuccess && (
            <p className="col-span-2 flex items-center gap-2 text-xs text-green-600"
               data-testid="smart-location-success" role="status">
              <CheckCircle2 className="w-4 h-4" /> Localização detectada e salva.
            </p>
          )}
          {conf && (
            <p className={`col-span-2 text-xs ${conf.tone}`} data-testid="smart-location-accuracy">
              {conf.label}
            </p>
          )}
          {gpsWarning && (
            <p className="col-span-2 flex items-center gap-2 text-xs text-amber-600"
               data-testid="smart-location-warning" role="status">
              <AlertTriangle className="w-4 h-4" /> {gpsWarning}
            </p>
          )}
          {gpsError && (
            <p className="col-span-2 text-xs text-destructive"
               data-testid="smart-location-error" role="alert">
              {gpsError}
            </p>
          )}
          <label className="col-span-2 text-xs text-muted-foreground">Cidade</label>
          <Input data-testid="smart-location-city" className="col-span-2" value={form.city ?? ""} onChange={(e) => updateField({ city: e.target.value })} placeholder="Cidade" />
          <Input value={form.uf ?? ""} onChange={(e) => updateField({ uf: e.target.value.toUpperCase().slice(0, 2) })} placeholder="UF" maxLength={2} />
          <Input data-testid="smart-location-neighborhood" value={form.neighborhood ?? ""} onChange={(e) => updateField({ neighborhood: e.target.value })} placeholder="Bairro" />
          <Input className="col-span-2" data-testid="smart-location-street" value={form.street ?? ""} onChange={(e) => updateField({ street: e.target.value })} placeholder="Rua (opcional)" />
          <Input value={form.number ?? ""} onChange={(e) => updateField({ number: e.target.value })} placeholder="Número" />
          <Input value={form.complement ?? ""} onChange={(e) => updateField({ complement: e.target.value })} placeholder="Complemento" />
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          {!confirmReset ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmReset(true)}
                    data-testid="smart-location-reset" className="mr-auto text-xs">
              <RotateCcw className="w-3 h-3 mr-1" /> Redefinir localização
            </Button>
          ) : (
            <div className="mr-auto flex items-center gap-2 text-xs" data-testid="smart-location-reset-confirm">
              <span className="text-muted-foreground">Confirmar reset?</span>
              <Button type="button" variant="destructive" size="sm" onClick={resetLocation}>Sim</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>Não</Button>
            </div>
          )}
          <Button variant="ghost" onClick={dismiss}>Agora não</Button>
          <Button onClick={() => save(form.latitude != null ? "gps" : "manual")}
                  disabled={!form.city && form.latitude == null}>
            {gpsSuccess ? "Fechar" : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
