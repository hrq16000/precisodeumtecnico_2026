import { createFileRoute } from "@tanstack/react-router";
import PainelConversao from "@/pages/PainelConversao";

export const Route = createFileRoute("/operacao/painel-conversao")({
  component: PainelConversao,
});
