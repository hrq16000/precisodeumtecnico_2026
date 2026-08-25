/**
 * Rodada 3S — pilares operacionais do hub empresarial.
 *
 * Só usado em /empresa-de-ti-curitiba. Cada pilar aponta para uma rota real
 * já registrada no App (sem criar serviço novo, sem preço e sem promessa
 * de disponibilidade). Conteúdo derivado das seções já publicadas.
 */
import { Link } from "@/lib/router-compat";
import { ArrowRight, HardDrive, Laptop, ShieldCheck, Wifi } from "lucide-react";

const PILLARS = [
  {
    icon: Laptop,
    title: "Computadores e usuários",
    items: ["Lentidão e falhas", "Configurações e estações", "Suporte ao usuário"],
    to: "/servicos/suporte-tecnico-empresarial",
    linkLabel: "Suporte técnico empresarial",
  },
  {
    icon: Wifi,
    title: "Redes e conectividade",
    items: ["Wi-Fi e cabeamento", "Impressoras em rede", "Compartilhamento e estabilidade"],
    to: "/servicos/redes",
    linkLabel: "Redes cabeadas e Wi-Fi",
  },
  {
    icon: ShieldCheck,
    title: "Prevenção e continuidade",
    items: ["Manutenção preventiva", "Backup e riscos", "Organização e recomendações"],
    to: "/seguranca-dos-dados",
    linkLabel: "Segurança dos dados",
  },
  {
    icon: HardDrive,
    title: "Remoto e presencial",
    items: ["Triagem do cenário", "Modalidade conforme sintoma", "Limites do que é remoto"],
    to: "/suporte-tecnico-remoto",
    linkLabel: "Suporte técnico remoto",
  },
];

export function BusinessPillars({ className = "" }: { className?: string }) {
  return (
    <div data-business-pillars className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        {PILLARS.map(({ icon: Icon, title, items, to, linkLabel }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 flex items-center gap-2 font-semibold text-card-foreground">
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {title}
            </p>
            <ul className="mb-3 space-y-1 text-sm text-muted-foreground">
              {items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <Link
              to={to}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {linkLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
