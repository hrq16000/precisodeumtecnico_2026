import { createFileRoute } from "@tanstack/react-router";
import DadosEmpresa from "@/pages/DadosEmpresa";

export const Route = createFileRoute("/dados-da-empresa")({
  component: DadosEmpresa,
});
