import { createFileRoute } from "@tanstack/react-router";
import StatusOrdemServico from "@/pages/StatusOrdemServico";

export const Route = createFileRoute("/status-da-ordem-de-servico")({
  component: StatusOrdemServico,
});
