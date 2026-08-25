import { createFileRoute } from "@tanstack/react-router";
import AtendimentoUrgente from "@/pages/AtendimentoUrgente";

export const Route = createFileRoute("/atendimento-urgente")({
  component: AtendimentoUrgente,
});
