import { useParams, Link } from "@/lib/router-compat";
import { Helmet } from "@/lib/helmet-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import {
  MessageCircle, Phone, CheckCircle, Clock, Shield, Award,
  ArrowRight, MapPin, Star
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import NotFound from "@/pages/NotFound";
import { servicesData as SERVICES_CATALOG } from "@/data/services";
import { PcAssemblyPolicySections } from "@/components/marketing/PcAssemblyPolicySections";
import { ServiceStandardBand } from "@/components/service/ServiceStandardBand";
import { CollectionOnlyBand } from "@/components/service/CollectionOnlyBand";
import { isCollectionOnlyService } from "@/data/collectionOnlyServices";
import { getServiceStandard } from "@/data/serviceStandards";
import { PcQuoteWizard } from "@/components/marketing/PcQuoteWizard";
import { WorkstationRequirements } from "@/components/marketing/WorkstationRequirements";
import { AssemblyScopeBand } from "@/components/marketing/AssemblyScopeBand";
import {
  AssemblyUseContexts,
  AssemblyFlow,
  AssemblyCompatibility,
  AssemblyBiosBlock,
} from "@/components/marketing/AssemblyContextBlocks";
import { PageTableOfContents } from "@/components/layout/PageTableOfContents";
import { RelatedGuidesCard, GUIDE_LINKS } from "@/components/seo/RelatedGuidesCard";

import { RelatedServiceLinks } from "@/components/seo/RelatedServiceLinks";
import { LocalReviewsBand } from "@/components/reviews/LocalReviewsBand";

const PC_GAMER = SERVICES_CATALOG["pc-gamer"];
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickServicePhotos } from "@/data/publicPhotos";
import {
  getTestimonialsForService,
  buildServiceReviewsSchema,
} from "@/data/testimonials";

// Service data mapping
const servicesData: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string[];
  benefits: string[];
  process: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedServices: { name: string; href: string }[];
  category: string;
}> = {
  "formatacao-computadores": {
    title: "Formatação de Computadores",
    subtitle: "Formatação profissional com backup de dados",
    description: "Serviço completo de formatação de computadores em Curitiba e região. Reinstalação do sistema operacional, drivers e programas essenciais.",
    longDescription: [
      "A formatação de computadores é um procedimento essencial para restaurar o desempenho original do seu equipamento. Com o tempo, o acúmulo de arquivos temporários, programas não utilizados e possíveis vírus podem deixar seu computador extremamente lento.",
      "Nossa equipe de técnicos especializados realiza a formatação completa do seu computador, incluindo backup dos seus arquivos importantes, reinstalação do sistema operacional Windows (ou Linux, se preferir), instalação de todos os drivers necessários e configuração dos programas que você utiliza no dia a dia.",
      "Oferecemos o serviço tanto para computadores desktop quanto notebooks, com atendimento no conforto da sua casa ou empresa. Todos os nossos serviços incluem garantia e suporte pós-atendimento.",
    ],
    benefits: [
      "Computador como novo, com desempenho restaurado",
      "Backup completo dos seus arquivos antes da formatação",
      "Instalação do Windows original e atualizado",
      "Configuração de todos os drivers necessários",
      "Instalação de antivírus e programas essenciais",
      "Garantia de 90 dias no serviço",
      "Atendimento no local (casa ou empresa)",
      "Técnicos certificados e experientes",
    ],
    process: [
      { step: 1, title: "Diagnóstico", description: "Avaliamos o estado do computador e identificamos as necessidades" },
      { step: 2, title: "Backup", description: "Fazemos backup de todos os seus arquivos importantes" },
      { step: 3, title: "Formatação", description: "Realizamos a formatação e reinstalação do sistema" },
      { step: 4, title: "Configuração", description: "Instalamos drivers, programas e restauramos seus arquivos" },
    ],
    faqs: [
      { question: "Quanto tempo demora a formatação?", answer: "Em média, o processo completo leva de 2 a 4 horas, dependendo do volume de dados para backup." },
      { question: "Preciso de licença do Windows?", answer: "Se seu computador já veio com Windows original, utilizamos a licença existente. Caso contrário, podemos instalar Windows com licença digital." },
      { question: "Meus arquivos serão perdidos?", answer: "Não! Fazemos backup completo de todos os seus documentos, fotos e arquivos antes da formatação." },
    ],
    relatedServices: [
      { name: "Limpeza de Computador", href: "/servicos/limpeza-computador" },
      { name: "Remoção de Vírus", href: "/servicos/remocao-virus" },
      { name: "Upgrade de Hardware", href: "/servicos/upgrade-hardware" },
    ],
    category: "Informática",
  },
  "instalacao-cameras": {
    title: "Instalação de Câmeras de Segurança",
    subtitle: "Sistema completo de CFTV para sua segurança",
    description: "Instalação profissional de câmeras de segurança em Curitiba e região. Projeto, instalação, configuração e acesso remoto pelo celular.",
    longDescription: [
      "A instalação de câmeras de segurança é fundamental para proteger sua residência ou empresa. Com um sistema de CFTV bem projetado, você pode monitorar seu patrimônio 24 horas por dia, de qualquer lugar do mundo, através do seu smartphone.",
      "Nossa equipe realiza desde o projeto inicial, identificando os melhores pontos para instalação das câmeras, até a configuração completa do sistema com acesso remoto. Trabalhamos com as melhores marcas do mercado como Intelbras, Hikvision e Dahua.",
      "Oferecemos soluções para todos os tamanhos de projetos: desde uma única câmera para monitorar a entrada de casa até sistemas completos com dezenas de câmeras para empresas e condomínios.",
    ],
    benefits: [
      "Projeto personalizado para sua necessidade",
      "Câmeras de alta definição (Full HD e 4K)",
      "Configuração de acesso remoto pelo celular",
      "Instalação de DVR/NVR com armazenamento",
      "Gravação 24 horas com detecção de movimento",
      "Visão noturna de alta qualidade",
      "Garantia de 1 ano nas câmeras e instalação",
      "Suporte técnico especializado",
    ],
    process: [
      { step: 1, title: "Visita Técnica", description: "Avaliamos o local e elaboramos o projeto ideal" },
      { step: 2, title: "Orçamento", description: "Apresentamos opções de equipamentos e valores" },
      { step: 3, title: "Instalação", description: "Realizamos a instalação completa do sistema" },
      { step: 4, title: "Configuração", description: "Configuramos o acesso remoto e ensinamos a usar" },
    ],
    faqs: [
      { question: "Quantas câmeras preciso instalar?", answer: "Depende do tamanho do local e dos pontos que deseja monitorar. Fazemos uma visita técnica gratuita para avaliar." },
      { question: "Consigo ver as câmeras pelo celular?", answer: "Sim! Configuramos o acesso remoto para você monitorar de qualquer lugar, a qualquer hora." },
      { question: "Vocês fornecem as câmeras?", answer: "Sim, fornecemos todo o equipamento com garantia. Também instalamos equipamentos comprados pelo cliente." },
    ],
    relatedServices: [
      { name: "Manutenção de CFTV", href: "/servicos/manutencao-cftv" },
      { name: "Alarme Residencial", href: "/servicos/alarme-residencial" },
      { name: "Controle de Acesso", href: "/servicos/controle-acesso" },
    ],
    category: "CFTV / Câmeras",
  },
  "instalacao-ar-condicionado": {
    title: "Instalação de Ar-Condicionado",
    subtitle: "Instalação profissional com garantia",
    description: "Instalação de ar-condicionado split em Curitiba e região. Serviço completo com tubulação, parte elétrica e teste de funcionamento.",
    longDescription: [
      "A instalação correta do ar-condicionado é essencial para garantir o funcionamento eficiente e a durabilidade do equipamento. Uma instalação mal feita pode causar vazamentos, ruídos excessivos e até mesmo danificar o compressor.",
      "Nossa equipe de instaladores especializados realiza o serviço completo: desde a avaliação do melhor local para instalação, passagem da tubulação de cobre, instalação elétrica adequada (se necessário), até o teste final de funcionamento.",
      "Trabalhamos com todas as marcas e modelos de ar-condicionado split, desde os modelos residenciais mais simples até sistemas multi-split e VRF para empresas.",
    ],
    benefits: [
      "Instalação completa com todos os materiais",
      "Tubulação de cobre de alta qualidade",
      "Instalação elétrica dedicada se necessário",
      "Teste completo de funcionamento",
      "Orientação sobre uso e manutenção",
      "Garantia de 1 ano na instalação",
      "Técnicos certificados pelas principais marcas",
      "Atendimento rápido e pontual",
    ],
    process: [
      { step: 1, title: "Avaliação", description: "Verificamos o melhor local para instalação das unidades" },
      { step: 2, title: "Orçamento", description: "Detalhamos todos os materiais e valores" },
      { step: 3, title: "Instalação", description: "Realizamos a instalação completa" },
      { step: 4, title: "Teste", description: "Testamos o funcionamento e orientamos sobre o uso" },
    ],
    faqs: [
      { question: "Quanto tempo demora a instalação?", answer: "Uma instalação padrão leva em média 3 a 4 horas. Instalações com maior distância entre as unidades podem levar mais tempo." },
      { question: "Preciso fazer instalação elétrica separada?", answer: "Depende da potência do ar-condicionado. Modelos acima de 12.000 BTUs geralmente necessitam de circuito dedicado." },
      { question: "Vocês vendem o ar-condicionado?", answer: "Nosso foco é a instalação, mas podemos indicar parceiros com bons preços ou instalar o equipamento que você já possui." },
    ],
    relatedServices: [
      { name: "Limpeza de Ar-Condicionado", href: "/servicos/limpeza-ar-condicionado" },
      { name: "Manutenção de Ar Split", href: "/servicos/manutencao-ar-split" },
      { name: "Carga de Gás", href: "/servicos/carga-gas-ar" },
    ],
    category: "Ar-Condicionado",
  },
  "pc-gamer": {
    title: PC_GAMER.title,
    subtitle: PC_GAMER.subtitle,
    description: PC_GAMER.description,
    longDescription: [PC_GAMER.longDescription],
    benefits: [...PC_GAMER.benefits],
    process: [...PC_GAMER.process],
    faqs: [...PC_GAMER.faqs],
    relatedServices: [
      { name: "Informática", href: "/servicos/informatica" },
      { name: "Upgrade de SSD", href: "/upgrade-ssd-curitiba" },
      { name: "Upgrade de Memória RAM", href: "/upgrade-memoria-ram-curitiba" },
    ],
    category: "Informática",
  },
};


// Default data for services not in the mapping
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultServiceData = {
  title: "Serviço Técnico Especializado",
  subtitle: "Assistência técnica de qualidade",
  description: "Serviço técnico profissional em Curitiba e Região Metropolitana. Atendimento 24h via WhatsApp com garantia em todos os serviços.",
  longDescription: [
    "Oferecemos serviços técnicos especializados com a mais alta qualidade. Nossa equipe de profissionais está preparada para atender suas necessidades com rapidez e eficiência.",
    "Todos os nossos técnicos passam por rigoroso processo de seleção e são constantemente avaliados para garantir a excelência no atendimento.",
    "Trabalhamos com transparência, apresentando orçamento detalhado antes de iniciar qualquer serviço. Você só paga após a conclusão e aprovação do trabalho.",
  ],
  benefits: [
    "Técnicos especializados e certificados",
    "Atendimento 24 horas via WhatsApp",
    "Garantia em todos os serviços",
    "Orçamento sem compromisso",
    "Atendimento no local (casa ou empresa)",
    "Peças de qualidade com procedência",
    "Preços justos e competitivos",
    "Suporte pós-atendimento",
  ],
  process: [
    { step: 1, title: "Contato", description: "Entre em contato via WhatsApp descrevendo sua necessidade" },
    { step: 2, title: "Orçamento", description: "Receba um orçamento detalhado sem compromisso" },
    { step: 3, title: "Agendamento", description: "Agende o melhor horário para o atendimento" },
    { step: 4, title: "Execução", description: "Técnico realiza o serviço com garantia" },
  ],
  faqs: [
    { question: "Como funciona o atendimento?", answer: "Basta entrar em contato via WhatsApp, descrever o problema e agendaremos um técnico para ir até você." },
    { question: "Qual a forma de pagamento?", answer: "Aceitamos PIX, cartões de crédito/débito e dinheiro. Pagamento após a conclusão do serviço." },
    { question: "Vocês atendem empresas?", answer: "Sim! Atendemos tanto clientes residenciais quanto empresas de todos os portes." },
  ],
  relatedServices: [
    { name: "Informática", href: "/servicos/informatica" },
    { name: "Elétrica", href: "/servicos/eletrica" },
    { name: "CFTV", href: "/servicos/cftv" },
  ],
  category: "Serviços Gerais",
};


/**
 * Adapta uma entrada do catálogo canônico (`src/data/services.ts`) para o
 * formato renderizado por esta rota. O catálogo tem conteúdo próprio e único
 * por serviço (longDescription, benefícios, processo, FAQs), então NÃO é
 * página genérica — resolve os links de categoria do Header/Footer que antes
 * caíam em 404 sem criar soft-404.
 */
type CuratedService = (typeof servicesData)[string];

function fromCatalog(slug: string): CuratedService | null {
  const entry = SERVICES_CATALOG[slug];
  if (!entry) return null;
  const paragraphs = entry.longDescription
    .split(/(?<=\.)\s+(?=[A-ZÀ-Ú])/)
    .reduce<string[]>((acc, sentence, i) => {
      const idx = Math.floor(i / 2);
      acc[idx] = acc[idx] ? `${acc[idx]} ${sentence}` : sentence;
      return acc;
    }, []);
  return {
    title: entry.title,
    subtitle: entry.subtitle,
    description: entry.description,
    longDescription: paragraphs.length ? paragraphs : [entry.longDescription],
    benefits: entry.benefits,
    process: entry.process,
    faqs: entry.faqs,
    relatedServices: entry.relatedServices
      .map((s) => SERVICES_CATALOG[s])
      .filter(Boolean)
      .slice(0, 3)
      .map((s) => ({ name: s.title, href: `/servicos/${s.slug}` })),
    category: entry.title,
  };
}

const ServicoDetalhe = () => {
  const { slug } = useParams<{ slug: string }>();
  const curated = slug ? servicesData[slug] ?? fromCatalog(slug) : null;

  // Rodada 3L — anti soft-404: slug sem conteúdo próprio (nem curado, nem no
  // catálogo canônico) não pode render uma página genérica indexável.
  if (!curated) return <NotFound />;

  const service = curated;

  const displayTitle = service.title;
  const serviceStandard = getServiceStandard(slug);


  const whatsappLink = buildWhatsAppUrl({ service: displayTitle, sourcePage: `/servicos/${slug ?? ""}` });

  // Depoimentos reais que fazem match com este serviço (política Rodada 23:
  // Review individual, sem AggregateRating).
  const serviceTestimonials = getTestimonialsForService(slug, displayTitle);
  const reviewsSchema = buildServiceReviewsSchema(displayTitle, serviceTestimonials);

  return (
    <Layout>
      {reviewsSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(reviewsSchema)}</script>
        </Helmet>
      )}
      <SEOHead
        title={`${displayTitle} em Curitiba | Preciso de Um Técnico`}
        description={SERVICES_CATALOG[slug!]?.metaDescription ?? service.description}
        canonical={`https://precisodeumtecnico.com/servicos/${slug}`}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
          { name: displayTitle, url: `https://precisodeumtecnico.com/servicos/${slug}` },
        ]}
        service={{
          name: displayTitle,
          description: service.description,
          priceMinBRL: 99.99,
          areaServed: "Curitiba e Região Metropolitana",
        }}
        // FAQ é única por serviço (curada ou vinda do catálogo canônico);
        // nunca há reaproveitamento genérico entre rotas.
        faq={service.faqs}

      />


      {/* Hero */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/servicos" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Serviços
              </Link>
              <span className="text-primary-foreground/40">/</span>
              <span className="text-primary-foreground/60">{service.category}</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              {displayTitle}
            </h1>
            <p className="text-accent font-semibold text-lg mb-4">{service.subtitle}</p>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
              {service.description}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Clock className="w-5 h-5 text-accent" />
                <span>Atendimento 24h</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Shield className="w-5 h-5 text-success" />
                <span>Garantia inclusa</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-accent" />
                <span>Curitiba e Região</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="whatsapp" size="xl" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="service-detail" data-service={displayTitle} aria-label={`Solicitar orçamento de ${displayTitle} pelo WhatsApp`}>
                  <MessageCircle className="w-5 h-5" />
                  Solicitar Orçamento
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {isCollectionOnlyService(slug) && <CollectionOnlyBand />}

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Sumário navegável — apenas na montagem de PC (página longa) */}
              {slug === "pc-gamer" && (
                <PageTableOfContents
                  className="mb-10"
                  items={[
                    { id: "sobre-o-servico", label: "Sobre o serviço" },
                    { id: "o-que-esta-incluido", label: "O que está incluído" },
                    { id: "escopo-da-montagem", label: "Escopo da montagem" },
                    { id: "orcamento-da-montagem", label: "Orçamento da montagem" },
                    { id: "como-funciona", label: "Como funciona" },
                    { id: "perguntas-frequentes", label: "Perguntas frequentes" },
                  ]}
                />
              )}

              {/* Description */}
              <div className="mb-12">
                <h2 id="sobre-o-servico" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Sobre o Serviço
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {service.longDescription.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-12">
                <h2 id="o-que-esta-incluido" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  O Que Está Incluído
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-card-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rodada 34 — ficha padrão obrigatória (fonte única serviceStandards.ts) */}
              {serviceStandard && <ServiceStandardBand standard={serviceStandard} />}


              {/* Montagem/PC Gamer: escopo, peças do cliente, garantia e checklist */}
              {slug === "pc-gamer" && (
                <div className="mb-12">
                  <h2 id="para-quem-e" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Para quem é a montagem
                  </h2>
                  <AssemblyUseContexts className="mb-10" />

                  <h2 id="escopo-da-montagem" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Escopo da montagem
                  </h2>
                  <AssemblyScopeBand className="mb-8" />
                  <AssemblyFlow className="mb-10" />
                  <AssemblyCompatibility className="mb-10" />
                  <AssemblyBiosBlock className="mb-10" />
                  <WorkstationRequirements />
                  <RelatedGuidesCard links={[GUIDE_LINKS.workstation, GUIDE_LINKS.ti]} />
                  <PcAssemblyPolicySections />




                  <div className="mt-8" id="orcamento-da-montagem">
                    <PcQuoteWizard sourcePage="/servicos/pc-gamer" />
                  </div>
                  <div className="mt-8 p-5 rounded-xl border border-border bg-card">
                    <p className="font-bold text-card-foreground mb-1">
                      Vai fornecer as peças?
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Leia a política completa de compatibilidade, procedência, integridade,
                      prazos de troca e garantia da peça versus mão de obra.
                    </p>
                    <Link
                      to="/politica-de-pecas-do-cliente"
                      className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                    >
                      Ver política de peças do cliente →
                    </Link>
                  </div>
                </div>
              )}

              {/* Depoimentos reais da cidade/bairro do visitante (oculto se não houver) */}
              <LocalReviewsBand
                serviceName={service.title}
                source={`servico-${slug}-depoimentos-locais`}
                className="mb-12"
              />

              {/* Interlinking contextual entre serviços correlatos (anti-canibalização) */}
              {slug && <RelatedServiceLinks slug={slug} />}



              {/* Process */}
              <div className="mb-12">
                <h2 id="como-funciona" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Como Funciona
                </h2>
                <div className="space-y-6">
                  {service.process.map((step) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary-foreground">{step.step}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Depoimentos reais para este serviço (política Rodada 23: sem AggregateRating) */}
              {serviceTestimonials.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                    O que dizem quem já contratou
                  </h2>
                  <div className="space-y-4">
                    {serviceTestimonials.map((t) => (
                      <article
                        key={`${t.name}-${t.date ?? t.service}`}
                        className="p-6 rounded-xl bg-card border border-border/50"
                      >
                        <div
                          className="flex items-center gap-1 mb-3"
                          aria-label={`Nota ${t.rating} de 5`}
                        >
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-accent fill-accent"
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          &ldquo;{t.text}&rdquo;
                        </p>
                        <footer className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                          <span className="font-semibold text-card-foreground">{t.name}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">{t.location}</span>
                          {t.date && (
                            <>
                              <span className="text-muted-foreground">·</span>
                              <time dateTime={t.date} className="text-muted-foreground">
                                {new Date(t.date).toLocaleDateString("pt-BR", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </time>
                            </>
                          )}
                        </footer>
                      </article>
                    ))}
                  </div>
                </div>
              )}


              {/* FAQs */}
              <div>
                <h2 id="perguntas-frequentes" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Perguntas Frequentes
                </h2>
                <div className="space-y-4">
                  {service.faqs.map((faq, index) => (
                    <div key={index} className="p-6 rounded-xl bg-card border border-border/50">
                      <h3 className="font-bold text-card-foreground mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-primary rounded-2xl p-6 text-center">
                  <Award className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-display font-bold text-xl text-primary-foreground mb-2">
                    Solicite um Orçamento
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mb-6">
                    Orçamento gratuito e sem compromisso. Atendimento rápido!
                  </p>
                  <Button variant="heroSolid" size="lg" className="w-full" asChild>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="service-detail" data-service={displayTitle} aria-label={`Solicitar ${displayTitle} pelo WhatsApp`}>
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 card-shadow">
                  <h3 className="font-bold text-card-foreground mb-4">Por Que Nos Escolher</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-accent" />
                      <span className="text-sm text-muted-foreground">Técnicos verificados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-success" />
                      <span className="text-sm text-muted-foreground">Garantia em todos os serviços</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Atendimento 24h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Técnicos certificados</span>
                    </div>
                  </div>
                </div>

                {/* Related Services */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 card-shadow">
                  <h3 className="font-bold text-card-foreground mb-4">Serviços Relacionados</h3>
                  <div className="space-y-2">
                    {service.relatedServices.map((related) => (
                      <Link
                        key={related.name}
                        to={related.href}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <span className="text-sm text-muted-foreground">{related.name}</span>
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
      <PublicPhotoBand
        title="Como esse tipo de serviço se parece na prática"
        intro="Imagens reais de domínio público / Creative Commons ilustrando equipamentos e bancadas semelhantes aos atendidos neste serviço."
        photos={pickServicePhotos("servico-detalhe", 3)}
      />
    </Layout>
  );
};

export default ServicoDetalhe;
