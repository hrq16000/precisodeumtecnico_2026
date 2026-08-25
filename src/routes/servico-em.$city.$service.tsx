import { createFileRoute } from "@tanstack/react-router";
import ServicoCidade from "@/pages/ServicoCidade";

export const Route = createFileRoute("/servico-em/$city/$service")({
  component: ServicoCidade,
});
