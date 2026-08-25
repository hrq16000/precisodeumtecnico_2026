import { Link } from "@/lib/router-compat";
import { MapPin, Clock, Route, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { ServiceAreaMap } from "@/components/service/ServiceAreaMap";
import { CURITIBA_ZONES, TRAVEL_DISCLAIMER } from "@/data/serviceAreaCuritiba";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";

const CANONICAL = "https://precisodeumtecnico.com/area-de-atendimento-curitiba";

const FAQ = [
  {
    question: "Como vocês estimam o tempo de deslocamento até o meu bairro?",
    answer:
      "A estimativa parte da faixa de distância entre o eixo central de Curitiba e cada zona, em condições normais de trânsito, dentro da janela de 08h às 22h. É uma referência de deslocamento, não prazo de conclusão do reparo — a janela real é confirmada na triagem conforme a agenda do dia.",
  },
  {
    question: "Vocês atendem toda a Região Metropolitana?",
    answer:
      "Temos rota ativa em Curitiba, São José dos Pinhais, Pinhais, Colombo e Araucária. Em cidades vizinhas fora dessa lista o atendimento é avaliado caso a caso na triagem, com o deslocamento informado antes de qualquer agendamento.",
  },
  {
    question: "O deslocamento é cobrado à parte?",
    answer:
      "A visita técnica custa a partir de R$ 99,99 por bloco de até 30 minutos, já considerando o atendimento no endereço. A coleta com entrega parte de R$ 299,99. Distâncias maiores dentro da Região Metropolitana podem alterar o valor, sempre informado antes da confirmação.",
  },
  {
    question: "Dá para agendar por janela de horário?",
    answer:
      "Sim. Para bairros mais distantes e para a Região Metropolitana, trabalhamos por janela (manhã ou tarde), o que reduz espera e evita agendamento em horário impossível de cumprir.",
  },
  {
    question: "Meu bairro não aparece na lista. Vocês atendem?",
    answer:
      "A lista mostra bairros de referência de cada zona, não a cobertura completa. Curitiba inteira está coberta: abra a triagem informando o bairro e a confirmação vem com a janela disponível.",
  },
];

const AreaAtendimentoCuritiba = () => {
  const schemas = [
    buildLocalBusinessSchema({
      url: CANONICAL,
      city: "Curitiba",
      state: "PR",
      description:
        "Área de atendimento técnico em Curitiba e Região Metropolitana, com zonas de cobertura e estimativa de deslocamento por região.",
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Zonas de atendimento em Curitiba",
      itemListElement: CURITIBA_ZONES.map((z, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: z.name,
        description: `${z.summary} Deslocamento estimado de ${z.travelMinMin} a ${z.travelMinMax} minutos.`,
      })),
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="Área de atendimento em Curitiba: zonas e tempo estimado"
        description="Veja as zonas de atendimento técnico em Curitiba e RMC, o tempo estimado de deslocamento por região e abra a triagem já com o seu bairro identificado."
        canonical={CANONICAL}
        keywords="área de atendimento curitiba, técnico perto de mim curitiba, cobertura assistência técnica curitiba"
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Área de atendimento em Curitiba", url: CANONICAL },
        ]}
        faq={FAQ}
        structuredData={schemas}
      />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Área de atendimento em Curitiba e Região Metropolitana
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Quem procura técnico com urgência quer saber duas coisas antes de qualquer preço: se
          atende o meu bairro e em quanto tempo alguém chega. Esta página responde as duas. O mapa
          abaixo divide Curitiba em cinco zonas operacionais mais a Região Metropolitana, com a
          faixa estimada de deslocamento de cada uma dentro da janela comercial de 08h às 22h.
        </p>

        <div className="mt-8">
          <ServiceAreaMap surface="city_page" />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Tempo estimado por zona
          </h2>
          <p className="mt-2 text-muted-foreground">{TRAVEL_DISCLAIMER}</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <caption className="sr-only">
                Zonas de atendimento em Curitiba e faixa estimada de deslocamento
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-3 pr-4 font-semibold text-foreground">Zona</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-foreground">Deslocamento estimado</th>
                  <th scope="col" className="py-3 font-semibold text-foreground">Bairros de referência</th>
                </tr>
              </thead>
              <tbody>
                {CURITIBA_ZONES.map((z) => (
                  <tr key={z.id} className="border-b border-border align-top">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">{z.name}</th>
                    <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                      {z.travelMinMin}–{z.travelMinMax} min
                    </td>
                    <td className="py-3 text-muted-foreground">{z.places.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Route,
              title: "Rota por zona, não por sorte",
              text: "Os atendimentos do dia são agrupados por zona. Isso reduz deslocamento morto, encurta a espera e mantém o custo da visita estável em toda a cidade.",
            },
            {
              icon: Clock,
              title: "Janela confirmada antes de sair",
              text: "Você recebe a faixa de horário antes do deslocamento. Se a agenda do dia não comportar, isso é dito na hora — não deixamos o cliente esperando por um horário que não existe.",
            },
            {
              icon: MapPin,
              title: "Bairro identificado na triagem",
              text: "Ao abrir a triagem pelo mapa, a localidade já vai preenchida. O técnico recebe o contexto certo e leva as peças prováveis para o sintoma informado.",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card p-5">
              <c.icon className="w-6 h-6 text-primary" aria-hidden />
              <h3 className="mt-3 font-semibold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-muted/30 p-6">
          <h2 className="text-2xl font-bold text-foreground">Continue por aqui</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/atendimento-urgente">
                Preciso de atendimento urgente
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ghost"><Link to="/areas-atendidas">Todas as áreas atendidas</Link></Button>
            <Button asChild variant="ghost"><Link to="/assistencia-tecnica-curitiba">Assistência técnica em Curitiba</Link></Button>
            <Button asChild variant="ghost"><Link to="/precos">Preços e condições</Link></Button>
            <Button asChild variant="ghost"><Link to="/checklists-de-reparo">Checklists rápidos</Link></Button>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground">Perguntas frequentes sobre cobertura</h2>
          <dl className="mt-4 space-y-4">
            {FAQ.map((f) => (
              <div key={f.question} className="rounded-xl border border-border p-4">
                <dt className="font-semibold text-foreground">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <CTASection />
    </Layout>
  );
};

export default AreaAtendimentoCuritiba;
