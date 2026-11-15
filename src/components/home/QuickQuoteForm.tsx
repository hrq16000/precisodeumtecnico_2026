import { PRICING } from "@/data/pricingPolicy";
import { useState } from "react";
import { TermsDialog } from "@/components/TermsDialog";
import { TERMS_SOURCE } from "@/lib/termsSource";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Send, Phone, User, Wrench, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getStoredTermsAcceptance } from "@/lib/analytics";
import { openTriage } from "@/lib/triageFlag";

// Mapeia o serviço selecionado para a categoria do funil de triagem.
const SERVICE_TO_CATEGORY: Record<string, "tv" | "celular" | "console" | "notebook" | "pc" | "som" | undefined> = {
  "Informática": "pc",
  "Notebooks": "notebook",
  "Celulares": "celular",
  "Games": "console",
  "Servidores": "pc",
};

const services = [
  "Informática",
  "Notebooks",
  "CFTV",
  "Elétrica",
  "Redes",
  "Ar-Condicionado",
  "Celulares",
  "Games",
  "Impressoras",
  "Servidores",
  "Manutenção Predial",
  "Serviços Gerais"
];

export function QuickQuoteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(() => getStoredTermsAcceptance());
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação com mensagem por CAMPO específico.
    if (!formData.name.trim()) {
      toast.error("Falta preencher: Nome completo.");
      return;
    }
    if (formData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Falta preencher: WhatsApp com DDD (mín. 10 dígitos).");
      return;
    }
    if (!formData.service) {
      toast.error("Falta preencher: selecione o serviço.");
      return;
    }
    if (!acceptedTerms) {
      toast.error("Você precisa aceitar os Termos de Orçamento Pré-Aprovado.");
      return;
    }

    setIsLoading(true);

    // Registra o aceite (legal) — não bloqueia.
    try {
      await supabase.from("terms_acceptances").insert({
        name: formData.name,
        phone: formData.phone,
        service: formData.service,
      });
    } catch {
      // non-blocking
    }

    // Abre o FUNIL OBRIGATÓRIO (triagem) com contexto pré-preenchido.
    openTriage({
      source: `quick-quote:${formData.service}`,
      category: SERVICE_TO_CATEGORY[formData.service],
    });

    toast.success("Abrindo triagem técnica para definir a modalidade.");
    setIsLoading(false);
    setAcceptedTerms(false);
    setFormData({ name: "", phone: "", service: "", description: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
              <MessageCircle className="h-4 w-4" />
              Orçamento em Minutos
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 break-words">
              Solicite um <span className="text-primary">Orçamento Rápido</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Preencha o formulário e receba atendimento imediato via WhatsApp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="grid gap-5">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="pl-10 h-12 bg-background"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="(41) 9 9999-9999"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pl-10 h-12 bg-background"
                  required
                />
              </div>

              {/* Service Select */}
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger className="pl-10 h-12 bg-background" aria-label="Selecione o serviço">
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Textarea
                  placeholder="Descreva brevemente o problema ou serviço necessário..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="pl-10 min-h-[100px] bg-background resize-none"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms-quick"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-0.5"
                  aria-label="Li e concordo com os Termos de Orçamento Pré-Aprovado"
                  aria-labelledby="terms-quick-label"
                />
                <span id="terms-quick-label" className="sr-only">Aceito os Termos de Orçamento Pré-Aprovado</span>
                <label htmlFor="terms-quick" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  Li e concordo com os{" "}
                  <TermsDialog
                    source={TERMS_SOURCE.quickForm}
                    onAccept={() => setAcceptedTerms(true)}
                    triggerLabel="Termos de Orçamento Pré-Aprovado"
                    triggerClassName="text-primary font-semibold hover:underline cursor-pointer"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !acceptedTerms}
                aria-disabled={isLoading || !acceptedTerms}
                className="w-full h-14 text-lg font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2"
              >
                <Send className="h-5 w-5" />
                {isLoading ? "Abrindo triagem..." : "Iniciar Triagem Técnica"}
              </Button>
              {!acceptedTerms && (
                <p className="text-xs text-center text-muted-foreground -mt-2">
                  Marque a caixa acima para habilitar o envio — o aceite dos Termos é obrigatório.
                </p>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {PRICING.technicalVisit.description} {PRICING.demandService.description}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
