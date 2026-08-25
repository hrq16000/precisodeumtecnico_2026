import { createFileRoute } from "@tanstack/react-router";
import ServicoBairroCuritiba from "@/pages/ServicoBairroCuritiba";

export const Route = createFileRoute("/servicos/configuracao-wifi/curitiba/$bairro")({
  component: () => <ServicoBairroCuritiba service="configuracao-wifi" />,
});
