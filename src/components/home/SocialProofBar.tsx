/**
 * Prova social fail-closed: só renderiza se houver avaliações aprovadas E
 * autorizadas para publicação no banco. Nenhum número é fabricado.
 */
import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Star, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { buildWhatsAppUrl, readStoredLocation, currentSourcePage } from "@/lib/whatsapp";

export function SocialProofBar() {
  const [count, setCount] = useState(0);
  const [average, setAverage] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("reviews")
      .select("rating")
      .eq("status", "approved")
      .eq("publish_consent", true)
      .then(({ data }) => {
        if (!active || !data || data.length === 0) return;
        const ratings = data.map((r) => Number(r.rating)).filter((n) => n > 0);
        if (ratings.length === 0) return;
        setCount(ratings.length);
        setAverage(ratings.reduce((a, b) => a + b, 0) / ratings.length);
      });
    return () => {
      active = false;
    };
  }, []);

  const whatsappLink = useWhatsAppLink({ service: "assistência técnica" });

  return (
    <section className="border-b border-border bg-secondary/30 py-6" data-social-proof>
      <div className="container-custom max-w-5xl">
        {average !== null && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i <= Math.round(average) ? "fill-current text-amber-500" : "text-muted-foreground"}`}
                />
              ))}
            </span>
            <span className="font-semibold text-foreground">
              {average.toFixed(1).replace(".", ",")} de 5
            </span>
            <span className="text-muted-foreground">
              em {count} {count === 1 ? "avaliação publicada" : "avaliações publicadas"}
            </span>
            <Link
              to="/avaliacoes"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Ler avaliações <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}

        <TrustStrip />

        <div className="mt-4 flex justify-center">
          <Button variant="whatsapp" size="lg" asChild>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="social-proof"
              data-service="assistência técnica"
              data-cta-label="social_proof_whatsapp"
              aria-label="Falar com técnico pelo WhatsApp (prova social)"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com técnico no WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
