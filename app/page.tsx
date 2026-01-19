"use client";

import { useSession } from "@/contexts/SessionContext";
import { getRankedActions } from "@/lib/decision/getRankedActions";
import { Action } from "@/types/action";

const ACTIONS: Action[] = [
  {
    id: "1",
    title: "Review Flip-Flop JK",
    estimatedTime: 45,
    daysToDeadline: 3,
    impact: "high",
    relatedPaths: 1,
    energyRequired: "medium",
  },
  {
    id: "2",
    title: "Read calculus notes",
    estimatedTime: 20,
    impact: "medium",
    relatedPaths: 1,
    energyRequired: "low",
  },
  {
    id: "3",
    title: "Work on ML project",
    estimatedTime: 90,
    daysToDeadline: 10,
    impact: "high",
    relatedPaths: 2,
    energyRequired: "high",
  },
  {
    id: "4",
    title: "Organize study materials",
    estimatedTime: 15,
    impact: "low",
    relatedPaths: 0,
    energyRequired: "low",
  },
];

export default function DashboardPage() {
  const { startSession, session } = useSession();

  // 🔹 contexto simples (MVP)
  const context = {
    availableTime: 60, // depois vem do usuário
    energy: "medium" as const,
  };

  const rankedActions = getRankedActions(
    ACTIONS,
    context
  );

  const nextAction = rankedActions[0];
  const otherActions = rankedActions.slice(1);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-medium">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-400">
            Decide what to do now
          </p>
        </header>

        {/* Next Right Action */}
        {nextAction && (
          <section className="rounded-2xl border border-neutral-700 p-6 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-400">
              Next right action
            </h2>

            <p className="text-lg font-medium">
              {nextAction.title}
            </p>

            <p className="text-sm text-neutral-500">
              Estimated time: {nextAction.estimatedTime} min
            </p>

            <button
              onClick={() =>
                startSession(nextAction.title)
              }
              disabled={!!session}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-white/40 transition"
            >
              Start focus session
            </button>
          </section>
        )}

        {/* Other good options */}
        {otherActions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              Other good options
            </h2>

            {otherActions.map(action => (
              <div
                key={action.id}
                className="rounded-xl border border-neutral-800 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {action.title}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {action.estimatedTime} min ·{" "}
                    {action.energyRequired} energy
                  </p>
                </div>

                <button
                  onClick={() =>
                    startSession(action.title)
                  }
                  disabled={!!session}
                  className="text-xs text-neutral-400 hover:text-white transition"
                >
                  Start anyway
                </button>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
