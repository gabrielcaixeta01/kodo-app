"use client";

import { useAuth } from "@/contexts/AuthContext";
import { FooterNav } from "./FooterNav";
import { usePathname } from "next/navigation";

export function ConditionalFooterNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user || pathname === "/focus") return null;

  return <FooterNav />;
}
