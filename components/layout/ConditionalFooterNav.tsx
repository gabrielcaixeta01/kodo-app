"use client";

import { useSession } from "@/contexts/SessionContext";
import { FooterNav } from "./FooterNav";

export function ConditionalFooterNav() {
  const { session } = useSession();

  // Se houver sessão ativa, não mostrar navegação
  if (session) return null;

  return <FooterNav />;
}
