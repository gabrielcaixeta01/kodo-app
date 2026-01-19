import type { Metadata } from "next";
import "./globals.css";
import { FooterNav } from "@/components/layout/FooterNav";


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
        {children}
        <FooterNav />
      </body>
    </html>
  );
}
