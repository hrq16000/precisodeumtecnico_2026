import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import { trackCtaClick, type CtaSurface } from "@/lib/analytics";

/**
 * Bloco de links internos com âncoras consistentes entre as páginas que mais
 * convertem (Home, /areas-atendidas e /precos). O texto da âncora é fixo por
 * destino para consolidar o sinal semântico em todas as superfícies.
 */
export type RelatedLinkKey = "home" | "areas" | "precos" | "servicos" | "faq";

const LINKS: Record<
  RelatedLinkKey,
  { to: string; anchor: string; description: string; ctaId: string }
> = {
  home: {
    to: "/",
    anchor: "Assistência técnica em Curitiba e região",
    description: "Serviços, prazos e como abrir a triagem online sem telefone.",
    ctaId: "related_home",
  },
  areas: {
    to: "/areas-atendidas",
    anchor: "Áreas atendidas: cidades e bairros",
    description: "Cobertura rota por rota em Curitiba, RMC e atendimento nacional.",
    ctaId: "related_areas",
  },
  precos: {
    to: "/precos",
    anchor: "Preços e condições de atendimento",
    description: "Visita a partir de R$ 99,99 e coleta por R$ 299,99, com orçamento antes do reparo.",
    ctaId: "related_precos",
  },
  servicos: {
    to: "/servicos",
    anchor: "Todos os serviços técnicos",
    description: "Informática, notebooks, CFTV, elétrica e ar-condicionado.",
    ctaId: "related_servicos",
  },
  faq: {
    to: "/faq",
    anchor: "Perguntas frequentes",
    description: "Garantia, prazos, formas de pagamento e regras de orçamento.",
    ctaId: "related_faq",
  },
};

interface RelatedLinksSectionProps {
  /** Chaves na ordem desejada. O destino igual à página atual deve ser omitido. */
  items: RelatedLinkKey[];
  title?: string;
  /** Superfície usada no tracking GA4. */
  surface: CtaSurface;
}

export function RelatedLinksSection({
  items,
  title = "Continue por aqui",
  surface,
}: RelatedLinksSectionProps) {
  return (
    <section
      id="links-relacionados"
      aria-labelledby="links-relacionados-title"
      className="py-12 bg-muted/30 border-t border-border scroll-mt-24"
    >
      <div className="container-custom">
        <h2 id="links-relacionados-title" className="text-2xl md:text-3xl font-bold mb-6">
          {title}
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((key) => {
            const link = LINKS[key];
            return (
              <li key={key}>
                <Link
                  to={link.to}
                  data-testid={`related-link-${key}`}
                  className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-colors hover:border-success"
                  onClick={() =>
                    trackCtaClick({
                      surface,
                      cta_id: link.ctaId,
                      label: link.anchor,
                      destination: link.to,
                    })
                  }
                >
                  <span className="inline-flex items-center gap-2 font-semibold group-hover:text-success">
                    {link.anchor}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-muted-foreground">{link.description}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
