/**
 * Rodada 3U — blocos institucionais de segurança dos dados.
 *
 * Contrato: práticas → responsabilidades → acessos → riscos → limites →
 * prevenção. Página educativa: nada de SOC, monitoramento, conformidade,
 * pentest ou promessa de proteção total. Sem preço, plano ou Offer.
 */
import { Link } from "@/lib/router-compat";
import { AlertTriangle, Database, KeySquare, ShieldCheck, Users } from "lucide-react";

const PILLARS = [
  {
    icon: Database,
    title: "Backup",
    items: ["Cópias", "Separação de mídia e local", "Restauração testada", "Responsabilidade definida"],
  },
  {
    icon: KeySquare,
    title: "Acesso mínimo",
    items: ["Apenas o necessário", "Tempo limitado", "Encerramento ao final"],
  },
  {
    icon: ShieldCheck,
    title: "Autorização",
    items: ["Responsável identificado", "Escopo declarado", "Registro do atendimento", "Limite explícito"],
  },
  {
    icon: Users,
    title: "Sistemas de terceiros",
    items: ["Fornecedor", "Licença e conta", "Autenticação", "Disponibilidade externa"],
  },
];

const MATRIX = [
  {
    role: "Cliente",
    items: [
      "Indicar o responsável pelo atendimento",
      "Informar restrições de acesso",
      "Manter acessos de recuperação",
      "Preservar códigos e contas",
      "Comunicar quais dados são críticos",
      "Manter backup próprio",
    ],
  },
  {
    role: "Técnico",
    items: [
      "Solicitar apenas o acesso mínimo",
      "Explicar o procedimento antes de executar",
      "Não armazenar credencial sem necessidade",
      "Encerrar sessões ao final",
      "Respeitar o escopo autorizado",
      "Registrar limitações encontradas",
    ],
  },
  {
    role: "Fornecedor externo",
    items: [
      "Licença e conta do sistema",
      "Autenticação da plataforma",
      "Servidor e infraestrutura própria",
      "Correção interna do software",
      "Disponibilidade do serviço",
      "Recuperação dentro da plataforma",
    ],
  },
];

const NEVER_SEND = [
  "Senha bancária",
  "Código de autenticação em duas etapas",
  "Token de acesso",
  "Chave privada",
  "Credencial de carteira digital",
  "Código de recuperação de conta",
  "Arquivo confidencial sem necessidade e autorização",
];

export function SecurityPrinciple({ className = "" }: { className?: string }) {
  return (
    <div data-security-principle className={`rounded-xl border border-border bg-muted/40 p-5 ${className}`}>
      <p className="text-base text-foreground">
        Nenhum procedimento técnico elimina totalmente o risco de perda. Backup, autorização,
        acesso mínimo e comunicação clara reduzem riscos, mas não substituem avaliação e
        responsabilidade compartilhada.
      </p>
    </div>
  );
}

export function SecurityPillars({ className = "" }: { className?: string }) {
  return (
    <section id="pilares-seguranca" data-security-pillars className={`scroll-mt-24 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
        Quatro pilares aplicáveis na prática
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {PILLARS.map(({ icon: Icon, title, items }) => (
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

export function ResponsibilityMatrix({ className = "" }: { className?: string }) {
  return (
    <section id="responsabilidades" data-security-matrix className={`scroll-mt-24 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
        Quem responde por cada parte
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {MATRIX.map((col) => (
          <article key={col.role} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-bold text-card-foreground mb-3">{col.role}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true">·</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NeverSendBox({ className = "" }: { className?: string }) {
  return (
    <section id="credenciais" data-security-credentials className={`scroll-mt-24 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
        O que nunca deve ser enviado por mensagem
      </h2>
      <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-5">
        <p className="flex items-center gap-2 font-semibold text-foreground mb-3">
          <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
          Dados que nenhum atendimento legítimo solicita por mensagem
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
          {NEVER_SEND.map((i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true">·</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SecurityRemoteAccessNote({ className = "" }: { className?: string }) {
  return (
    <section id="acesso-remoto" data-security-remote className={`scroll-mt-24 ${className}`}>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
        Acesso remoto: autorização e encerramento
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-3">
        Quando o atendimento é feito à distância, o acesso depende de autorização da pessoa
        responsável, ocorre em sessão temporária acompanhada na tela, é encerrado ao final e pode
        ser revogado a qualquer momento.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Cópias, sincronização e recuperação são coisas diferentes: sincronização replica exclusões,
        backup mantém cópias separadas e recuperação é uma tentativa depois da falha. Detalhes em{" "}
        <Link to="/suporte-tecnico-remoto" className="text-primary hover:underline">
          atendimento remoto
        </Link>
        ,{" "}
        <Link to="/servicos/backup-para-empresas" className="text-primary hover:underline">
          backup para empresas
        </Link>{" "}
        e{" "}
        <Link to="/servicos/recuperacao-de-dados" className="text-primary hover:underline">
          recuperação de dados
        </Link>
        .
      </p>
    </section>
  );
}
