"use client";

import { useSession } from "@/contexts/SessionContext";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionPage() {
  const { session, endSession, interruptSession } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const expectedMinutes = 60; // duração alvo da sessão

  // Redireciona se não houver sessão (após montagem)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // redireciona se não houver sessão
  useEffect(() => {
    if (!mounted) return;

    // Se não tem sessão após montagem, volta ao dashboard
    if (!session) {
      router.replace("/");
    }
  }, [mounted, session, router]);

  // controla o tempo (atualiza a cada segundo para progresso suave)
  useEffect(() => {
    if (!mounted || !session) return;

    function updateTime() {
      if (!session) return;
      const diff = Date.now() - session.startedAt;
      setElapsedMs(diff);
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [mounted, session]);

  // guarda de render
  if (!mounted) return null;
  if (!session) return null;

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-neutral-800 p-6 space-y-6">
        <h1 className="text-xl font-medium">
          Sessão de foco
        </h1>

        <div className="space-y-1">
          <p className="text-sm text-neutral-400">
            Atividade atual
          </p>
          <p className="text-lg font-medium">
            {session.actionTitle}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 items-center">
          <div className="flex items-center justify-center py-2">
            <CircularProgress
              value={Math.min(100, (elapsedMs / (expectedMinutes * 60000)) * 100)}
              label={`meta: ${expectedMinutes} min`}
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm text-neutral-400">Tempo</p>
            <p className="text-lg font-medium">
              {Math.floor(elapsedMs / 60000)} min
            </p>
            <p className="text-xs text-neutral-500">
              {Math.floor((elapsedMs % 60000) / 1000)}s
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              endSession();
              router.replace("/progress");
            }}
            className="w-full rounded-xl border border-green-500/40 py-2 text-sm text-green-400 hover:border-green-500 hover:text-green-300 transition"
          >
            Concluir sessão
          </button>

          <button
            onClick={() => {
              interruptSession();
              router.replace("/");
            }}
            className="w-full rounded-xl border border-yellow-500/40 py-2 text-sm text-yellow-400 hover:border-yellow-500 hover:text-yellow-300 transition"
          >
            Interromper sessão
          </button>
        </div>
      </div>
    </main>
  );
}
