import { createFileRoute } from "@tanstack/react-router";
import Avaliacoes from "@/pages/Avaliacoes";

export const Route = createFileRoute("/avaliacoes")({
  component: Avaliacoes,
});
