"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";
import { MonthCalendar } from "@/components/ui/MonthCalendar";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { WeeklyActivityChart } from "@/components/ui/WeeklyActivityChart";
import { activityToAction, getRankedActions } from "@/lib/ranking";
import {
  BoltIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { activities, loading: activitiesLoading, updateActivity, deleteActivity } =
    useActivities();
  const { startSession, sessions } = useSessions();

  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const context = useMemo(
    () => ({
      availableTime: 60,
      energy: "média" as const,
    }),
    []
  );

  const pendingActivities = useMemo(
    () => activities.filter((a) => a.status === "pending" || a.status === "interrupted"),
    [activities]
  );

  const actions = useMemo(() => pendingActivities.map(activityToAction), [pendingActivities]);

  const rankedActions = useMemo(() => getRankedActions(actions, context), [actions, context]);

  const nextAction = rankedActions[0];
  const otherActions = rankedActions.slice(1);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black text-white">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
          <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
        </div>

        <div className="relative mx-auto max-w-3xl p-4 sm:p-6 pb-24 sm:pb-20">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 animate-pulse">
            <div className="h-5 w-36 rounded bg-white/10" />
            <div className="mt-2 h-4 w-64 rounded bg-white/10" />
            <div className="mt-6 h-44 rounded-2xl bg-white/10" />
            <div className="mt-4 h-24 rounded-2xl bg-white/10" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  async function handleStart(activityId: string, title: string) {
    if (starting) return;

    setStarting(true);
    setError(null);

    try {
      const lastInterrupted = sessions.find(
        (s) => s.activity_id === activityId && s.status === "interrupted"
      );
      const resumeMinutes = lastInterrupted?.duration ?? 0;

      await updateActivity(activityId, { status: "in_progress" });
      await startSession(activityId, title, resumeMinutes);
      router.push("/focus");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao iniciar sessão");
    } finally {
      setStarting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-[35%] -left-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
      </div>

      <div className="relative mx-auto max-w-3xl p-4 sm:p-6 pb-40 sm:pb-32 space-y-6 sm:space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <BoltIcon className="h-4 w-4" />
            <span>Dashboard</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Decida o que fazer agora
              </h1>
              <p className="text-sm text-neutral-400">
                Próxima ação recomendada + visão rápida da semana.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-neutral-400 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
                Pendentes:{" "}
                <span className="text-neutral-200">{pendingActivities.length}</span>
              </span>
              <span className="text-xs text-neutral-400 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
                Ranking:{" "}
                <span className="text-neutral-200">{rankedActions.length}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Calendar card */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-200">
              <CalendarDaysIcon className="h-5 w-5 text-neutral-300" />
              <span>Calendário</span>
            </div>
            <span className="text-xs text-neutral-500">Planejamento rápido</span>
          </div>
          <div className="p-3 sm:p-6">
            <MonthCalendar />
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-300 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Loading activities */}
        {activitiesLoading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 animate-pulse">
            <div className="h-5 w-40 rounded bg-white/10" />
            <div className="mt-4 h-24 rounded-2xl bg-white/10" />
            <div className="mt-3 h-24 rounded-2xl bg-white/10" />
          </div>
        )}

        {/* Empty */}
        {!activitiesLoading && rankedActions.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center">
            <p className="text-sm text-neutral-200">Nenhuma atividade ainda.</p>
            <p className="mt-1 text-xs text-neutral-500">
              Crie uma atividade para o KODO sugerir a próxima ação.
            </p>
          </div>
        )}

        {/* Next action */}
        {!activitiesLoading && nextAction && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-neutral-500">
                Próxima ação recomendada
              </h2>
              <span className="text-[11px] text-neutral-400 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
                Top 1
              </span>
            </div>

            <ActivityCard
              activity={nextAction.activity}
              onStart={() => handleStart(nextAction.activity.id, nextAction.activity.title)}
              onDelete={deleteActivity}
            />
          </section>
        )}

        {/* Other actions */}
        {!activitiesLoading && otherActions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-neutral-500">
                Outras atividades
              </h2>
              <span className="text-[11px] text-neutral-400 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
                {otherActions.length} itens
              </span>
            </div>

            <div className="space-y-3">
              {otherActions.map((action) => (
                <ActivityCard
                  key={action.activity.id}
                  activity={action.activity}
                  onStart={() => handleStart(action.activity.id, action.activity.title)}
                  onDelete={deleteActivity}
                />
              ))}
            </div>
          </section>
        )}

        {/* Weekly chart */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-200">
              <ChartBarIcon className="h-5 w-5 text-neutral-300" />
              <span>Semana</span>
            </div>
            <span className="text-xs text-neutral-500">Visão geral</span>
          </div>

          <div className="p-3 sm:p-6">
            <WeeklyActivityChart />
          </div>

          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-xs text-neutral-500">
              Dica: escolha uma sessão curta para ganhar tração.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}