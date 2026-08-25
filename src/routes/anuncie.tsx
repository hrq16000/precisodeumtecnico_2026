import { createFileRoute } from "@tanstack/react-router";
import Anuncie from "@/pages/Anuncie";

export const Route = createFileRoute("/anuncie")({
  component: Anuncie,
});
