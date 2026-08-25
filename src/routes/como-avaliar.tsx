import { createFileRoute } from "@tanstack/react-router";
import ComoAvaliar from "@/pages/ComoAvaliar";

export const Route = createFileRoute("/como-avaliar")({
  component: ComoAvaliar,
});
