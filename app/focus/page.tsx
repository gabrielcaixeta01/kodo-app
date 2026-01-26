/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";
import { CircularProgress } from "@/components/ui/CircularProgress";
import {
  BoltIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

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

  // Evita flicker
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Guard de auth
  useEffect(() => {
    if (mounted && !authLoading && !user) router.push("/login");
  }, [user, authLoading, mounted, router]);

  // Timer
  useEffect(() => {
    if (!currentSession) return;
    const start = new Date(currentSession.started_at).getTime();

    const tick = () => setElapsedMs(Date.now() - start);

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [currentSession]);

  const activity = useMemo(
    () => activities.find((a) => a.id === currentSession?.activity_id),
    [activities, currentSession?.activity_id]
  );

  // Captura a meta uma única vez por sessão
  useEffect(() => {
    if (activity?.estimated_time) setTargetMinutes(activity.estimated_time);
  }, [activity?.id, activity?.estimated_time]);

  const expectedMinutes = (targetMinutes ?? activity?.estimated_time) ?? 25;

  // Loading
  if (!mounted || authLoading || activitiesLoading || sessionsLoading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
          <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
        </div>

        <div className="relative p-4 sm:p-6 min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 animate-pulse">
            <div className="h-5 w-28 rounded bg-white/10" />
            <div className="h-4 w-56 rounded bg-white/10" />
            <div className="mt-4 h-52 rounded-2xl bg-white/10" />
            <div className="mt-4 h-10 rounded-2xl bg-white/10" />
            <div className="h-10 rounded-2xl bg-white/10" />
          </div>
        </div>
      </main>
    );
  }

  const minutesElapsed = elapsedMs / 60000;
  const progressValue = Math.min(100, (elapsedMs / (expectedMinutes * 60000)) * 100);

  const mm = Math.floor(elapsedMs / 60000);
  const ss = Math.floor((elapsedMs % 60000) / 1000);
  const timeLeftMs = Math.max(0, expectedMinutes * 60000 - elapsedMs);
  const leftMm = Math.floor(timeLeftMs / 60000);
  const leftSs = Math.floor((timeLeftMs % 60000) / 1000);

  const handleComplete = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      await endSession("completed", minutesElapsed);
      if (activity) await updateActivity(activity.id, { status: "completed" });
      router.replace("/progress");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao concluir sessão");
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
      setError(err instanceof Error ? err.message : "Erro ao interromper sessão");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-[35%] -left-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
      </div>

      <div className="relative p-4 sm:p-6 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-4">
          {/* Header pill */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
              <BoltIcon className="h-4 w-4" />
              <span>Modo foco</span>
            </div>

            <span className="text-[11px] text-neutral-400 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
              meta {expectedMinutes} min
            </span>
          </div>

          {/* Main card */}
          <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)] overflow-hidden">
            {/* top shine */}
            <div className="pointer-events-none h-16 bg-linear-to-b from-white/10 to-transparent" />

            <div className="px-6 pb-6 -mt-10 space-y-5">
              {/* Title */}
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-neutral-500">
                  Atividade
                </p>
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                  {activity?.title ?? "Sessão em andamento"}
                </h1>
                <p className="text-xs text-neutral-500">
                  Foque por pequenos blocos. Consistência &gt; intensidade.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-300 mt-0.5" />
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {/* Progress */}
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-center py-2">
                  <CircularProgress
                    value={progressValue}
                    text={`${mm} min`}
                    label={`restante: ${pad2(leftMm)}:${pad2(leftSs)}`}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Metric
                    label="Decorrido"
                    value={`${pad2(mm)}:${pad2(ss)}`}
                    icon={<ClockIcon className="h-4 w-4 text-neutral-400" />}
                  />
                  <Metric
                    label="Restante"
                    value={`${pad2(leftMm)}:${pad2(leftSs)}`}
                    icon={<ClockIcon className="h-4 w-4 text-neutral-400" />}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleComplete}
                  disabled={isProcessing}
                  className={[
                    "w-full inline-flex items-center justify-center gap-2",
                    "rounded-2xl py-3 text-sm font-medium",
                    "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
                    "hover:bg-emerald-500/15 hover:border-emerald-500/35 transition",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  {isProcessing ? "Processando..." : "Concluir sessão"}
                </button>

                <button
                  onClick={handleInterrupt}
                  disabled={isProcessing}
                  className={[
                    "w-full inline-flex items-center justify-center gap-2",
                    "rounded-2xl py-3 text-sm font-medium",
                    "border border-amber-500/25 bg-amber-500/10 text-amber-200",
                    "hover:bg-amber-500/15 hover:border-amber-500/35 transition",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  <PauseCircleIcon className="h-5 w-5" />
                  {isProcessing ? "Processando..." : "Interromper sessão"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 text-base font-semibold tracking-tight text-neutral-100">
        {value}
      </div>
    </div>
  );
}