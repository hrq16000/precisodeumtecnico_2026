import { createFileRoute } from "@tanstack/react-router";
import PoliticaPecasCliente from "@/pages/PoliticaPecasCliente";

export const Route = createFileRoute("/politica-de-pecas-do-cliente")({
  component: PoliticaPecasCliente,
});
