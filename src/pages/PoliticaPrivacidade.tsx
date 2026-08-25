import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const CANONICAL = "https://precisodeumtecnico.com/politica-privacidade";

const SECTIONS = [
  {
    id: "dados-coletados",
    title: "Quais dados coletamos",
    items: [
      "Dados de contato que você mesmo informa: nome, telefone/WhatsApp, e-mail (quando enviado).",
      "Dados do atendimento: cidade, bairro, equipamento, marca, modelo, sintoma relatado, modalidade (bancada, visita ou coleta) e número da ordem de serviço.",
      "Arquivos anexados por você na triagem (fotos e vídeos do equipamento), usados só para diagnóstico.",
      "Dados técnicos de navegação: página de origem, referenciador e user agent, usados para medir quais páginas geram atendimento.",
      "Avaliações enviadas em /avaliar: nome informado, nota, comentário, cidade/bairro e a autorização (ou não) de publicação no site.",
    ],
  },
  {
    id: "finalidades",
    title: "Para que usamos",
    items: [
      "Responder ao seu contato, montar o orçamento e emitir a ordem de serviço.",
      "Registrar aceites de termos, política de preços e política de peças do cliente — prova da condição combinada.",
      "Medir desempenho das páginas de forma agregada (eventos de analytics sem conteúdo pessoal).",
      "Publicar avaliações no site somente quando você marca a autorização e após conferência manual.",
    ],
  },
  {
    id: "base-legal",
    title: "Base legal (LGPD)",
    items: [
      "Execução de contrato ou de procedimentos preliminares (art. 7º, V): orçamento, ordem de serviço e atendimento.",
      "Cumprimento de obrigação legal (art. 7º, II): registros fiscais e de garantia.",
      "Legítimo interesse (art. 7º, IX): segurança do atendimento e melhoria das páginas, sempre em base agregada.",
      "Consentimento (art. 7º, I): anexos enviados na triagem e publicação de avaliação com identificação.",
    ],
  },
  {
    id: "compartilhamento",
    title: "Com quem compartilhamos",
    items: [
      "Não vendemos e não alugamos dados pessoais.",
      "Usamos provedores de infraestrutura (hospedagem, banco de dados, envio de e-mail e analytics) que tratam os dados apenas em nosso nome.",
      "O contato por WhatsApp acontece na plataforma da Meta e segue as políticas dela.",
      "Dados só são entregues a terceiros por ordem judicial ou obrigação legal.",
    ],
  },
  {
    id: "retencao",
    title: "Por quanto tempo guardamos",
    items: [
      "Leads e triagens sem contratação: até 12 meses, para retomar o atendimento.",
      "Ordens de serviço e aceites: 5 anos, prazo de garantia e defesa em eventual reclamação.",
      "Fotos e vídeos anexados: até 90 dias após a conclusão do serviço, salvo se necessários a uma reclamação em aberto.",
      "Avaliações publicadas: enquanto estiverem no site; a exclusão pode ser pedida a qualquer momento.",
    ],
  },
  {
    id: "direitos",
    title: "Seus direitos como titular",
    items: [
      "Confirmar a existência de tratamento e acessar seus dados.",
      "Corrigir dados incompletos, inexatos ou desatualizados.",
      "Pedir anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.",
      "Revogar o consentimento (inclusive a autorização de publicação da avaliação) e pedir a exclusão dos anexos.",
      "Solicitar a portabilidade e informações sobre com quem compartilhamos.",
    ],
  },
  {
    id: "seguranca",
    title: "Segurança",
    items: [
      "Acesso ao painel administrativo restrito por autenticação e por perfil de administrador.",
      "Upload de anexos assinado no servidor, com bucket privado — nada fica público por link aberto.",
      "Registro de auditoria das moderações de avaliação (quem aprovou/rejeitou e quando).",
    ],
  },
  {
    id: "publicidade-terceiros",
    title: "Publicidade e cookies de terceiros",
    items: [
      "Algumas páginas podem exibir anúncios de redes de terceiros. Esses fornecedores usam cookies e identificadores próprios para veicular e medir anúncios.",
      "O Google, como fornecedor terceirizado, pode usar cookies para veicular anúncios neste site. O cookie DoubleClick permite exibir anúncios com base na sua visita a este e a outros sites da internet.",
      "Você pode desativar a publicidade personalizada do Google nas Configurações de anúncios do Google e a de outras redes em www.aboutads.info/choices.",
      "No banner de consentimento você decide sobre a telemetria first-party e os cookies de publicidade. Se você negar, nenhum evento de medição é gravado e a publicidade exibida fica não personalizada.",
      "Não enviamos nome, telefone, e-mail, endereço, anexos da triagem nem número de ordem de serviço para redes de anúncios.",
      "As regras completas de identificação e posicionamento dos anúncios estão na Política de Anúncios e Patrocínio.",
    ],
  },
];

const FAQ = [
  {
    question: "Como peço a exclusão dos meus dados e dos arquivos anexados?",
    answer:
      "Envie o pedido pelo WhatsApp informando nome e número da ordem de serviço. Confirmamos a exclusão em até 15 dias, mantendo apenas o que a lei exige (registros fiscais e de garantia), e avisamos por escrito quando concluído.",
  },
  {
    question: "As fotos e vídeos que envio na triagem ficam públicos?",
    answer:
      "Não. Os anexos vão para um armazenamento privado, acessível apenas pela equipe técnica durante o atendimento, e são descartados em até 90 dias após a conclusão do serviço.",
  },
  {
    question: "Minha avaliação é publicada automaticamente?",
    answer:
      "Não. A avaliação só aparece no site se você marcar a autorização de publicação e depois de conferência manual. Você pode revogar a autorização a qualquer momento.",
  },
  {
    question: "Vocês usam cookies de rastreamento?",
    answer:
      "Usamos medição de páginas em base agregada (quais páginas geram contato) e armazenamento local para lembrar cidade e bairro escolhidos. Não usamos esses dados para identificar você individualmente.",
  },
  {
    question: "Anunciantes de terceiros recebem meus dados?",
    answer:
      "Não. Nome, telefone, e-mail, endereço, anexos e número da ordem de serviço nunca são enviados a redes de anúncios. Fornecedores como o Google podem usar cookies próprios (incluindo o DoubleClick) para exibir anúncios com base na sua visita a este e a outros sites; você pode desativar a personalização nas Configurações de anúncios do Google ou em www.aboutads.info/choices.",
  },
  {
    question: "Por quanto tempo a ordem de serviço fica guardada?",
    answer:
      "Cinco anos, prazo compatível com a garantia do serviço e com a defesa em eventual reclamação de consumo.",
  },
];

const PoliticaPrivacidade = () => {
  const waUrl = buildWhatsAppUrl({
    service: "solicitação LGPD (acesso ou exclusão de dados)",
    sourcePage: "/politica-privacidade",
  });

  return (
    <Layout>
      <SEOHead
        title="Política de Privacidade e LGPD | Preciso de um Técnico"
        description="Como coletamos, usamos, guardamos e excluímos seus dados: finalidades, base legal, prazos de retenção, anexos da triagem e como exercer seus direitos de titular pela LGPD."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Política de Privacidade e LGPD", url: CANONICAL },
        ]}
        faq={FAQ}
      />

      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Transparência sobre seus dados
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Política de Privacidade e LGPD
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            O que coletamos no orçamento, na triagem e na avaliação, por que usamos, quanto tempo
            guardamos e como você pede correção ou exclusão — em linguagem direta.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="privacy-policy"
              data-service="solicitação LGPD"
              aria-label="Solicitar acesso ou exclusão de dados pelo WhatsApp"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Solicitar acesso ou exclusão
            </a>
            <Link
              to="/termos-orcamento-pre-aprovado"
              className="inline-flex items-center gap-2 border border-border bg-card text-card-foreground font-semibold px-6 py-3 rounded-xl hover:bg-accent/40 transition-colors"
            >
              Termos do orçamento
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2
                id={section.id}
                className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
              >
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm md:text-base text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/30"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section aria-labelledby="faq-privacidade">
            <h2
              id="faq-privacidade"
              className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6"
            >
              Perguntas frequentes sobre privacidade
            </h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <article key={item.question} className="p-5 rounded-xl bg-card border border-border/50">
                  <h3 className="font-bold text-card-foreground mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="p-5 rounded-xl bg-muted/40 border border-border text-sm text-muted-foreground">
            Pedidos de titular são respondidos em até 15 dias corridos pelo mesmo canal de
            atendimento. Consulte também a{" "}
            <Link to="/politica-de-pecas-do-cliente" className="text-primary hover:underline">
              política de peças do cliente
            </Link>{" "}
            e os{" "}
            <Link to="/termos-orcamento-pre-aprovado" className="text-primary hover:underline">
              termos do orçamento pré-aprovado
            </Link>
            .
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PoliticaPrivacidade;
