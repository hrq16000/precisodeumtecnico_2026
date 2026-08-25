import { useCallback, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

/**
 * Checklist interno de publicação (rota não indexável).
 *
 * Carrega cada rota num iframe same-origin, aguarda a hidratação do
 * react-helmet e confere no DOM real: title, meta description, canonical
 * absoluto, meta robots e blocos JSON-LD. Serve como conferência manual
 * pós-deploy, complementando os gates automáticos do CI.
 */

const DEFAULT_ROUTES = [
  "/",
  "/servicos",
  "/precos",
  "/garantia-e-cobertura",
  "/assistencia-tecnica-curitiba",
  "/atendimento-nacional",
  "/atendimento-nacional/sao-paulo",
  "/atendimento-nacional/sao-paulo/pinheiros",
  "/servico-em-nacional/sao-paulo/pinheiros/informatica",
  "/termos-orcamento-pre-aprovado",
];

interface RouteCheck {
  path: string;
  status: "idle" | "running" | "done" | "error";
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  schemas?: string[];
  h1Count?: number;
  problems?: string[];
}

const ORIGIN_RE = /^https:\/\/(www\.)?precisodeumtecnico\.com/;

function inspect(doc: Document, path: string): Omit<RouteCheck, "path" | "status"> {
  const get = (sel: string, attr = "content") =>
    doc.querySelector(sel)?.getAttribute(attr)?.trim() ?? "";
  const title = doc.title?.trim();
  const description = get('meta[name="description"]');
  const canonical = get('link[rel="canonical"]', "href");
  const robots = get('meta[name="robots"]') || "(ausente — indexável)";
  const schemas: string[] = [];
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
    try {
      const parsed = JSON.parse(s.textContent || "{}");
      const nodes = Array.isArray(parsed) ? parsed : parsed["@graph"] ?? [parsed];
      for (const n of nodes as Record<string, unknown>[]) {
        const t = n?.["@type"];
        schemas.push(Array.isArray(t) ? String(t[0]) : String(t ?? "?"));
      }
    } catch {
      schemas.push("JSON inválido");
    }
  });
  const h1Count = doc.querySelectorAll("h1").length;

  const problems: string[] = [];
  if (!title || title.length < 15) problems.push("title ausente ou curto");
  if (!description || description.length < 60) problems.push("description ausente ou curta");
  if (!canonical) problems.push("canonical ausente");
  else if (!ORIGIN_RE.test(canonical)) problems.push("canonical não absoluto no domínio");
  else if ((new URL(canonical).pathname.replace(/\/$/, "") || "/") !== (path.replace(/\/$/, "") || "/"))
    problems.push(`canonical aponta para ${new URL(canonical).pathname}`);
  if (h1Count !== 1) problems.push(`H1 encontrado ${h1Count}x (esperado 1)`);
  if (schemas.length === 0) problems.push("nenhum JSON-LD");
  if (/noindex/i.test(robots)) problems.push("robots=noindex");

  return { title, description, canonical, robots, schemas, h1Count, problems };
}

export default function ChecklistPublicacao() {
  const [routesText, setRoutesText] = useState(DEFAULT_ROUTES.join("\n"));
  const [checks, setChecks] = useState<RouteCheck[]>([]);
  const [running, setRunning] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const routes = useMemo(
    () => routesText.split("\n").map((r) => r.trim()).filter(Boolean),
    [routesText],
  );

  const runAll = useCallback(async () => {
    setRunning(true);
    setChecks(routes.map((path) => ({ path, status: "idle" as const })));
    for (let i = 0; i < routes.length; i++) {
      const path = routes[i];
      setChecks((c) => c.map((x, idx) => (idx === i ? { ...x, status: "running" } : x)));
      try {
        const frame = frameRef.current!;
        await new Promise<void>((resolve) => {
          const onLoad = () => {
            frame.removeEventListener("load", onLoad);
            resolve();
          };
          frame.addEventListener("load", onLoad);
          frame.src = path;
        });
        // espera a hidratação do helmet escrever as tags
        let doc = frame.contentDocument!;
        for (let t = 0; t < 40; t++) {
          doc = frame.contentDocument!;
          if (doc?.querySelector('link[rel="canonical"]') && doc.querySelector("h1")) break;
          await new Promise((r) => setTimeout(r, 250));
        }
        const result = inspect(doc, path);
        setChecks((c) => c.map((x, idx) => (idx === i ? { ...x, ...result, status: "done" } : x)));
      } catch (e) {
        setChecks((c) =>
          c.map((x, idx) =>
            idx === i ? { ...x, status: "error", problems: [String(e)] } : x,
          ),
        );
      }
    }
    setRunning(false);
  }, [routes]);

  const okCount = checks.filter((c) => c.status === "done" && !(c.problems?.length)).length;

  return (
    <Layout>
      <Helmet>
        <title>Checklist de publicação (interno)</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground">Checklist de publicação</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Conferência manual pós-deploy do DOM hidratado: title, description, canonical,
          robots, H1 e JSON-LD. Página interna, não indexável.
        </p>

        <Card className="mt-6 p-4">
          <label htmlFor="routes" className="text-sm font-medium text-foreground">
            Rotas (uma por linha)
          </label>
          <textarea
            id="routes"
            className="mt-2 h-40 w-full rounded-md border border-border bg-background p-2 font-mono text-xs"
            value={routesText}
            onChange={(e) => setRoutesText(e.target.value)}
          />
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={runAll} disabled={running || routes.length === 0}>
              {running ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando…</> : "Verificar rotas"}
            </Button>
            {checks.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {okCount}/{checks.length} sem problemas
              </span>
            )}
            <Button
              variant="outline"
              disabled={checks.length === 0}
              onClick={() => {
                const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), checks }, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `checklist-publicacao-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Exportar relatório
            </Button>
          </div>
        </Card>

        <ul className="mt-6 space-y-3">
          {checks.map((c) => {
            const ok = c.status === "done" && !(c.problems?.length);
            return (
              <li key={c.path}>
                <Card className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-sm font-semibold text-foreground">{c.path}</code>
                    {c.status === "running" && <Loader2 className="h-4 w-4 animate-spin" />}
                    {c.status === "done" && (ok
                      ? <Badge className="gap-1"><CheckCircle2 className="h-3 w-3" /> OK</Badge>
                      : <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> {c.problems!.length}</Badge>)}
                  </div>
                  {c.status === "done" && (
                    <dl className="mt-3 grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                      <div><dt className="inline font-medium text-foreground">title: </dt><dd className="inline">{c.title}</dd></div>
                      <div><dt className="inline font-medium text-foreground">canonical: </dt><dd className="inline break-all">{c.canonical}</dd></div>
                      <div className="sm:col-span-2"><dt className="inline font-medium text-foreground">description: </dt><dd className="inline">{c.description}</dd></div>
                      <div><dt className="inline font-medium text-foreground">robots: </dt><dd className="inline">{c.robots}</dd></div>
                      <div><dt className="inline font-medium text-foreground">schemas: </dt><dd className="inline">{c.schemas?.join(", ") || "—"}</dd></div>
                    </dl>
                  )}
                  {c.problems?.length ? (
                    <ul className="mt-2 list-inside list-disc text-xs text-destructive">
                      {c.problems.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>

        <iframe
          ref={frameRef}
          title="inspeção de rota"
          className="mt-6 h-64 w-full rounded-sm border border-border opacity-60"
          aria-hidden="true"
        />
      </div>
    </Layout>
  );
}
