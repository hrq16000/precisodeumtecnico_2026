import React, { useEffect, useState } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MessageCircle,
  Clock,
  Globe2,
  Home,
  Wrench,
  MapPinned,
  Newspaper,
  Tag,
  Info,
  Mail,
  Monitor,
  Laptop,
  Camera,
  Zap,
  Wifi,
  Snowflake,
  Smartphone,
  Gamepad2,
  Cpu,
  Building2,
  MapPin,
  Map,
  Flag,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RegionIndicator } from "@/components/layout/RegionIndicator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const services = [
  { name: "Informática", href: "/servicos/informatica", description: "Manutenção e suporte em computadores", icon: Monitor },
  { name: "Notebooks", href: "/servicos/notebooks", description: "Conserto e upgrade de notebooks", icon: Laptop },
  { name: "CFTV / Câmeras", href: "/servicos/cftv", description: "Instalação e manutenção de câmeras", icon: Camera },
  { name: "Elétrica", href: "/servicos/eletrica", description: "Serviços elétricos residenciais e comerciais", icon: Zap },
  { name: "Redes", href: "/servicos/redes", description: "Configuração de redes e Wi-Fi", icon: Wifi },
  { name: "Ar-Condicionado", href: "/servicos/ar-condicionado", description: "Instalação e manutenção", icon: Snowflake },
  { name: "Celulares", href: "/servicos/celulares", description: "Reparo de smartphones e tablets", icon: Smartphone },
  { name: "Games", href: "/servicos/games", description: "Conserto de videogames e consoles", icon: Gamepad2 },
  { name: "Consoles & Eletrônicos (Curitiba)", href: "/assistencia-tecnica-curitiba", description: "Assistência técnica especializada em PS5, Xbox, Nintendo e GPUs", icon: Cpu },
];

const regions = [
  { name: "Curitiba", href: "/regioes/curitiba", icon: Building2 },
  { name: "São José dos Pinhais", href: "/regioes/sao-jose-dos-pinhais", icon: MapPin },
  { name: "Pinhais", href: "/regioes/pinhais", icon: MapPin },
  { name: "Todas as Regiões (PR)", href: "/regioes", icon: Map },
  { name: "🇧🇷 Atendimento Nacional", href: "/atendimento-nacional", icon: Flag },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navValue, setNavValue] = useState("");
  const desktopNavRef = React.useRef<HTMLElement | null>(null);
  const location = useLocation();
  const whatsappLink = buildWhatsAppUrl({ service: "assistência técnica", sourcePage: typeof window !== "undefined" ? window.location.pathname : "" });

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 30);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu desktop ao clicar fora ou pressionar Esc.
  useEffect(() => {
    if (!navValue) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = desktopNavRef.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) setNavValue("");
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavValue("");
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [navValue]);

  // Fecha o menu ao navegar (SPA).
  useEffect(() => {
    setNavValue("");
  }, [location.pathname]);



  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-xs">
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground py-2">
        <div className="container-custom">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Atendimento 24h via WhatsApp
              </span>
              <RegionIndicator />
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-primary-foreground/90">
                <Globe2 className="w-4 h-4" />
                Prestadores parceiros em todo o Brasil
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container-custom">
          <div
            className={cn(
              "flex items-center justify-between gap-2 transition-[height] duration-500 ease-out",
              scrolled ? "h-14 sm:h-16 md:h-16 lg:h-16" : "h-16 sm:h-18 md:h-20 lg:h-20",
            )}
          >
            {/* Logo */}
            <Logo
              variant="dark"
              size="lg"
              compact={scrolled}
              priority
              className="shrink-0 max-w-[60%] sm:max-w-none"
            />

          {/* Desktop Navigation */}
          <nav ref={desktopNavRef} className="hidden xl:flex items-center gap-1">
            <NavigationMenu value={navValue} onValueChange={setNavValue}>

              <NavigationMenuList className="gap-1">
                {[
                  { to: "/", label: "Início", icon: Home, match: (p: string) => p === "/" },
                  { to: "/blog", label: "Blog", icon: Newspaper, match: (p: string) => p.startsWith("/blog") },
                  { to: "/precos", label: "Preços", icon: Tag, match: (p: string) => p === "/precos" },
                  { to: "/sobre", label: "Sobre", icon: Info, match: (p: string) => p === "/sobre" },
                  { to: "/contato", label: "Contato", icon: Mail, match: (p: string) => p === "/contato" },
                ].map((item, idx) => {
                  const active = item.match(location.pathname);
                  const Icon = item.icon;
                  // Insert Serviços + Regiões after "Início"
                  const insertDropdowns = idx === 1;
                  return (
                    <React.Fragment key={item.to}>

                      {insertDropdowns && (
                        <>
                          <NavigationMenuItem key="services-menu">
                            <NavigationMenuTrigger className="group/trigger relative h-10 px-3 text-sm font-medium bg-transparent data-[state=open]:bg-primary/10 hover:bg-primary/5">
                              <Wrench className="w-4 h-4 mr-1.5 text-primary transition-transform duration-300 group-hover/trigger:rotate-12" />
                              Serviços
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <ul className="grid w-[560px] gap-1.5 p-4 md:grid-cols-2">
                                {services.map((service, i) => {
                                  const SIcon = service.icon;
                                  return (
                                    <li
                                      key={service.name}
                                      className="opacity-0 animate-fade-in"
                                      style={{ animationDelay: `${i * 30}ms`, animationFillMode: "forwards" }}
                                    >
                                      <NavigationMenuLink asChild>
                                        <Link
                                          to={service.href}
                                          className="group/item flex items-start gap-3 select-none rounded-lg p-3 leading-none no-underline outline-hidden border border-transparent transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 focus:bg-secondary"
                                        >
                                          <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 group-hover/item:rotate-6">
                                            <SIcon className="w-4.5 h-4.5" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold leading-tight text-foreground group-hover/item:text-primary transition-colors">
                                              {service.name}
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                                              {service.description}
                                            </p>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-muted-foreground/0 group-hover/item:text-primary group-hover/item:translate-x-0 -translate-x-2 transition-all duration-300 self-center" />
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  );
                                })}
                                <li className="col-span-2 mt-1">
                                  <NavigationMenuLink asChild>
                                    <Link
                                      to="/servicos"
                                      className="group/all flex items-center justify-center gap-2 select-none rounded-lg p-3 no-underline outline-hidden bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300"
                                    >
                                      <Sparkles className="w-4 h-4 transition-transform duration-500 group-hover/all:rotate-180" />
                                      Ver todos os serviços
                                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/all:translate-x-1" />
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              </ul>
                            </NavigationMenuContent>
                          </NavigationMenuItem>

                          <NavigationMenuItem key="regions-menu">
                            <NavigationMenuTrigger className="group/trigger relative h-10 px-3 text-sm font-medium bg-transparent data-[state=open]:bg-primary/10 hover:bg-primary/5">
                              <MapPinned className="w-4 h-4 mr-1.5 text-primary transition-transform duration-300 group-hover/trigger:-translate-y-0.5" />
                              Regiões
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <ul className="grid w-[320px] gap-1 p-3">
                                {regions.map((region, i) => {
                                  const RIcon = region.icon;
                                  return (
                                    <li
                                      key={region.name}
                                      className="opacity-0 animate-fade-in"
                                      style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
                                    >
                                      <NavigationMenuLink asChild>
                                        <Link
                                          to={region.href}
                                          className="group/r flex items-center gap-3 select-none rounded-lg px-3 py-2.5 leading-none no-underline outline-hidden transition-all duration-300 hover:bg-primary/10 hover:translate-x-1 font-medium text-sm"
                                        >
                                          <RIcon className="w-4 h-4 text-primary shrink-0 transition-transform duration-300 group-hover/r:scale-125" />
                                          <span className="flex-1">{region.name}</span>
                                          <ChevronRight className="w-4 h-4 text-muted-foreground/0 group-hover/r:text-primary -translate-x-2 group-hover/r:translate-x-0 transition-all duration-300" />
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        </>
                      )}
                      <NavigationMenuItem key={item.to}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.to}
                            className={cn(
                              "group/link relative inline-flex h-10 w-max items-center gap-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-primary/5 focus:outline-hidden",
                              active && "text-primary",
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-4 h-4 transition-all duration-300 group-hover/link:scale-110 group-hover/link:text-primary",
                                active ? "text-primary" : "text-muted-foreground",
                              )}
                            />
                            <span>{item.label}</span>
                            <span
                              className={cn(
                                "absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-primary to-primary-glow origin-left transition-transform duration-300",
                                active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100",
                              )}
                            />
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </React.Fragment>

                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden xl:flex items-center gap-3">
            <Button variant="whatsapp" size="sm" asChild className="relative overflow-hidden group/cta">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="header" data-service="assistência técnica" aria-label="Falar com técnico pelo WhatsApp">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/cta:translate-x-full transition-transform duration-700" />
                <MessageCircle className="w-4 h-4 transition-transform duration-300 group-hover/cta:rotate-12" />
                <span className="hidden sm:inline">WhatsApp 24h</span>
              </a>
            </Button>
          </div>


          {/* Mobile menu trigger (Sheet handles outside-click close) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="xl:hidden relative p-2 rounded-lg hover:bg-secondary transition-all duration-300 active:scale-95"
                aria-label="Abrir menu"
              >
                <Menu className="w-6 h-6 transition-transform duration-300" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm p-0 rounded-xl border border-border/50 bg-gradient-to-b from-background via-background to-secondary/30 shadow-2xl"
              style={{ top: "5rem", bottom: "auto", height: "auto", maxHeight: "80dvh" }}
            >
              <div className="flex flex-col">
                <div className="px-6 pt-5 pb-3 border-b border-border/40">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Menu</span>
                  <h2 className="mt-1 text-xl font-display font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    Navegação
                  </h2>
                </div>
                <nav className="overflow-y-auto px-3 py-3">
                  <ul className="flex flex-col gap-1">
                    {[
                      { to: "/", label: "Início", icon: Home },
                      { to: "/servicos", label: "Serviços", icon: Wrench },
                      { to: "/regioes", label: "Regiões Atendidas", icon: MapPinned },
                      { to: "/precos", label: "Preços", icon: Tag },
                      { to: "/blog", label: "Blog", icon: Newspaper },
                      { to: "/sobre", label: "Sobre", icon: Info },
                      { to: "/contato", label: "Contato", icon: Mail },
                    ].map((item, i) => {
                      const active =
                        item.to === "/"
                          ? location.pathname === "/"
                          : location.pathname.startsWith(item.to);
                      const MIcon = item.icon;
                      return (
                        <li
                          key={item.to}
                          className="opacity-0 animate-fade-in"
                          style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
                        >
                          <Link
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "group flex items-center gap-3 px-4 py-3 rounded-lg font-medium",
                              "transition-all duration-300",
                              "hover:bg-primary/5 hover:translate-x-1",
                              "border border-transparent",
                              active
                                ? "bg-primary/10 text-primary border-primary/20 shadow-xs"
                                : "text-foreground/80 hover:text-foreground",
                            )}
                          >
                            <span
                              className={cn(
                                "shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300",
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110",
                              )}
                            >
                              <MIcon className="w-4 h-4" />
                            </span>
                            <span className="flex-1">{item.label}</span>
                            <ChevronRight
                              className={cn(
                                "w-4 h-4 text-primary opacity-0 -translate-x-2 transition-all duration-300",
                                "group-hover:opacity-100 group-hover:translate-x-0",
                                active && "opacity-100 translate-x-0",
                              )}
                            />
                          </Link>
                        </li>
                      );
                    })}

                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
    </header>
  );
}
