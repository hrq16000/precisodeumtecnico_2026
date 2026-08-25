import { useState } from "react";
import { TermsDialog } from "@/components/TermsDialog";
import { TERMS_SOURCE } from "@/lib/termsSource";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { sendLeadNotification } from "@/lib/lead-notification.functions";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, MessageCircle } from "lucide-react";
import { getStoredTermsAcceptance } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const phoneRegex = /^\(?[1-9]{2}\)?\s?[9]?\d{4}[-\s]?\d{4}$/;

const contactFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().regex(phoneRegex, "Telefone inválido. Use: (41) 99999-9999"),
  service: z.string().optional(),
  city: z.string().optional(),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(1000, "Mensagem muito longa"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const services = [
  "Informática",
  "Notebook",
  "CFTV / Câmeras",
  "Elétrica",
  "Redes e Wi-Fi",
  "Ar-Condicionado",
  "TV e Eletrônicos",
  "Celulares",
  "Impressoras",
  "Manutenção Predial",
  "Serviços Gerais",
  "Outro",
];

const cities = [
  "Curitiba",
  "São José dos Pinhais",
  "Pinhais",
  "Colombo",
  "Araucária",
  "Campo Largo",
  "Fazenda Rio Grande",
  "Almirante Tamandaré",
  "Piraquara",
  "Outra",
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(() => getStoredTermsAcceptance());

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      city: "",
      message: "",
    },
  });

  // Honeypot field state (anti-spam)
  const [honeypot, setHoneypot] = useState("");

  const sendEmailNotification = async (data: ContactFormValues) => {
    try {
      const response = await sendLeadNotification({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          ...(data.service ? { service: data.service } : {}),
          ...(data.city ? { city: data.city } : {}),
          message: data.message,
          website: honeypot, // Honeypot field
        },
      });

      if (!response.success) {
        console.error("Error sending email notification:", response.error);
        // Don't throw - email is secondary, lead was already saved
      } else {
        console.log("Email notification sent successfully");
      }
    } catch (err) {
      console.error("Failed to send email notification:", err);
      // Don't throw - email is secondary, lead was already saved
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    // If honeypot is filled, silently reject (bot detected)
    if (honeypot) {
      setIsSuccess(true);
      return;
    }
    if (!acceptedTerms) {
      toast({
        title: "Termos obrigatórios",
        description: "Você precisa aceitar os Termos de Orçamento Pré-Aprovado.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save lead to database
      const { error } = await supabase.from("leads").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service || null,
        city: data.city || null,
        message: data.message,
        status: "new",
      });

      if (error) {
        console.error("Error submitting lead:", error);
        toast({
          title: "Erro ao enviar",
          description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // Send email notifications (async, don't block)
      sendEmailNotification(data);

      // Register terms acceptance
      try {
        await supabase.from("terms_acceptances").insert({
          name: data.name,
          phone: data.phone,
          email: data.email,
          service: data.service || null,
        });
      } catch (e) {
        // non-blocking
      }

      setIsSuccess(true);
      setAcceptedTerms(false);
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve. Verifique seu e-mail!",
      });
      form.reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro. Tente novamente ou entre em contato via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const whatsappLink = buildWhatsAppUrl({ service: "contato técnico" });

  if (isSuccess) {
    return (
      <div className="bg-success/10 rounded-2xl p-8 text-center border border-success/30">
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        <h3 className="font-display font-bold text-2xl text-foreground mb-2">
          Mensagem Enviada!
        </h3>
        <p className="text-muted-foreground mb-6">
          Recebemos sua solicitação e enviamos uma confirmação para seu e-mail. Entraremos em contato em breve!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="whatsapp" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="contact-form" data-service="contato técnico" aria-label="Falar com técnico pelo WhatsApp">
              <MessageCircle className="w-4 h-4" />
              Atendimento Imediato via WhatsApp
            </a>
          </Button>
          <Button variant="outline" onClick={() => setIsSuccess(false)}>
            Enviar Nova Mensagem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow border border-border/50">
      <h3 className="font-display font-bold text-xl text-card-foreground mb-2">
        Solicite um Orçamento
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        Preencha o formulário e entraremos em contato rapidamente
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone / WhatsApp *</FormLabel>
                  <FormControl>
                    <Input placeholder="(41) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Serviço</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger aria-label="Tipo de serviço">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger aria-label="Cidade">
                        <SelectValue placeholder="Selecione sua cidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descreva seu problema ou necessidade *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o serviço que você precisa, o problema que está enfrentando, ou qualquer informação relevante..."
                    className="min-h-[120px] resize-none"
                    {...field} 
                  />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          {/* Honeypot field - hidden from users, visible to bots */}
          <div className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms-contact"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-0.5"
              aria-label="Li e concordo com os Termos de Orçamento Pré-Aprovado"
              aria-labelledby="terms-contact-label"
            />
            <span id="terms-contact-label" className="sr-only">Aceito os Termos de Orçamento Pré-Aprovado</span>
            <label htmlFor="terms-contact" className="text-sm text-muted-foreground leading-tight cursor-pointer">
              Li e concordo com os{" "}
              <TermsDialog
                source={TERMS_SOURCE.contactForm}
                onAccept={() => setAcceptedTerms(true)}
                triggerLabel="Termos de Orçamento Pré-Aprovado"
                triggerClassName="text-primary font-semibold hover:underline cursor-pointer"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting || !acceptedTerms}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Solicitação"
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <Button variant="whatsapp" size="lg" className="w-full" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="contact-form" data-service="contato técnico" aria-label="Falar com técnico pelo WhatsApp">
                <MessageCircle className="w-4 h-4" />
                Atendimento Imediato via WhatsApp
              </a>
            </Button>
          </div>
        </form>
      </Form>

      <p className="text-muted-foreground text-xs text-center mt-4">
        * Campos obrigatórios. Seus dados estão seguros e não serão compartilhados.
      </p>
    </div>
  );
}
