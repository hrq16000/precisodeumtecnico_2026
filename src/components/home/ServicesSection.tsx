import { Link } from "react-router-dom";
import { 
  Monitor, 
  Laptop, 
  Camera, 
  Zap, 
  Wifi, 
  Wind, 
  Wrench, 
  Tv,
  Server,
  Smartphone,
  Printer,
  Building,
  ArrowRight,
  Gamepad2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/analytics";

import serviceComputer from "@/assets/service-computer.jpg";
import serviceNotebook from "@/assets/service-notebook.jpg";
import serviceCftv from "@/assets/service-cftv.jpg";
import serviceEletrica from "@/assets/service-eletrica.jpg";
import serviceRedes from "@/assets/service-redes.jpg";
import serviceAr from "@/assets/service-arcondicionado.jpg";
import serviceCelular from "@/assets/service-celular.jpg";
import serviceGames from "@/assets/service-games.jpg";

const services = [
  {
    icon: Monitor,
    title: "Informática",
    alt: "Manutenção de informática e computadores",
    description: "Manutenção, formatação, limpeza e upgrade de computadores desktop.",
    href: "/servicos/informatica",
    color: "bg-blue-500/10 text-blue-600",
    image: serviceComputer,
    price: "A partir de R$ 99,99",
  },
  {
    icon: Laptop,
    title: "Notebooks",
    alt: "Conserto e manutenção de notebooks",
    description: "Conserto de tela, teclado, bateria, limpeza interna e upgrade.",
    href: "/servicos/notebooks",
    color: "bg-indigo-500/10 text-indigo-600",
    image: serviceNotebook,
    price: "A partir de R$ 149,99",
  },
  {
    icon: Camera,
    title: "CFTV / Câmeras",
    alt: "Instalação de câmeras CFTV de segurança",
    description: "Instalação e manutenção de sistemas de câmeras de segurança.",
    href: "/servicos/cftv",
    color: "bg-purple-500/10 text-purple-600",
    image: serviceCftv,
    price: "A partir de R$ 199,99",
  },
  {
    icon: Zap,
    title: "Elétrica",
    alt: "Serviços de elétrica residencial e comercial",
    description: "Instalações elétricas residenciais e comerciais conforme normas.",
    href: "/servicos/eletrica",
    color: "bg-yellow-500/10 text-yellow-600",
    image: serviceEletrica,
    price: "A partir de R$ 99,99",
  },
  {
    icon: Wifi,
    title: "Redes e Wi-Fi",
    alt: "Configuração de redes Wi-Fi e roteadores",
    description: "Configuração de redes, roteadores e sistemas mesh.",
    href: "/servicos/redes",
    color: "bg-cyan-500/10 text-cyan-600",
    image: serviceRedes,
    price: "A partir de R$ 99,99",
  },
  {
    icon: Wind,
    title: "Ar-Condicionado",
    alt: "Instalação e manutenção de ar-condicionado",
    description: "Instalação, limpeza e manutenção de aparelhos de ar.",
    href: "/servicos/ar-condicionado",
    color: "bg-teal-500/10 text-teal-600",
    image: serviceAr,
    price: "A partir de R$ 149,99",
  },
  {
    icon: Smartphone,
    title: "Celulares e Tablets",
    alt: "Reparo de celulares e tablets",
    description: "Reparo de telas, baterias e componentes de dispositivos móveis.",
    href: "/servicos/celulares",
    color: "bg-emerald-500/10 text-emerald-600",
    image: serviceCelular,
    price: "A partir de R$ 99,99",
  },
  {
    icon: Gamepad2,
    title: "Games e Consoles",
    alt: "Conserto de games e consoles PlayStation Xbox",
    description: "Conserto de PlayStation, Xbox, Nintendo e controles.",
    href: "/servicos/games",
    color: "bg-rose-500/10 text-rose-600",
    image: serviceGames,
    price: "A partir de R$ 99,99",
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-background" id="servicos">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Nossos Serviços
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Soluções Completas em Assistência Técnica
          </h2>
          <p className="text-muted-foreground text-lg">
            Oferecemos uma ampla gama de serviços técnicos para residências e empresas. 
            Técnicos especializados e garantia em todos os serviços.
          </p>
        </div>

        {/* Services Grid with Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.href}
              onClick={() => trackCtaClick({ surface: "services_section", cta_id: "service_card", label: service.title, destination: service.href, service: service.title })}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-secondary">
                <img
                  src={service.image}
                  alt={service.alt}
                  width={400}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className={`absolute top-3 left-3 w-10 h-10 rounded-lg ${service.color} flex items-center justify-center backdrop-blur-xs`}>
                  <service.icon className="w-5 h-5" />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-3 py-1 bg-success text-success-foreground text-xs font-bold rounded-full">
                    {service.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                  Ver detalhes <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/servicos" onClick={() => trackCtaClick({ surface: "services_section", cta_id: "view_all_services", label: "Ver todos os serviços", destination: "/servicos" })}>
              Ver todos os serviços
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
