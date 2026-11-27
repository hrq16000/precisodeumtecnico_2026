import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { CookieConsentBanner } from "@/components/system/CookieConsentBanner";

interface LayoutProps {
  children: ReactNode;
  staticContent?: boolean;
}

export function Layout({ children, staticContent = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className={staticContent ? "flex-1" : "flex-1 page-enter"}>
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieConsentBanner />
    </div>
  );
}

