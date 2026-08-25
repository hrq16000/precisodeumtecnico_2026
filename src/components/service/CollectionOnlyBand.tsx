import { Truck, CheckCircle2 } from "lucide-react";
import { COLLECTION_ONLY_POLICY } from "@/data/collectionOnlyServices";
import { Link } from "@/lib/router-compat";

/**
 * Aviso de atendimento exclusivamente com coleta + política de valores.
 * Renderizado nas páginas de serviços sem balcão (videogames, consoles,
 * controles, tablets e similares).
 */
export function CollectionOnlyBand() {
  return (
    <section
      className="py-10 md:py-14 bg-muted/40 border-y border-border"
      aria-labelledby="coleta-exclusiva-heading"
      data-testid="collection-only-band"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
          <Truck className="h-4 w-4" aria-hidden="true" />
          Sem balcão de atendimento
        </div>
        <h2
          id="coleta-exclusiva-heading"
          className="mt-4 text-2xl md:text-3xl font-bold text-foreground"
        >
          {COLLECTION_ONLY_POLICY.headline}
        </h2>
        <p className="mt-3 text-muted-foreground">{COLLECTION_ONLY_POLICY.summary}</p>

        <ul className="mt-6 space-y-3">
          {COLLECTION_ONLY_POLICY.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-sm text-foreground/90">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="#triagem"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            data-cta-id="collection_only_triagem"
          >
            Iniciar triagem para coleta
          </Link>
          <Link
            to="/garantia-e-cobertura"
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-background transition-colors"
          >
            Garantia e cobertura
          </Link>
        </div>
      </div>
    </section>
  );
}
