import { createFileRoute } from "@tanstack/react-router";
import TermosOrcamento from "@/pages/TermosOrcamento";

export const Route = createFileRoute("/termos-orcamento-pre-aprovado")({
  component: TermosOrcamento,
});
