import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (typeof window === "undefined") return null;

  // ✅ Retorna a instância existente se já foi criada (singleton)
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase env vars missing");
    return null;
  }

  // ✅ Cria uma única instância e armazena
  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}
