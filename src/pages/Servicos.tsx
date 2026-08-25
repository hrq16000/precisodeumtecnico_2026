import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { AuthoritySince } from "@/components/marketing/AuthoritySince";
import { CommercialTermsBlock } from "@/components/marketing/CommercialTermsBlock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Monitor, Laptop, Camera, Zap, Wifi, Wind, Wrench, Tv, Server, 
  Smartphone, Printer, Building, HardDrive, Shield, Cpu, Settings,
  ArrowRight, CheckCircle, MessageCircle, Building2, Headset
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { PRICING, SLA } from "@/data/pricingPolicy";
import { servicesData } from "@/data/services";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickServicePhotos } from "@/data/publicPhotos";

/**
 * FAQ de /servicos — fonte única: COMMERCIAL_TERMS + PRICING.
 * Não incluir alegações sem comprovação (guard: check-commercial-claims.ts).
 */
const servicosFaqs = [
  {
    question: "Como funciona o orçamento antes do serviço?",
    answer: COMMERCIAL_TERMS.preApprovedPolicyText,
  },
  {
    question: "Quanto custa o diagnóstico?",
    answer: `${PRICING.benchDiagnosis.description} ${PRICING.technicalVisit.description}`,
  },
  {
    question: "Como funciona a coleta e entrega?",
    answer: PRICING.pickupDelivery.description,
  },
  {
    question: "Qual é o prazo de atendimento?",
    answer: `${COMMERCIAL_TERMS.minimumQueueText} ${SLA.disclaimer}`,
  },
  {
    question: "E se eu desistir depois do diagnóstico?",
    answer: COMMERCIAL_TERMS.cancellationText,
  },
  {
    question: "O valor mínimo inclui peças?",
    answer: `Não. ${COMMERCIAL_TERMS.preApprovedBudget.minLabel} é o mínimo pré-aprovado e cobre ${COMMERCIAL_TERMS.preApprovedBudget.includes.join(", ").toLowerCase()}. Peças, componentes, materiais ou itens adicionais são informados separadamente e só seguem com sua aprovação.`,
  },
];

/**
 * Rodada 4I-P.1 / 4I-P.1R — hub sem 404.
 * `href` só existe quando há destino real e de mesma intenção no HEAD
 * (landing viva ou slug curado de `servicesData`). Sem equivalente, o card
 * permanece como item informativo, sem link — nenhuma rota nova é criada.
 * Não há link "Ver categoria": os hubs `/servicos/:categoria` não existem
 * (slug fora de CURATED_SERVICE_SLUGS responde NotFound).
 */
type HubService = { name: string; href?: string };

const serviceCategories: {
  title: string;
  icon: typeof Monitor;
  color: string;
  services: HubService[];
}[] = [
  {
    title: "Informática e Computadores",
    icon: Monitor,
    color: "bg-blue-500/10 text-blue-600",
    services: [
      { name: "Formatação de Computadores", href: "/formatacao-de-computador-curitiba" },
      { name: "Limpeza de Computador" },
      { name: "Upgrade de Hardware" },
      { name: "Troca de HD para SSD", href: "/upgrade-ssd-curitiba" },
      { name: "Instalação de Programas" },
      { name: "Remoção de Vírus", href: "/remocao-de-virus-curitiba" },
      { name: "Recuperação de Dados" },
      { name: "Montagem de PC Gamer", href: "/servicos/pc-gamer" },
    ],
  },
  {
    title: "Notebooks",
    icon: Laptop,
    color: "bg-indigo-500/10 text-indigo-600",
    services: [
      { name: "Conserto de Notebook", href: "/conserto-de-notebook-curitiba" },
      { name: "Troca de Tela de Notebook" },
      { name: "Troca de Teclado" },
      { name: "Troca de Bateria" },
      { name: "Limpeza Interna de Notebook" },
      { name: "Reparo de Placa Mãe" },
      { name: "Upgrade de Memória RAM", href: "/upgrade-memoria-ram-curitiba" },
      { name: "Notebook não Liga" },
    ],
  },
  {
    title: "CFTV e Câmeras de Segurança",
    icon: Camera,
    color: "bg-purple-500/10 text-purple-600",
    services: [
      { name: "Instalação de Câmeras" },
      { name: "Manutenção de CFTV" },
      { name: "Configuração de DVR/NVR" },
      { name: "Acesso Remoto de Câmeras" },
      { name: "Instalação de Interfone" },
      { name: "Alarme Residencial" },
      { name: "Cerca Elétrica" },
      { name: "Controle de Acesso" },
    ],
  },
  {
    title: "Elétrica",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-600",
    services: [
      { name: "Instalação de Tomadas" },
      { name: "Troca de Disjuntores" },
      { name: "Instalação de Chuveiro" },
      { name: "Revisão Elétrica Residencial" },
      { name: "Adequação NBR 5410" },
      { name: "Instalação de Lustres" },
      { name: "Quadro de Distribuição" },
      { name: "Aterramento Elétrico" },
    ],
  },
  {
    title: "Redes e Wi-Fi",
    icon: Wifi,
    color: "bg-cyan-500/10 text-cyan-600",
    services: [
      { name: "Instalação de Roteador" },
      { name: "Configuração de Wi-Fi", href: "/servicos/configuracao-wifi-curitiba" },
      { name: "Rede Estruturada" },
      { name: "Instalação de Cabo de Rede" },
      { name: "Configuração de Switch" },
      { name: "Internet Lenta" },
      { name: "Repetidor de Sinal" },
      { name: "VPN Empresarial" },
    ],
  },
  {
    title: "Ar-Condicionado",
    icon: Wind,
    color: "bg-teal-500/10 text-teal-600",
    services: [
      { name: "Instalação de Ar-Condicionado" },
      { name: "Limpeza de Ar-Condicionado" },
      { name: "Manutenção de Ar Split" },
      { name: "Carga de Gás" },
      { name: "Conserto de Ar-Condicionado" },
      { name: "Desinstalação de Ar" },
    ],
  },
  {
    title: "TV e Eletrônicos",
    icon: Tv,
    color: "bg-rose-500/10 text-rose-600",
    services: [
      { name: "Conserto de TV" },
      { name: "Instalação de TV na Parede" },
      { name: "Conserto de Videogame" },
      { name: "Reparo de PlayStation" },
      { name: "Reparo de Xbox" },
      { name: "Conserto de Som", href: "/servicos/conserto-de-som-e-audio-curitiba" },
    ],
  },
  {
    title: "Servidores e Data Centers",
    icon: Server,
    color: "bg-slate-500/10 text-slate-600",
    services: [
      { name: "Instalação de Servidor" },
      { name: "Configuração de Servidor" },
      { name: "Backup Empresarial", href: "/servicos/backup-para-empresas" },
      { name: "Virtualização" },
      { name: "Suporte de TI", href: "/servicos/suporte-tecnico-empresarial" },
      { name: "Contrato de Manutenção", href: "/servicos/manutencao-preventiva-empresas" },
    ],
  },
  {
    title: "Celulares e Tablets",
    icon: Smartphone,
    color: "bg-emerald-500/10 text-emerald-600",
    services: [
      { name: "Troca de Tela de Celular" },
      { name: "Troca de Bateria de Celular" },
      { name: "Conserto de Tablet" },
      { name: "Recuperação de Celular Molhado" },
      { name: "Desbloqueio de Celular" },
    ],
  },
  {
    title: "Impressoras",
    icon: Printer,
    color: "bg-orange-500/10 text-orange-600",
    services: [
      { name: "Instalação de Impressora" },
      { name: "Manutenção de Impressora" },
      { name: "Impressora em Rede" },
      { name: "Bulk Ink" },
      { name: "Troca de Cartucho/Toner" },
    ],
  },
  {
    title: "Manutenção Predial",
    icon: Building,
    color: "bg-amber-500/10 text-amber-600",
    services: [
      { name: "Manutenção Comercial" },
      { name: "Manutenção Industrial" },
      { name: "Adequação NR-10" },
      { name: "Laudo Técnico" },
      { name: "PMOC" },
    ],
  },
  {
    title: "Serviços Gerais",
    icon: Wrench,
    color: "bg-stone-500/10 text-stone-600",
    services: [
      { name: "Hidráulica Básica" },
      { name: "Montagem de Móveis" },
      { name: "Instalação de Suportes" },
      { name: "Pequenos Reparos" },
    ],
  },
];
const whatsappLink = buildWhatsAppUrl({ service: "assistência técnica", sourcePage: "/servicos" });

const Servicos = () => {
  return (
    <Layout>
      <SEOHead
        title="Assistência Técnica em Curitiba e Região"
        description="Escolha o serviço técnico que você precisa: informática, notebooks, CFTV, elétrica, redes, ar-condicionado e mais. Orçamento informado antes da execução."
        canonical="https://precisodeumtecnico.com/servicos"
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
        ]}
        faq={servicosFaqs}
        structuredData={[
          buildLocalBusinessSchema({ url: "https://precisodeumtecnico.com/servicos" }),
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "Catálogo de serviços técnicos — Curitiba e Região",
            url: "https://precisodeumtecnico.com/servicos",
            itemListElement: Object.entries(servicesData)
              .slice(0, 24)
              .map(([slug, s], i) => ({
                "@type": "Offer",
                position: i + 1,
                itemOffered: {
                  "@type": "Service",
                  name: s.title,
                  description: s.description,
                  url: `https://precisodeumtecnico.com/servicos/${slug}`,
                  areaServed: "Curitiba e Região Metropolitana",
                  provider: { "@type": "LocalBusiness", name: "Preciso de Um Técnico" },
                },
              })),
          },
        ]}
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Nossos <span className="text-accent">Serviços</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
              Soluções completas em assistência técnica para residências e empresas. 
              Técnicos especializados, garantia em todos os serviços e atendimento 24 horas.
            </p>
            <Button variant="whatsapp" size="lg" asChild>
              <a
                data-wa-source="servicos"
                data-service="assistência técnica"
                aria-label="Falar no WhatsApp sobre os serviços"
                href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                Solicitar Orçamento
              </a>
            </Button>
          </div>
        </div>
      </section>

      <AuthoritySince />


      {/* Cluster prioritário de informática — concentra o link equity do hub
          nas páginas de maior intenção comercial do cluster. */}
      <section className="section-padding bg-secondary/30 border-y border-border" aria-labelledby="cluster-informatica">
        <div className="container-custom">
          <h2 id="cluster-informatica" className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Informática: comece por aqui
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            As páginas mais procuradas do atendimento em computadores e notebooks, com escopo,
            prazos e faixas de valor descritos em cada uma.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { to: "/assistencia-tecnica-curitiba", label: "Assistência técnica em informática em Curitiba", desc: "Hub de atendimento: diagnóstico, manutenção, upgrade e redes." },
              { to: "/guia-tecnico-informatica", label: "Guia técnico de informática", desc: "Como diagnosticar antes de gastar com peça ou serviço." },
              { to: "/conserto-de-notebook-curitiba", label: "Conserto de notebook em Curitiba", desc: "Não liga, superaquece, não carrega ou tela danificada." },
              { to: "/formatacao-de-computador-curitiba", label: "Formatação de computador em Curitiba", desc: "Reinstalação limpa com backup e drivers oficiais." },
              { to: "/upgrade-ssd-curitiba", label: "Upgrade de SSD em Curitiba", desc: "Troca do disco mecânico com migração do sistema." },
              { to: "/upgrade-memoria-ram-curitiba", label: "Upgrade de memória RAM em Curitiba", desc: "Ampliação de memória com conferência de compatibilidade." },
              { to: "/como-escolher-tecnico-preco-prazo", label: "Como escolher o técnico pelo preço e prazo", desc: "Comparativo de escopos, prazos e sinais de alerta antes de fechar." },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-testid="hub-service-link"
                className="group block p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <span className="font-semibold text-card-foreground group-hover:text-primary inline-flex items-center gap-2">
                  {item.label}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </span>
                <span className="mt-2 block text-sm text-muted-foreground">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="space-y-16">
            {serviceCategories.map((category) => (
              <div key={category.title} id={category.title.toLowerCase().replace(/\s+/g, '-')}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.services.map((service) =>
                    service.href ? (
                      <Link
                        key={service.name}
                        to={service.href}
                        data-testid="hub-service-link"
                        className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                      >
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="text-card-foreground group-hover:text-primary transition-colors font-medium">
                          {service.name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                      </Link>
                    ) : (
                      // Item informativo: sem destino real. Visual deliberadamente
                      // distinto do card clicável (sem borda de hover, sem seta,
                      // fundo neutro) para não prometer interação inexistente.
                      <div
                        key={service.name}
                        data-testid="hub-service-static"
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-transparent cursor-default"
                      >
                        <CheckCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground font-medium">{service.name}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cluster interno PJ e remoto */}
      <section className="section-padding bg-background" aria-labelledby="cluster-publicos">
        <div className="container-custom max-w-5xl">
          <h2 id="cluster-publicos" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Atendimento para empresas e suporte remoto
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/assistencia-tecnica-empresas-curitiba"
              className="group flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Assistência técnica para empresas em Curitiba
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Suporte a parques de máquinas, servidores, redes e CFTV com atendimento
                  programado para CNPJ.
                </p>
              </div>
            </Link>
            <Link
              to="/suporte-tecnico-remoto"
              className="group flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Headset className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Suporte técnico remoto
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Resolução de problemas de software, configuração e lentidão sem
                  deslocamento, com acesso assistido.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <CommercialTermsBlock />

      {/* FAQ */}
      <section className="section-padding bg-background" aria-labelledby="faq-servicos">
        <div className="container-custom max-w-3xl">
          <h2 id="faq-servicos" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Perguntas frequentes sobre nossos serviços
          </h2>
          <Accordion type="single" collapsible>
            {servicosFaqs.map((f, i) => (
              <AccordionItem data-faq-item key={i} value={`s-${i}`}>
                <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent data-faq-answer>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection />
      <PublicPhotoBand
        title="Referências visuais dos serviços"
        intro="Fotos reais de bancadas, redes, CFTV e instalações elétricas — imagens de terceiros sob licença livre, usadas para ilustrar o tipo de trabalho descrito nesta página."
        photos={pickServicePhotos("todos-os-servicos", 3)}
      />
    </Layout>
  );
};

export default Servicos;
