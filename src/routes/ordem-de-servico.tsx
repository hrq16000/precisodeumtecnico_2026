import { createFileRoute } from "@tanstack/react-router";
import AbrirOrdemServico from "@/pages/AbrirOrdemServico";

export const Route = createFileRoute("/ordem-de-servico")({
  head: () => ({
    meta: [
      { title: "Ordem de Serviço — Abertura com Código Único" },
      {
        name: "description",
        content:
          "Abertura de Ordem de Serviço com código único rastreável, escolha entre visita técnica e coleta para laboratório e termos completos antes do aceite.",
      },
      { property: "og:title", content: "Ordem de Serviço — Abertura com Código Único" },
      {
        property: "og:description",
        content:
          "Abra sua O.S., revise os termos da modalidade escolhida e envie o resumo formatado pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AbrirOrdemServico,
});
