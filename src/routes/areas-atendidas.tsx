import { createFileRoute } from "@tanstack/react-router";
import AreasAtendidas from "@/pages/AreasAtendidas";

export const Route = createFileRoute("/areas-atendidas")({
  component: AreasAtendidas,
});
