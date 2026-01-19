import { Activity } from "@/types/activity";
import { Action } from "@/types/action";

export function activityToAction(
  activity: Activity
): Action {
  return {
    id: activity.id,
    title: activity.title,
    estimatedTime:
      activity.difficulty === "high"
        ? 60
        : activity.difficulty === "medium"
        ? 40
        : 20,
    impact:
      activity.priority === "high"
        ? "high"
        : activity.priority === "medium"
        ? "medium"
        : "low",
    daysToDeadline: activity.dueDate
      ? Math.max(
          0,
          Math.ceil(
            (activity.dueDate - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : undefined,
    relatedPaths: 1,
    energyRequired:
      activity.difficulty === "high"
        ? "high"
        : activity.difficulty === "medium"
        ? "medium"
        : "low",
  };
}
