import { Link } from "@/lib/router-compat";
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/analytics";
import { buildWhatsAppUrl, readStoredLocation, currentSourcePage } from "@/lib/whatsapp";
import { COMPANY } from "@/data/companyInfo";

const services = [
  { name: "Informática", href: "/servicos/informatica" },
  { name: "Notebooks", href: "/servicos/notebooks" },
  { name: "CFTV / Câmeras", href: "/servicos/cftv" },
  { name: "Elétrica", href: "/servicos/eletrica" },
  { name: "Redes e Wi-Fi", href: "/servicos/redes" },
  { name: "Ar-Condicionado", href: "/servicos/ar-condicionado" },
  { name: "Manutenção Predial", href: "/servicos/manutencao-predial" },
];

const regions = [
  { name: "Curitiba", href: "/regioes/curitiba" },
  { name: "São José dos Pinhais", href: "/regioes/sao-jose-dos-pinhais" },
  { name: "Pinhais", href: "/regioes/pinhais" },
  { name: "Colombo", href: "/regioes/colombo" },
  { name: "Araucária", href: "/regioes/araucaria" },
  { name: "Campo Largo", href: "/regioes/campo-largo" },
];

export function Footer() {
  const whatsappLink = buildWhatsAppUrl({ ...readStoredLocation(), sourcePage: currentSourcePage() });
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo variant="light" size="md" className="max-w-full" />
            </div>
            <p className="text-background/70 mb-6 text-sm leading-relaxed">
              A maior rede de técnicos especializados do Brasil. Atendimento 24 horas via WhatsApp para Curitiba e Região Metropolitana.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/precisodeumtecnico/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/PrecisoDeUmTecnico" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Serviços</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link to={service.href} onClick={() => trackCtaClick({ surface: "footer", cta_id: "footer_service", label: service.name, destination: service.href, service: service.name })} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/assistencia-tecnica-curitiba" onClick={() => trackCtaClick({ surface: "footer", cta_id: "footer_curitiba_lp", label: "Assistência Técnica em Curitiba", destination: "/assistencia-tecnica-curitiba", city: "Curitiba" })} className="text-background/70 hover:text-primary transition-colors text-sm">
                  Assistência Técnica em Curitiba
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-background hover:text-white underline underline-offset-4 transition-colors text-sm font-semibold">
                  Ver todos →
                </Link>
              </li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Regiões Atendidas</h3>
            <ul className="space-y-3">
              {regions.map((region) => (
                <li key={region.name}>
                  <Link to={region.href} onClick={() => trackCtaClick({ surface: "footer", cta_id: "footer_region", label: region.name, destination: region.href, city: region.name })} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {region.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/regioes" className="text-background hover:text-white underline underline-offset-4 transition-colors text-sm font-semibold">
                  Todas as regiões →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-background/70">WhatsApp 24h</span>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ source: "footer" })}
                    data-wa-source="footer"
                    data-service="assistência técnica"
                    data-wa-keep="footer"
                    aria-label="Falar com técnico pelo WhatsApp (rodapé)"
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    WhatsApp 24h
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-background/70">Atendimento Presencial</span>
                  <span className="font-semibold">08h às 22h</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-background/70">Área de Atendimento</span>
                  <span className="font-semibold">Curitiba e Região Metropolitana</span>
                  <Link to="/atendimento-nacional" className="block text-xs mt-1 text-background/80 hover:text-primary underline-offset-2 hover:underline">
                    + Prestadores parceiros em todo o Brasil →
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-background/60 text-sm text-center md:text-left space-y-1">
              <p>© {currentYear} {COMPANY.legalName}. Todos os direitos reservados.</p>
              <p>CNPJ: {COMPANY.cnpj} · {COMPANY.experiencePhrase}</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link to="/faq" className="text-background/60 hover:text-background text-sm transition-colors">
                FAQ
              </Link>
              <Link to="/empresa-de-ti-curitiba" className="text-background/60 hover:text-background text-sm transition-colors">
                Empresa de TI em Curitiba
              </Link>
              <Link to="/servicos/suporte-tecnico-empresarial" className="text-background/60 hover:text-background text-sm transition-colors">
                Suporte Empresarial
              </Link>
              <Link to="/seguranca-dos-dados" className="text-background/60 hover:text-background text-sm transition-colors">
                Segurança dos Dados
              </Link>

              <Link to="/dados-da-empresa" className="text-background/60 hover:text-background text-sm transition-colors">
                Dados da Empresa
              </Link>
              <Link to="/gestor-responsavel" className="text-background/60 hover:text-background text-sm transition-colors">
                Gestor Responsável
              </Link>
              <Link to="/precos" className="text-background/60 hover:text-background text-sm transition-colors">
                Preços
              </Link>
              <Link
                to="/como-funciona"
                onClick={() => trackCtaClick({ surface: "footer", cta_id: "footer_como_funciona", label: "Como funciona", destination: "/como-funciona" })}
                className="text-background/60 hover:text-background text-sm transition-colors"
              >
                Como funciona
              </Link>
              <Link
                to="/busca"
                onClick={() => trackCtaClick({ surface: "footer", cta_id: "footer_busca", label: "Buscar por bairro ou serviço", destination: "/busca" })}
                className="text-background/60 hover:text-background text-sm transition-colors"
              >
                Buscar por bairro ou serviço
              </Link>



              <Link to="/blog" className="text-background/60 hover:text-background text-sm transition-colors">
                Blog
              </Link>
              <Link to="/garantia-e-cobertura" className="text-background/60 hover:text-background text-sm transition-colors">
                Garantia e cobertura
              </Link>
              <Link to="/termos-orcamento-pre-aprovado" className="text-background/60 hover:text-background text-sm transition-colors">
                Termos de Orçamento
              </Link>
              <Link to="/politica-privacidade" className="text-background/60 hover:text-background text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos-uso" className="text-background/60 hover:text-background text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link to="/areas-atendidas" onClick={() => trackCtaClick({ surface: "footer", cta_id: "footer_areas_atendidas", label: "Áreas atendidas", destination: "/areas-atendidas" })} className="text-background/60 hover:text-background text-sm transition-colors">
                Áreas atendidas
              </Link>
              <Link to="/anuncie" onClick={() => trackCtaClick({ surface: "footer", cta_id: "media_kit_footer", label: "Anuncie / Mídia Kit", destination: "/anuncie" })} className="text-background/60 hover:text-background text-sm transition-colors">
                Anuncie / Mídia Kit
              </Link>
              <a
                href="/midia-kit.pdf"
                download
                data-testid="media-kit-download-footer"
                onClick={() => trackCtaClick({ surface: "footer", cta_id: "media_kit_pdf_footer", label: "Mídia kit em PDF", destination: "/midia-kit.pdf" })}
                className="text-background/60 hover:text-background text-sm transition-colors"
              >
                Mídia kit em PDF
              </a>

              <Link to="/politica-de-anuncios" className="text-background/60 hover:text-background text-sm transition-colors">
                Política de Anúncios
              </Link>
              <Link to="/politica-de-cookies" className="text-background/60 hover:text-background text-sm transition-colors">
                Política de Cookies
              </Link>
              <Link to="/status-anuncios" className="text-background/60 hover:text-background text-sm transition-colors">
                Status de anúncios e SEO
              </Link>
              <Link to="/creditos-de-imagens" className="text-background/60 hover:text-background text-sm transition-colors">
                Créditos de imagens
              </Link>
              <Link to="/como-avaliar" className="text-background/60 hover:text-background text-sm transition-colors">
                Como avaliar
              </Link>
              <Link to="/avaliacoes" className="text-background/60 hover:text-background text-sm transition-colors">
                Avaliações de clientes
              </Link>
              <Link to="/status-os" className="text-background/60 hover:text-background text-sm transition-colors">
                Status da OS
              </Link>
              <Link to="/exclusao-de-dados" className="text-background/60 hover:text-background text-sm transition-colors">
                Exclusão de dados (LGPD)
              </Link>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
