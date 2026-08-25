/**
 * Rodada 3U — blocos exclusivos do atendimento remoto (modalidade).
 *
 * Contrato: elegibilidade → autorização → conexão → execução → encerramento →
 * orientação. Nada aqui promete acesso permanente, plano, monitoramento ou
 * solução universal sem presencial. Nenhum preço, prazo ou capacidade nova.
 */
import { Link } from "@/lib/router-compat";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  MonitorSmartphone,
  ShieldCheck,
  Wifi,
  UserCheck,
} from "lucide-react";

const ELIGIBILITY = [
  {
    icon: MonitorSmartphone,
    title: "O computador inicia",
    text: "O equipamento precisa permitir acesso ao sistema para que a sessão seja possível.",
  },
  {
    icon: Wifi,
    title: "Há conexão com a internet",
    text: "A estabilidade da conexão influencia diretamente a sessão remota.",
  },
  {
    icon: UserCheck,
    title: "O usuário pode autorizar",
    text: "A pessoa responsável precisa acompanhar ou autorizar o acesso durante o atendimento.",
  },
  {
    icon: CheckCircle2,
    title: "O problema é compatível",
    text: "Falhas físicas, energia, tela sem imagem e equipamentos que não ligam podem exigir atendimento presencial.",
  },
];

const FLOW = [
  "Solicitação",
  "Triagem",
  "Confirmação de compatibilidade",
  "Autorização",
  "Acesso temporário",
  "Procedimento",
  "Encerramento da sessão",
  "Orientação",
];

const NOT_SUITABLE = [
  "Equipamento não liga",
  "Tela sem imagem",
  "Cheiro, calor ou ruído incomum",
  "Contato com líquido",
  "Falha física ou troca de peça",
  "Limpeza interna, bateria ou conector",
  "Armazenamento com ruído",
  "Rede totalmente indisponível, sem acesso alternativo",
];

const AUTHORIZATION = [
  "O acesso depende de consentimento explícito da pessoa responsável.",
  "A sessão é iniciada por código temporário gerado no momento do atendimento.",
  "Você acompanha a tela durante todo o procedimento.",
  "O acesso é limitado ao necessário para o caso descrito na triagem.",
  "A sessão é encerrada ao final e a autorização pode ser revogada a qualquer momento.",
  "Nunca envie senha bancária ou código de autenticação em duas etapas.",
  "Acesso permanente não é mantido: cada atendimento exige nova autorização.",
];

export function RemoteEligibility({ className = "" }: { className?: string }) {
  return (
    <section id="requisitos" data-remote-eligibility className={`scroll-mt-24 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
        Requisitos para o atendimento remoto
      </h2>
      <p className="text-muted-foreground mb-6">
        A modalidade remota atende residência, home office, profissional autônomo e empresa. Antes
        de agendar, quatro condições definem se o caso é elegível.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {ELIGIBILITY.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="flex items-center gap-2 font-semibold text-card-foreground mb-1">
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RemoteSessionFlow({ className = "" }: { className?: string }) {
  return (
    <section id="fluxo-remoto" data-remote-flow className={`scroll-mt-24 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
        Como a sessão remota acontece
      </h2>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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
      <p className="rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        Nem todo problema pode ser resolvido remotamente. Quando há suspeita de falha física,
        ausência de imagem, falta de energia ou risco para os dados, pode ser necessário
        atendimento presencial, coleta ou bancada.
      </p>
    </section>
  );
}

export function RemoteAuthorizationBox({ className = "" }: { className?: string }) {
  return (
    <section id="seguranca-remota" data-remote-authorization className={`scroll-mt-24 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
        Como o acesso remoto deve ser autorizado
      </h2>
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <p className="flex items-center gap-2 font-semibold text-foreground mb-3">
          <KeyRound className="h-4 w-4 text-primary" aria-hidden="true" />
          Autorização, acompanhamento e encerramento
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {AUTHORIZATION.map((item) => (
            <li key={item} className="flex gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link to="/seguranca-dos-dados" className="font-semibold text-primary hover:underline">
            Ver práticas e responsabilidades sobre dados →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function RemoteNotSuitable({ className = "" }: { className?: string }) {
  return (
    <section id="limites-remoto" data-remote-limits className={`scroll-mt-24 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
        O que não pode ser resolvido remotamente
      </h2>
      <p className="text-muted-foreground mb-5">
        Nestes casos a triagem indica a modalidade correta — bancada, visita ou coleta — antes de
        qualquer sessão.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {NOT_SUITABLE.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">
        Em ambiente de empresa, quando a demanda é recorrente, o contexto correto é o{" "}
        <Link to="/servicos/suporte-tecnico-empresarial" className="text-primary hover:underline">
          suporte técnico empresarial
        </Link>
        . Já a modalidade presencial no endereço segue as condições da{" "}
        <Link to="/precos" className="text-primary hover:underline">
          página de preços e políticas
        </Link>
        .
      </p>
    </section>
  );
}
