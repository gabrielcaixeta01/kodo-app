import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/contexts/SessionContext";
import { ConditionalFooterNav } from "@/components/layout/ConditionalFooterNav";
import { ActivityProvider } from "@/contexts/ActivityContext";


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
      <body className="bg-black text-white select-none">
        <ActivityProvider>
          <SessionProvider>
            {children}
            <ConditionalFooterNav />
          </SessionProvider>
        </ActivityProvider>
      </body>
    </html>
  );
}
