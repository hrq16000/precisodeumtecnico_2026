/**
 * Card editorial discreto (Rodada 3O).
 *
 * Liga páginas comerciais aos dois guias educacionais empresariais sem
 * transformar a página em lista de artigos: no máximo dois links, sem CTA
 * paralelo, sem formulário e sem alterar o contrato semântico da página.
 */
import { Link } from "@/lib/router-compat";
import { BookOpen, ArrowRight } from "lucide-react";

export interface RelatedGuideLink {
  to: string;
  label: string;
  description: string;
}

export const GUIDE_LINKS: Record<"ti" | "workstation", RelatedGuideLink> = {
  ti: {
    to: "/guias/organizacao-de-ti-para-pequenos-escritorios",
    label: "Como organizar a informática de um pequeno escritório",
    description:
      "Inventário, sistemas de terceiros, backup testado, continuidade e o que registrar antes de pedir suporte.",
  },
  workstation: {
    to: "/guias/como-escolher-uma-workstation",
    label: "Como escolher uma workstation profissional",
    description:
      "Levantamento de requisitos, critérios por componente, testes de validação e limites de desempenho.",
  },
};

interface Props {
  links: RelatedGuideLink[];
  title?: string;
}

export function RelatedGuidesCard({ links, title = "Conteúdo relacionado" }: Props) {
  if (!links.length) return null;
  return (
    <aside aria-label={title} className="container-custom my-10">
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <p className="flex items-center gap-2 font-semibold text-card-foreground mb-3">
          <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
          {title}
        </p>
        <ul className="space-y-3">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="group flex items-start gap-2">
                <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                <span>
                  <span className="block font-medium text-card-foreground group-hover:text-primary">{l.label}</span>
                  <span className="block text-sm text-muted-foreground">{l.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
