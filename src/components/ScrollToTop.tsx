import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "@/lib/router-compat";

/**
 * Smart scroll manager for the SPA:
 *
 * - On PUSH/REPLACE navigations without `#hash`: scroll to top (smooth when
 *   safe, instant when the user prefers reduced motion).
 * - On navigations with `#hash`: try to find the element immediately, and if
 *   it isn't mounted yet (data still loading, code-split bundle, etc.) keep
 *   retrying via MutationObserver for up to ~6s.
 * - On POP navigations (back / forward): restore the previous scroll position
 *   for that history entry instead of jumping to the top.
 */

const STORAGE_KEY = "lov_scroll_positions";
type Positions = Record<string, number>;

function loadPositions(): Positions {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePositions(map: Positions) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function keyForLocation(loc: { pathname: string; search: string }) {
  return loc.pathname + loc.search;
}

export function ScrollToTop() {
  const location = useLocation();
  const navType = useNavigationType(); // "POP" | "PUSH" | "REPLACE"
  const prevKey = useRef<string | null>(null);

  // Persist scroll position before leaving the current entry.
  useEffect(() => {
    const onScroll = () => {
      if (!prevKey.current) return;
      const map = loadPositions();
      map[prevKey.current] = window.scrollY;
      savePositions(map);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Disable the browser's automatic scroll restoration so we can manage it.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    const currentKey = keyForLocation(location);
    const reduced = prefersReducedMotion();
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

    // 1) Anchor scrolling — try now, then retry as the DOM grows.
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      let resolved = false;

      const attempt = () => {
        const el = document.getElementById(id);
        if (el) {
          // Anchors should always be instant — feels broken otherwise.
          el.scrollIntoView({ behavior: "auto", block: "start" });
          resolved = true;
          return true;
        }
        return false;
      };

      if (!attempt()) {
        const observer = new MutationObserver(() => {
          if (attempt()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        const timeout = window.setTimeout(() => observer.disconnect(), 6000);
        // Cleanup on next route change.
        return () => {
          observer.disconnect();
          window.clearTimeout(timeout);
          prevKey.current = currentKey;
          if (!resolved) {
            // Hash never resolved — at least don't leave the user mid-page.
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          }
        };
      }
      prevKey.current = currentKey;
      return;
    }

    // 2) POP (back/forward) — restore saved position if any.
    if (navType === "POP") {
      const saved = loadPositions()[currentKey];
      if (typeof saved === "number") {
        window.scrollTo({ top: saved, left: 0, behavior: "auto" });
        prevKey.current = currentKey;
        return;
      }
    }

    // 3) Normal navigation — scroll to top imediatamente (auto) e reforça
    //    no próximo frame para cobrir layout shifts pós-mount.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior });
    });
    prevKey.current = currentKey;
    return () => cancelAnimationFrame(raf);
  }, [location, navType]);

  return null;
}
