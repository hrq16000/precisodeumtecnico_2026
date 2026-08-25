import { createFileRoute } from "@tanstack/react-router";
import TrocaDeTelaTVCuritiba from "@/pages/TrocaDeTelaTVCuritiba";

export const Route = createFileRoute("/servicos/troca-de-tela-tv-curitiba")({
  component: TrocaDeTelaTVCuritiba,
});
