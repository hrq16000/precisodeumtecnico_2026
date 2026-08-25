import { createFileRoute } from "@tanstack/react-router";
import AbrirOrdemServico from "@/pages/AbrirOrdemServico";

export const Route = createFileRoute("/abrir-os")({
  head: () => ({
    meta: [
      { title: "Abrir Ordem de Serviço — Código Único e Termos Claros" },
      {
        name: "description",
        content:
          "Abra sua O.S. em minutos: código único rastreável, visita técnica ou coleta para laboratório e todos os termos visíveis antes do aceite.",
      },
      { property: "og:title", content: "Abrir Ordem de Serviço — Código Único e Termos Claros" },
      {
        property: "og:description",
        content:
          "Gere o código da sua Ordem de Serviço, revise os termos da modalidade e envie o resumo completo pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AbrirOrdemServico,
});
