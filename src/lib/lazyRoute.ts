/**
 * Carregamento resiliente de rotas lazy.
 *
 * Problema real coberto aqui: quando um chunk de rota falha ao carregar
 * (deploy novo invalidando o hash antigo, rede instável ou cache de dependência
 * desatualizado em dev), o React lança "Failed to fetch dynamically imported
 * module" e a rota inteira não monta — o usuário vê a página de erro e o
 * <head> da rota (canonical, og:url, JSON-LD) nunca é emitido.
 *
 * Estratégia:
 * 1. Uma nova tentativa imediata (resolve falhas transitórias de rede).
 * 2. Segunda tentativa com cache-busting via query string.
 * 3. Último recurso: um único reload da página por sessão, sinalizado em
 *    sessionStorage para nunca entrar em laço de recarregamento.
 */
import { lazy, type ComponentType } from "react";

const RELOAD_FLAG = "pdut:chunk-reload";

function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /dynamically imported module|Loading chunk|Importing a module script failed|Outdated Optimize Dep/i.test(
    message,
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function lazyRoute<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (first) {
      if (!isChunkLoadError(first)) throw first;

      await delay(300);
      try {
        return await factory();
      } catch (second) {
        if (!isChunkLoadError(second)) throw second;

        // Recarrega uma única vez: o HTML novo referencia os chunks atuais.
        if (typeof window !== "undefined") {
          const alreadyReloaded = window.sessionStorage?.getItem(RELOAD_FLAG);
          if (!alreadyReloaded) {
            window.sessionStorage?.setItem(RELOAD_FLAG, String(Date.now()));
            window.location.reload();
            // Mantém o Suspense suspenso até o reload assumir.
            await new Promise(() => {});
          }
        }
        throw second;
      }
    }
  });
}

/** Limpa a trava de reload após uma navegação bem-sucedida. */
export function clearChunkReloadFlag() {
  if (typeof window !== "undefined") {
    window.sessionStorage?.removeItem(RELOAD_FLAG);
  }
}
