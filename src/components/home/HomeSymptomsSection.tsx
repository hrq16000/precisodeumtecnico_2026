/**
 * Rodada 3P — bloco "por sintoma" da home.
 *
 * Diferencia visualmente sintoma ("o que está acontecendo") de serviço
 * ("como podemos atender"). Usa exclusivamente rotas já existentes e
 * canônicas — nenhuma URL nova é criada aqui.
 */
import { Link } from "@/lib/router-compat";
import { ArrowRight, Activity } from "lucide-react";

interface SymptomEntry {
  label: string;
  hint: string;
  to: string;
}

export const HOME_SYMPTOMS: SymptomEntry[] = [
  {
    label: "Computador lento ou travando",
    hint: "Disco no limite, pouca memória ou sistema sobrecarregado",
    to: "/upgrade-ssd-curitiba",
  },
  {
    label: "Notebook não liga ou desliga sozinho",
    hint: "Carregador, bateria, superaquecimento ou placa",
    to: "/conserto-de-notebook-curitiba",
  },
  {
    label: "Vírus ou programas indesejados",
    hint: "Anúncios, extensões estranhas e lentidão repentina",
    to: "/remocao-de-virus-curitiba",
  },
  {
    label: "Sistema instável após atualização",
    hint: "Erros na inicialização e travamentos frequentes",
    to: "/formatacao-de-computador-curitiba",
  },
  {
    label: "Internet ou Wi-Fi instável",
    hint: "Sinal fraco, quedas e áreas sem cobertura",
    to: "/servicos/configuracao-wifi-curitiba",
  },
  {
    label: "Trava com muitos programas abertos",
    hint: "Memória insuficiente para a rotina de uso",
    to: "/upgrade-memoria-ram-curitiba",
  },
];

export function HomeSymptomsSection() {
  return (
    <section className="section-padding" aria-labelledby="home-sintomas" data-home-symptoms>
      <div className="container-custom max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
          Comece pelo que está acontecendo
        </p>
        <h2 id="home-sintomas" className="font-display text-2xl md:text-3xl font-bold mb-6">
          Qual problema você está enfrentando?
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_SYMPTOMS.map((s) => (
            <li key={s.to}>
              <Link
                to={s.to}
                className="group flex h-full min-h-11 items-start gap-3 rounded-xl border-l-4 border-l-primary border border-border bg-card p-4 transition-colors hover:bg-secondary/40"
              >
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-card-foreground group-hover:text-primary">
                    {s.label}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{s.hint}</span>
                </span>
                <ArrowRight
                  className="ml-auto mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
