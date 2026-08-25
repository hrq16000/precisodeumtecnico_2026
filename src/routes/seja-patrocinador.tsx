import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/seja-patrocinador")({
  beforeLoad: () => {
    throw redirect({ href: "/anuncie", statusCode: 301 });
  },
});
