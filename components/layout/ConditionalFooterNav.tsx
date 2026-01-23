"use client";

import { useAuth } from "@/contexts/AuthContext";
import { FooterNav } from "./FooterNav";

export function ConditionalFooterNav() {
  const { user } = useAuth();

  if (!user) return null;

  return <FooterNav />;
}
