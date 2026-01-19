import { Action, Energy } from "@/types/action";

type Context = {
  availableTime: number;
  energy: Energy;
};

function urgency(days?: number) {
  if (days === undefined) return 0.2;
  return 1 / (days + 1);
}

function impactWeight(impact: Action["impact"]) {
  switch (impact) {
    case "high":
      return 1.0;
    case "medium":
      return 0.7;
    case "low":
      return 0.4;
  }
}

function alignmentWeight(paths: number) {
  return 1 + paths * 0.3;
}

function energyMatch(
  current: Energy,
  required: Energy
) {
  if (current === required) return 1.0;
  if (current === "high" && required === "medium") return 0.9;
  if (current === "medium" && required === "high") return 0.7;
  if (current === "low" && required === "high") return 0.3;
  return 0.8;
}

export function calculateScore(
  action: Action,
  context: Context
) {
  const U = urgency(action.daysToDeadline);
  const I = impactWeight(action.impact);
  const A = alignmentWeight(action.relatedPaths);
  const E = energyMatch(
    context.energy,
    action.energyRequired
  );

  return U * I * A * E;
}
