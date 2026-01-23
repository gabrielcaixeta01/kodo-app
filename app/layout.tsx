import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConditionalFooterNav } from "@/components/layout/ConditionalFooterNav";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Kodo",
  description: "Sistema de gerenciamento de atividades",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <ConditionalFooterNav />
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
