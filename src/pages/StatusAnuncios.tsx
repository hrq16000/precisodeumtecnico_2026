import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw, SlidersHorizontal } from "lucide-react";
import { ADSENSE_CLIENT, getConsentPrefs, openConsentPreferences } from "@/lib/consent";

const CANONICAL = "https://precisodeumtecnico.com/status-anuncios";
const PUBLISHER_ID = ADSENSE_CLIENT.replace(/^ca-/, "");

type CheckState = "checking" | "ok" | "fail";

interface Check {
  id: string;
  label: string;
  state: CheckState;
  detail: string;
}

function Row({ check }: { check: Check }) {
  const Icon = check.state === "ok" ? CheckCircle2 : check.state === "fail" ? XCircle : RefreshCw;
  const tone =
    check.state === "ok"
      ? "text-primary"
      : check.state === "fail"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <li className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} aria-hidden="true" />
      <div>
        <p className="text-sm font-medium">{check.label}</p>
        <p className="text-xs text-muted-foreground">{check.detail}</p>
      </div>
    </li>
  );
}

export default function StatusAnuncios() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [ranAt, setRanAt] = useState<string>("");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const results: Check[] = [];

      // 1. ads.txt acessível e com o publisher correto
      try {
        const res = await fetch(`/ads.txt?ts=${Date.now()}`, { cache: "no-store" });
        const text = res.ok ? await res.text() : "";
        const hasLine = /google\.com,\s*pub-\d{16},\s*DIRECT,\s*f08c47fec0942fa0/i.test(text);
        const hasPub = text.includes(PUBLISHER_ID);
        results.push({
          id: "ads-txt",
          label: "ads.txt publicado",
          state: res.ok && hasLine && hasPub ? "ok" : "fail",
          detail: res.ok
            ? hasPub
              ? `Arquivo servido com a linha DIRECT de ${PUBLISHER_ID}.`
              : "Arquivo servido, mas sem a linha do publisher esperado."
            : `Não acessível (HTTP ${res.status}).`,
        });
      } catch {
        results.push({
          id: "ads-txt",
          label: "ads.txt publicado",
          state: "fail",
          detail: "Falha de rede ao buscar /ads.txt.",
        });
      }

      // 2. metatag de verificação do AdSense
      const meta = document.querySelector('meta[name="google-adsense-account"]');
      const metaContent = meta?.getAttribute("content") ?? "";
      results.push({
        id: "meta",
        label: "Metatag google-adsense-account",
        state: metaContent === ADSENSE_CLIENT ? "ok" : "fail",
        detail: metaContent ? `content="${metaContent}"` : "Metatag ausente no <head>.",
      });

      // 3. estado do consentimento neste navegador
      const prefs = getConsentPrefs();
      results.push({
        id: "consent",
        label: "Consentimento (Consent Mode v2)",
        state: prefs ? "ok" : "checking",
        detail: prefs
          ? `Medição: ${prefs.analytics ? "permitida" : "negada"} · Publicidade: ${prefs.ads ? "permitida" : "negada"} · Decidido em ${new Date(prefs.decidedAt).toLocaleString("pt-BR")}.`
          : "Sem decisão registrada neste navegador — nenhuma tag de terceiros carregada.",
      });

      // 4. script do AdSense só depois do aceite
      const adsScript = document.querySelector('script[src*="adsbygoogle.js"]');
      const adsAllowed = Boolean(prefs?.ads);
      results.push({
        id: "adsbygoogle",
        label: "Script adsbygoogle",
        state: Boolean(adsScript) === adsAllowed ? "ok" : "fail",
        detail: adsScript
          ? adsAllowed
            ? "Carregado após consentimento de publicidade."
            : "Carregado sem consentimento — inconsistência."
          : "Não carregado (sem consentimento de publicidade).",
      });

      // 5. robots.txt e sitemap acessíveis
      for (const [id, path, label] of [
        ["robots", "/robots.txt", "robots.txt"],
        ["sitemap", "/sitemap.xml", "sitemap.xml"],
      ] as const) {
        try {
          const res = await fetch(`${path}?ts=${Date.now()}`, { cache: "no-store" });
          results.push({
            id,
            label,
            state: res.ok ? "ok" : "fail",
            detail: res.ok ? "Acessível na raiz do domínio." : `HTTP ${res.status}.`,
          });
        } catch {
          results.push({ id, label, state: "fail", detail: "Falha de rede." });
        }
      }

      if (!cancelled) {
        setChecks(results);
        setRanAt(new Date().toLocaleString("pt-BR"));
      }
    }

    setChecks([]);
    run();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return (
    <Layout>
      <SEOHead
        title="Status de anúncios e SEO do portal"
        description="Verificação pública do ads.txt, da metatag do AdSense, do consentimento de publicidade e da acessibilidade de robots.txt e sitemap.xml."
        canonical={CANONICAL}
        noindex
      />

      <section className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold md:text-4xl">Status de anúncios e SEO</h1>
        <p className="mt-3 text-muted-foreground">
          Relatório executado no seu navegador, contra o site publicado. Publisher AdSense:{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 text-sm">{PUBLISHER_ID}</code>.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button className="min-h-11" onClick={() => setNonce((n) => n + 1)}>
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Reexecutar verificação
          </Button>
          <Button variant="outline" className="min-h-11" onClick={openConsentPreferences}>
            <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
            Gerenciar consentimento
          </Button>
        </div>

        <ul className="mt-6 space-y-2">
          {checks.length === 0 ? (
            <li className="text-sm text-muted-foreground">Executando verificações…</li>
          ) : (
            checks.map((c) => <Row key={c.id} check={c} />)
          )}
        </ul>

        {ranAt && <p className="mt-3 text-xs text-muted-foreground">Última execução: {ranAt}.</p>}

        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <h2 className="text-base font-semibold">Arquivos e políticas</h2>
          <ul className="mt-2 space-y-1">
            <li><a href="/ads.txt" className="text-primary underline">/ads.txt</a></li>
            <li><a href="/robots.txt" className="text-primary underline">/robots.txt</a></li>
            <li><a href="/sitemap.xml" className="text-primary underline">/sitemap.xml</a></li>
            <li><Link to="/politica-de-cookies" className="text-primary underline">Política de Cookies</Link></li>
            <li><Link to="/politica-de-anuncios" className="text-primary underline">Política de Anúncios</Link></li>
            <li><Link to="/politica-privacidade" className="text-primary underline">Política de Privacidade</Link></li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
