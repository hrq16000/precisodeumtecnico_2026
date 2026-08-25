import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Cookie, ArrowRight, SlidersHorizontal } from "lucide-react";
import { openConsentPreferences } from "@/lib/consent";

const CANONICAL = "https://precisodeumtecnico.com/politica-de-cookies";

const SECTIONS = [
  {
    id: "o-que-sao",
    title: "O que são cookies e por que usamos",
    items: [
      "Cookies são pequenos arquivos gravados no seu navegador. Também usamos armazenamento local (localStorage e sessionStorage) para lembrar o que você já preencheu.",
      "Nada de terceiros é carregado antes da sua decisão no banner: enquanto você não aceita, o gtag.js e o script do AdSense simplesmente não entram na página.",
      "A escolha fica salva com data e hora, e você pode mudar quando quiser em “Gerenciar preferências”.",
    ],
  },
  {
    id: "categorias",
    title: "Categorias que usamos",
    items: [
      "Essenciais (sempre ativos): guardam sua decisão de consentimento, o rascunho do funil de triagem (6 horas) e o aceite de termos. Sem eles o atendimento não funciona.",
      "Medição (opcional): telemetria first-party do funil — qual página gerou contato, qual etapa foi concluída, sem conteúdo pessoal. Se você aceita, também liberamos o gtag.js do Google.",
      "Publicidade (opcional): cookies do Google AdSense e de redes parceiras para exibir e medir anúncios. Sem aceite, a personalização fica desligada pelo Consent Mode v2.",
    ],
  },
  {
    id: "terceiros",
    title: "Cookies de terceiros",
    items: [
      "O Google e outras redes podem usar cookies (incluindo o DoubleClick) para veicular anúncios com base nas suas visitas a este e a outros sites.",
      "Os dados de publicidade só são liberados quando você marca “Publicidade” no banner — antes disso o Consent Mode v2 fica com ad_storage, ad_user_data e ad_personalization negados.",
      "Não vendemos dados pessoais e não enviamos nome, telefone ou conteúdo de mensagens para redes de anúncio.",
    ],
  },
  {
    id: "opt-out",
    title: "Como recusar ou desativar (opt-out)",
    items: [
      "No próprio site: use o botão “Gerenciar preferências” desta página e desmarque o que não quiser.",
      "No Google: desative a publicidade personalizada em google.com/settings/ads.",
      "Nas demais redes: use as opções do setor em aboutads.info/choices e youronlinechoices.com.",
      "No navegador: você pode bloquear ou apagar cookies nas configurações — algumas funções de atendimento podem parar de lembrar o que você preencheu.",
    ],
  },
  {
    id: "retencao",
    title: "Por quanto tempo guardamos",
    items: [
      "Decisão de consentimento: até você alterar ou limpar o navegador.",
      "Rascunho do funil de triagem: 6 horas.",
      "Cookies de medição e de publicidade do Google: prazos definidos pelo próprio Google, geralmente até 24 meses.",
    ],
  },
];

const FAQ = [
  {
    question: "Posso usar o site sem aceitar cookies de publicidade?",
    answer:
      "Pode. Recusar não bloqueia nenhuma página, nenhum orçamento e nenhum atendimento. Só deixa de haver personalização de anúncios e medição.",
  },
  {
    question: "Como faço opt-out da publicidade personalizada do Google?",
    answer:
      "Use google.com/settings/ads para desativar a personalização na sua conta Google e aboutads.info/choices para as demais redes. No nosso site, basta abrir “Gerenciar preferências” e desmarcar Publicidade.",
  },
  {
    question: "Vocês carregam o AdSense antes do meu aceite?",
    answer:
      "Não. O script do AdSense só é injetado depois que você marca a categoria Publicidade. Antes disso o Consent Mode v2 permanece com todos os sinais de anúncio negados.",
  },
  {
    question: "Meus dados do funil de triagem vão para anunciantes?",
    answer:
      "Não. Nome, telefone, fotos e descrição do defeito são usados apenas para o atendimento e não são compartilhados com redes de anúncio.",
  },
];

export default function PoliticaDeCookies() {
  return (
    <Layout>
      <SEOHead
        title="Política de Cookies e Consentimento"
        description="Como usamos cookies de medição e publicidade, o que fica ativo antes do aceite, opt-out no Google e nas redes parceiras e como gerenciar suas preferências."
        canonical={CANONICAL}
        faq={FAQ}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Política de Cookies", url: CANONICAL },
        ]}
      />

      <section className="bg-muted/30 py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <Cookie className="h-4 w-4" aria-hidden="true" /> Transparência
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Política de Cookies</h1>
          <p className="mt-3 text-muted-foreground">
            Explicamos exatamente o que é gravado no seu navegador, o que depende do seu aceite e
            como desligar a qualquer momento. Nenhuma tag de medição ou de publicidade é carregada
            antes da sua decisão.
          </p>
          <Button className="mt-5 min-h-11" onClick={openConsentPreferences}>
            <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
            Gerenciar preferências de cookies
          </Button>
        </div>
      </section>

      <article className="container mx-auto max-w-3xl px-4 py-10">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="mb-8">
            <h2 className="text-xl font-semibold md:text-2xl">{section.title}</h2>
            <ul className="mt-3 space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section id="faq" className="mb-8">
          <h2 className="text-xl font-semibold md:text-2xl">Perguntas frequentes sobre cookies</h2>
          <dl className="mt-3 space-y-4">
            {FAQ.map((item) => (
              <div key={item.question} className="rounded-lg border border-border p-4">
                <dt className="font-medium">{item.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <h2 className="text-base font-semibold">Documentos relacionados</h2>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/politica-privacidade" className="text-primary underline">Política de Privacidade</Link>
            </li>
            <li>
              <Link to="/politica-de-anuncios" className="text-primary underline">Política de Anúncios</Link>
            </li>
            <li>
              <Link to="/termos-uso" className="text-primary underline">Termos de Uso</Link>
            </li>
            <li>
              <Link to="/status-anuncios" className="text-primary underline">Status de anúncios e SEO</Link>
            </li>
          </ul>
        </section>
      </article>
    </Layout>
  );
}
