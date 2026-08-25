import { createFileRoute } from "@tanstack/react-router";
import Busca from "@/pages/Busca";

export const Route = createFileRoute("/busca")({
  component: Busca,
});
