"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Chamar getUser() na montagem para obter sessão existente
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    initAuth();

    // ✅ Escutar mudanças de autenticação em tempo real
    // Isso é disparado quando:
    // - Usuário faz login
    // - Usuário faz logout
    // - Sessão expira
    // - Token é refrescado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Não resetar loading aqui, apenas atualizar user
        setUser(session?.user ?? null);
        // Quando o user muda, o proxy.ts vai redirecionar automaticamente
        // se a rota não for pública
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // proxy.ts vai redirecionar para /login automaticamente
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}