"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  // ✅ QUANDO o user existir → navegar
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou senha inválidos");
      setLoading(false);
    }
    // ❌ NÃO faz router.push aqui
    // O effect acima cuida disso quando o user chegar
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-medium">Entrar</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white text-black py-2 font-medium disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
