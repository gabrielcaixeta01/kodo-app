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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { activities, loading: activitiesLoading, updateActivity } =
    useActivities();
  const { startSession } = useSessions();

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
    () => activities.filter((a) => a.status === "pending"),
    [activities]
  );

  const actions = useMemo(
    () => pendingActivities.map(activityToAction),
    [pendingActivities]
  );

  const rankedActions = useMemo(
    () => getRankedActions(actions, context),
    [actions, context]
  );

  const nextAction = rankedActions[0];
  const otherActions = rankedActions.slice(1);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-neutral-700 p-6 animate-pulse">
            <div className="h-6 bg-neutral-800 rounded w-1/3 mb-4" />
            <div className="h-24 bg-neutral-800 rounded" />
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
      updateActivity(activityId, { status: "in_progress" });
      await startSession(activityId, title);
      router.push("/focus"); // confirme que existe
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao iniciar sessão"
      );
    } finally {
      setStarting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-medium">Dashboard</h1>
          <p className="text-sm text-neutral-400">
            Decida o que fazer agora
          </p>
        </header>

        <MonthCalendar />

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {activitiesLoading && (
          <div className="rounded-2xl border border-neutral-700 p-6 animate-pulse">
            <div className="h-24 bg-neutral-800 rounded" />
          </div>
        )}

        {!activitiesLoading && rankedActions.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nenhuma atividade ainda.
          </p>
        )}

        {!activitiesLoading && nextAction && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-300">
              Próxima ação recomendada
            </h2>

            <ActivityCard
              activity={nextAction.activity}
              isHighlighted
              onStart={() =>
                handleStart(
                  nextAction.activity.id,
                  nextAction.activity.title
                )
              }
            />
          </section>
        )}

        {!activitiesLoading && otherActions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-300">
              Outras atividades
            </h2>

            {otherActions.map((action) => (
              <ActivityCard
                key={action.activity.id}
                activity={action.activity}
                onStart={() =>
                  handleStart(
                    action.activity.id,
                    action.activity.title
                  )
                }
              />
            ))}
          </section>
        )}

        <WeeklyActivityChart />
      </div>
    </main>
  );
}
