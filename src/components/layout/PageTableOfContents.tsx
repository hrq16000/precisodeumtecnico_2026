/**
 * Rodada 3P — sumário navegável para páginas longas.
 *
 * Recebe os headings reais da página (id + rótulo). No mobile fica recolhido
 * num <details>; no desktop é uma lista simples. Sem sticky invasivo e sem
 * dependência nova.
 *
 * Rodada 3R — acessibilidade por teclado:
 *  - foco visível explícito (ring) em links e no summary;
 *  - ao ativar um item, o foco move para a seção-alvo (tabindex=-1), então
 *    leitores de tela e navegação por Tab continuam do ponto certo;
 *  - garante `scroll-margin-top` no alvo marcando `data-toc-anchor`, para o
 *    título não ficar sob o header fixo;
 *  - respeita `prefers-reduced-motion` no scroll suave.
 */
import { ListTree } from "lucide-react";

export interface TocItem {
  id: string;
  label: string;
}

interface Props {
  items: TocItem[];
  title?: string;
  className?: string;
}

const focusRing =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

export function PageTableOfContents({ items, title = "Nesta página", className = "" }: Props) {
  if (items.length < 2) return null;

  function goTo(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return; // sem alvo, deixa o navegador tentar a âncora nativa
    e.preventDefault();
    target.setAttribute("data-toc-anchor", "");
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
    if (window.history?.replaceState) {
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  const list = (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={(e) => goTo(e, item.id)}
            className={`inline-flex min-h-11 items-center text-sm text-primary hover:underline focus-visible:underline ${focusRing}`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav data-page-toc aria-label={title} className={`rounded-xl border border-border bg-card p-4 ${className}`}>
      <details className="md:hidden" open={false}>
        <summary
          className={`flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-card-foreground ${focusRing}`}
        >
          <ListTree className="h-4 w-4 text-primary" aria-hidden="true" />
          {title}
        </summary>
        {list}
      </details>
      <div className="hidden md:block">
        <p className="flex items-center gap-2 font-semibold text-card-foreground">
          <ListTree className="h-4 w-4 text-primary" aria-hidden="true" />
          {title}
        </p>
        {list}
      </div>
    </nav>
  );
}
