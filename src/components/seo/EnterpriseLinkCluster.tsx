/**
 * Malha de links internos do contexto empresarial (Rodada 31).
 *
 * Conecta os guias educacionais aos serviços B2B já existentes no App,
 * garantindo navegação consistente entre suporte empresarial, servidores,
 * redes, montagem de máquinas e política de peças.
 *
 * Regra: só emite rotas registradas em src/App.tsx (sem links quebrados).
 */
import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";

export interface EnterpriseLink {
  to: string;
  label: string;
  description: string;
}

export const ENTERPRISE_LINKS: EnterpriseLink[] = [
  {
    to: "/empresa-de-ti-curitiba",
    label: "Empresa de TI em Curitiba",
    description:
      "Hub do atendimento empresarial: postos de trabalho, rede, servidores, backup e preventiva.",
  },
  {
    to: "/servicos/suporte-tecnico-empresarial",
    label: "Suporte técnico empresarial",
    description:
      "Chamados remotos e presenciais com escopo aprovado por escrito e ordem de serviço com protocolo.",
  },
  {
    to: "/seguranca-dos-dados",
    label: "Segurança dos dados",
    description:
      "Backup 3-2-1 testado, contas nominais, duas etapas e resposta aos primeiros minutos de um incidente.",
  },
  {
    to: "/servicos/manutencao-preventiva-empresas",
    label: "Manutenção preventiva para empresas",
    description:
      "Rotina agendada de verificação de discos, energia, atualizações e backup, com registro por equipamento.",
  },
  {
    to: "/servicos/backup-para-empresas",
    label: "Backup para empresas",
    description:
      "Cópia local e externa com versionamento e teste de restauração registrado por ciclo.",
  },
  {
    to: "/servicos/redes-e-wifi",
    label: "Redes e Wi-Fi para empresas",
    description:
      "Postos críticos cabeados, IP fixo para impressora e storage e correção de instabilidade recorrente.",
  },
  {
    to: "/assistencia-tecnica-empresas-curitiba",
    label: "Assistência técnica para empresas em Curitiba",
    description:
      "Atendimento a escritórios e comércios: chamados por posto, rede, impressão e prioridade para máquinas críticas.",
  },
  {
    to: "/servicos/servidores",
    label: "Servidores e storage",
    description:
      "Instalação, manutenção e verificação de servidores, NAS e volumes de arquivos compartilhados.",
  },
  {
    to: "/servicos/redes",
    label: "Redes cabeadas e Wi-Fi",
    description:
      "Segmentação de rede, IP fixo para impressora e storage, e correção de lentidão intermitente.",
  },
  {
    to: "/servicos/pc-gamer",
    label: "Montagem e configuração de desktops",
    description:
      "Montagem de máquinas de trabalho e workstations, com conferência de compatibilidade e checklist de testes.",
  },
  {
    to: "/suporte-tecnico-remoto",
    label: "Suporte técnico remoto",
    description:
      "Ajustes de sistema, configuração e resolução de chamados sem deslocamento, quando o sintoma é de software.",
  },
  {
    to: "/servicos/recuperacao-dados",
    label: "Recuperação de dados",
    description:
      "Avaliação em bancada quando o disco falha antes de existir uma cópia de backup íntegra.",
  },
  {
    to: "/politica-de-pecas-do-cliente",
    label: "Política de peças do cliente",
    description:
      "Regras de conferência, registro de estado na entrada e limites de garantia quando a peça vem do cliente.",
  },
  {
    to: "/guias/organizacao-de-ti-para-pequenos-escritorios",
    label: "Guia: organização de TI para pequenos escritórios",
    description:
      "Inventário, rede, backup 3-2-1, contas de acesso e rotina de manutenção em ordem de prioridade.",
  },
  {
    to: "/guias/como-escolher-uma-workstation",
    label: "Guia: como escolher uma workstation",
    description:
      "Checklist por carga de trabalho, memória, GPU, armazenamento em camadas e limites operacionais.",
  },
];

interface Props {
  /** Rota atual, excluída da lista para não gerar autolink. */
  currentPath?: string;
  title?: string;
  limit?: number;
}

export function EnterpriseLinkCluster({
  currentPath,
  title = "Continue pelo contexto empresarial",
  limit = 12,
}: Props) {
  const links = ENTERPRISE_LINKS.filter((l) => l.to !== currentPath).slice(0, limit);
  if (!links.length) return null;

  return (
    <nav aria-label={title} className="mb-12">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="group flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/50"
          >
            <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
            <span>
              <span className="block font-semibold text-card-foreground">{l.label}</span>
              <span className="block text-sm text-muted-foreground">{l.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
