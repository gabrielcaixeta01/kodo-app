"use client";

import { Activity } from "@/types/activity";
import { PlayIcon } from "@heroicons/react/24/solid";

interface Props {
  activity: Activity;
  onStart: () => void;
  isHighlighted?: boolean;
}

export function ActivityCard({ activity, onStart, isHighlighted }: Props) {
  const difficultyColors: Record<string, string> = {
    baixa: "bg-green-900/30 text-green-300",
    média: "bg-yellow-900/30 text-yellow-300",
    alta: "bg-red-900/30 text-red-300",
  };

  const priorityColors: Record<string, string> = {
    baixa: "text-blue-400",
    média: "text-orange-400",
    alta: "text-red-400",
  };

  const energyLabels: Record<string, string> = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  };

  return (
    <div
      className={`
        rounded-2xl border p-4 sm:p-5 transition
        ${
          isHighlighted
            ? "border-white bg-neutral-900/80 ring-2 ring-white/20"
            : "border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/60"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-medium text-white">
            {activity.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {activity.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-lg ${difficultyColors[activity.difficulty]}`}>
                {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
              </span>
            )}
            <span className={`text-xs font-medium ${priorityColors[activity.priority]}`}>
              Prioridade: {activity.priority}
            </span>
            <span className="text-xs text-neutral-400">
              ⚡ {energyLabels[activity.energy_required]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs sm:text-sm text-neutral-400">
          ⏱️ {activity.estimated_time}min
          {activity.due_date && !isNaN(new Date(activity.due_date).getTime()) && (
            <>
              {" • "}
              <span>
                Vence:{" "}
                {new Date(activity.due_date).toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>
        <button
          onClick={onStart}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg
            font-medium text-sm transition
            ${
              isHighlighted
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-neutral-800 text-white hover:bg-neutral-700"
            }
          `}
        >
          <PlayIcon className="w-4 h-4" />
          Iniciar
        </button>
      </div>
    </div>
  );
}
