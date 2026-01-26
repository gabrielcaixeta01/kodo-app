// app/settings/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Cog6ToothIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

function getInitials(email?: string | null) {
  if (!email) return "K";
  const name = email.split("@")[0] || "K";
  return name.slice(0, 1).toUpperCase();
}

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const initials = useMemo(() => getInitials(user?.email), [user?.email]);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);
    setError(null);

    try {
      await signOut();
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao sair");
      setSigningOut(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black text-white">
        {/* Subtle background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl p-4 sm:p-6 pb-24 sm:pb-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-64 rounded bg-white/10 animate-pulse" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="h-14 rounded-2xl bg-white/10 animate-pulse" />
              <div className="h-14 rounded-2xl bg-white/10 animate-pulse" />
              <div className="h-10 w-32 rounded-xl bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-[30%] -left-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
      </div>

      <div className="relative mx-auto max-w-3xl p-4 sm:p-6 pb-24 sm:pb-16 space-y-6 sm:space-y-10">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
              <Cog6ToothIcon className="h-4 w-4 text-neutral-300" />
              <span>Settings</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
              Configurações
            </h1>

            <p className="text-sm text-neutral-400">
              Controle como o KODO funciona para você
            </p>
          </div>
        </header>

        {/* Card */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]">
          {/* Top */}
          <div className="p-4 sm:p-6 flex items-center justify-between gap-4 border-b border-white/10">
            <div className="flex items-center gap-4 min-w-0">
              {/* Avatar */}
              <div className="h-12 w-12 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center">
                <span className="text-sm font-semibold text-white/90">
                  {initials}
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                  Conta
                </p>
                <p className="mt-1 text-sm text-neutral-200 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
              <ShieldCheckIcon className="h-4 w-4" />
              Sessão segura
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-5">
            {/* Info rows */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <EnvelopeIcon className="h-5 w-5 text-neutral-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-400">Email</p>
                    <p className="text-sm text-neutral-100 truncate">{user.email}</p>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
                  Principal
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <p className="text-xs text-neutral-500">
                Se você sair, precisará entrar novamente para acessar sua conta.
              </p>

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
                  "border border-red-500/25 bg-red-500/10 text-red-200",
                  "hover:bg-red-500/15 hover:border-red-500/35 transition",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {signingOut ? "Saindo..." : "Sair"}
              </button>
            </div>
          </div>
        </section>

        {/* Footer hint */}
        <div className="text-xs text-neutral-600">
          KODO • Configurações
        </div>
      </div>
    </main>
  );
}