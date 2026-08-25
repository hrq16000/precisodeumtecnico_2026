import { createFileRoute } from "@tanstack/react-router";
import ServicoCuritibaContratacao from "@/pages/ServicoCuritibaContratacao";

export const Route = createFileRoute("/servicos/$servico/curitiba")({
  component: ServicoCuritibaContratacao,
});
