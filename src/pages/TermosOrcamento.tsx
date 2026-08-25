import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import {
  FileText, Truck, Clock, Wrench, XCircle, CheckCircle,
  AlertTriangle, Shield, Calendar, Package, MapPin, Phone, CreditCard, Award, Users
} from "lucide-react";
import { PRICING, SLA, COMMERCIAL } from "@/data/pricingPolicy";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { EquipmentValuationTerms } from "@/components/marketing/EquipmentValuationTerms";
import { Link } from "@/lib/router-compat";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const TermosOrcamento = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Termos de Orçamento Pré-Aprovado – Serviços Técnicos",
    "description": "Conheça os termos de diagnóstico, orçamento pré-aprovado, prazos de reparo, logística de coleta e política de cancelamento dos serviços técnicos.",
    "url": "https://precisodeumtecnico.com/termos-orcamento-pre-aprovado",
    "publisher": {
      "@type": "Organization",
      "name": "Preciso de Um Técnico"
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Termos de Orçamento Pré-Aprovado – Serviços Técnicos"
        description="Conheça os termos de diagnóstico, orçamento pré-aprovado, prazos de reparo, logística de coleta e política de cancelamento dos serviços técnicos."
        canonical="https://precisodeumtecnico.com/termos-orcamento-pre-aprovado"
        schema={schema}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          {
            name: "Termos de Orçamento Pré-Aprovado",
            url: "https://precisodeumtecnico.com/termos-orcamento-pre-aprovado",
          },
        ]}
      />


      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield className="h-4 w-4" />
            Transparência e Segurança
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Termos e Condições
          </h1>
          <h2 className="text-xl md:text-2xl text-primary font-semibold mb-4">
            Orçamentos Pré-Aprovados
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Política de diagnóstico, reparo, prazos e logística de serviços técnicos
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl space-y-12 md:space-y-16">

          {/* 1 – Orçamento Pré-Aprovado */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                1 – Política de Orçamento Pré-Aprovado
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Para agilizar o atendimento e evitar atrasos no diagnóstico técnico, todos os serviços iniciam
                com valores mínimos pré-aprovados, conforme a modalidade:
              </p>

              <div className="grid md:grid-cols-3 gap-4 my-6" id="visita-99">
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Visita técnica (até 30 min)</p>
                  <p className="text-3xl font-bold text-primary">{PRICING.technicalVisit.priceLabel}</p>
                  <p className="text-xs text-muted-foreground mt-1">no endereço do cliente</p>
                </div>
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Diagnóstico em bancada (até 30 min)</p>
                  <p className="text-3xl font-bold text-primary">{PRICING.benchDiagnosis.priceLabel}</p>
                  <p className="text-xs text-muted-foreground mt-1">no nosso endereço</p>
                </div>
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5 text-center" id="coleta-299">
                  <p className="text-xs text-muted-foreground mb-1">Coleta e entrega personalizada</p>
                  <p className="text-2xl font-bold text-primary">{PRICING.pickupDelivery.priceLabel}</p>
                  <p className="text-xs text-muted-foreground mt-1">mínimo pré-aprovado</p>
                </div>
              </div>

              <p>
                Esses valores representam uma <strong className="text-foreground">autorização inicial</strong> para
                diagnóstico técnico e possível reparo. Se o valor final do reparo for superior ao pré-aprovado,
                o cliente é <strong className="text-foreground">informado previamente</strong> e nenhum reparo
                adicional é executado sem confirmação.
              </p>

              <div className="flex items-start gap-3 bg-accent/50 rounded-lg p-4 mt-4">
                <AlertTriangle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">
                  <strong>Exceção:</strong> intervalos de até 30 minutos de atendimento estão inclusos no valor
                  da visita/bancada. Tempo adicional é acordado por escrito antes da execução.
                </p>
              </div>

              {/* Escopo do Orçamento Pré-Aprovado — fonte única */}
              <div className="mt-6 border-2 border-primary/20 rounded-xl p-5 bg-primary/5" id="escopo-pre-aprovado">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Escopo do Orçamento Pré-Aprovado ({COMMERCIAL_TERMS.preApprovedBudget.minLabel})
                </h3>
                <p className="text-sm mb-4">{COMMERCIAL_TERMS.preApprovedPolicyText}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Está incluso:</p>
                    <ul className="space-y-1.5 text-sm">
                      {COMMERCIAL_TERMS.preApprovedBudget.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Não está incluso:</p>
                    <ul className="space-y-1.5 text-sm">
                      {COMMERCIAL_TERMS.preApprovedBudget.excludes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Caso seja necessária alguma peça, componente, material ou item adicional, o valor será
                  cobrado à parte mediante aprovação prévia do cliente.
                </p>
              </div>

              {/* Fila mínima operacional — fonte única */}
              <div className="mt-4 border border-border rounded-xl p-5 bg-accent/40" id="fila-minima">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Fila mínima operacional</h3>
                </div>
                <p className="text-sm">{COMMERCIAL_TERMS.minimumQueueText}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Prazo mínimo: <strong className="text-foreground">{COMMERCIAL_TERMS.minimumQueue.label}</strong>.
                </p>
              </div>
            </div>
          </div>


          {/* 2 – Logística */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                2 – Logística de Coleta e Entrega
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Para garantir organização e eficiência operacional, os atendimentos seguem um sistema de 
                <strong className="text-foreground"> logística programada</strong>.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-accent/50 rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Coleta de Equipamentos</h3>
                  </div>
                  <p className="text-sm">Realizada mediante <strong className="text-foreground">agendamento prévio</strong></p>
                </div>
                <div className="bg-accent/50 rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Entrega de Equipamentos</h3>
                  </div>
                  <p className="text-sm">Realizada mediante <strong className="text-foreground">agendamento após conclusão</strong> do serviço</p>
                </div>
              </div>

              <p>Essa logística permite:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Melhor organização das rotas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Maior segurança no transporte
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Controle de fluxo de equipamentos no laboratório técnico
                </li>
              </ul>
            </div>
          </div>

          {/* 3 – Prazos */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                3 – Prazos de Serviço
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Os prazos podem variar conforme:</p>
              <ul className="space-y-2 ml-1 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Complexidade do equipamento
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Disponibilidade de peças
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Fila de atendimento técnico
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Necessidade de importação de componentes
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-4">Prazos praticados:</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 bg-accent/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">Prazo mínimo de conclusão</span>
                  </div>
                  <span className="font-bold text-primary text-sm md:text-base text-right">{SLA.minLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-3 bg-accent/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">Prazo mínimo com encomenda de peças</span>
                  </div>
                  <span className="font-bold text-primary text-sm md:text-base text-right">{SLA.minWithPartsLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-3 bg-accent/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">Prazo máximo estimado</span>
                  </div>
                  <span className="font-bold text-primary text-sm md:text-base text-right">{SLA.maxLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-3 bg-accent/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">Exceção — atendimento expresso</span>
                  </div>
                  <span className="font-bold text-primary text-sm md:text-base text-right">Intervalos de até 30 min</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                <p className="font-semibold mb-1">Como os prazos são definidos</p>
                <p className="text-muted-foreground">
                  O prazo máximo pode variar entre <strong className="text-foreground">3 semanas e 60 dias</strong> dependendo da
                  fila técnica, da encomenda de peças e da triagem interna do equipamento. Quando não há necessidade de peças,
                  o prazo mínimo é de <strong className="text-foreground">3 dias úteis ou 72 horas úteis</strong>. Havendo
                  encomenda de peças, o prazo mínimo passa para <strong className="text-foreground">15 dias úteis</strong>.
                </p>
              </div>

              <p className="text-sm mt-4 italic">{SLA.disclaimer}</p>
              <p className="text-xs mt-2 text-muted-foreground">
                <strong className="text-foreground">Importante:</strong> termos, condições, valores e prazos são 4 parâmetros
                independentes e possuem variáveis específicas conforme cada situação de atendimento.
              </p>
            </div>
          </div>

          {/* 4 – Compromisso */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                4 – Compromisso com o Serviço
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Os equipamentos enviados para análise devem ser encaminhados com 
                <strong className="text-foreground"> real intenção de reparo</strong>.
              </p>
              <p>Durante o diagnóstico podem ser realizados:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Testes técnicos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Desmontagem parcial
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Análise de componentes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Procedimentos de verificação elétrica ou eletrônica
                </li>
              </ul>
              <p>
                Esses procedimentos fazem parte do processo técnico necessário para identificar a solução adequada.
              </p>
            </div>
          </div>

          {/* 5 – Cancelamento */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-destructive/10 p-3 rounded-xl">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                5 – Cancelamento ou Desistência
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{COMMERCIAL_TERMS.cancellationText}</p>

              <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-6 text-center my-6">
                <p className="text-sm text-muted-foreground mb-1">Taxa de diagnóstico (visita, bancada ou parceiros)</p>
                <p className="text-4xl md:text-5xl font-bold text-destructive">{COMMERCIAL_TERMS.diagnosisFee.priceLabel}</p>
              </div>


              <p>Essa taxa cobre os custos técnicos envolvidos em:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Análise técnica
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Testes realizados
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Tempo de diagnóstico
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Manipulação e avaliação do equipamento
                </li>
              </ul>
            </div>
          </div>

          {/* 5.1 – Declaração de valor do equipamento */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs">
            <EquipmentValuationTerms />
            <p className="text-sm text-muted-foreground mt-6">
              Vai fornecer peças para montagem ou upgrade?{" "}
              <Link to="/politica-de-pecas-do-cliente" className="text-primary font-semibold hover:underline">
                Leia a política de peças do cliente
              </Link>
              .
            </p>
          </div>

          {/* 6 – Aceitação */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                6 – Aceitação dos Termos
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Ao solicitar:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Coleta de equipamento
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Diagnóstico técnico
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Envio para análise
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Orçamento ou reparo
                </li>
              </ul>
              <p>
                O cliente declara estar <strong className="text-foreground">ciente e de acordo</strong> com estes 
                Termos e Condições de Serviço.
              </p>
            </div>
          </div>

          {/* 7 – Condições comerciais */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                7 – Condições Comerciais e Experiência
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-accent/40 rounded-xl p-5 border border-border">
                <CreditCard className="h-5 w-5 text-primary mb-2" />
                <p className="font-semibold text-foreground mb-1">Parcelamento</p>
                <p className="text-muted-foreground">{COMMERCIAL.installments}.</p>
              </div>
              <div className="bg-accent/40 rounded-xl p-5 border border-border">
                <Award className="h-5 w-5 text-primary mb-2" />
                <p className="font-semibold text-foreground mb-1">Experiência</p>
                <p className="text-muted-foreground">{COMMERCIAL.experienceLabel} entregando soluções com garantia de qualidade.</p>
              </div>
              <div className="bg-accent/40 rounded-xl p-5 border border-border">
                <Users className="h-5 w-5 text-primary mb-2" />
                <p className="font-semibold text-foreground mb-1">Rede nacional</p>
                <p className="text-muted-foreground">{COMMERCIAL.partnersLabel}.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-accent/50 rounded-lg p-4 mt-6">
              <AlertTriangle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Importante:</strong> {COMMERCIAL.partnersDisclaimer}{" "}
                {COMMERCIAL.triageRequirement}
              </p>
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Tem dúvidas sobre nossos termos?</p>
            <a
              href={buildWhatsAppUrl({ service: "assistência técnica", sourcePage: "/termos-orcamento" })}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="terms"
              data-service="assistência técnica"
              aria-label="Tirar dúvida sobre termos pelo WhatsApp"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Phone className="h-5 w-5" />
              Fale Conosco via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermosOrcamento;
