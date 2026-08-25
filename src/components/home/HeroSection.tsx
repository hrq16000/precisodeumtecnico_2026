import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Clock, Shield, MapPin, Users, CalendarCheck } from "lucide-react";
import { OfferHighlight } from "@/components/marketing/OfferHighlight";
import { GeoStatusChip } from "@/components/layout/GeoStatusChip";
import { SLA } from "@/data/pricingPolicy";
import { COMPANY } from "@/data/companyInfo";
import { useWhatsAppLink } from "@/hooks/useWhatsAppLink";


export function HeroSection() {
  const whatsappLink = useWhatsAppLink({ service: "assistência técnica" });
  return <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1a3050]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 40%)`
      }} />
      </div>

      <div className="container-custom relative z-10 py-4 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge — prova de autoridade factual acima da dobra */}
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/20 border border-[#22C55E]/30 rounded-full px-4 py-1.5 mb-3 animate-fade-up">
            <CalendarCheck className="w-4 h-4 text-[#22C55E]" />
            <span className="text-white text-sm font-medium">
              Atuação em informática desde {COMPANY.foundingYear}
            </span>
          </div>

          {/* Status de localização — Detectado (IP) / Confirmado (GPS ou manual) */}
          <div className="mb-3 flex justify-center animate-fade-up">
            <GeoStatusChip />
          </div>



          {/* Main Headline */}
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 animate-fade-up tracking-tight leading-tight">
            <span className="text-white">Assistência Técnica </span>
            <span className="text-[#22C55E]">Especializada</span>
          </h1>

          <p className="text-sm md:text-lg text-white/80 mb-4 max-w-2xl mx-auto animate-fade-up px-4">
            Informática, notebooks, CFTV, elétrica, ar-condicionado, celulares e muito mais.
            Atendimento 24h via WhatsApp. O técnico vai até você!
          </p>

          {/* Oferta âncora — preço (1) + Termos (2) com hierarquia forte */}
          <div className="mb-4 animate-fade-up max-w-xl mx-auto">
            <OfferHighlight region="Curitiba e Brasil" />
          </div>

          {/* CTA principal — mantido acima da dobra no mobile (360/390/430px) */}
          <div className="flex flex-col gap-3 px-4 mb-4 animate-fade-up">
            <Button size="lg" className="w-full bg-[#15803D] hover:bg-[#116932] text-white font-bold text-lg py-5 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02]" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="hero" data-service="assistência técnica" data-cta-label="hero_whatsapp" aria-label="Solicitar atendimento pelo WhatsApp (hero)">
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar Atendimento
              </a>
            </Button>
          </div>

          {/* Sinais de confiança comprovados (abaixo do CTA) */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 animate-fade-up px-4 text-white/90">
            <span className="inline-flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" /> Valor informado antes da execução
            </span>
            <span className="inline-flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-[#22C55E]" /> Garantia conforme o serviço realizado
            </span>
            <span className="inline-flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#F59E0B]" /> Prazo: {SLA.minLabel} a {SLA.maxLabel}
            </span>
          </div>

          {/* Operating Hours */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/70 mb-8 animate-fade-up">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>Atendimento presencial: 8h às 22h</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-[#22C55E]" />
              <span>WhatsApp: 24 horas</span>
            </div>
          </div>

          {/* Feature Cards */}
          <h2 className="sr-only">Diferenciais do atendimento</h2>
          <div className="grid grid-cols-2 gap-4 px-4 animate-fade-up">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <Clock className="w-10 h-10 text-[#3B82F6] mb-3" aria-hidden="true" />
              <div className="font-bold text-white text-2xl mb-1" aria-label="24 horas">24h</div>
              <p className="text-white/80 text-sm">Agendamento via WhatsApp</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <CalendarCheck className="w-10 h-10 text-[#22C55E] mb-3" aria-hidden="true" />
              <div className="font-bold text-white text-2xl mb-1">{COMPANY.foundingYear}</div>
              <p className="text-white/80 text-sm">Ano de início da atuação</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <MapPin className="w-10 h-10 text-[#F59E0B] mb-3" aria-hidden="true" />
              <div className="font-bold text-white text-2xl mb-1">Curitiba</div>
              <p className="text-white/80 text-sm">E região metropolitana</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <Users className="w-10 h-10 text-[#22C55E] mb-3" aria-hidden="true" />
              <div className="font-bold text-white text-2xl mb-1">Brasil</div>
              <p className="text-white/80 text-sm">Rede de prestadores parceiros</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
}
