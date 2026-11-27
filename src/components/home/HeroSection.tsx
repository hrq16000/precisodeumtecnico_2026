import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Clock, Shield, MapPin, Users, CalendarCheck, ArrowDown } from "lucide-react";
import { OfferHighlight } from "@/components/marketing/OfferHighlight";
import { GeoStatusChip } from "@/components/layout/GeoStatusChip";
import { SLA } from "@/data/pricingPolicy";
import { COMPANY } from "@/data/companyInfo";
import { useWhatsAppLink } from "@/hooks/useWhatsAppLink";

export function HeroSection() {
  const whatsappLink = useWhatsAppLink({ service: "assistência técnica" });
  return (
    <section className="relative overflow-hidden bg-[#1e3a5f] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#365d84,transparent_65%)]" />
      <div className="container-custom relative py-7 md:py-12 lg:py-16">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,.86fr)] lg:gap-14">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium">
                <CalendarCheck className="h-4 w-4 shrink-0 text-[#86efac]" aria-hidden="true" />
                Atuação em informática desde {COMPANY.foundingYear}
              </span>
              <GeoStatusChip />
            </div>

            <h1 className="mt-5 font-display text-[clamp(2rem,4.7vw,4.5rem)] font-bold leading-[1.08] tracking-tight">
              Assistência Técnica <span className="block text-[#86efac]">Especializada</span>
            </h1>

            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-white/85 md:text-lg">
              Informática, notebooks, CFTV, elétrica, ar-condicionado, celulares e muito mais.
              Atendimento 24h via WhatsApp. O técnico vai até você!
            </p>

            <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button size="lg" className="min-h-12 w-full rounded-xl bg-[#15803D] px-5 font-bold text-white transition-colors hover:bg-[#116932] active:bg-[#116932] sm:w-auto" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="hero" data-service="assistência técnica" data-cta-label="hero_whatsapp" aria-label="Solicitar atendimento pelo WhatsApp (hero)">
                  <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                  Solicitar Atendimento
                </a>
              </Button>
              <a href="#home-sintomas" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Explorar por problema <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <ul className="mt-6 grid gap-2 text-sm text-white/90">
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#86efac]" aria-hidden="true" /> Valor informado antes da execução</li>
              <li className="flex items-start gap-2"><Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#86efac]" aria-hidden="true" /> Garantia conforme o serviço realizado</li>
              <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#fcd34d]" aria-hidden="true" /> Prazo: {SLA.minLabel} a {SLA.maxLabel}</li>
            </ul>
          </div>

          <div className="min-w-0 rounded-3xl border border-white/15 bg-[#132e4b] p-4 sm:p-6 lg:p-7">
            <p className="mb-4 border-b border-white/15 pb-3 text-xs font-semibold uppercase tracking-[.16em] text-white/75">Como iniciar o atendimento</p>
            <OfferHighlight region="Curitiba e Brasil" layout="stacked" />
            <div className="mt-5 grid gap-3 text-sm text-white/85">
              <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#86efac]" aria-hidden="true" /><span>Atendimento presencial: 8h às 22h</span></div>
              <div className="flex items-start gap-2"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#86efac]" aria-hidden="true" /><span>WhatsApp: 24 horas</span></div>
            </div>
          </div>
        </div>

        <h2 className="sr-only">Diferenciais do atendimento</h2>
        <dl className="mt-8 grid grid-cols-2 divide-x divide-white/15 border-y border-white/15 lg:mt-12 lg:grid-cols-4">
          {[
            { icon: Clock, value: "24h", label: "Agendamento via WhatsApp" },
            { icon: CalendarCheck, value: String(COMPANY.foundingYear), label: "Ano de início da atuação" },
            { icon: MapPin, value: "Curitiba", label: "E região metropolitana" },
            { icon: Users, value: "Brasil", label: "Rede de prestadores parceiros" },
          ].map(({ icon: Icon, value, label }, index) => (
            <div key={label} className={`min-w-0 px-3 py-4 sm:px-5 ${index > 1 ? "border-t border-white/15 lg:border-t-0" : ""}`}>
              <dt className="flex items-center gap-2 font-display text-xl font-bold sm:text-2xl"><Icon className="h-5 w-5 shrink-0 text-[#86efac]" aria-hidden="true" />{value}</dt>
              <dd className="mt-1 text-xs leading-relaxed text-white/75 sm:text-sm">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
