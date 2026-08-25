import { createFileRoute } from "@tanstack/react-router";
import AvaliarAtendimento from "@/pages/AvaliarAtendimento";

export const Route = createFileRoute("/avaliar")({
  component: AvaliarAtendimento,
});
