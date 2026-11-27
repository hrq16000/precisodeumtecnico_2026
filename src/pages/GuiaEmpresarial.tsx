/**
 * Página de guia educacional empresarial (Rodada 31).
 * Renderiza qualquer guia definido em src/data/enterpriseGuides.ts.
 */
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { EnterpriseLinkCluster } from "@/components/seo/EnterpriseLinkCluster";
import { ENTERPRISE_GUIDES, type EnterpriseGuide } from "@/data/enterpriseGuides";
import { ENTERPRISE_LANDINGS } from "@/data/enterpriseLandings";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { AlertTriangle, BookOpen, CheckCircle2, MessageCircle } from "lucide-react";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { InlineTriageCTA } from "@/components/marketing/InlineTriageCTA";
import { B2BHero } from "@/components/marketing/B2BHero";
import { B2BCriteriaBand } from "@/components/marketing/B2BCriteriaBand";
import { BusinessPillars } from "@/components/marketing/BusinessPillars";
import { BusinessServiceMap } from "@/components/marketing/BusinessServiceMap";
import { BusinessScopeIndicators } from "@/components/marketing/BusinessScopeIndicators";
import { BusinessSupportFlow } from "@/components/marketing/BusinessSupportFlow";
import { PageTableOfContents, type TocItem } from "@/components/layout/PageTableOfContents";
import {
  PreventivePriorityMatrix,
  BackupConceptsBlock,
  NetworkAudienceBlocks,
  NetworkScopeLimits,
} from "@/components/marketing/B2BPageBlocks";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickServicePhotos } from "@/data/publicPhotos";
import {
  SecurityPrinciple,
  SecurityPillars,
  ResponsibilityMatrix,
  NeverSendBox,
  SecurityRemoteAccessNote,
} from "@/components/marketing/DataSecurityBlocks";



const BASE = "https://precisodeumtecnico.com";

interface Props {
  slug: string;
}

export default function GuiaEmpresarial({ slug }: Props) {
  const guide: EnterpriseGuide | undefined = [...ENTERPRISE_GUIDES, ...ENTERPRISE_LANDINGS].find(
    (g) => g.slug === slug,
  );
  if (!guide) return null;

  const canonical = `${BASE}${guide.path}`;
  const waUrl = buildWhatsAppUrl({
    service: guide.whatsappService,
    sourcePage: guide.path,
  });

  /** Landings B2B usam template próprio; guias mantêm o layout editorial. */
  const isB2BLanding = ENTERPRISE_LANDINGS.some((l) => l.slug === guide.slug);

  /** Rodada 3S — piloto do sistema empresarial: hub × serviço. */
  const isHubPilot = guide.slug === "empresa-de-ti-curitiba";
  const B2B_SERVICE_SLUGS = new Set([
    "suporte-tecnico-empresarial",
    "manutencao-preventiva-empresas",
    "backup-para-empresas",
    "redes-e-wifi",
  ]);
  const isServicePilot = B2B_SERVICE_SLUGS.has(guide.slug);
  const isPilot = isHubPilot || isServicePilot;
  const CTA_LABEL_BY_SLUG: Record<string, string> = {
    "empresa-de-ti-curitiba": "Descrever a necessidade da empresa",
    "suporte-tecnico-empresarial": "Solicitar suporte para a empresa",
    "manutencao-preventiva-empresas": "Descrever os equipamentos da empresa",
    "backup-para-empresas": "Descrever como os arquivos são armazenados",
    "redes-e-wifi": "Descrever o ambiente de rede",
  };
  const pilotCtaLabel = CTA_LABEL_BY_SLUG[guide.slug] ?? "Solicitar avaliação para a empresa";

  /** Rodada 3T — bloco de diferenciação por página. */
  const isPreventiva = guide.slug === "manutencao-preventiva-empresas";
  const isBackup = guide.slug === "backup-para-empresas";
  const isRedes = guide.slug === "redes-e-wifi";

  /**
   * Rodada 3U — segurança dos dados é página institucional/educativa:
   * WebPage + BreadcrumbList + FAQPage, sem Service/Offer e com no máximo
   * dois CTAs (hero + um CTA discreto após a matriz de responsabilidades).
   */
  const isInstitutional = guide.slug === "seguranca-dos-dados";

  /** Sumário gerado dos headings reais da página, incluindo as seções fixas. */
  const tocItems: TocItem[] = [
    ...(isHubPilot ? [{ id: "pilares", label: "Pilares operacionais" }] : []),
    ...(isRedes ? [{ id: "contextos-rede", label: "Casa, home office e escritório" }] : []),
    ...(isInstitutional
      ? [
          { id: "responsabilidades", label: "Responsabilidades" },
          { id: "pilares-seguranca", label: "Pilares" },
          { id: "credenciais", label: "Credenciais" },
          { id: "acesso-remoto", label: "Acesso remoto" },
        ]
      : []),
    ...guide.sections.map((s) => ({ id: s.id, label: s.title.replace(/^\d+\.\s*/, "") })),
    ...(isPreventiva ? [{ id: "prioridades", label: "Riscos e prioridades" }] : []),
    ...(isBackup ? [{ id: "conceitos-backup", label: "Sincronização, backup e recuperação" }] : []),
    ...(isRedes ? [{ id: "limites-externos", label: "Cobertura, operadora e impressoras" }] : []),
    ...(isHubPilot ? [{ id: "mapa-servicos", label: "Mapa de serviços empresariais" }] : []),
    ...(isServicePilot ? [{ id: "fluxo", label: "Fluxo de atendimento e impacto" }] : []),
    { id: "checklist", label: "Checklist de requisitos" },
    { id: "limites", label: "Limites operacionais" },
    { id: "faq", label: "Perguntas frequentes" },
  ];

  /** Chips de escopo derivados das primeiras seções reais (sem claim novo). */
  const heroChips = isServicePilot
    ? []
    : guide.sections.slice(0, 4).map((s) => s.title.replace(/^\d+\.\s*/, ""));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    mainEntityOfPage: canonical,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: "Preciso de um Técnico" },
    publisher: { "@type": "Organization", name: "Preciso de um Técnico" },
    articleSection: "Guias empresariais",
  };

  /** WebPage canônica das landings B2B (evita Article fora de contexto). */
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    name: guide.title,
    description: guide.metaDescription,
    url: canonical,
    inLanguage: "pt-BR",
    isPartOf: { "@type": "WebSite", name: "Preciso de um Técnico", url: `${BASE}/` },
  };

  /** Breadcrumb padronizado: Início › Empresas › página. */
  const breadcrumbs = isB2BLanding
    ? [
        { name: "Início", url: `${BASE}/` },
        { name: "Empresas", url: `${BASE}/servicos/suporte-tecnico-empresarial` },
        { name: guide.title, url: canonical },
      ]
    : [
        { name: "Início", url: `${BASE}/` },
        { name: guide.title, url: canonical },
      ];

  return (
    <Layout>
      <SEOHead
        title={guide.metaTitle}
        description={guide.metaDescription}
        canonical={canonical}
        type={isInstitutional ? "website" : guide.serviceSchema ? "service" : "article"}
        breadcrumbs={breadcrumbs}
        faq={guide.faq}
        service={isInstitutional ? undefined : guide.serviceSchema}
        structuredData={
          isInstitutional
            ? [webPageSchema]
            : isB2BLanding
              ? [webPageSchema]
              : guide.serviceSchema
                ? []
                : [articleSchema]
        }
      />


      <article>
        {isB2BLanding ? (
          <B2BHero
            kicker={guide.kicker}
            title={guide.title}
            intro={guide.intro}
            chips={heroChips}
            waUrl={waUrl}
            waSource={`guia-${guide.slug}-hero`}
            waService={guide.whatsappService}
            triage={guide.triage}
            variant={isServicePilot ? "service" : "hub"}
            ctaLabel={
              isInstitutional
                ? "Descrever uma situação relacionada aos dados"
                : isPilot
                  ? pilotCtaLabel
                  : undefined
            }
            showWhatsApp={!isInstitutional}
            actionTitle={
              isInstitutional
                ? "Situação envolvendo dados"
                : isServicePilot
                  ? "Abertura de chamado empresarial"
                  : isHubPilot
                    ? "Necessidade da empresa"
                    : undefined
            }
          />
        ) : (
          /* Hero compacto no mobile para manter o CTA visível na primeira dobra. */
          <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-8 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-5">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {guide.kicker}
              </div>
              <h1 className="text-2xl md:text-5xl font-bold text-foreground mb-3 md:mb-4">{guide.title}</h1>
              <p className="text-muted-foreground text-base md:text-lg">{guide.intro}</p>
              <div className="flex flex-wrap gap-3 mt-5 md:mt-7">
                {guide.triage && (
                  <Button
                    size="lg"
                    className="min-h-11"
                    data-triage-cta
                    data-triage-source={guide.triage.source}
                    data-triage-category={guide.triage.category}
                    data-triage-city={guide.triage.city}
                  >
                    Iniciar triagem
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Button>
                )}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source={`guia-${guide.slug}-hero`}
                  data-service={guide.whatsappService}
                  aria-label={`Falar no WhatsApp sobre ${guide.whatsappService}`}
                  className="inline-flex items-center gap-2 min-h-[48px] bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Avaliar meu cenário
                </a>
              </div>
            </div>
          </section>
        )}

        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Landings B2B usam faixa de critérios; guias mantêm o TrustStrip. */}
            {isB2BLanding ? <B2BCriteriaBand className="mb-6" /> : <TrustStrip className="mb-6" />}

            {/* Rodada 3S — serviço abre por indicadores de escopo (execução). */}
            {isServicePilot && <BusinessScopeIndicators className="mb-6" />}

            <PageTableOfContents
              className="mb-10"
              title={isB2BLanding ? "Nesta página" : "Neste guia"}
              items={tocItems}
            />

            {/* Rodada 3S — hub abre por pilares operacionais (amplitude). */}
            {isHubPilot && (
              <section id="pilares" tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Pilares operacionais
                </h2>
                <BusinessPillars />
              </section>
            )}

            {/* Rodada 3T — redes: público misto declarado antes do conteúdo. */}
            {isRedes && (
              <section id="contextos-rede" tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Casa, home office e escritório
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  O atendimento de rede cobre contextos diferentes. Os dois cenários abaixo usam as
                  mesmas verificações internas, mudando a escala e o que está em jogo.
                </p>
                <NetworkAudienceBlocks />
              </section>
            )}

            {/* Rodada 3U — segurança dos dados: princípio, responsabilidades e limites. */}
            {isInstitutional && (
              <div className="mb-10 space-y-10">
                <SecurityPrinciple />
                <ResponsibilityMatrix />
                {guide.triage && (
                  <InlineTriageCTA
                    label="Descrever uma situação relacionada aos dados"
                    description="A triagem registra equipamento, contexto e o que está em risco antes de qualquer procedimento."
                    source={`${guide.triage.source}_meio`}
                    category={guide.triage.category}
                  />
                )}
                <SecurityPillars />
                <NeverSendBox />
                <SecurityRemoteAccessNote />
              </div>
            )}

            {guide.sections.map((s) => (
              <section key={s.id} id={s.id} tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {s.title}
                </h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
                {s.table && (
                  <div className="overflow-x-auto my-5 rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/60">
                        <tr>
                          {s.table.head.map((h) => (
                            <th key={h} scope="col" className="px-4 py-3 text-left font-semibold text-foreground">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map((row) => (
                          <tr key={row[0]} className="border-t border-border">
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={ci === 0 ? "px-4 py-3 font-medium text-foreground" : "px-4 py-3 text-muted-foreground"}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {s.bullets && (
                  <ul className="space-y-2">
                    {s.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Rodada 3S — hub: mapa de serviços; serviço: fluxo e impacto. */}
            {isHubPilot && (
              <section id="mapa-servicos" tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Mapa de serviços empresariais
                </h2>
                <BusinessServiceMap />
              </section>
            )}

            {/* Rodada 3T — bloco de diferenciação por página. */}
            {isPreventiva && (
              <section id="prioridades" tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Riscos e prioridades no registro
                </h2>
                <PreventivePriorityMatrix />
              </section>
            )}

            {isBackup && (
              <section id="conceitos-backup" tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Sincronização, backup e recuperação
                </h2>
                <BackupConceptsBlock />
              </section>
            )}

            {isRedes && (
              <section id="limites-externos" tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Cobertura, operadora e impressoras
                </h2>
                <NetworkScopeLimits />
              </section>
            )}

            {isServicePilot && (
              <section id="fluxo" tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Fluxo de atendimento e impacto operacional
                </h2>
                <BusinessSupportFlow />
              </section>
            )}

            {isPilot && guide.triage && (
              <InlineTriageCTA
                className="mb-12"
                label={pilotCtaLabel}
                description={
                  isHubPilot
                    ? "A triagem organiza equipamentos, usuários afetados e impacto na operação antes de qualquer deslocamento."
                    : "Descreva o chamado com equipamento, usuário afetado e impacto: o escopo é apresentado antes da execução."
                }
                source={`${guide.triage.source}_meio`}
                category={guide.triage.category}
              />
            )}



            <section id="checklist" tabIndex={-1} data-toc-anchor className="mb-10 scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Checklist de requisitos
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {guide.checklist.map((c) => (
                  <div key={c.label} className="rounded-xl border border-border/50 bg-card p-4">
                    <p className="font-semibold text-card-foreground">{c.label}</p>
                    <p className="text-sm text-muted-foreground">{c.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="limites" tabIndex={-1} data-toc-anchor className="mb-12 scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Limites operacionais
              </h2>
              <ul className="space-y-2">
                {guide.limits.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <AlertTriangle className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </section>

            {!isPilot && !isInstitutional && guide.triage && (
              <InlineTriageCTA
                className="mb-12"
                label="Iniciar triagem do cenário"
                description="A triagem online organiza equipamento, contexto de uso e prioridade antes de qualquer deslocamento, e apresenta o valor mínimo aplicável."
                source={`${guide.triage.source}_meio`}
                category={guide.triage.category}
              />
            )}



            <section id="faq" tabIndex={-1} data-toc-anchor className="mb-12 scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Perguntas frequentes
              </h2>
              <div className="space-y-4">
                {guide.faq.map((f) => (
                  <div key={f.question} className="rounded-xl border border-border/50 bg-card p-4">
                    <h3 className="font-semibold text-card-foreground mb-1">{f.question}</h3>
                    <p className="text-sm text-muted-foreground">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <EnterpriseLinkCluster currentPath={guide.path} />

            {!isInstitutional && (
              <div className="rounded-xl border border-border/50 bg-card p-6 text-center">
                <h2 className="font-display text-xl md:text-2xl font-bold text-card-foreground mb-2">
                  Quer aplicar isso no seu escritório?
                </h2>
                <p className="text-muted-foreground mb-5">
                  Descreva o cenário atual (quantidade de postos, softwares e principais travas) e
                  recebemos o contexto já organizado para a avaliação técnica.
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar no WhatsApp sobre este guia empresarial"
                  data-wa-source={`guia-${guide.slug}-final`}
                  data-service={guide.whatsappService}
                  data-wa-tracked="b2b_final"
                  onClick={() =>
                    trackWhatsAppClick({
                      source: `guia-${guide.slug}-final`,
                      service: guide.whatsappService,
                      city: guide.triage?.city,
                      source_component: "b2b_cta_final",
                      cta_label: "Falar sobre o meu cenário",
                    })
                  }
                  className="inline-flex items-center gap-2 min-h-[48px] bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Falar sobre o meu cenário
                </a>
              </div>
            )}
          </div>
        </section>
      </article>
      <PublicPhotoBand
        title="Infraestrutura e ambientes de TI"
        intro="Fotos reais (Creative Commons) de racks, cabeamento e bancadas — referência visual dos ambientes tratados neste guia."
        photos={pickServicePhotos("guia-empresarial", 3)}
      />
    </Layout>
  );
}
