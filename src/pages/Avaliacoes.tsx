import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Star, Download, Quote } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import {
  buildPublishedReviewsSchema,
  formatReviewLocation,
  SITE_ORIGIN,
  type PublishedReview,
} from "@/lib/reviews";

const faq = [
  {
    question: "As avaliações do site são reais?",
    answer:
      "Sim. Cada avaliação vem de um atendimento com Ordem de Serviço, passa por conferência manual e só é publicada quando o cliente marca a autorização expressa de publicação.",
  },
  {
    question: "Como uma avaliação é publicada?",
    answer:
      "O cliente recebe o link de avaliação no WhatsApp após a OS, dá a nota em estrelas, escreve o comentário e autoriza a publicação. Sem essa autorização, a avaliação fica só no controle interno de qualidade.",
  },
  {
    question: "Posso auditar uma avaliação publicada?",
    answer:
      "Pode. Use o botão 'Exportar avaliações' desta página para baixar um arquivo com nota, comentário, cidade, bairro, serviço e data de publicação de cada avaliação autorizada.",
  },
  {
    question: "É possível remover uma avaliação depois de publicada?",
    answer:
      "Sim. Basta pedir a exclusão na página de exclusão de dados ou pelo WhatsApp informando o número da OS; a avaliação é despublicada.",
  },
];

export default function Avaliacoes() {
  const [reviews, setReviews] = useState<PublishedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [neighborhood, setNeighborhood] = useState("all");
  const [service, setService] = useState("all");

  useEffect(() => {
    let active = true;
    supabase
      .from("reviews")
      .select("id,name,city,neighborhood,service,rating,comment,created_at")
      .eq("status", "approved")
      .eq("publish_consent", true)
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (!active) return;
        if (data) setReviews(data as PublishedReview[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const neighborhoods = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.neighborhood).filter(Boolean) as string[])).sort(),
    [reviews],
  );
  const services = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.service).filter(Boolean) as string[])).sort(),
    [reviews],
  );

  const visible = reviews.filter((r) => {
    if (neighborhood !== "all" && (r.neighborhood || "") !== neighborhood) return false;
    if (service !== "all" && (r.service || "") !== service) return false;
    return true;
  });

  // JSON-LD gerado somente com avaliações aprovadas E autorizadas.
  const schema = buildPublishedReviewsSchema(reviews);

  function exportReviews() {
    const header = ["nota", "nome", "cidade", "bairro", "servico", "data", "comentario"];
    const rows = visible.map((r) => [
      String(r.rating),
      r.name,
      r.city ?? "",
      r.neighborhood ?? "",
      r.service ?? "",
      r.created_at.slice(0, 10),
      (r.comment ?? "").replace(/\s+/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avaliacoes-publicadas-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("reviews_public_export", { count: visible.length });
  }

  return (
    <Layout>
      <SEOHead
        title="Avaliações de Clientes | Assistência Técnica em Curitiba e Região"
        description="Avaliações reais de clientes do atendimento técnico em Curitiba e região, com nota em estrelas, bairro e serviço. Publicadas apenas com aprovação e autorização expressa do cliente."
        canonical={`${SITE_ORIGIN}/avaliacoes`}
        breadcrumbs={[
          { name: "Início", url: `${SITE_ORIGIN}/` },
          { name: "Avaliações", url: `${SITE_ORIGIN}/avaliacoes` },
        ]}
        faq={faq}
        structuredData={schema ? [schema] : undefined}
      />

      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Prova social auditável
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Avaliações de clientes
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
            Todas as avaliações abaixo vêm de atendimentos com Ordem de Serviço, foram aprovadas na
            moderação e têm autorização expressa de publicação. Filtre por bairro ou serviço e
            exporte a lista para auditoria.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <label className="sr-only" htmlFor="rv-bairro">
              Filtrar por bairro
            </label>
            <select
              id="rv-bairro"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="h-11 rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="all">Todos os bairros</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="rv-servico">
              Filtrar por serviço
            </label>
            <select
              id="rv-servico"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="h-11 rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="all">Todos os serviços</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={exportReviews}
              disabled={!visible.length}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar avaliações
            </Button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Carregando avaliações...</p>
          ) : visible.length === 0 ? (
            <div className="rounded-xl border border-border p-6">
              <p className="text-muted-foreground">
                Ainda não há avaliações publicadas com esse filtro. Foi atendido por nós?{" "}
                <Link to="/como-avaliar" className="text-primary underline">
                  Veja como avaliar
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {visible.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-card p-6">
                  <Quote className="w-6 h-6 text-primary/40 mb-3" aria-hidden="true" />
                  <div
                    className="flex gap-0.5 mb-3"
                    aria-label={`Nota ${r.rating} de 5`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  {r.comment && <p className="text-foreground mb-4">{r.comment}</p>}
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[formatReviewLocation(r), r.service].filter(Boolean).join(" · ")} ·{" "}
                    {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="rounded-xl border border-border p-6 mt-12">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Como funcionam as avaliações
            </h2>
            <dl className="space-y-4">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-foreground">{item.question}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </Layout>
  );
}
