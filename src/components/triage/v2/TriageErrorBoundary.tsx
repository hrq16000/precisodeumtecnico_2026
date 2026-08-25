import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props { onReset: () => void; children: ReactNode }
interface State { hasError: boolean; message?: string }

export class TriageErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };
  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }
  override componentDidCatch(_err: Error, _info: ErrorInfo) {
    // Não expor dados sensíveis nos logs.
    // eslint-disable-next-line no-console
    console.warn("[triage] boundary caught error");
  }
  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
    this.props.onReset();
  };
  override render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="space-y-4 p-6 text-center" role="alert">
        <h2 className="text-lg font-bold">Precisamos reiniciar a triagem</h2>
        <p className="text-sm text-muted-foreground">
          Detectamos uma inconsistência. Suas respostas foram descartadas para evitar mistura de informações.
        </p>
        <Button onClick={this.handleReset}>Reiniciar triagem</Button>
      </div>
    );
  }
}
