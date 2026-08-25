import { useEffect, useState } from "react";
import { Helmet } from "@/lib/helmet-compat";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { supabase } from "@/integrations/supabase/client";
import {
  buildPublishedReviewsSchema,
  formatReviewLocation,
  type PublishedReview,
} from "@/lib/reviews";

export function TestimonialsSection() {
  // Avaliações reais aprovadas no painel e com autorização de publicação.
  // Nada é exibido (nem entra no JSON-LD) sem esses dois requisitos.
  const [approved, setApproved] = useState<PublishedReview[]>([]);
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");


  useEffect(() => {
    let active = true;
    supabase
      .from("reviews")
      .select("id,name,city,neighborhood,service,rating,comment,created_at")
      .eq("status", "approved")
      .eq("publish_consent", true)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (active && data) setApproved(data as PublishedReview[]);
      });
    return () => {
      active = false;
    };
  }, []);

  const approvedSchema = buildPublishedReviewsSchema(approved);

  // Filtros públicos (bairro / serviço) sobre avaliações aprovadas E autorizadas.
  const neighborhoods = Array.from(
    new Set(approved.map((r) => r.neighborhood).filter(Boolean) as string[]),
  ).sort();
  const services = Array.from(
    new Set(approved.map((r) => r.service).filter(Boolean) as string[]),
  ).sort();
  const visibleApproved = approved.filter((r) => {
    if (neighborhoodFilter !== "all" && (r.neighborhood || "") !== neighborhoodFilter) return false;
    if (serviceFilter !== "all" && (r.service || "") !== serviceFilter) return false;
    return true;
  });


  return <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Depoimentos
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O Que Nossos{" "}
            <span className="text-gradient text-primary-foreground">Clientes Dizem</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Milhares de clientes satisfeitos em toda a região. Veja o que eles falam sobre nosso atendimento.
          </p>
        </div>

        {approvedSchema && (
          <Helmet>
            <script type="application/ld+json">{JSON.stringify(approvedSchema)}</script>
          </Helmet>
        )}

        {approved.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <select
              value={neighborhoodFilter}
              onChange={(e) => setNeighborhoodFilter(e.target.value)}
              aria-label="Filtrar depoimentos por bairro"
              className="h-12 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
            >
              <option value="all">Todos os bairros</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              aria-label="Filtrar depoimentos por serviço"
              className="h-12 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
            >
              <option value="all">Todos os serviços</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {approved.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {visibleApproved.map((r) => (

              <div
                key={r.id}
                data-approved-review
                className="bg-card rounded-2xl p-6 card-shadow border border-primary/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-1" aria-label={`Nota ${r.rating} de 5`}>
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" aria-hidden="true" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/20" aria-hidden="true" />
                </div>
                {r.comment && (
                  <p className="text-card-foreground mb-6 leading-relaxed">"{r.comment}"</p>
                )}
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-card-foreground">{r.name}</p>
                  <p className="text-muted-foreground text-sm">{formatReviewLocation(r)}</p>
                  {r.service && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {r.service}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-card rounded-2xl p-6 card-shadow border border-border/50 hover:card-shadow-hover transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-1">
                  {Array.from({
                length: testimonial.rating
              }).map((_, i) => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
                </div>
                <Quote className="w-8 h-8 text-primary/20" />
              </div>
              
              <p className="text-card-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {testimonial.service}
                </span>
              </div>
            </div>)}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border/50 card-shadow">
            <div className="flex">
              {Array.from({
              length: 5
            }).map((_, i) => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
            </div>
            <span className="text-card-foreground font-medium">
              Depoimentos reais de clientes atendidos pela nossa rede
            </span>
          </div>
        </div>
      </div>
    </section>;
}