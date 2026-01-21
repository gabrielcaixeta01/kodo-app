"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";
import { MonthCalendar } from "@/components/ui/MonthCalendar";
import { WeeklyActivityChart } from "@/components/ui/WeeklyActivityChart";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { activityToAction, getRankedActions } from "@/lib/ranking";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { activities, loading: activitiesLoading, updateActivity } = useActivities();
  const { startSession } = useSessions();
  const [mounted, setMounted] = useState(false);

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

  if (!mounted || authLoading) {
    return (
      <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-20">
        <div className="max-w-3xl w-full mx-auto">
          <div className="rounded-2xl border border-neutral-700 p-6 space-y-4 animate-pulse">
            <div className="h-8 bg-neutral-800 rounded-lg w-1/3" />
            <div className="h-24 bg-neutral-800 rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  const context = {
    availableTime: 60,
    energy: "média" as const,
  };

  // Filtra atividades pendentes
  const pendingActivities = activities.filter((a) => a.status === "pending");
  const actions = pendingActivities.map((activity) =>
    activityToAction(activity)
  );
  const rankedActions = getRankedActions(actions, context);
  const nextAction = rankedActions[0];
  const otherActions = rankedActions.slice(1);

  function handleStart(activityId: string, title: string) {
    updateActivity(activityId, { status: "in_progress" });
    startSession(activityId, title);
    router.push("/session");
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-20">
      <div className="max-w-3xl w-full mx-auto space-y-6 sm:space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-xl sm:text-2xl font-medium">Dashboard</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Decida o que fazer agora
          </p>
        </header>

        <MonthCalendar />

        {/* Skeleton Loader */}
        {activitiesLoading && (
          <div className="rounded-2xl border border-neutral-700 p-6 space-y-4 animate-pulse">
            <div className="h-24 bg-neutral-800 rounded-lg" />
          </div>
        )}

        {/* Empty state */}
        {!activitiesLoading && rankedActions.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nenhuma atividade. Crie uma nova em &quot;Atividades&quot;.
          </p>
        )}

        {/* Next Right Action */}
        {!activitiesLoading && nextAction && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-300">Próxima ação recomendada</h2>
            <ActivityCard
              activity={nextAction.activity}
              onStart={() => handleStart(nextAction.activity.id, nextAction.activity.title)}
              isHighlighted
            />
          </section>
        )}

        {/* Other Actions */}
        {!activitiesLoading && otherActions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-300">Outras atividades</h2>
            <div className="space-y-2">
              {otherActions.map((action) => (
                <ActivityCard
                  key={action.activity.id}
                  activity={action.activity}
                  onStart={() => handleStart(action.activity.id, action.activity.title)}
                />
              ))}
            </div>
          </section>
        )}

        <WeeklyActivityChart />
      </div>
    </main>
  );
}
