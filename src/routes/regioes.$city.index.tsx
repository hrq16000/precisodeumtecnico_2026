import { createFileRoute } from "@tanstack/react-router";
import RegiaoDetalhe from "@/pages/RegiaoDetalhe";

export const Route = createFileRoute("/regioes/$city/")({
  component: RegiaoDetalhe,
});
