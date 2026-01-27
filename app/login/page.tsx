"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  EnvelopeIcon,
  KeyIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type Mode = "login" | "recovery";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/reset-password`;
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError(
        "Erro de configuração: variáveis do Supabase não configuradas. Verifique o .env.local"
      );
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const msg = error.message?.toLowerCase() ?? "";
        if (msg.includes("confirm") || msg.includes("verified")) {
          setError("Confirme seu email antes de entrar (verifique a caixa de entrada).");
        } else {
          setError(error.message || "Email ou senha inválidos");
        }
        setLoading(false);
      }
      // AuthContext faz o redirect quando user atualizar
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
      setLoading(false);
    }
  }

  async function handleRecovery(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError(
        "Erro de configuração: variáveis do Supabase não configuradas. Verifique o .env.local"
      );
      setLoading(false);
      return;
    }

    try {
      // Envia email com link para /reset-password
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setError(error.message || "Erro ao enviar email de recuperação");
        setLoading(false);
        return;
      }

      setSuccess("Te enviei um email com o link para redefinir a senha.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar email de recuperação");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = mode === "login" ? handleLogin : handleRecovery;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background premium */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-[35%] -left-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
              <LockClosedIcon className="h-4 w-4" />
              <span>{mode === "login" ? "Acesso" : "Recuperação"}</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              {mode === "login" ? "Entrar" : "Redefinir senha"}
            </h1>

            <p className="text-sm text-neutral-400">
              {mode === "login"
                ? "Faça login para continuar no KODO."
                : "Digite seu email para receber o link de redefinição."}
            </p>
          </div>

          {/* Card */}
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)] overflow-hidden"
          >
            <div className="pointer-events-none h-14 bg-linear-to-b from-white/10 to-transparent" />

            <div className="-mt-8 p-5 sm:p-6 space-y-4">
              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-300 mt-0.5" />
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-300 mt-0.5" />
                    <p className="text-sm text-emerald-200">{success}</p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs text-neutral-500">Email</label>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 focus-within:border-white/20 focus-within:bg-black/25 transition">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-transparent outline-none text-sm text-neutral-100 placeholder:text-neutral-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password (only in login mode) */}
              {mode === "login" && (
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500">Senha</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 focus-within:border-white/20 focus-within:bg-black/25 transition">
                    <LockClosedIcon className="h-5 w-5 text-neutral-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none text-sm text-neutral-100 placeholder:text-neutral-600"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
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
                <span className="inline-flex items-center justify-center gap-2">
                  {mode === "login" ? (
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  ) : (
                    <KeyIcon className="h-5 w-5" />
                  )}
                  {loading
                    ? "Processando..."
                    : mode === "login"
                    ? "Entrar"
                    : "Enviar link"}
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </button>

              {/* Footer actions */}
              <div className="pt-2 flex items-center justify-between">
                {mode === "login" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("recovery");
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-xs text-neutral-400 hover:text-neutral-200 transition underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
                  >
                    Esqueci a senha
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-xs text-neutral-400 hover:text-neutral-200 transition"
                  >
                    Voltar para login
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="text-xs text-neutral-400 hover:text-neutral-200 transition"
                >
                  Criar conta
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}