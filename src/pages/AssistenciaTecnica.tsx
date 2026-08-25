import { Helmet } from "@/lib/helmet-compat";
import { motion } from "framer-motion";
import { Link } from "@/lib/router-compat";
import {
  Gamepad2,
  Monitor,
  Laptop,
  Smartphone,
  Cpu,
  Wrench,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Tv,
  Volume2,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  MapPin,
  Truck,
  Globe2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { trackWhatsAppClick } from "@/lib/analytics";
import { buildWhatsAppUrl, buildWhatsAppUrlFromText } from "@/lib/whatsapp";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickServicePhotos } from "@/data/publicPhotos";

const WHATSAPP_DISPLAY = "WhatsApp 24h";
const waLink = (text?: string) =>
  text
    ? buildWhatsAppUrlFromText(text)
    : buildWhatsAppUrl({ service: "assistência técnica nacional", sourcePage: "/assistencia-tecnica" });
const waClick = (source: string, service?: string) => () =>
  trackWhatsAppClick({ source: `brasil_lp_${source}`, service });

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const services = [
  { icon: Gamepad2, title: "Consoles & Videogames", desc: "PS5, PS4, Xbox Series, Xbox One, Nintendo Switch — reparo completo com peças de qualidade." },
  { icon: Cpu, title: "Placas de Vídeo (GPU)", desc: "Reballing, troca de cooler, reparo de artefatos e superaquecimento em NVIDIA e AMD." },
  { icon: Monitor, title: "Computadores & PC Gamer", desc: "Montagem, upgrade, diagnóstico e recuperação de dados em desktops e workstations." },
  { icon: Laptop, title: "Notebooks Multimarca", desc: "Dell, HP, Lenovo, Asus, Acer, Samsung e Apple. Troca de tela, teclado, bateria e placa-mãe." },
  { icon: Smartphone, title: "Smartphones & Tablets", desc: "iPhone, Samsung, Xiaomi, Motorola — troca de tela, bateria, conectores e software." },
  { icon: Tv, title: "TVs & Monitores", desc: "Reparo de backlight, fonte, placa T-Con, sem imagem e painel queimado." },
  { icon: Volume2, title: "Equipamentos de Som", desc: "Amplificadores, receivers, caixas, soundbars e home theaters." },
  { icon: Wrench, title: "Manutenção Preventiva", desc: "Limpeza interna, troca de pasta térmica e revisão completa de hardware." },
];

const trustPoints = [
  { icon: ShieldCheck, title: "Garantia de 90 dias", desc: "Em todos os reparos." },
  { icon: BadgeCheck, title: "Técnicos certificados", desc: "Curitiba e parceiros em todo o Brasil." },
  { icon: Truck, title: "Logística nacional", desc: "Envio rastreado para qualquer estado." },
  { icon: Sparkles, title: "Orçamento grátis", desc: "Diagnóstico transparente antes do reparo." },
];

const faqs = [
  {
    q: "Vocês atendem em todo o Brasil?",
    a: "Sim. Nossa central técnica fica em Curitiba (PR) e mantemos uma rede de parceiros certificados em todos os estados, além de logística reversa para receber e devolver seu equipamento com segurança.",
  },
  {
    q: "Como funciona o envio do equipamento para reparo?",
    a: "Após o orçamento via WhatsApp, enviamos as instruções de embalagem e a etiqueta de postagem. Você despacha pelos Correios ou transportadora parceira e acompanha o reparo em tempo real.",
  },
  {
    q: "Quanto custa o diagnóstico?",
    a: "O diagnóstico inicial via WhatsApp é gratuito. Após receber o equipamento, confirmamos o orçamento detalhado por escrito antes de iniciar qualquer reparo.",
  },
  {
    q: "Qual o prazo médio do reparo?",
    a: "A maioria dos serviços é concluída em 3 a 7 dias úteis após o recebimento. Serviços complexos (reballing de BGA, reparo de placa-mãe) podem levar até 10 dias úteis.",
  },
  {
    q: "Trabalham com nota fiscal?",
    a: "Sim. Emitimos nota fiscal de serviço para pessoas físicas e jurídicas em todos os atendimentos.",
  },
];

const stateAnchors = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre",
  "Brasília", "Salvador", "Fortaleza", "Recife", "Manaus", "Florianópolis",
  "Goiânia", "Vitória",
];

export default function AssistenciaTecnica() {
  const pageUrl = "https://precisodeumtecnico.com/assistencia-tecnica";
  const ogImage = "https://precisodeumtecnico.com/og-image.jpg";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Preciso de um Técnico",
    description:
      "Assistência técnica nacional: reparo de consoles, placas de vídeo, computadores, notebooks, smartphones, TVs e equipamentos de som. Central em Curitiba e parceiros em todo o Brasil.",
    url: pageUrl,
    image: ogImage,
    areaServed: { "@type": "Country", name: "Brasil" },
    serviceArea: { "@type": "Country", name: "BR" },
    priceRange: "$$",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: "Assistência Técnica no Brasil", item: pageUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceSchemas = services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${s.title} — Atendimento Nacional`,
    serviceType: s.title,
    areaServed: { "@type": "Country", name: "Brasil" },
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de um Técnico",
      url: pageUrl,
    },
  }));

  return (
    <Layout>
      <Helmet>
        <title>Assistência Técnica em Todo o Brasil | PCs, Consoles e TVs</title>
        <meta
          name="description"
          content="Reparo de PS5, Xbox, placas de vídeo, notebooks, celulares, TVs e som com atendimento em todo o Brasil. Central em Curitiba e WhatsApp 24h."
        />
        <meta
          name="keywords"
          content="assistência técnica brasil, conserto ps5 nacional, assistência xbox brasil, reparo placa de vídeo brasil, assistência técnica notebook brasil, conserto tv nacional, manutenção computador brasil"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Preciso de um Técnico" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Assistência Técnica em Todo o Brasil" />
        <meta
          property="og:description"
          content="Reparo de consoles, GPUs, PCs, notebooks, TVs e som. Central em Curitiba, parceiros em todos os estados do Brasil."
        />
        <meta property="og:url" content={pageUrl} />
        {/* og:image / twitter:image ficam a cargo da hospedagem (evita duplicidade). */}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Assistência Técnica Nacional — Preciso de um Técnico" />
        <meta name="twitter:description" content="Reparo de eletrônicos com envio rastreado para todo o Brasil." />


        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        {serviceSchemas.map((s, i) => (
          <script key={`svc-${i}`} type="application/ld+json">{JSON.stringify(s)}</script>
        ))}
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b">
        <div className="container-custom relative py-16 md:py-24 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <motion.span
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
            >
              <Globe2 className="w-3.5 h-3.5" /> Atendimento em todo o Brasil
            </motion.span>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground"
            >
              Assistência Técnica Especializada{" "}
              <span className="text-primary">em Todo o Brasil</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              Reparo de <strong className="text-foreground">consoles, placas de vídeo, computadores, notebooks, smartphones, TVs e equipamentos de som</strong>.
              Central em Curitiba e rede de parceiros certificados em todos os estados, com logística rastreada e garantia.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button variant="whatsapp" size="lg" asChild>
                <a href={waLink()} onClick={waClick("hero")} target="_blank" rel="noopener noreferrer" data-wa-source="landing-brasil" data-service="assistência técnica nacional" aria-label="Solicitar orçamento pelo WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                  Solicitar Orçamento no WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#servicos">Ver Serviços</a>
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="mt-8 flex flex-wrap gap-2.5 text-xs"
            >
              {["Logística Nacional", "Garantia 90 dias", "Nota Fiscal", "Orçamento Grátis"].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-muted-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 via-accent/30 to-primary/20 blur-2xl rounded-3xl" />
            <div className="relative rounded-3xl bg-card border border-border p-7 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
                  <Globe2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Cobertura Nacional</p>
                  <p className="text-xs text-muted-foreground">Central em Curitiba · Parceiros em todo o BR</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: "27", l: "Estados" },
                  { v: "90d", l: "Garantia" },
                  { v: "24h", l: "Resposta" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-muted/50 border border-border py-3">
                    <div className="text-primary font-extrabold text-lg">{s.v}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos" className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Nossos <span className="text-primary">Serviços Especializados</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Soluções completas para todos os seus dispositivos eletrônicos, com envio rastreado de qualquer cidade do Brasil.
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.article
                  key={s.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i}
                  className="group rounded-2xl bg-card border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="inline-grid place-items-center w-12 h-12 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:rotate-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                  <a
                    href={waLink(`Olá! Quero um orçamento nacional para: ${s.title}.`)}
                    onClick={waClick("service_card", s.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-wa-source="brasil-lp-service-card"
                    data-service={s.title}
                    aria-label={`Solicitar orçamento de ${s.title} pelo WhatsApp`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Solicitar Orçamento <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 md:py-20 bg-muted/30 border-y border-border">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Por que somos referência <span className="text-primary">em todo o Brasil</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Mais de 500 reparos concluídos com transparência, prazos curtos e suporte direto com o técnico.
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustPoints.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-2xl p-6 bg-card border border-border hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition"
                >
                  <div className="grid place-items-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 font-bold text-foreground text-lg">{t.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24">
        <div className="container-custom max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground"
          >
            Como funciona o atendimento nacional
          </motion.h2>

          <div className="mt-10 grid md:grid-cols-4 gap-6">
            {[
              { n: 1, t: "Fale no WhatsApp", d: "Descreva o problema e receba o diagnóstico inicial." },
              { n: 2, t: "Envio rastreado", d: "Recebemos seu equipamento com etiqueta postal." },
              { n: 3, t: "Orçamento aprovado", d: "Reparo iniciado somente após sua confirmação." },
              { n: 4, t: "Devolução segura", d: "Equipamento volta embalado e com garantia de 90 dias." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl bg-card border border-border p-6"
              >
                <div className="grid place-items-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">{s.n}</div>
                <h3 className="mt-4 font-bold text-foreground">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted/30 border-t border-border">
        <div className="container-custom max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <HelpCircle className="w-3.5 h-3.5" /> Perguntas Frequentes
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Dúvidas sobre <span className="text-primary">assistência técnica nacional</span>
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp} className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem data-faq-item key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent data-faq-answer className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="py-14 border-t border-border">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Atendimento em destaque</h2>
            <p className="mt-2 text-muted-foreground">
              Página dedicada a Curitiba e principais capitais — envio rastreado para todos os estados.
            </p>
          </motion.div>

          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <li>
              <Link
                to="/assistencia-tecnica-curitiba"
                className="group flex items-center justify-between gap-3 rounded-xl border border-primary/40 bg-card p-4 hover:border-primary hover:shadow-md transition"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  Assistência Técnica em Curitiba
                </span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition" />
              </Link>
            </li>
            {stateAnchors.map((c) => (
              <li key={c}>
                <span className="flex items-center gap-2 text-sm text-muted-foreground rounded-xl border border-border bg-card p-4">
                  <MapPin className="w-4 h-4 text-primary/70" />
                  {c} — via parceiros
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 bg-muted/30 border-t border-border">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-10 sm:p-14 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Seu equipamento, qualquer cidade do Brasil
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Fale agora no WhatsApp e receba seu orçamento e instruções de envio em minutos.
            </p>
            <div className="mt-8">
              <Button variant="whatsapp" size="lg" asChild>
                <a href={waLink()} onClick={waClick("final_cta")} target="_blank" rel="noopener noreferrer" data-wa-source="landing-brasil" data-service="assistência técnica nacional" aria-label="Chamar técnico pelo WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                  Chamar no WhatsApp — {WHATSAPP_DISPLAY}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <PublicPhotoBand
        title="Referências visuais do atendimento técnico"
        intro="Fotos reais licenciadas livremente que representam os equipamentos e serviços cobertos pelo atendimento nacional."
        photos={pickServicePhotos("assistencia-nacional", 3)}
      />
    </Layout>
  );
}
