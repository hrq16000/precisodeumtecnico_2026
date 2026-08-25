import { createFileRoute } from "@tanstack/react-router";
import PainelGoogleBusiness from "@/pages/PainelGoogleBusiness";

export const Route = createFileRoute("/operacao/painel-google-business")({
  component: PainelGoogleBusiness,
});
