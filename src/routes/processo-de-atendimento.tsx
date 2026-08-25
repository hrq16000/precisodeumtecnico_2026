import { createFileRoute } from "@tanstack/react-router";
import ProcessoAtendimento from "@/pages/ProcessoAtendimento";

export const Route = createFileRoute("/processo-de-atendimento")({
  component: ProcessoAtendimento,
});
