import { createFileRoute } from "@tanstack/react-router";
import GuiaTecnicoInformatica from "@/pages/GuiaTecnicoInformatica";

export const Route = createFileRoute("/guia-tecnico-informatica")({
  component: GuiaTecnicoInformatica,
});
