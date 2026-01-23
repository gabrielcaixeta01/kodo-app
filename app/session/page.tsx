"use client";

import { useAuth } from "@/contexts/AuthContext";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";

export default function SessionPage() {
   const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { activities, loading: activitiesLoading, updateActivity } = useActivities();
    const { startSession } = useSessions();
    const [mounted, setMounted] = useState(false);

  // Redireciona se não houver sessão (após montagem)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100); // pequeno atraso para evitar flicker

    return () => clearTimeout(timer);
    //
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, mounted, router]);

  

  // guarda de render
  if (!mounted) return null;
  if (!session) return null;

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-neutral-800 p-4 sm:p-6 space-y-6">
        <h1 className="text-lg sm:text-xl font-medium">
          Sessão de foco
        </h1>

        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-neutral-400">
            Atividade atual
          </p>
          <p className="text-base sm:text-lg font-medium break-words">
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

          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-neutral-400">Tempo</p>
            <p className="text-base sm:text-lg font-medium">
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
            className="w-full rounded-xl border border-green-500/40 py-2.5 sm:py-2 text-sm sm:text-base text-green-400 hover:border-green-500 hover:text-green-300 transition font-medium"
          >
            Concluir sessão
          </button>

          <button
            onClick={() => {
              interruptSession();
              router.replace("/");
            }}
            className="w-full rounded-xl border border-yellow-500/40 py-2.5 sm:py-2 text-sm sm:text-base text-yellow-400 hover:border-yellow-500 hover:text-yellow-300 transition font-medium"
          >
            Interromper sessão
          </button>
        </div>
      </div>
    </main>
  );
}
