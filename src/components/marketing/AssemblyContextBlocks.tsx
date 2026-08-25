/**
 * Rodada 3U — blocos contextuais da montagem de PC.
 *
 * Contrato: requisitos → compatibilidade → montagem → configuração → testes →
 * garantia e peças. Público misto (uso geral, gamer, workstation, empresa).
 * Nenhuma promessa de desempenho, benchmark ou catálogo de componentes.
 */
import { Link } from "@/lib/router-compat";
import { Cpu, Layers, Settings2, Building2, Gamepad2, Briefcase, Home } from "lucide-react";

const FLOW = [
  "Levantamento de requisitos",
  "Lista de componentes",
  "Compatibilidade",
  "Autorização",
  "Montagem",
  "BIOS e drivers",
  "Testes",
  "Entrega e orientação",
];

const CONTEXTS = [
  {
    icon: Home,
    title: "Uso geral",
    items: ["Estudo", "Navegação", "Trabalho", "Multitarefa"],
  },
  {
    icon: Gamepad2,
    title: "PC Gamer",
    items: ["Jogos", "Placa de vídeo", "Refrigeração", "Fonte", "Expansão"],
  },
  {
    icon: Briefcase,
    title: "Workstation",
    items: ["Arquivos grandes", "Programas exigentes", "Memória", "Armazenamento", "GPU quando aplicável"],
  },
  {
    icon: Building2,
    title: "Empresa",
    items: ["Estação de trabalho", "Padronização", "Múltiplos monitores", "Manutenção", "Backup"],
  },
];

const COMPATIBILITY = [
  "Socket",
  "Chipset",
  "Memória",
  "Fonte",
  "Conectores",
  "Dimensões",
  "Gabinete",
  "Refrigeração",
  "Armazenamento",
  "Firmware",
];

const CAVEATS = [
  "Nem toda peça é compatível com a placa-mãe ou com o gabinete escolhido.",
  "Peça usada pode apresentar defeito prévio, identificado apenas na conferência ou nos testes.",
  "Atualização de BIOS é feita por necessidade, não por rotina.",
  "Desempenho depende do conjunto e do software utilizado.",
  "Garantia da peça é diferente da garantia da mão de obra.",
];

const BIOS = [
  "Compatibilidade com um componente mais recente que a placa-mãe",
  "Estabilidade em falhas já observadas na versão instalada",
  "Suporte formal ao componente pelo fabricante",
  "Versão adequada ao hardware presente",
  "Risco envolvido na operação, informado antes",
  "Autorização explícita antes de executar",
];

export function AssemblyUseContexts({ className = "" }: { className?: string }) {
  return (
    <section id="contextos-de-uso" data-assembly-contexts className={`scroll-mt-24 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Para quem é indicado
      </h2>
      <p className="text-muted-foreground mb-5">
        A montagem atende contextos diferentes com o mesmo processo. O que muda é o que precisa ser
        priorizado — não existe configuração universal.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {CONTEXTS.map(({ icon: Icon, title, items }) => (
          <li key={title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold text-card-foreground mb-2">
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {title}
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {items.map((i) => (
                <li key={i}>· {i}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AssemblyFlow({ className = "" }: { className?: string }) {
  return (
    <section id="fluxo-montagem" data-assembly-flow className={`scroll-mt-24 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
        Da lista de peças à entrega
      </h2>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {FLOW.map((step, i) => (
          <li
            key={step}
            className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-sm"
          >
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <span className="text-card-foreground">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AssemblyCompatibility({ className = "" }: { className?: string }) {
  return (
    <section id="compatibilidade" data-assembly-compatibility className={`scroll-mt-24 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
        <Layers className="h-6 w-6 text-accent" aria-hidden="true" />
        Compatibilidade antes da montagem
      </h2>
      <p className="text-muted-foreground mb-5">
        A conferência de compatibilidade acontece antes de qualquer parafuso. Estes são os pontos
        verificados na lista enviada pelo cliente ou na configuração definida em conjunto.
      </p>
      <ul className="flex flex-wrap gap-2 mb-6">
        {COMPATIBILITY.map((i) => (
          <li
            key={i}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-card-foreground"
          >
            {i}
          </li>
        ))}
      </ul>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {CAVEATS.map((c) => (
          <li key={c} className="flex gap-2">
            <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">
        Reparar um equipamento existente é{" "}
        <Link to="/servicos/manutencao-de-computador" className="text-primary hover:underline">
          manutenção de computador
        </Link>
        ; modernizar um item específico é{" "}
        <Link to="/upgrade-ssd-curitiba" className="text-primary hover:underline">
          upgrade de SSD e memória
        </Link>
        . Montagem é construir e validar o conjunto.
      </p>
    </section>
  );
}

export function AssemblyBiosBlock({ className = "" }: { className?: string }) {
  return (
    <section id="bios-e-drivers" data-assembly-bios className={`scroll-mt-24 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
        <Settings2 className="h-6 w-6 text-accent" aria-hidden="true" />
        Quando uma atualização de BIOS pode ser necessária
      </h2>
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <ul className="space-y-2 text-sm text-muted-foreground">
          {BIOS.map((i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true">·</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          A atualização não é recomendada sem motivo técnico e não é publicada aqui como
          procedimento passo a passo.
        </p>
      </div>
    </section>
  );
}
