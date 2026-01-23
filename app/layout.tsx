import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConditionalFooterNav } from "@/components/layout/ConditionalFooterNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "Kodo — The right action, now.",
    template: "%s | Kodo",
  },
  description: "Sistema de apoio à decisão baseado em disciplina, clareza e ação correta. Escolha o que fazer agora com base em objetivos, prazos e energia disponível.",
  keywords: ["produtividade", "gestão de tarefas", "foco", "disciplina"],
  authors: [{ name: "Kodo" }],
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
      <body>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <ConditionalFooterNav />
          </AuthProvider>
        </ErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}
