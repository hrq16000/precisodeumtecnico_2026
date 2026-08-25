import { createFileRoute } from "@tanstack/react-router";
import CidadeNacional from "@/pages/CidadeNacional";

export const Route = createFileRoute("/atendimento-nacional/$slug")({
  component: CidadeNacional,
});
