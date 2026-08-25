/**
 * Links internos contextuais entre serviços correlatos.
 *
 * Objetivo: reduzir canibalização entre montagem/PC Gamer, manutenção de
 * computador e upgrade de SSD/RAM, direcionando cada intenção de busca ao
 * destino canônico correto. Só emite rotas que existem no App.
 */
import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";

export interface RelatedLink {
  to: string;
  label: string;
  description: string;
}

/** Mapa por slug de origem → destinos canônicos com intenção distinta. */
const RELATED_BY_SLUG: Record<string, RelatedLink[]> = {
  "pc-gamer": [
    {
      to: "/guias/como-escolher-uma-workstation",
      label: "Guia: como escolher uma workstation",
      description:
        "Critérios por carga de trabalho, memória, GPU e energia antes de fechar a lista de peças.",
    },
    {
      to: "/upgrade-ssd-curitiba",
      label: "Upgrade de SSD em Curitiba",
      description:
        "Quando a máquina já está montada e o objetivo é trocar ou acrescentar armazenamento.",
    },
    {
      to: "/upgrade-memoria-ram-curitiba",
      label: "Upgrade de memória RAM em Curitiba",
      description:
        "Ampliação de memória em desktop já em uso, com conferência de compatibilidade antes da compra.",
    },
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação e reinstalação do sistema",
      description:
        "Reinstalação limpa do sistema e drivers oficiais sem mexer no hardware do gabinete.",
    },
    {
      to: "/servicos/configuracao-wifi-curitiba",
      label: "Configuração de rede e Wi-Fi",
      description:
        "Deixar o desktop montado estável na rede, incluindo impressora e periféricos em rede.",
    },
  ],
  "formatacao-computadores": [
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação de computador em Curitiba",
      description: "Página local com escopo, prazos e o que é preservado no backup.",
    },
    {
      to: "/remocao-de-virus-curitiba",
      label: "Remoção de vírus em Curitiba",
      description: "Quando o objetivo é limpar a máquina sem reinstalar o sistema.",
    },
    {
      to: "/servicos/pc-gamer",
      label: "Montagem e configuração de desktop",
      description: "Montagem do zero, peças do cliente, garantia delimitada e checklist de testes.",
    },
  ],
  /* Landing pages por keyword → destinos canônicos com intenção distinta. */
  "upgrade-ssd-curitiba": [
    {
      to: "/upgrade-memoria-ram-curitiba",
      label: "Upgrade de memória RAM em Curitiba",
      description:
        "Quando a lentidão vem de memória insuficiente, e não do armazenamento.",
    },
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação e reinstalação do sistema",
      description: "Instalação limpa do sistema no SSD novo, com drivers oficiais.",
    },
    {
      to: "/servicos/pc-gamer",
      label: "Montagem e configuração de desktop",
      description:
        "Para montar a máquina do zero com peças novas, com checklist de testes documentado.",
    },
  ],
  "upgrade-memoria-ram-curitiba": [
    {
      to: "/upgrade-ssd-curitiba",
      label: "Upgrade de SSD em Curitiba",
      description: "Quando o gargalo é o disco e não a quantidade de memória.",
    },
    {
      to: "/servicos/pc-gamer",
      label: "Montagem e configuração de desktop",
      description:
        "Conferência de compatibilidade, perfis oficiais de memória e testes antes da entrega.",
    },
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação de computador",
      description: "Quando a lentidão é de software e o hardware já dá conta.",
    },
  ],
  "formatacao-de-computador-curitiba": [
    {
      to: "/remocao-de-virus-curitiba",
      label: "Remoção de vírus em Curitiba",
      description: "Limpeza da máquina sem reinstalar o sistema.",
    },
    {
      to: "/upgrade-ssd-curitiba",
      label: "Upgrade de SSD em Curitiba",
      description: "Quando a lentidão continua mesmo com o sistema recém-instalado.",
    },
  ],
  "remocao-de-virus-curitiba": [
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação de computador em Curitiba",
      description: "Quando a infecção não permite recuperar o sistema com segurança.",
    },
    {
      to: "/servicos/configuracao-wifi-curitiba",
      label: "Configuração de rede e Wi-Fi",
      description: "Rede e roteador revisados após a limpeza, incluindo dispositivos em rede.",
    },
  ],
  "assistencia-tecnica-empresas-curitiba": [
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
        "Checklist por carga de trabalho, memória, GPU e armazenamento antes de aprovar a compra.",
    },
    {
      to: "/servicos/servidores",
      label: "Servidores e storage",
      description: "Manutenção de servidores, NAS e volumes de arquivos compartilhados.",
    },
    {
      to: "/servicos/redes",
      label: "Redes cabeadas e Wi-Fi",
      description: "Segmentação de rede e correção de lentidão intermitente no escritório.",
    },
  ],
  "suporte-tecnico-remoto": [
    {
      to: "/guias/organizacao-de-ti-para-pequenos-escritorios",
      label: "Guia: organização de TI para pequenos escritórios",
      description: "O que padronizar antes de abrir chamado: backup, acessos e inventário.",
    },
    {
      to: "/assistencia-tecnica-empresas-curitiba",
      label: "Assistência técnica para empresas em Curitiba",
      description: "Quando o sintoma exige atendimento presencial no posto de trabalho.",
    },
    {
      to: "/assistencia-tecnica-curitiba",
      label: "Assistência técnica em informática em Curitiba",
      description: "Hub do cluster de informática: manutenção, upgrade, redes e diagnóstico.",
    },
    {
      to: "/guia-tecnico-informatica",
      label: "Guia técnico de informática",
      description: "Conteúdo de referência sobre diagnóstico, manutenção e upgrades.",
    },
  ],
  /* Hub do cluster de informática → páginas de conversão prioritárias. */
  "assistencia-tecnica-curitiba": [
    {
      to: "/guia-tecnico-informatica",
      label: "Guia técnico de informática",
      description:
        "Referência longa sobre diagnóstico, manutenção preventiva, upgrades e quando trocar de equipamento.",
    },
    {
      to: "/conserto-de-notebook-curitiba",
      label: "Conserto de notebook em Curitiba",
      description: "Notebook que não liga, superaquece, não carrega ou está com tela danificada.",
    },
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação de computador em Curitiba",
      description: "Reinstalação limpa do sistema com backup e drivers oficiais.",
    },
    {
      to: "/upgrade-ssd-curitiba",
      label: "Upgrade de SSD em Curitiba",
      description: "Troca de disco mecânico por SSD com migração do sistema.",
    },
    {
      to: "/upgrade-memoria-ram-curitiba",
      label: "Upgrade de memória RAM em Curitiba",
      description: "Ampliação de memória com conferência de compatibilidade antes da compra.",
    },
    {
      to: "/remocao-de-virus-curitiba",
      label: "Remoção de vírus em Curitiba",
      description: "Limpeza de malware e adware sem reinstalar o sistema, quando possível.",
    },
  ],
  "guia-tecnico-informatica": [
    {
      to: "/assistencia-tecnica-curitiba",
      label: "Assistência técnica em informática em Curitiba",
      description: "Página de atendimento do cluster, com escopo, cobertura e contato direto.",
    },
    {
      to: "/conserto-de-notebook-curitiba",
      label: "Conserto de notebook em Curitiba",
      description: "Para quando o diagnóstico do guia aponta defeito de hardware no notebook.",
    },
    {
      to: "/upgrade-ssd-curitiba",
      label: "Upgrade de SSD em Curitiba",
      description: "Execução do upgrade que mais muda a percepção de velocidade.",
    },
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação de computador em Curitiba",
      description: "Quando o problema é de sistema e a reinstalação limpa é o caminho mais curto.",
    },
    {
      to: "/precos",
      label: "Preços e faixas de atendimento",
      description: "Referências de valores antes de abrir o chamado.",
    },
  ],
};



interface Props {
  slug: string;
  title?: string;
}

export function RelatedServiceLinks({ slug, title = "Serviços relacionados" }: Props) {
  const links = RELATED_BY_SLUG[slug];
  if (!links?.length) return null;

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
