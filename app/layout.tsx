import type { Metadata } from "next";
import { SessionProvider } from "@/contexts/SessionContext";
import { ActivityProvider } from "@/contexts/ActivityContext";
import "./globals.css";

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
        <SessionProvider>
          <ActivityProvider>{children}</ActivityProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
