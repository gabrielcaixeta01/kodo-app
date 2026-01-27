"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

function getHashParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  const hash = window.location.hash?.startsWith("#")
    ? window.location.hash.slice(1)
    : "";
  return new URLSearchParams(hash);
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = useMemo(() => searchParams.get("code"), [searchParams]);

  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1) Finaliza o login de recovery (code ou hash)
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase não configurado. Verifique o .env.local.");
      setReady(true);
      return;
    }

    (async () => {
      try {
        // Caso PKCE: vem ?code=
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setError("Link inválido ou expirado. Solicite novamente.");
          }
          setReady(true);
          return;
        }

        // Caso hash: vem #access_token=...&type=recovery
        const hashParams = getHashParams();
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (type === "recovery" && access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            setError("Link inválido ou expirado. Solicite novamente.");
          }

          // remove o hash pra não ficar exposto na URL
          window.history.replaceState({}, document.title, "/reset-password");
          setReady(true);
          return;
        }

        setError("Link inválido. Solicite novamente em “Esqueci a senha”.");
        setReady(true);
      } catch {
        setError("Erro ao validar link. Tente novamente.");
        setReady(true);
      }
    })();
  }, [code]);

  // 2) Atualiza senha
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (pw.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");
    if (pw !== confirm) return setError("As senhas não conferem.");

    const supabase = getSupabaseClient();
    if (!supabase) return setError("Supabase não configurado.");

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) {
        setError(error.message || "Erro ao atualizar senha.");
        setLoading(false);
        return;
      }

      setSuccess("Senha atualizada! Agora entre novamente.");
      // opcional: sair da sessão de recovery
      await supabase.auth.signOut();
      setTimeout(() => router.replace("/login"), 800);
    } catch {
      setError("Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 animate-pulse">
          <div className="h-5 w-44 bg-white/10 rounded" />
          <div className="mt-3 h-4 w-64 bg-white/10 rounded" />
          <div className="mt-6 h-11 bg-white/10 rounded-2xl" />
          <div className="mt-3 h-11 bg-white/10 rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-medium">Definir nova senha</h1>
        <p className="text-sm text-neutral-400">
          Crie uma nova senha para sua conta.
        </p>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">{success}</p>}

        <input
          type="password"
          placeholder="Nova senha"
          className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-2"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-2"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white text-black py-2 font-medium disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Atualizar senha"}
        </button>
      </form>
    </main>
  );
}