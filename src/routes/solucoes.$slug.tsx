import { createFileRoute } from "@tanstack/react-router";
import SolucaoGuia from "@/pages/SolucaoGuia";

export const Route = createFileRoute("/solucoes/$slug")({
  component: SolucaoGuia,
});
