import { createFileRoute } from "@tanstack/react-router";
import SolucoesHub from "@/pages/SolucoesHub";

export const Route = createFileRoute("/solucoes/")({
  component: SolucoesHub,
});
