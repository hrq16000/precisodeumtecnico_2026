import { createFileRoute } from "@tanstack/react-router";
import TriagemPreview from "@/pages/TriagemPreview";

export const Route = createFileRoute("/triagem-preview")({
  component: TriagemPreview,
});
