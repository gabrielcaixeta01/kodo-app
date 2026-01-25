"use client";

import { Activity } from "@/types/activity";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSwipeDelete } from "@/hooks/useSwipeDelete";

interface Props {
  activity: Activity;
  onStart?: () => void | Promise<void>;
  onDelete?: (id: string) => void;
}

export function ActivityCard({ activity, onStart, onDelete }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const isCompleted = activity.status === "completed";
  const isInterrupted = activity.status === "interrupted"; // ✅ continua aqui

  const {
    setRef,
    handleStart,
    handleMove,
    handleEnd,
  } = useSwipeDelete({
    onDelete: onDelete || (() => {}),
  });


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

  async function handleClick() {
    if (!onStart || isCompleted) return;
    setIsLoading(true);
    try {
      await onStart();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background delete */}
      <div className="absolute inset-0 flex items-center border-4 border-black justify-end pr-8 bg-red-500 rounded-2xl">
        <span className="text-white font-semibold text-sm">Deletar</span>
      </div>

      {/* Card */}
      <div
        ref={setRef(activity.id)}
        onPointerDown={(e) => handleStart(activity.id, e)}
        onPointerMove={(e) => handleMove(activity.id, e)}
        onPointerUp={() => handleEnd(activity.id)}
        onPointerCancel={() => handleEnd(activity.id)}
        className="relative rounded-2xl p-4 sm:p-5 bg-neutral-900 touch-pan-y select-none"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-medium text-white">
              {activity.title}
            </h3>

            {!isCompleted && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {isInterrupted && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-orange-900/30 text-orange-300 border border-orange-500/30">
                    Interrompida
                  </span>
                )}

                {activity.difficulty && (
                  <span
                    className={`text-xs px-2 py-1 rounded-lg ${difficultyColors[activity.difficulty]}`}
                  >
                    {activity.difficulty}
                  </span>
                )}

                <span
                  className={`text-xs font-medium ${priorityColors[activity.priority]}`}
                >
                  Prioridade: {activity.priority}
                </span>
              </div>
            )}
          </div>
        </div>

        {!isCompleted && (
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-neutral-400">
              {activity.estimated_time}min
            </div>

            {onStart && (
              <button
                onClick={handleClick}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition"
              >
                <PlayIcon className="w-4 h-4" />
                {isLoading
                  ? "Iniciando..."
                  : isInterrupted
                  ? "Retomar"
                  : "Iniciar"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
