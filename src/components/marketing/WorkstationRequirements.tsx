/**
 * Workstations e estações de trabalho profissionais (Rodada 3N).
 *
 * Renderizado dentro de /servicos/pc-gamer — NÃO cria rota nova.
 * Regra de claims: nenhuma promessa de desempenho por software, FPS,
 * tempo de render, benchmark ou certificação de fabricante.
 */
import { Link } from "@/lib/router-compat";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const REQUIREMENTS: { label: string; detail: string }[] = [
  { label: "Programas utilizados", detail: "Tipo de carga: desenho técnico, modelagem, renderização, edição, análise ou desenvolvimento." },
  { label: "Tamanho dos arquivos", detail: "Projetos pequenos e projetos pesados exigem memória e armazenamento diferentes." },
  { label: "Aplicações simultâneas", detail: "Quantos programas ficam abertos ao mesmo tempo durante o trabalho real." },
  { label: "Monitores e resolução", detail: "Quantidade de telas, resolução e necessidade de saídas específicas de vídeo." },
  { label: "Uso de CPU, memória e GPU", detail: "Nem toda aplicação usa aceleração gráfica; parte depende só de processador e memória." },
  { label: "Armazenamento", detail: "Sistema, programas, arquivos de trabalho, cache de projeto e destino de backup." },
  { label: "Expansão futura", detail: "Slots livres, limite de memória da placa-mãe e folga da fonte para upgrades." },
  { label: "Orçamento e vida útil", detail: "Faixa de investimento e por quanto tempo a máquina precisa atender à operação." },
];

const COMPONENTS: { title: string; body: string }[] = [
  {
    title: "Processador",
    body: "Relacionado ao tipo de carga e à duração das tarefas. Cargas curtas e interativas se comportam de forma diferente de tarefas longas de processamento contínuo.",
  },
  {
    title: "Memória",
    body: "Relacionada ao volume de projetos abertos, às aplicações simultâneas e ao tamanho dos arquivos. Falta de memória costuma aparecer como travamento e uso intenso de disco.",
  },
  {
    title: "Placa de vídeo",
    body: "Relevante somente quando a aplicação utiliza aceleração gráfica compatível. Em programas que não aproveitam GPU, investir nela não melhora o trabalho.",
  },
  {
    title: "Armazenamento",
    body: "Considerar sistema, programas, arquivos de trabalho, cache e o destino do backup — que não deve ficar no mesmo disco do sistema.",
  },
  {
    title: "Fonte e refrigeração",
    body: "Devem ser compatíveis com o conjunto e com a carga prevista. Conjunto potente com fonte ou refrigeração subdimensionada gera instabilidade sob uso prolongado.",
  },
];

export function WorkstationRequirements() {
  return (
    <section aria-labelledby="workstations-heading" className="mb-12">
      <h2 id="workstations-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        Workstations e estações de trabalho profissionais
      </h2>
      <p className="text-muted-foreground mb-6 max-w-3xl">
        Além de máquinas para jogos, a montagem atende estações de trabalho para cargas mais
        exigentes. A diferença não está em uma configuração pronta, e sim no levantamento de
        requisitos: o que a máquina precisa executar, com que tamanho de arquivo e por quanto tempo.
      </p>

      <h3 className="text-lg font-bold text-foreground mb-3">Levantamento de requisitos</h3>
      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {REQUIREMENTS.map((r) => (
          <div key={r.label} className="rounded-xl border border-border bg-card p-4">
            <p className="flex items-start gap-2 font-semibold text-card-foreground">
              <CheckCircle2 className="h-4 w-4 mt-1 shrink-0 text-primary" aria-hidden />
              {r.label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{r.detail}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-3">O papel de cada componente</h3>
      <div className="space-y-3 mb-8">
        {COMPONENTS.map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-card p-4">
            <p className="font-semibold text-card-foreground">{c.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 mb-8">
        <p className="flex items-start gap-2 text-sm text-foreground">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" aria-hidden />
          <span>
            A montagem correta não garante desempenho específico em um programa. A configuração deve
            ser definida a partir dos requisitos da aplicação, do tipo de projeto e do orçamento
            disponível. Compatibilidade e desempenho dependem da versão do software, do projeto e
            dos requisitos oficiais do fabricante — não publicamos benchmark sem teste real nem
            afirmamos certificação.
          </span>
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-5">
        <p className="font-semibold text-foreground mb-2">Contexto empresarial relacionado</p>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm">
          <li>
            <Link to="/empresa-de-ti-curitiba" className="text-primary underline underline-offset-4">
              Empresa de TI em Curitiba
            </Link>{" "}
            — visão geral do atendimento a empresas.
          </li>
          <li>
            <Link to="/servicos/suporte-tecnico-empresarial" className="text-primary underline underline-offset-4">
              Suporte técnico empresarial
            </Link>{" "}
            — modalidades, escopo e limites.
          </li>
          <li>
            <Link to="/seguranca-dos-dados" className="text-primary underline underline-offset-4">
              Segurança dos dados
            </Link>{" "}
            — backup e acessos antes de migrar de máquina.
          </li>
          <li>
            <Link to="/precos" className="text-primary underline underline-offset-4">
              Preços e políticas
            </Link>{" "}
            — como o orçamento é formado.
          </li>
        </ul>
      </div>
    </section>
  );
}
