import { useEffect } from "react";
import { useLocation } from "@/lib/router-compat";

/**
 * Global scroll-reveal: aplica a classe `.is-visible` em qualquer
 * <section>, [data-reveal] ou card quando entra no viewport.
 * Funciona em todas as páginas sem precisar editá-las individualmente.
 */
export function GlobalReveal() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll<HTMLElement>(".reveal-on-scroll")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const selector = [
      "main section",
      "main [data-reveal]",
      "main .service-card",
      "main .region-card",
      "main .stat-card",
      "main .trust-badge",
    ].join(", ");

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );

    targets.forEach((el, i) => {
      if (el.dataset.revealApplied === "1") return;
      el.dataset.revealApplied = "1";
      el.classList.add("reveal-on-scroll");
      // staggered delay (cap at 240ms)
      const delay = Math.min(i * 60, 240);
      el.style.transitionDelay = `${delay}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // already in view at mount
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, [location.pathname]);

  return null;
}
