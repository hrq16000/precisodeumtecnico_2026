import { createFileRoute } from "@tanstack/react-router";
import BairroNacional from "@/pages/BairroNacional";

export const Route = createFileRoute("/atendimento-nacional/$city/$bairro")({
  component: BairroNacional,
});
