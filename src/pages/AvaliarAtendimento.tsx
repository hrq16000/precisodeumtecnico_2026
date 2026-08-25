import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { currentSourcePage } from "@/lib/whatsapp";

/**
 * Página de avaliação pós-atendimento (link enviado no WhatsApp após a OS).
 * A avaliação entra como "pendente" e só aparece no site depois de aprovada
 * no painel — e apenas se o cliente autorizar a publicação.
 */

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome (mínimo 2 caracteres).").max(120),
  rating: z.number().int().min(1, "Selecione de 1 a 5 estrelas.").max(5),
  comment: z.string().trim().max(1200, "Máximo de 1200 caracteres.").optional(),
  city: z.string().trim().max(120).optional(),
  neighborhood: z.string().trim().max(120).optional(),
  service: z.string().trim().max(200).optional(),
});

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring";

export default function AvaliarAtendimento() {
  const [params] = useSearchParams();
  const protocol = params.get("os")?.slice(0, 40) ?? "";
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [city, setCity] = useState(params.get("cidade") ?? "");
  const [neighborhood, setNeighborhood] = useState(params.get("bairro") ?? "");
  const [service, setService] = useState(params.get("servico") ?? "");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const utm = useMemo(
    () => params.get("utm_medium") ?? params.get("utm_source") ?? "direto",
    [params],
  );

  useEffect(() => {
    trackEvent("review_link_open", {
      page_path: "/avaliar",
      utm_medium: utm,
      has_protocol: protocol ? "yes" : "no",
    });
  }, [utm, protocol]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, rating, comment, city, neighborhood, service });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({
        name: f.name?.[0],
        rating: f.rating?.[0],
        comment: f.comment?.[0],
      });
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>("[data-invalid='true']");
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setErrors({});
    setSending(true);
    setServerError(null);
    const { error } = await supabase.from("reviews").insert({
      name: name.trim(),
      rating,
      comment: comment.trim() || null,
      city: city.trim() || null,
      neighborhood: neighborhood.trim() || null,
      service: service.trim() || null,
      protocol: protocol || null,
      publish_consent: consent,
      status: "pending",
      source: utm.slice(0, 64),
      page_path: currentSourcePage().slice(0, 2048),
      user_agent: navigator.userAgent.slice(0, 500),
    });
    setSending(false);
    if (error) {
      // Log técnico detalhado para depuração (sem PII do formulário).
      console.error("[reviews] falha ao registrar avaliação", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      const isPermission =
        error.code === "42501" || /permission denied|row-level security/i.test(error.message ?? "");
      setServerError(
        isPermission
          ? "Não foi possível registrar sua avaliação por uma restrição de permissão. Já fomos notificados — tente novamente em instantes."
          : `Não foi possível enviar agora (${error.code ?? "erro"}). Tente novamente em instantes.`,
      );
      trackEvent("review_submit_error", { page_path: "/avaliar", error_code: error.code ?? "unknown" });
      return;
    }

    trackEvent("review_submitted", {
      page_path: "/avaliar",
      rating,
      publish_consent: consent ? "yes" : "no",
    });
    setDone(true);
  }

  return (
    <Layout>
      <SEOHead
        title="Avaliar atendimento | Preciso de Um Técnico"
        description="Registre sua avaliação com estrelas do atendimento técnico e autorize (ou não) a publicação do seu depoimento no site."
        canonical="/avaliar"
        noindex
      />
      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Como foi o seu atendimento?
          </h1>
          <p className="text-muted-foreground mb-8">
            Sua avaliação leva menos de um minuto e ajuda outros clientes a decidirem com segurança.
            {protocol && (
              <>
                {" "}
                Ordem de serviço: <strong className="text-foreground">{protocol}</strong>.
              </>
            )}
          </p>

          {done ? (
            <div role="status" aria-live="polite" className="p-6 rounded-2xl border border-success/40 bg-success/10 text-center">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold text-card-foreground mb-2">
                Avaliação registrada
              </h2>
              <p className="text-muted-foreground">
                Obrigado! {consent
                  ? "Seu depoimento passa por conferência antes de ser publicado no site."
                  : "Sua avaliação será usada apenas internamente, sem publicação."}{" "}
                Você pode pedir a correção ou exclusão pelo mesmo canal de atendimento.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5 p-6 rounded-2xl border border-border bg-card">
              <fieldset>
                <legend className="block text-sm font-semibold text-card-foreground mb-2">
                  Sua nota
                </legend>
                <div className="flex gap-2" role="radiogroup" aria-label="Nota de 1 a 5 estrelas">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                      data-invalid={errors.rating ? "true" : undefined}
                      onClick={() => setRating(n)}
                      className={`p-2 min-h-[48px] min-w-[48px] rounded-lg border ${
                        errors.rating ? "field-invalid" : "border-border"
                      }`}
                    >
                      <Star
                        className={`w-7 h-7 mx-auto ${
                          n <= rating ? "fill-accent text-accent" : "text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating}</p>}
              </fieldset>

              <div>
                <label htmlFor="rv-name" className="block text-sm font-semibold text-card-foreground mb-1">
                  Nome
                </label>
                <input
                  id="rv-name"
                  className={`${inputClass} ${errors.name ? "field-invalid" : ""}`}
                  data-invalid={errors.name ? "true" : undefined}
                  value={name}
                  maxLength={120}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rv-city" className="block text-sm font-semibold text-card-foreground mb-1">
                    Cidade
                  </label>
                  <input id="rv-city" className={inputClass} value={city} maxLength={120} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="rv-bairro" className="block text-sm font-semibold text-card-foreground mb-1">
                    Bairro
                  </label>
                  <input id="rv-bairro" className={inputClass} value={neighborhood} maxLength={120} onChange={(e) => setNeighborhood(e.target.value)} />
                </div>
              </div>

              <div>
                <label htmlFor="rv-service" className="block text-sm font-semibold text-card-foreground mb-1">
                  Serviço atendido
                </label>
                <input id="rv-service" className={inputClass} value={service} maxLength={200} onChange={(e) => setService(e.target.value)} />
              </div>

              <div>
                <label htmlFor="rv-comment" className="block text-sm font-semibold text-card-foreground mb-1">
                  Comentário (opcional)
                </label>
                <textarea
                  id="rv-comment"
                  rows={4}
                  className={`${inputClass} ${errors.comment ? "field-invalid" : ""}`}
                  data-invalid={errors.comment ? "true" : undefined}
                  value={comment}
                  maxLength={1200}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte o que foi feito e como foi o atendimento."
                />
                {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment}</p>}
              </div>

              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  Autorizo a publicação do meu nome (primeiro nome), cidade/bairro e comentário no
                  site. Sem esta autorização, a avaliação é usada apenas internamente.
                </span>
              </label>

              {serverError && (
                <p role="alert" aria-live="assertive" className="text-sm text-destructive rounded-lg border border-destructive/40 bg-destructive/10 p-3">
                  {serverError}
                </p>
              )}


              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-60"
              >
                {sending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                Enviar avaliação
              </button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
