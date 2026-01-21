"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { useActivities } from "@/contexts/ActivityContext";
import { getRankedActions } from "@/lib/decision/getRankedActions";
import { activityToAction } from "@/lib/decision/activityToAction";
import { useEffect, useState } from "react";
import { MonthCalendar } from "@/components/ui/MonthCalendar";
import { WeeklyActivityChart } from "@/components/ui/WeeklyActivityChart";

export default function DashboardPage() {
  const router = useRouter();
  const { startSession, session, interrupted, resumeSession, history } = useSession();
  const { activities, updateActivity } = useActivities();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const context = {
    availableTime: 60,
    energy: "média" as const,
  };

  // Filtra apenas atividades pendentes para recomendar
  const pendingActivities = mounted ? activities.filter(a => a.status === "pending") : [];
  const actions = pendingActivities.map(activityToAction);
  const rankedActions = mounted ? getRankedActions(actions, context) : [];
  const nextAction = rankedActions[0];
  const otherActions = rankedActions.slice(1);

  function handleStart(activityId: string, title: string) {
    // Marca atividade como in_progress
    updateActivity(activityId, { status: "in_progress" });
    startSession(title, activityId);
    router.push("/session");
  }

  // Sincroniza status das atividades com sessões interrompidas
  useEffect(() => {
    if (!mounted) return;
    interrupted.forEach(int => {
      if (int.activityId) {
        const activity = activities.find(a => a.id === int.activityId);
        if (activity && activity.status !== "interrupted") {
          updateActivity(int.activityId, { status: "interrupted" });
        }
      }
    });
  }, [interrupted, mounted, activities, updateActivity]);

  // Sincroniza status das atividades com histórico
  useEffect(() => {
    if (!mounted) return;
    history.forEach(comp => {
      if (comp.activityId) {
        const activity = activities.find(a => a.id === comp.activityId);
        if (activity && activity.status !== "completed") {
          updateActivity(comp.activityId, { status: "completed" });
        }
      }
    });
  }, [history, mounted, activities, updateActivity]);

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-20">
      <div className="max-w-3xl w-full mx-auto space-y-6 sm:space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-xl sm:text-2xl font-medium">Dashboard</h1>
          <p className="text-xs sm:text-sm text-neutral-400">Decida o que fazer agora</p>
        </header>

        
        <MonthCalendar />

        {/* Skeleton Loader */}
        {!mounted && (
          <div className="rounded-2xl border border-neutral-700 p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-neutral-700 rounded w-32"></div>
            <div className="h-6 bg-neutral-700 rounded w-48"></div>
            <div className="h-4 bg-neutral-700 rounded w-40"></div>
          </div>
        )}

        {/* Empty state */}
        {mounted && rankedActions.length === 0 && interrupted.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nenhuma atividade. Crie uma nova em &quot;Atividades&quot;.
          </p>
        )}

        {/* Interrupted sessions */}
        {mounted && interrupted.length > 0 && (
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              Sessões interrompidas
            </h2>

            {interrupted.map(item => (
              <div
                key={item.id}
                className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3 sm:p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-yellow-200 text-sm sm:text-base truncate">{item.actionTitle}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Interrompida em {new Date(item.interruptedAt).toLocaleDateString()} às {new Date(item.interruptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-lg font-bold text-yellow-400">{item.completionPercentage}%</p>
                    <p className="text-xs text-neutral-500">completo</p>
                  </div>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.completionPercentage}%` }}
                  />
                </div>
                <button
                  onClick={() => {
                    resumeSession(item.id);
                    router.push("/session");
                  }}
                  disabled={!!session}
                  className="w-full rounded-xl border border-yellow-500/40 py-2.5 sm:py-2 text-sm sm:text-base text-yellow-400 hover:border-yellow-500 hover:text-yellow-300 transition disabled:opacity-50 font-medium"
                >
                  Continuar
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Next Right Action */}
        {mounted && nextAction && (
          <section className="rounded-2xl border border-neutral-700 p-4 sm:p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">
              Atividade recomendada
            </h2>

            <p className="text-base sm:text-lg font-medium">{nextAction.title}</p>

            <p className="text-xs sm:text-sm text-neutral-500">
              Tempo estimado: {nextAction.estimatedTime} min
            </p>

            <button
              onClick={() => handleStart(nextAction.id, nextAction.title)}
              disabled={!!session}
              className="w-full rounded-xl border border-white/20 px-4 py-2.5 sm:py-2 text-sm sm:text-base hover:border-white/40 transition disabled:opacity-50 font-medium"
            >
              Iniciar sessão de foco
            </button>
          </section>
        )}

        

        {/* Other good options */}
        {mounted && otherActions.length > 0 && (
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              Outras boas opções
            </h2>

            {otherActions.map(action => (
              <div
                key={action.id}
                className="rounded-xl border border-neutral-800 p-3 sm:p-4 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{action.title}</p>
                  <p className="text-xs text-neutral-500">
                    {action.estimatedTime} min · {action.energyRequired} energia
                  </p>
                </div>

                <button
                  onClick={() => handleStart(action.id, action.title)}
                  disabled={!!session}
                  className="text-xs sm:text-sm text-neutral-400 hover:text-white transition disabled:opacity-50 whitespace-nowrap font-medium px-2 sm:px-3 py-1.5 rounded hover:bg-neutral-900"
                >
                  Iniciar
                </button>
              </div>
            ))}
          </section>
        )}

        <WeeklyActivityChart />
      </div>
    </main>
  );
}
