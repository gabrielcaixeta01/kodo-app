import { decideNextAction, Action } from "@/lib/decision/decisionEngine";
import { NextActionCard } from "@/components/dashboard/NextActionCard";

export default function DashboardPage() {
  const actions: Action[] = [
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
      title: "Light calculus revision",
      estimatedTime: 30,
      impact: "medium",
      relatedPaths: 1,
      energyRequired: "low",
    },
    {
      id: "3",
      title: "Organize project notes",
      estimatedTime: 25,
      impact: "low",
      relatedPaths: 0,
      energyRequired: "low",
    },
  ];

  const context = {
    energy: "medium" as const,
    availableTime: 60,
  };

  const nextAction = decideNextAction(actions, context);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto">
        {nextAction ? (
          <NextActionCard
            title={nextAction.title}
            estimatedTime={nextAction.estimatedTime}
            energyRequired={nextAction.energyRequired}
            reason={nextAction.reason}
          />
        ) : (
          <p className="text-neutral-500">
            No clear action right now.
          </p>
        )}
      </div>
    </main>
  );
}
