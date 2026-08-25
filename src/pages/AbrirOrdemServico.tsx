import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Link } from "@/lib/router-compat";
import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ClipboardList,
  ShieldCheck,
  Truck,
  Wrench,
  AlertTriangle,
  Search,
  FileDown,
  CheckCircle2,
} from "lucide-react";
import { VISIT_TERMS, COLLECTION_TERMS } from "@/data/serviceOrderTerms";
import { QrCode } from "@/components/QrCode";
import { recordFromDraft, saveOsRecord, type OsRecord } from "@/lib/serviceOrderRecords";
import { downloadOsReceipt } from "@/lib/serviceOrderPdf";
import {
  buildOsMessage,
  buildOsWhatsAppUrl,
  emptyDraft,
  generateOsProtocol,
  readOsDraft,
  saveOsDraft,
  validateDraft,
  type OsDraft,
  type OsMode,
} from "@/lib/serviceOrderDraft";

const CANONICAL = "https://precisodeumtecnico.com/abrir-os";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function AbrirOrdemServico() {
  const [hydrated, setHydrated] = useState(false);
  const [draft, setDraft] = useState<OsDraft>(() => emptyDraft());
  const [errors, setErrors] = useState<string[]>([]);
  const [record, setRecord] = useState<OsRecord | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const stored = readOsDraft();
    const base = stored ?? emptyDraft();
    setDraft({
      ...base,
      protocol: base.protocol || generateOsProtocol(),
      createdAt: base.createdAt || new Date().toISOString(),
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && draft.protocol) saveOsDraft(draft);
  }, [hydrated, draft]);

  const set = <K extends keyof OsDraft>(key: K, value: OsDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const ready = validateDraft(draft).length === 0;
  const message = useMemo(() => (draft.protocol ? buildOsMessage(draft) : ""), [draft]);
  const waUrl = useMemo(() => (ready ? buildOsWhatsAppUrl(draft) : undefined), [ready, draft]);

  /** Persiste a O.S. concluída e libera a tela de comprovante (PDF + QR). */
  function confirm() {
    if (!ready) return;
    const created = recordFromDraft(draft);
    saveOsRecord(created);
    setRecord(created);
  }

  function review() {
    const found = validateDraft(draft);
    setErrors(found.map((e) => e.label));
    if (found.length) {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${found[0].field}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      requestAnimationFrame(() => el?.focus());
    }
  }

  const terms = draft.mode === "visita" ? VISIT_TERMS : COLLECTION_TERMS;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Abrir Ordem de Serviço",
    description:
      "Abra sua Ordem de Serviço com código único, escolha entre visita técnica ou coleta para laboratório e revise todos os termos antes do aceite.",
    url: CANONICAL,
  };

  return (
    <Layout>
      <SEOHead
        title="Abrir Ordem de Serviço — Código Único e Termos Claros"
        description="Abra sua O.S. em minutos: gere um código único rastreável, escolha visita técnica ou coleta para laboratório e confira todos os termos antes de confirmar."
        canonical={CANONICAL}
        schema={schema}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Abrir Ordem de Serviço", url: CANONICAL },
        ]}
      />

      <section className="border-b border-border bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
            Ordem de Serviço
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Abrir Ordem de Serviço
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Preencha os dados, leia os termos da modalidade escolhida e confirme. Geramos um código
            único rastreável e enviamos o resumo completo pelo WhatsApp — sem pagamento nesta tela.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Já tem um código?{" "}
            <Link to="/status-os" className="font-semibold text-primary underline underline-offset-4">
              Consultar status da O.S.
            </Link>
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Código único */}
          <div className="rounded-lg border border-border bg-card p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Código da sua O.S.
            </p>
            {hydrated ? (
              <p
                data-testid="os-protocol"
                className="mt-1 font-mono text-2xl font-bold tracking-wider text-foreground"
              >
                {draft.protocol}
              </p>
            ) : (
              <Skeleton className="mt-2 h-8 w-48" />
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Guarde este código: ele acompanha o atendimento do início ao fim e é usado na consulta
              pública de status.
            </p>
          </div>

          <form ref={formRef} className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Modalidade */}
            <fieldset>
              <legend className="text-sm font-semibold text-foreground">Modalidade do atendimento</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    {
                      value: "visita" as OsMode,
                      icon: Wrench,
                      title: "Visita técnica",
                      desc: "Serviços rápidos (até 30 min), montagem ou inspeção presencial.",
                    },
                    {
                      value: "coleta" as OsMode,
                      icon: Truck,
                      title: "Coleta para laboratório",
                      desc: "Notebooks, PCs, TVs e placas que exigem bancada avançada.",
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={draft.mode === opt.value}
                    onClick={() => set("mode", opt.value)}
                    className={`rounded-lg border p-4 text-left transition-colors ${
                      draft.mode === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <opt.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      {opt.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Dados */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-foreground">Nome completo</span>
                <input
                  data-field="name"
                  className={`${inputClass} mt-1`}
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Como devemos te chamar"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-foreground">Equipamento</span>
                <input
                  data-field="equipment"
                  className={`${inputClass} mt-1`}
                  value={draft.equipment}
                  onChange={(e) => set("equipment", e.target.value)}
                  placeholder="Ex.: Notebook, Smart TV, PC"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-foreground">Marca e modelo (opcional)</span>
                <input
                  data-field="brandModel"
                  className={`${inputClass} mt-1`}
                  value={draft.brandModel}
                  onChange={(e) => set("brandModel", e.target.value)}
                  placeholder="Ex.: Samsung UN50AU7700"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-foreground">Preferência de horário (opcional)</span>
                <input
                  data-field="preferredWindow"
                  className={`${inputClass} mt-1`}
                  value={draft.preferredWindow}
                  onChange={(e) => set("preferredWindow", e.target.value)}
                  placeholder="Ex.: manhã, a partir de quinta"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-foreground">Cidade</span>
                <input
                  data-field="city"
                  className={`${inputClass} mt-1`}
                  value={draft.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Ex.: Curitiba"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-foreground">Bairro (opcional)</span>
                <input
                  data-field="neighborhood"
                  className={`${inputClass} mt-1`}
                  value={draft.neighborhood}
                  onChange={(e) => set("neighborhood", e.target.value)}
                  placeholder="Ex.: Portão"
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Descrição do problema</span>
              <textarea
                data-field="problem"
                rows={4}
                className={`${inputClass} mt-1 resize-y`}
                value={draft.problem}
                onChange={(e) => set("problem", e.target.value)}
                placeholder="Conte o que acontece, quando começou e o que já foi tentado."
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-foreground">Ponto de referência (opcional)</span>
              <input
                data-field="reference"
                className={`${inputClass} mt-1`}
                value={draft.reference}
                onChange={(e) => set("reference", e.target.value)}
                placeholder="Portaria, bloco, comércio próximo"
              />
            </label>

            {/* Termos */}
            <div className="rounded-lg border border-border bg-card p-4 md:p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                {draft.mode === "visita"
                  ? "Termos da visita técnica presencial"
                  : "Termos de coleta e laboratório avançado"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Leia com atenção: o aceite abaixo confirma que todos os itens desta modalidade foram
                compreendidos.
              </p>
              <Accordion type="multiple" className="mt-3">
                {terms.map((group) => (
                  <AccordionItem key={group.id} value={group.id}>
                    <AccordionTrigger className="text-left text-sm font-semibold">
                      {group.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {draft.mode === "coleta" && (
                <p className="mt-3 flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  Procedimentos em altas temperaturas (reballing) podem causar danos irreversíveis em
                  placas já comprometidas. O aceite indica ciência desse risco.
                </p>
              )}

              <label className="mt-4 flex items-start gap-3 text-sm text-foreground">
                <input
                  data-field="acceptedTerms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border"
                  checked={draft.acceptedTerms}
                  onChange={(e) => set("acceptedTerms", e.target.checked)}
                />
                <span>
                  Li e aceito integralmente os termos acima, incluindo valores, prazos, riscos e
                  política de cancelamento e retirada.
                </span>
              </label>
            </div>

            {/* Revisão */}
            <div className="rounded-lg border border-border bg-card p-4 md:p-5">
              <h2 className="text-base font-semibold text-foreground">Revisão e envio</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Nenhum pagamento é processado aqui. Ao confirmar, o resumo completo da O.S. é
                sintetizado e enviado pelo WhatsApp para a central.
              </p>

              {errors.length > 0 && (
                <p role="alert" aria-live="polite" className="mt-3 text-sm font-medium text-destructive">
                  Preencha: {errors.join(", ")}.
                </p>
              )}

              {hydrated && (
                <details className="mt-4 rounded-md border border-border bg-muted/30 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">
                    Ver prévia da mensagem
                  </summary>
                  <pre
                    data-testid="os-message-preview"
                    className="mt-3 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-muted-foreground"
                  >
                    {message}
                  </pre>
                </details>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {ready && waUrl ? (
                  <WhatsAppCTA
                    source="abrir-os-confirm"
                    service="abertura de ordem de serviço"
                    ariaLabel="Confirmar e enviar a Ordem de Serviço pelo WhatsApp"
                    href={waUrl}
                    data-testid="os-submit"
                    data-wa-keep="abrir-os"
                    onClick={confirm}
                    className="justify-center"
                  >
                    Confirmar e enviar O.S.
                  </WhatsAppCTA>
                ) : (
                  <button
                    type="button"
                    onClick={review}
                    data-testid="os-review"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Revisar e liberar envio
                  </button>
                )}
                <Link
                  to="/status-os"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Consultar uma O.S.
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
