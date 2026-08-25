import { createFileRoute } from "@tanstack/react-router";
import ServicoBairroCuritiba from "@/pages/ServicoBairroCuritiba";

export const Route = createFileRoute("/servicos/reparo-smart-tv/curitiba/$bairro")({
  component: () => <ServicoBairroCuritiba service="reparo-smart-tv" />,
});
