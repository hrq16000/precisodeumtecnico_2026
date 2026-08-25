import { createFileRoute } from "@tanstack/react-router";
import ReparoSmartTVCuritiba from "@/pages/ReparoSmartTVCuritiba";

export const Route = createFileRoute("/servicos/reparo-smart-tv-curitiba")({
  component: ReparoSmartTVCuritiba,
});
