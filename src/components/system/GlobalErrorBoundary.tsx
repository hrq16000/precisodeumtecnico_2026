import { Component, type ErrorInfo, type ReactNode } from "react";
import { captureHandledError } from "@/lib/sentry";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Boundary global — captura erros de render/hidratação de rotas lazy.
 * Encaminha para Sentry (se DSN presente) e mostra fallback textual mínimo,
 * garantindo que o site permaneça navegável mesmo com falha em uma rota.
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    captureHandledError(error, {
      componentStack: info.componentStack ?? undefined,
      route: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    // Log local mínimo — sem PII, apenas mensagem e rota.
    // Útil quando Sentry DSN não está configurado.
    // eslint-disable-next-line no-console
    console.warn(
      "[GlobalErrorBoundary] render error captured",
      error.message,
      typeof window !== "undefined" ? window.location.pathname : "(ssr)",
    );
  }

  reset = () => this.setState({ hasError: false, message: undefined });

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          role="alert"
          className="min-h-[50vh] flex items-center justify-center p-8"
          data-testid="global-error-boundary"
        >
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Algo deu errado ao carregar esta página
            </h1>
            <p className="mt-3 text-muted-foreground">
              Já registramos o erro. Tente recarregar a página ou voltar para o
              início.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold"
              >
                Recarregar
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-md border border-border font-semibold text-foreground"
              >
                Ir para o início
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
