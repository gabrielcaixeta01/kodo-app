import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConditionalFooterNav } from "@/components/layout/ConditionalFooterNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: {
    default: "Kodo — The right action, now.",
    template: "%s | Kodo",
  },
  description: "Sistema de apoio à decisão baseado em disciplina, clareza e ação correta. Escolha o que fazer agora com base em objetivos, prazos e energia disponível.",
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kodo",
  },
  keywords: ["produtividade", "gestão de tarefas", "foco", "disciplina"],
  authors: [{ name: "Kodo" }],
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "Kodo — The right action, now.",
    description: "Sistema de apoio à decisão para escolher a próxima ação correta.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kodo" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <ServiceWorkerRegister />
            {children}
            <ConditionalFooterNav />
          </AuthProvider>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}
