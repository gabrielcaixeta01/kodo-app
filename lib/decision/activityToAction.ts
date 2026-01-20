import { Activity } from "@/types/activity";
import { Action } from "@/types/action";

export function activityToAction(
  activity: Activity
): Action {
  return {
    id: activity.id,
    title: activity.title,
    estimatedTime:
      activity.difficulty === "alta"
        ? 60
        : activity.difficulty === "média"
        ? 40
        : 20,
    impact:
      activity.priority === "alta"
        ? "alta"
        : activity.priority === "média"
        ? "média"
        : "baixa",
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
      activity.difficulty === "alta"
        ? "alta"
        : activity.difficulty === "média"
        ? "média"
        : "baixa",
  };
}
