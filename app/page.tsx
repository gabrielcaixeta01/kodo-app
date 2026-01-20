"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { useActivities } from "@/contexts/ActivityContext";
import { getRankedActions } from "@/lib/decision/getRankedActions";
import { activityToAction } from "@/lib/decision/activityToAction";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { startSession, session } = useSession();
  const { activities } = useActivities();
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

  const actions = mounted ? activities.map(activityToAction) : [];
  const rankedActions = mounted ? getRankedActions(actions, context) : [];
  const nextAction = rankedActions[0];
  const otherActions = rankedActions.slice(1);

  function handleStart(title: string) {
    startSession(title);
    router.push("/session");
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-medium">Atividades</h1>
          <p className="text-sm text-neutral-400">Decida o que fazer agora</p>
        </header>

        {/* Skeleton Loader */}
        {!mounted && (
          <div className="rounded-2xl border border-neutral-700 p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-neutral-700 rounded w-32"></div>
            <div className="h-6 bg-neutral-700 rounded w-48"></div>
            <div className="h-4 bg-neutral-700 rounded w-40"></div>
          </div>
        )}

        {/* Empty state */}
        {mounted && rankedActions.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nenhuma atividade disponível. Adicione atividades em Estudos.
          </p>
        )}

        {/* Next Right Action */}
        {mounted && nextAction && (
          <section className="rounded-2xl border border-neutral-700 p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">
              Atividade recomendada
            </h2>

            <p className="text-lg font-medium">{nextAction.title}</p>

            <p className="text-sm text-neutral-500">
              Tempo estimado: {nextAction.estimatedTime} min
            </p>

            <button
              onClick={() => handleStart(nextAction.title)}
              disabled={!!session}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-white/40 transition disabled:opacity-50"
            >
              Iniciar sessão de foco
            </button>
          </section>
        )}

        {/* Other good options */}
        {mounted && otherActions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              Outras boas opções
            </h2>

            {otherActions.map(action => (
              <div
                key={action.id}
                className="rounded-xl border border-neutral-800 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-neutral-500">
                    {action.estimatedTime} min · {action.energyRequired} energia
                  </p>
                </div>

                <button
                  onClick={() => handleStart(action.title)}
                  disabled={!!session}
                  className="text-xs text-neutral-400 hover:text-white transition disabled:opacity-50"
                >
                  Iniciar atividade
                </button>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
