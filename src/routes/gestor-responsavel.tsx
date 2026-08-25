import { createFileRoute } from "@tanstack/react-router";
import GestorResponsavel from "@/pages/GestorResponsavel";

export const Route = createFileRoute("/gestor-responsavel")({
  component: GestorResponsavel,
});
