import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/contexts/SessionContext";
import { ConditionalFooterNav } from "@/components/layout/ConditionalFooterNav";


export const metadata: Metadata = {
  title: "Kodo App",
  description: "KODO — Structure enables discipline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <SessionProvider>
          {children}
          <ConditionalFooterNav />
        </SessionProvider>
      </body>
    </html>
  );
}
