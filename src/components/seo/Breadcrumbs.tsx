import { Fragment } from "react";
import { Link } from "@/lib/router-compat";
import { ChevronRight } from "lucide-react";

/**
 * Trilha de navegação VISUAL. O BreadcrumbList JSON-LD continua sendo emitido
 * pelo SEOHead (prop `breadcrumbs`) — este componente não duplica schema,
 * apenas renderiza a mesma trilha para o usuário e para o crawler de links,
 * reduzindo a profundidade de clique das rotas programáticas.
 */

export interface Crumb {
  name: string;
  /** URL absoluta (mesma passada ao SEOHead) ou path relativo. */
  url: string;
}

function toPath(url: string): string {
  try {
    return /^https?:\/\//i.test(url) ? new URL(url).pathname : url;
  } catch {
    return url;
  }
}

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  if (!items || items.length < 2) return null;
  const last = items.length - 1;

  return (
    <nav aria-label="Você está aqui" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-muted-foreground">
        {items.map((item, i) => (
          <Fragment key={`${item.url}-${i}`}>
            <li className="inline-flex items-center">
              {i === last ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.name}
                </span>
              ) : (
                <Link to={toPath(item.url)} className="hover:text-primary underline-offset-4 hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
            {i !== last && (
              <li aria-hidden="true" className="inline-flex items-center">
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
