import { Helmet } from "@/lib/helmet-compat";
import { Layout } from "@/components/layout/Layout";
import { TriageWizardV2 } from "@/components/triage/v2/TriageWizardV2";
import { OfferHighlight } from "@/components/marketing/OfferHighlight";

/**
 * Rota de PREVIEW (Fase B em rollout controlado).
 *
 * Esta rota IGNORA a feature flag `VITE_TRIAGE_ENABLED` para permitir que o
 * time valide visualmente o TriageWizard sem expor o componente em CTAs
 * públicos. Quando a flag for ativada, o mesmo componente passa a ser usado
 * pelo WhatsAppFloat, hero CTAs e botões das páginas de cidade.
 *
 * `noindex` no robots — não queremos que crawlers indexem este sandbox.
 */
export default function TriagemPreview() {
  return (
    <Layout>
      <Helmet>
        <title>Triagem técnica (preview) | Preciso de Um Técnico</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="bg-gradient-to-b from-background to-muted/30 py-10 md:py-16">
        <div className="container-custom space-y-6">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-600">
              Preview interno · Fase B
            </span>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              Triagem técnica — sandbox
            </h1>
            <p className="text-sm text-muted-foreground">
              Fluxo completo da máquina de estados com bifurcação por sintoma,
              uploader de mídia (bucket privado <code>triage-media</code>) e payload
              final visível ao concluir.
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <OfferHighlight region="Curitiba" />
          </div>

          <TriageWizardV2 source="triagem-preview" />
        </div>
      </section>
    </Layout>
  );
}
