import { createFileRoute } from "@tanstack/react-router";
import ConsertoSomAudio from "@/pages/ConsertoSomAudio";

export const Route = createFileRoute("/servicos/conserto-de-som-e-audio-curitiba")({
  component: ConsertoSomAudio,
});
