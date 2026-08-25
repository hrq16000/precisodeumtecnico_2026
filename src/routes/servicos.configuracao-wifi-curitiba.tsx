import { createFileRoute } from "@tanstack/react-router";
import ConfiguracaoWifiCuritiba from "@/pages/ConfiguracaoWifiCuritiba";

export const Route = createFileRoute("/servicos/configuracao-wifi-curitiba")({
  component: ConfiguracaoWifiCuritiba,
});
