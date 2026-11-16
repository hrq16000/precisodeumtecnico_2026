import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeSymptomsSection } from "@/components/home/HomeSymptomsSection";
import { SocialProofBar } from "@/components/home/SocialProofBar";

import { ServicesSection } from "@/components/home/ServicesSection";
import { RegionsSection } from "@/components/home/RegionsSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { QuickQuoteForm } from "@/components/home/QuickQuoteForm";
import { QuickDiagnosisQuiz } from "@/components/QuickDiagnosisQuiz";
import { RelatedLinksSection } from "@/components/seo/RelatedLinksSection";
import { Reveal } from "@/components/Reveal";
import { SmartSearchWidget } from "@/components/search/SmartSearchWidget";
import { AuthoritySince } from "@/components/marketing/AuthoritySince";
import { buildReviewsSchema } from "@/data/testimonials";
import { homeFaqs } from "@/data/homeFaqs";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";
import { buildOrganizationSchema, buildPersonSchema } from "@/lib/schema/organization";

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Preciso de Um Técnico | Assistência Técnica Curitiba 24h"
        description="Técnico em Curitiba e região no mesmo dia: informática, notebooks, CFTV, elétrica e ar-condicionado. Orçamento antes do reparo. Visita de inspeção de até 20 minutos."
        canonical="https://precisodeumtecnico.com"
        // Rodada 25.1 — Bloco 0: FAQ da home passa a ter fonte única
        // (src/data/homeFaqs.ts), consumida também pela seção visível.
        faq={homeFaqs}
        service={{
          name: "Assistência técnica em Curitiba e Região Metropolitana",
          description:
            "Informática, notebooks, redes Wi-Fi, CFTV, elétrica e ar-condicionado com orçamento informado antes da execução.",
          priceMinBRL: 99.99,
          areaServed: "Curitiba e Região Metropolitana",
        }}
        structuredData={(() => {
          const reviews = buildReviewsSchema();
          return [
            buildLocalBusinessSchema({ url: "https://precisodeumtecnico.com" }),
            buildOrganizationSchema(),
            buildPersonSchema(),
            ...(reviews ? [reviews] : []),
          ];
        })()}
      />

      
      <HeroSection />
      {/* Prova social + confiança logo após o hero, antes dos CTAs secundários. */}
      <SocialProofBar />
      {/* Rodada 3P — sintomas ("o que está acontecendo") antes dos serviços
          ("como podemos atender"). A prova de autoridade do hero não é repetida
          imediatamente abaixo: a faixa AuthoritySince passa para depois dos
          serviços, sem perda de conteúdo. */}
      <section className="py-8 bg-background">
        <div className="container-custom max-w-4xl">
          <SmartSearchWidget />
        </div>
      </section>
      <Reveal><HomeSymptomsSection /></Reveal>
      <Reveal><ServicesSection /></Reveal>
      <AuthoritySince />
      <Reveal><QuickDiagnosisQuiz /></Reveal>

      <Reveal><QuickQuoteForm /></Reveal>
      <Reveal><BenefitsSection /></Reveal>
      <Reveal><BrandsSection /></Reveal>
      <Reveal><RegionsSection /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><FAQSection /></Reveal>
      <Reveal>
        <RelatedLinksSection
          surface="cta_section"
          title="Continue por aqui"
          items={["precos", "areas", "servicos"]}
        />
      </Reveal>
      <Reveal><CTASection /></Reveal>

    </Layout>
  );
};

export default Index;
