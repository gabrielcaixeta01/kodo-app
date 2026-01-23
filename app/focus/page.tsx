"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";
import { CircularProgress } from "@/components/ui/CircularProgress";

export default function FocusPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { activities, loading: activitiesLoading, updateActivity } = useActivities();
  const { currentSession, endSession, loading: sessionsLoading } = useSessions();

  const [mounted, setMounted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Espera montagem para evitar flicker
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Guard de auth
  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, mounted, router]);

  // Timer baseado no currentSession
  useEffect(() => {
    if (!currentSession) return;
    const start = new Date(currentSession.started_at).getTime();

    const tick = () => {
      setElapsedMs(Date.now() - start);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [currentSession]);

  const activity = activities.find((a) => a.id === currentSession?.activity_id);
  const expectedMinutes = activity?.estimated_time ?? 25;

  // Estados de carregamento
  if (!mounted || authLoading || activitiesLoading || sessionsLoading) {
    return (
      <main className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border border-neutral-800 p-4 sm:p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-neutral-800 rounded" />
          <div className="h-4 bg-neutral-800 rounded w-2/3" />
          <div className="h-24 bg-neutral-800 rounded" />
        </div>
      </main>
    );
  }

  // Sem sessão em andamento
  if (!currentSession) {
    return (
      <main className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border border-neutral-800 p-6 space-y-4 text-center">
          <p className="text-sm text-neutral-300">Nenhuma sessão em andamento.</p>
          <button
            className="w-full rounded-xl bg-white text-black py-2 font-medium"
            onClick={() => router.replace("/dashboard")}
          >
            Voltar ao dashboard
          </button>
        </div>
      </main>
    );
  }

  const minutesElapsed = Math.floor(elapsedMs / 60000);
  const progressValue = Math.min(100, (elapsedMs / (expectedMinutes * 60000)) * 100);

  const handleComplete = async () => {
    await endSession("completed", minutesElapsed);
    if (activity) await updateActivity(activity.id, { status: "completed" });
    router.replace("/progress");
  };

  const handleInterrupt = async () => {
    await endSession("interrupted", minutesElapsed);
    if (activity) await updateActivity(activity.id, { status: "interrupted" });
    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-neutral-800 p-4 sm:p-6 space-y-6">
        <h1 className="text-lg sm:text-xl font-medium">Sessão de foco</h1>

        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-neutral-400">Atividade atual</p>
          <p className="text-base sm:text-lg font-medium break-words">
            {activity?.title || currentSession.title}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 items-center">
          <div className="flex items-center justify-center py-2">
            <CircularProgress
              value={progressValue}
              label={`meta: ${expectedMinutes} min`}
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-neutral-400">Tempo</p>
            <p className="text-base sm:text-lg font-medium">
              {minutesElapsed} min
            </p>
            <p className="text-xs text-neutral-500">
              {Math.floor((elapsedMs % 60000) / 1000)}s
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleComplete}
            className="w-full rounded-xl border border-green-500/40 py-2.5 sm:py-2 text-sm sm:text-base text-green-400 hover:border-green-500 hover:text-green-300 transition font-medium"
          >
            Concluir sessão
          </button>

          <button
            onClick={handleInterrupt}
            className="w-full rounded-xl border border-yellow-500/40 py-2.5 sm:py-2 text-sm sm:text-base text-yellow-400 hover:border-yellow-500 hover:text-yellow-300 transition font-medium"
          >
            Interromper sessão
          </button>
        </div>
      </div>
    </main>
  );
}
