import { createFileRoute } from "@tanstack/react-router";
import BairroDetalhe from "@/pages/BairroDetalhe";

export const Route = createFileRoute("/regioes/$city/$neighborhood")({
  component: BairroDetalhe,
});
