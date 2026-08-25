import { createFileRoute } from "@tanstack/react-router";
import ServicoBairroNacional from "@/pages/ServicoBairroNacional";

export const Route = createFileRoute("/servico-em-nacional/$city/$bairro/$service")({
  component: ServicoBairroNacional,
});
