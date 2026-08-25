import { createFileRoute } from "@tanstack/react-router";
import StatusOrdemServico from "@/pages/StatusOrdemServico";

export const Route = createFileRoute("/status-os")({
  component: StatusOrdemServico,
});
