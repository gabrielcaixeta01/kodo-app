import { Action, Energy } from "@/types/action";
import { calculateScore } from "./calculateScore";

export type ScoredAction = Action & {
  score: number;
};

type Context = {
  availableTime: number;
  energy: Energy;
};

export function getRankedActions(
  actions: Action[],
  context: Context,
  limit = 4
): ScoredAction[] {
  return actions
    .filter(
      action =>
        action.estimatedTime <= context.availableTime
    )
    .map(action => ({
      ...action,
      score: calculateScore(action, context),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
