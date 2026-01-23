// app/settings/page.tsx

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Guard de autenticação
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // ✅ Loading visual enquanto autentica
  if (authLoading) {
    return (
      <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-16">
        <div className="max-w-3xl w-full mx-auto">
          <div className="rounded-2xl border border-neutral-800 p-6 animate-pulse">
            <div className="h-24 bg-neutral-800 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    // ✅ Evita múltiplos cliques
    if (signingOut) return;
    
    setSigningOut(true);
    setError(null);

    try {
      await signOut();
      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao sair"
      );
      setSigningOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-16">
      <div className="max-w-3xl w-full mx-auto space-y-6 sm:space-y-10">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-medium">Configurações</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Controle como o KODO funciona para você
          </p>
        </header>

        {/* User Info */}
        <section className="rounded-2xl border border-neutral-800 p-4 sm:p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Conta
          </h2>
          
          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Email</p>
            <p className="text-base">{user?.email}</p>
          </div>

          {/* ✅ Erro feedback */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signingOut ? "Saindo..." : "Sair"}
          </button>
        </section>
      </div>
    </main>
  );
}
                 