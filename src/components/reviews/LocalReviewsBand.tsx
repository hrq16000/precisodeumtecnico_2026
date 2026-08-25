import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Star, Quote, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { readGeoPrefill } from "@/lib/geoPrefill";
import { formatReviewLocation, type PublishedReview } from "@/lib/reviews";

/**
 * Depoimentos locais por cidade/bairro na página do serviço.
 *
 * Fail-closed: só exibe avaliações reais aprovadas e com autorização de
 * publicação (RLS pública já garante `status = approved` + `publish_consent`).
 * Se não houver avaliação relevante para a localidade, o bloco não é renderizado
 * — nunca inventamos prova social.
 */

function normalize(v?: string | null): string {
  return (v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

interface LocalReviewsBandProps {
  /** Nome do serviço, usado no CTA e no filtro suave por serviço. */
  serviceName: string;
  /** Cidade preferida; quando ausente, usa o contexto geográfico do visitante. */
  city?: string;
  /** Bairro preferido; quando ausente, usa o contexto geográfico do visitante. */
  neighborhood?: string;
  /** Rótulo de origem para o rastreio do clique no WhatsApp. */
  source?: string;
  className?: string;
}

export function LocalReviewsBand({
  serviceName,
  city,
  neighborhood,
  source = "servico-depoimentos-locais",
  className,
}: LocalReviewsBandProps) {
  const [reviews, setReviews] = useState<PublishedReview[]>([]);

  const geo = useMemo(() => readGeoPrefill(), []);
  const targetCity = (city ?? geo.city ?? "").trim();
  const targetNeighborhood = (neighborhood ?? geo.neighborhood ?? "").trim();

  useEffect(() => {
    let active = true;
    supabase
      .from("reviews")
      .select("id,name,city,neighborhood,service,rating,comment,created_at")
      .eq("status", "approved")
      .eq("publish_consent", true)
      .gte("rating", 4)
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }) => {
        if (!active) return;
        setReviews((data ?? []) as PublishedReview[]);
      });
    return () => {
      active = false;
    };
  }, []);

  const relevant = useMemo(() => {
    if (reviews.length === 0) return [];
    const nCity = normalize(targetCity);
    const nBairro = normalize(targetNeighborhood);
    const nService = normalize(serviceName);
    if (!nCity && !nBairro) return [];

    const score = (r: PublishedReview) => {
      let s = 0;
      if (nBairro && normalize(r.neighborhood) === nBairro) s += 4;
      if (nCity && normalize(r.city) === nCity) s += 2;
      if (nService && normalize(r.service).includes(nService.split(" ")[0])) s += 1;
      return s;
    };

    return reviews
      .map((r) => ({ r, s: score(r) }))
      .filter((x) => x.s >= 2)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => x.r);
  }, [reviews, targetCity, targetNeighborhood, serviceName]);

  if (relevant.length === 0) return null;

  const localeLabel = [targetNeighborhood, targetCity].filter(Boolean).join(" · ");
  const waUrl = buildWhatsAppUrl({
    service: serviceName,
    city: targetCity || undefined,
    neighborhood: targetNeighborhood || undefined,
    sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
  });

  return (
    <section className={className} aria-labelledby="depoimentos-locais-heading">
      <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 id="depoimentos-locais-heading" className="text-lg font-bold">
            Quem já foi atendido {localeLabel ? `em ${localeLabel}` : "na sua região"}
          </h2>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {relevant.map((r) => (
            <li key={r.id} className="rounded-lg border border-border bg-background p-3">
              <div className="flex items-center gap-1" aria-label={`Nota ${r.rating} de 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={i < r.rating ? "h-3.5 w-3.5 fill-primary text-primary" : "h-3.5 w-3.5 text-muted-foreground/40"}
                    aria-hidden="true"
                  />
                ))}
              </div>
              {r.comment && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <Quote className="mr-1 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {r.comment}
                </p>
              )}
              <p className="mt-2 text-xs font-medium">{r.name}</p>
              <p className="text-xs text-muted-foreground">
                {[formatReviewLocation(r), r.service].filter(Boolean).join(" · ")}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="min-h-[48px]">
            <a
              data-wa-source={source}
              data-service={serviceName}
              aria-label={`Falar no WhatsApp sobre ${serviceName}`}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick({
                  source,
                  service: serviceName,
                  city: targetCity || undefined,
                  bairro: targetNeighborhood || undefined,
                  source_component: "local-reviews-band",
                  cta_label: "depoimentos-locais",
                })
              }
            >
              <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Falar no WhatsApp sobre {serviceName}
            </a>
          </Button>
          <Link to="/avaliacoes" className="text-sm font-medium text-primary underline underline-offset-4">
            Ver todas as avaliações verificadas
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LocalReviewsBand;
