import { createFileRoute } from "@tanstack/react-router";
import ConsultarOrdemServico from "@/pages/ConsultarOrdemServico";

export const Route = createFileRoute("/consultar-os")({
  head: () => ({
    meta: [
      { title: "Consultar Ordem de Serviço — Código Único e Status" },
      {
        name: "description",
        content:
          "Consulte sua Ordem de Serviço pelo código único: equipamento, modalidade, termos aceitos, resumo enviado e o status atual do atendimento.",
      },
      { property: "og:title", content: "Consultar Ordem de Serviço — Código Único e Status" },
      {
        property: "og:description",
        content:
          "Busque sua O.S. pelo código rastreável e acompanhe o status, os termos aceitos e o resumo enviado na abertura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsultarOrdemServico,
});
