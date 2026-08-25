import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/patrocinadores")({
  beforeLoad: () => {
    throw redirect({ href: "/anuncie", statusCode: 301 });
  },
});
