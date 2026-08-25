/**
 * Rodada 3S — mapa de serviços empresariais do hub.
 *
 * Navegação visual para no máximo sete rotas canônicas já existentes.
 * Sem preço, sem plano e sem repetir os cards da home.
 */
import { Link } from "@/lib/router-compat";
import { ArrowUpRight } from "lucide-react";

const ENTRIES = [
  {
    to: "/servicos/suporte-tecnico-empresarial",
    label: "Suporte técnico empresarial",
    description: "Chamados por posto, remoto ou presencial, com escopo aprovado antes da execução.",
  },
  {
    to: "/assistencia-tecnica-empresas-curitiba",
    label: "Assistência técnica para empresas",
    description: "Atendimento a escritórios e comércios com histórico por equipamento.",
  },
  {
    to: "/seguranca-dos-dados",
    label: "Backup e segurança dos dados",
    description: "Cópia local e externa, versionamento, contas nominais e teste de restauração.",
  },
  {
    to: "/servicos/redes",
    label: "Redes e Wi-Fi",
    description: "Segmentação, IP fixo para impressora e storage e correção de lentidão intermitente.",
  },
  {
    to: "/suporte-tecnico-remoto",
    label: "Atendimento remoto",
    description: "Configuração, permissões e aplicativos quando o sintoma é de software.",
  },
  {
    to: "/servicos/pc-gamer",
    label: "Montagem de estação de trabalho",
    description: "Dimensionamento por requisito, conferência de compatibilidade e checklist de testes.",
  },
  {
    to: "/servicos/servidores",
    label: "Servidores e storage",
    description: "Verificação de discos, volumes compartilhados e permissões de pasta.",
  },
];

export function BusinessServiceMap({ className = "" }: { className?: string }) {
  return (
    <nav
      data-business-service-map
      aria-label="Mapa de serviços empresariais"
      className={className}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {ENTRIES.map((e) => (
          <li key={e.to}>
            <Link
              to={e.to}
              className="group flex h-full items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <span>
                <span className="block font-semibold text-card-foreground">{e.label}</span>
                <span className="block text-sm text-muted-foreground">{e.description}</span>
              </span>
              <ArrowUpRight
                className="mt-1 h-4 w-4 flex-shrink-0 text-primary transition-transform group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
