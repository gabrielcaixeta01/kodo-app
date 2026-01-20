"use client";

import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionPage() {
  const { session, endSession, interruptSession } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

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

  // controla o tempo
  useEffect(() => {
    if (!mounted || !session) return;

    function updateTime() {
      if (!session) return;
      const diff = Date.now() - session.startedAt;
      setElapsedMinutes(Math.floor(diff / 60000));
    }

    updateTime();
    const interval = setInterval(updateTime, 60000);
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

        <p className="text-sm text-neutral-500">
          Tempo decorrido: {elapsedMinutes} min
        </p>

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
