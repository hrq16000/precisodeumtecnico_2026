import { createFileRoute } from "@tanstack/react-router";
import ServicoDetalhe from "@/pages/ServicoDetalhe";

export const Route = createFileRoute("/servicos/$slug")({
  component: ServicoDetalhe,
});
