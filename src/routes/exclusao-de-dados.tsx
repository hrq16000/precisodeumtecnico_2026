import { createFileRoute } from "@tanstack/react-router";
import ExclusaoDeDados from "@/pages/ExclusaoDeDados";

export const Route = createFileRoute("/exclusao-de-dados")({
  component: ExclusaoDeDados,
});
