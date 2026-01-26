/* eslint-disable react-hooks/set-state-in-effect */
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetMinutes, setTargetMinutes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  // Capture target minutes once per session/activity to avoid fallback to 25 during teardown
  useEffect(() => {
    if (activity?.estimated_time) {
      setTargetMinutes(activity.estimated_time);
    }
  }, [activity?.id, activity?.estimated_time]);

  const expectedMinutes = (targetMinutes ?? activity?.estimated_time) ?? 25;

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

  const minutesElapsed = elapsedMs / 60000;
  const progressValue = Math.min(100, (elapsedMs / (expectedMinutes * 60000)) * 100);

  const handleComplete = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      await endSession("completed", minutesElapsed);
      if (activity) await updateActivity(activity.id, { status: "completed" });
      router.replace("/progress");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao concluir sessão"
      );
      setIsProcessing(false);
    }
  };

  const handleInterrupt = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      await endSession("interrupted", minutesElapsed);
      if (activity) await updateActivity(activity.id, { status: "interrupted" });
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao interromper sessão"
      );
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-neutral-800 p-6 space-y-6">
        {/* ✅ Feedback de erro */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-center py-2">
          <CircularProgress
            value={progressValue}
            text={`${Math.floor(minutesElapsed)} min`}
            label={`meta: ${expectedMinutes} min`}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-neutral-400">Tempo</p>
          <p className="text-base sm:text-lg font-medium">
            {Math.floor(minutesElapsed)} min
          </p>
          <p className="text-xs text-neutral-500">
            {Math.floor((elapsedMs % 60000) / 1000)}s
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleComplete}
            disabled={isProcessing}
            className="w-full rounded-xl border border-green-500/40 py-2.5 sm:py-2 text-sm sm:text-base text-green-400 hover:border-green-500 hover:text-green-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processando..." : "Concluir sessão"}
          </button>

          <button
            onClick={handleInterrupt}
            disabled={isProcessing}
            className="w-full rounded-xl border border-yellow-500/40 py-2.5 sm:py-2 text-sm sm:text-base text-yellow-400 hover:border-yellow-500 hover:text-yellow-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processando..." : "Interromper sessão"}
          </button>
        </div>
      </div>
    </main>
  );
}
