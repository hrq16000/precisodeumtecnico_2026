import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Skeleton } from "@/components/ui/skeleton";
import { QrCode } from "@/components/QrCode";
import { Search, FileDown, CheckCircle2, Circle, XCircle, ClipboardList } from "lucide-react";
import {
  OS_STATUS_FLOW,
  OS_MODE_LABEL,
  findOsRecord,
  statusIndex,
  statusLabel,
  type OsRecord,
} from "@/lib/serviceOrderRecords";
import { downloadOsReceipt } from "@/lib/serviceOrderPdf";

const CANONICAL = "https://precisodeumtecnico.com/consultar-os";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function ConsultarOrdemServico() {
  const [params, setParams] = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const [code, setCode] = useState("");
  const [record, setRecord] = useState<OsRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const initial = params.get("os") ?? "";
    setCode(initial);
    if (initial) {
      const found = findOsRecord(initial);
      setRecord(found);
      setNotFound(!found);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    const found = findOsRecord(code);
    setRecord(found);
    setNotFound(!found);
    setParams(code ? { os: code.trim().toUpperCase() } : {}, { replace: true });
  }

  const current = record ? statusIndex(record.status) : 0;
  const cancelled = record?.status === "cancelada";

  return (
    <Layout>
      <SEOHead
        title="Consultar Ordem de Serviço — Código Único e Status"
        description="Consulte sua Ordem de Serviço pelo código único: equipamento, modalidade, termos aceitos, resumo enviado e o status do atendimento."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Consultar Ordem de Serviço", url: CANONICAL },
        ]}
      />

      <section className="border-b border-border bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
            Ordem de Serviço
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Consultar Ordem de Serviço
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Informe o código único gerado na abertura (formato OS-ANO-CÓDIGO) para rever o
            equipamento, a modalidade, os termos aceitos e o resumo enviado ao atendimento.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-3xl px-4">
          <form onSubmit={lookup} className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1 text-sm">
              <span className="sr-only">Código da Ordem de Serviço</span>
              <input
                data-testid="consultar-os-input"
                className={inputClass}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="OS-2026-ABC123"
                aria-label="Código da Ordem de Serviço"
              />
            </label>
            <button
              type="submit"
              data-testid="consultar-os-submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Consultar
            </button>
          </form>

          {!hydrated && <Skeleton className="mt-8 h-40 w-full" />}

          {hydrated && notFound && (
            <p
              role="status"
              data-testid="consultar-os-notfound"
              className="mt-6 rounded-md border border-border bg-muted/40 p-4 text-sm text-foreground"
            >
              Não encontramos esse código neste dispositivo. As O.S. abertas aqui ficam salvas
              apenas neste navegador — se a abertura foi feita em outro aparelho, use o{" "}
              <Link to="/status-os" className="font-semibold text-primary underline underline-offset-4">
                acompanhamento oficial de status
              </Link>{" "}
              ou reenvie o código pelo atendimento.
            </p>
          )}

          {hydrated && record && (
            <div data-testid="consultar-os-result" className="mt-8 space-y-6">
              <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between md:p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Código rastreável
                  </p>
                  <p
                    data-testid="consultar-os-protocol"
                    className="mt-1 font-mono text-2xl font-bold tracking-wider text-foreground"
                  >
                    {record.protocol}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Aberta em {new Date(record.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadOsReceipt(record)}
                  data-testid="consultar-os-pdf"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <FileDown className="h-4 w-4" aria-hidden="true" />
                  Baixar comprovante em PDF
                </button>
              </div>

              {/* Fluxo de status */}
              <div className="rounded-lg border border-border bg-card p-4 md:p-5">
                <h2 className="text-base font-semibold text-foreground">Status do atendimento</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Situação atual: <strong className="text-foreground">{statusLabel(record.status)}</strong>
                </p>
                <ol className="mt-4 space-y-3">
                  {OS_STATUS_FLOW.map((stage, i) => {
                    const done = !cancelled && i <= current;
                    return (
                      <li key={stage.id} className="flex items-start gap-3">
                        {done ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        ) : (
                          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        )}
                        <span>
                          <span
                            className={`block text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {stage.label}
                          </span>
                          <span className="block text-sm text-muted-foreground">{stage.hint}</span>
                        </span>
                      </li>
                    );
                  })}
                  {cancelled && (
                    <li className="flex items-start gap-3">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                      <span className="text-sm font-semibold text-foreground">
                        Cancelada — histórico preservado para conferência.
                      </span>
                    </li>
                  )}
                </ol>
              </div>

              {/* Dados da solicitação */}
              <div className="rounded-lg border border-border bg-card p-4 md:p-5">
                <h2 className="text-base font-semibold text-foreground">Dados da solicitação</h2>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-muted-foreground">Equipamento</dt>
                    <dd data-testid="consultar-os-equipment" className="text-foreground">
                      {record.equipment}
                      {record.brandModel ? ` — ${record.brandModel}` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Modalidade</dt>
                    <dd data-testid="consultar-os-mode" className="text-foreground">
                      {OS_MODE_LABEL[record.mode]}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Localidade</dt>
                    <dd className="text-foreground">
                      {[record.neighborhood, record.city].filter(Boolean).join(", ") || "Não informada"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Problema relatado</dt>
                    <dd className="text-foreground">{record.problem}</dd>
                  </div>
                </dl>
              </div>

              {/* Termos aceitos */}
              <div className="rounded-lg border border-border bg-card p-4 md:p-5">
                <h2 className="text-base font-semibold text-foreground">
                  Termos operacionais aceitos na abertura
                </h2>
                <div className="mt-3 space-y-4">
                  {record.terms.map((group) => (
                    <div key={group.title}>
                      <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mensagem sintetizada + QR */}
              <div className="rounded-lg border border-border bg-card p-4 md:p-5">
                <h2 className="text-base font-semibold text-foreground">Resumo enviado no atendimento</h2>
                <div className="mt-3 flex flex-col gap-4 md:flex-row">
                  <pre
                    data-testid="consultar-os-message"
                    className="flex-1 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed text-muted-foreground"
                  >
                    {record.message}
                  </pre>
                  <div className="shrink-0 text-center">
                    <QrCode
                      value={`${CANONICAL}?os=${encodeURIComponent(record.protocol)}`}
                      alt={`QR code de consulta da Ordem de Serviço ${record.protocol}`}
                      size={148}
                      className="mx-auto rounded-md border border-border bg-background p-2"
                    />
                    <p className="mt-2 max-w-[9rem] text-xs text-muted-foreground">
                      Aponte a câmera para abrir esta consulta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-8 text-sm text-muted-foreground">
            Precisa abrir uma nova solicitação?{" "}
            <Link to="/abrir-os" className="font-semibold text-primary underline underline-offset-4">
              Abrir Ordem de Serviço
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
