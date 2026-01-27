"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  UserPlusIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Se já estiver logado, manda pro dashboard
  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (!email.trim()) return setError("Informe um email válido.");
    if (password.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");
    if (password !== confirm) return setError("As senhas não conferem.");

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
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Erro ao criar conta");
        setLoading(false);
        return;
      }

      setSuccess("Conta criada! Verifique seu email para confirmar (se habilitado).");
      setEmail("");
      setPassword("");
      setConfirm("");

      // Se seu projeto não exigir confirmação de email, pode logar automaticamente.
      // Aqui mantemos simples: após um tempinho, manda pro login.
      setTimeout(() => router.replace("/login"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

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
              <UserPlusIcon className="h-4 w-4" />
              <span>Criar conta</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">Registrar</h1>
            <p className="text-sm text-neutral-400">
              Crie sua conta para começar a usar o KODO.
            </p>
          </div>

          {/* Card */}
          <form
            onSubmit={handleRegister}
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

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs text-neutral-500">Senha</label>
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

              {/* Confirm */}
              <div className="space-y-2">
                <label className="text-xs text-neutral-500">Confirmar senha</label>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 focus-within:border-white/20 focus-within:bg-black/25 transition">
                  <LockClosedIcon className="h-5 w-5 text-neutral-400" />
                  <input
                    type="password"
                    placeholder="repita sua senha"
                    className="w-full bg-transparent outline-none text-sm text-neutral-100 placeholder:text-neutral-600"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

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
                  <UserPlusIcon className="h-5 w-5" />
                  {loading ? "Criando..." : "Criar conta"}
                </span>

                {/* subtle shine */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </button>

              {/* Footer actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.replace("/login")}
                  className="text-xs text-neutral-400 hover:text-neutral-200 transition"
                >
                  Já tenho conta
                </button>

              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}