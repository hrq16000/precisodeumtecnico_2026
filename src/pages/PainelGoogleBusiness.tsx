import { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Store, Download } from "lucide-react";
import { toast } from "sonner";
import { COMPANY } from "@/data/companyInfo";
import { PRICING, SLA } from "@/data/pricingPolicy";
import { trackEvent } from "@/lib/analytics";

const CANONICAL = "https://precisodeumtecnico.com/operacao/painel-google-business";

/** Categorias válidas do GBP para o escopo real da operação. */
const PRIMARY_CATEGORY = "Serviço de reparo de computadores";
const SECONDARY_CATEGORIES = [
  "Serviço de reparo de televisores",
  "Serviço de instalação de redes de computadores",
  "Serviço de instalação de sistemas de segurança",
  "Eletricista",
  "Serviço de reparo de ar-condicionado",
];

const SERVICES = [
  "Formatação e backup",
  "Remoção de vírus e limpeza",
  "Upgrade de SSD e memória",
  "Reparo de notebook",
  "Reparo de Smart TV e troca de tela",
  "Configuração de Wi-Fi e redes",
  "Instalação de CFTV",
  "Suporte técnico empresarial",
];

const GBP_DESCRIPTION_MAX = 750;

const GoogleBusinessPanel = () => {
  const [name, setName] = useState<string>(COMPANY.brand);
  const [city, setCity] = useState("Curitiba");
  const [region, setRegion] = useState("PR");
  const [phoneLabel, setPhoneLabel] = useState("WhatsApp oficial da central");
  const [site, setSite] = useState<string>(COMPANY.website);
  const [hours, setHours] = useState<string>(COMPANY.serviceHours);

  const description = useMemo(
    () =>
      [
        `${name} atende ${city} e região com assistência técnica em informática, notebooks, Smart TVs, redes/Wi-Fi, CFTV, elétrica e ar-condicionado.`,
        `Triagem técnica antes do orçamento: você descreve o problema, recebe a faixa de valor e só aprova o reparo depois do diagnóstico.`,
        `Diagnóstico em bancada a partir de ${PRICING.benchDiagnosis.priceLabel}, visita técnica a partir de ${PRICING.technicalVisit.priceLabel} e coleta e entrega por ${PRICING.pickupDelivery.priceLabel}. Prazo mínimo de conclusão: ${SLA.minLabel}.`,
        `${COMPANY.experiencePhrase}. Atendimento ${hours}. Peças e serviços com garantia formal registrada na ordem de serviço.`,
      ].join(" "),
    [name, city, hours],
  );

  const napBlock = useMemo(
    () =>
      [
        `Nome: ${name}`,
        `Cidade/UF: ${city} - ${region}`,
        `Área atendida: ${COMPANY.areaServed}`,
        `Contato: ${phoneLabel}`,
        `Site: ${site}`,
        `Horário: ${hours}`,
      ].join("\n"),
    [name, city, region, phoneLabel, site, hours],
  );

  const issues = useMemo(() => {
    const out: string[] = [];
    if (name.trim() !== COMPANY.brand)
      out.push(`Nome diverge da marca oficial ("${COMPANY.brand}") — NAP inconsistente com o site.`);
    if (!site.startsWith("https://")) out.push("Site deve começar com https://");
    if (site.replace(/\/$/, "") !== COMPANY.website.replace(/\/$/, ""))
      out.push(`Site diverge do canônico (${COMPANY.website}).`);
    if (description.length > GBP_DESCRIPTION_MAX)
      out.push(`Descrição com ${description.length} caracteres (limite ${GBP_DESCRIPTION_MAX}).`);
    if (/\b\d{4,5}-?\d{4}\b/.test(phoneLabel))
      out.push("Não escreva o número na descrição/rótulo — use apenas o campo de telefone do GBP.");
    if (!city.trim()) out.push("Informe a cidade principal do perfil.");
    return out;
  }, [name, site, description, phoneLabel, city]);

  const exportText = useMemo(
    () =>
      [
        "== CATEGORIA PRINCIPAL ==",
        PRIMARY_CATEGORY,
        "",
        "== CATEGORIAS SECUNDÁRIAS ==",
        ...SECONDARY_CATEGORIES.map((c) => `- ${c}`),
        "",
        "== SERVIÇOS ==",
        ...SERVICES.map((s) => `- ${s}`),
        "",
        `== DESCRIÇÃO (${description.length}/${GBP_DESCRIPTION_MAX}) ==`,
        description,
        "",
        "== NAP ==",
        napBlock,
      ].join("\n"),
    [description, napBlock],
  );

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(exportText);
      trackEvent("gbp_export_copy", { issues: issues.length });
      toast.success("Conteúdo copiado");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  function download() {
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "google-business-profile.txt";
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("gbp_export_download", { issues: issues.length });
  }

  return (
    <Layout>
      <SEOHead
        title="Painel do Google Business Profile (uso interno)"
        description="Composição e validação do conteúdo do perfil no Google: categoria, serviços, descrição e NAP consistentes com o site."
        canonical={CANONICAL}
        noindex
      />

      <section className="py-12 lg:py-16 bg-background">
        <div className="container-custom max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground mb-4">
            <Store className="w-4 h-4" aria-hidden="true" />
            Uso interno da operação
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Painel do Google Business Profile</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Monte a ficha do perfil com os mesmos dados publicados no site. A validação aponta
            divergências de NAP antes de você colar no Google — perfil e site precisam dizer
            exatamente a mesma coisa.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            <div>
              <Label htmlFor="gbp-name">Nome do perfil</Label>
              <Input id="gbp-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gbp-city">Cidade principal</Label>
              <Input id="gbp-city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gbp-uf">UF</Label>
              <Input id="gbp-uf" value={region} onChange={(e) => setRegion(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gbp-site">Site</Label>
              <Input id="gbp-site" value={site} onChange={(e) => setSite(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gbp-phone">Rótulo de contato</Label>
              <Input id="gbp-phone" value={phoneLabel} onChange={(e) => setPhoneLabel(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gbp-hours">Horário</Label>
              <Input id="gbp-hours" value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card mb-6">
            <h2 className="text-xl font-semibold mb-3">Validação de NAP e conteúdo</h2>
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground" role="status">
                Sem divergências. Conteúdo pronto para publicação no perfil.
              </p>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-sm text-destructive" role="status">
                {issues.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-6 rounded-xl border border-border bg-card mb-6">
            <h2 className="text-xl font-semibold mb-3">Links de agendamento on-line (GBP)</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Cole estes links no campo “Agendamentos” do perfil da empresa. Eles abrem a triagem
              técnica direto em pop-up, já com origem rastreada — sem exigir telefone.
            </p>
            <ul className="space-y-2">
              {[
                { label: "Agendamento padrão", url: `${COMPANY.website}/?utm_source=gbp#agendamento` },
                { label: "Agendamento — Curitiba", url: `${COMPANY.website}/assistencia-tecnica-curitiba?utm_source=gbp&cidade=Curitiba#agendamento` },
                { label: "Agendamento — urgência", url: `${COMPANY.website}/atendimento-urgente?utm_source=gbp_urgente#agendamento` },
              ].map((l) => (
                <li key={l.url} className="flex flex-wrap items-center gap-2">
                  <code className="text-xs bg-muted/60 rounded-sm px-2 py-1 break-all">{l.url}</code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="min-h-9"
                    onClick={() => {
                      navigator.clipboard.writeText(l.url);
                      trackEvent("gbp_booking_link_copy", { label: l.label });
                      toast.success("Link copiado.");
                    }}
                  >
                    <Copy className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
                    Copiar
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card mb-6">
            <h2 className="text-xl font-semibold mb-3">Descrição gerada</h2>
            <Textarea readOnly rows={7} value={description} className="font-sans text-sm" />
            <p className="text-xs text-muted-foreground mt-2">
              {description.length}/{GBP_DESCRIPTION_MAX} caracteres
            </p>
          </div>


          <div className="flex flex-wrap gap-3 mb-8">
            <Button type="button" className="min-h-11" onClick={copyAll}>
              <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
              Copiar tudo
            </Button>
            <Button type="button" variant="outline" className="min-h-11" onClick={download}>
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              Baixar .txt
            </Button>
          </div>

          <pre className="whitespace-pre-wrap text-sm bg-muted/40 rounded-lg p-4 border border-border font-sans overflow-x-auto">
            {exportText}
          </pre>
        </div>
      </section>
    </Layout>
  );
};

export default GoogleBusinessPanel;
