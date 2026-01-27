// app/settings/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Cog6ToothIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
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

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

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

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwLoading) return;

    setPwError(null);
    setPwSuccess(null);

    if (!user?.email) {
      setPwError("Sessão inválida. Faça login novamente.");
      return;
    }

    if (newPassword.length < 6) {
      setPwError("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError("As senhas não conferem.");
      return;
    }

    if (currentPassword === newPassword) {
      setPwError("A nova senha precisa ser diferente da senha atual.");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setPwError("Supabase não configurado. Verifique o .env.local.");
      return;
    }

    setPwLoading(true);

    try {
      // 1) Reautentica (confere senha atual)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        setPwError("Senha atual incorreta.");
        setPwLoading(false);
        return;
      }

      // 2) Atualiza senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPwError(updateError.message || "Erro ao atualizar senha.");
        setPwLoading(false);
        return;
      }

      setPwSuccess("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      window.setTimeout(() => setPwSuccess(null), 2500);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Erro ao atualizar senha.");
    } finally {
      setPwLoading(false);
    }
  }

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
              <span>Configurações</span>
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

            {/* Security: change password */}
            <section className="rounded-3xl border border-white/10 bg-black/20 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <KeyIcon className="h-5 w-5 text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-neutral-400">
                      Segurança
                    </p>
                    <p className="mt-1 text-sm text-neutral-200">Alterar senha</p>
                  </div>
                </div>

                <span className="text-[11px] text-neutral-400 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
                  Requer senha atual
                </span>
              </div>

              <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
                {pwError && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-300 mt-0.5" />
                      <p className="text-sm text-red-200">{pwError}</p>
                    </div>
                  </div>
                )}

                {pwSuccess && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-300 mt-0.5" />
                      <p className="text-sm text-emerald-200">{pwSuccess}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs text-neutral-500">Senha atual</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-700 outline-none focus:border-white/20 transition"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs text-neutral-500">Nova senha</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="mín. 6 caracteres"
                      className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-700 outline-none focus:border-white/20 transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-neutral-500">Confirmar</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="repita a senha"
                      className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-700 outline-none focus:border-white/20 transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                  <p className="text-xs text-neutral-500">
                    Você continuará logado após alterar a senha.
                  </p>

                  <button
                    type="submit"
                    disabled={pwLoading}
                    className={[
                      "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium",
                      "bg-white text-black hover:opacity-95 transition",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                    ].join(" ")}
                  >
                    {pwLoading ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            </section>

            {/* Error (sign out) */}
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
      </div>
    </main>
  );
}