import { createFileRoute } from "@tanstack/react-router";
import AtendimentoNacional from "@/pages/AtendimentoNacional";

export const Route = createFileRoute("/atendimento-nacional/")({
  component: AtendimentoNacional,
});
