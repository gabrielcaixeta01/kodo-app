"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const code = useMemo(() => searchParams.get("code"), [searchParams]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase não configurado. Verifique o .env.local");
      setReady(true);
      return;
    }

    // Alguns setups do Supabase enviam ?code= (PKCE). Outros usam hash.
    // Aqui a gente suporta o caso do ?code= (o mais comum hoje).
    (async () => {
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) setError(error.message || "Link inválido/expirado.");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao validar link.");
      } finally {
        setReady(true);
      }
    })();
  }, [code]);

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (password.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");
    if (password !== confirm) return setError("As senhas não conferem.");

    const supabase = getSupabaseClient();
    if (!supabase) return setError("Supabase não configurado.");

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message || "Erro ao atualizar senha.");
        setLoading(false);
        return;
      }

      setSuccess("Senha atualizada com sucesso! Você já pode entrar.");
      setTimeout(() => router.replace("/login"), 900);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao atualizar senha.");
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 animate-pulse">
          <div className="h-5 w-40 bg-white/10 rounded" />
          <div className="mt-3 h-4 w-56 bg-white/10 rounded" />
          <div className="mt-6 h-10 bg-white/10 rounded-2xl" />
          <div className="mt-3 h-10 bg-white/10 rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
              <KeyIcon className="h-4 w-4" />
              <span>Nova senha</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">Redefinir senha</h1>
            <p className="text-sm text-neutral-400">Crie uma senha nova para sua conta.</p>
          </div>

          <form
            onSubmit={handleUpdatePassword}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)] overflow-hidden"
          >
            <div className="pointer-events-none h-14 bg-linear-to-b from-white/10 to-transparent" />

            <div className="-mt-8 p-5 sm:p-6 space-y-4">
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-300 mt-0.5" />
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-300 mt-0.5" />
                    <p className="text-sm text-emerald-200">{success}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs text-neutral-500">Nova senha</label>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 focus-within:border-white/20 focus-within:bg-black/25 transition">
                  <LockClosedIcon className="h-5 w-5 text-neutral-400" />
                  <input
                    type="password"
                    placeholder="mín. 6 caracteres"
                    className="w-full bg-transparent outline-none text-sm text-neutral-100 placeholder:text-neutral-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-500">Confirmar senha</label>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 focus-within:border-white/20 focus-within:bg-black/25 transition">
                  <LockClosedIcon className="h-5 w-5 text-neutral-400" />
                  <input
                    type="password"
                    placeholder="repita a senha"
                    className="w-full bg-transparent outline-none text-sm text-neutral-100 placeholder:text-neutral-600"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={[
                  "relative w-full rounded-2xl py-3 text-sm font-medium",
                  "bg-white text-black",
                  "hover:opacity-95 transition",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {loading ? "Salvando..." : "Atualizar senha"}
              </button>

              <button
                type="button"
                onClick={() => router.replace("/login")}
                className="w-full text-xs text-neutral-400 hover:text-neutral-200 transition"
              >
                Voltar para login
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}