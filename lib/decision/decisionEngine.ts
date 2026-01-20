// lib/decision/decisionEngine.ts

export type EnergyLevel = "low" | "medium" | "high";

export type Action = {
  id: string;
  title: string;
  estimatedTime: number; // minutes
  daysToDeadline?: number;
  impact: "baixa" | "média" | "alta";
  relatedPaths: number;
  energyRequired: EnergyLevel;
};

const impactScore = {
  baixa: 0.4,
  média: 0.7,
  alta: 1.0,
};

const energyMatrix: Record<
  EnergyLevel,
  Record<EnergyLevel, number>
> = {
  high: { high: 1.0, medium: 0.9, low: 0.6 },
  medium: { high: 0.7, medium: 1.0, low: 0.8 },
  low: { high: 0.3, medium: 0.6, low: 1.0 },
};

function urgency(days?: number) {
  if (days === undefined) return 0.1;
  return 1 / (days + 1);
}

export function decideNextAction(
  actions: Action[],
  context: {
    energy: EnergyLevel;
    availableTime: number;
  }
) {
  const scored = actions
    .filter(a => a.estimatedTime <= context.availableTime)
    .map(action => {
      const U = urgency(action.daysToDeadline);
      const I = impactScore[action.impact];
      const A = 1 + action.relatedPaths * 0.3;
      const E = energyMatrix[context.energy][action.energyRequired];

      const score = U * I * A * E;

      return { action, score };
    });

  if (scored.length === 0) return null;

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];

  return {
    ...best.action,
    score: best.score,
    reason:
      "High impact, upcoming deadline and aligned with your main path.",
  };
}
