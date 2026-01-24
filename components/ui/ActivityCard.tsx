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
  const isInterrupted = activity.status === "interrupted";

  const {
    offsets,
    deletingIds,
    handleStart,
    handleMove,
    handleEnd,
  } = useSwipeDelete({
    onDelete: onDelete || (() => {}),
  });

  const offset = offsets[activity.id] || 0;
  const isDeleting = deletingIds.has(activity.id);
  
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
    <div className="relative">
      {/* Background de deletar - só aparece quando offset < 0 */}
      {offset < 0 && (
        <div className="absolute inset-0 flex items-center justify-end pr-8 bg-red-500 rounded-2xl">
          <span className="text-white font-semibold text-sm">Deletar</span>
        </div>
      )}

      {/* Card principal */}
      <div
        className={'relative rounded-2xl  p-4 sm:p-5  bg-neutral-900 ring-2 ring-white/20  hover:bg-neutral-900'}
        style={{
          transform: `translateX(${isDeleting ? '-100vw' : offset}px)`,
          transition: isDeleting 
            ? "transform 0.3s cubic-bezier(0.4, 0, 1, 1), opacity 0.3s ease-out" 
            : offset === 0 
            ? "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)" 
            : "none",
          opacity: isDeleting ? 0 : 1,
        }}
        onTouchStart={(e) => handleStart(activity.id, e)}
        onTouchMove={(e) => handleMove(activity.id, e)}
        onTouchEnd={() => handleEnd(activity.id)}
        onMouseDown={(e) => handleStart(activity.id, e)}
        onMouseMove={(e) => handleMove(activity.id, e)}
        onMouseUp={() => handleEnd(activity.id)}
        onMouseLeave={() => handleEnd(activity.id)}
      >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-medium text-white">
            {activity.title}
          </h3>
          {isCompleted ? (
            <div className="text-sm text-neutral-400">Concluída</div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {isInterrupted && (
                <span className="text-xs px-2 py-1 rounded-lg bg-orange-900/30 text-orange-300 border border-orange-500/30">
                  Interrompida
                </span>
              )}
              {activity.difficulty && (
                <span className={`text-xs px-2 py-1 rounded-lg ${difficultyColors[activity.difficulty]}`}>
                  {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
              </span>
            )}
              <span className={`text-xs font-medium ${priorityColors[activity.priority]}`}>
                Prioridade: {activity.priority}
              </span>
            </div>
          )}
        </div>
      </div>
          {isCompleted ? null : (
      <div className="flex items-center justify-between">
        <div className="text-xs sm:text-sm text-neutral-400">
          {activity.estimated_time}min
          {activity.due_date && !isNaN(new Date(activity.due_date).getTime()) && (
            <>
              {" • "}
              <span>
                Vence: {" "}
                {new Date(activity.due_date).toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>
        {isCompleted || !onStart ? (
          <div className="text-xs sm:text-sm text-neutral-500">Concluída</div>
        ) : (
          <button
            onClick={handleClick}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg 
              font-medium text-sm transition bg-neutral-800
               text-white hover:bg-neutral-700
            `}
          >
            <PlayIcon className={`w-4 h-4 ${isLoading ? "animate-pulse" : ""}`} />
            {isLoading ? "Iniciando..." : isInterrupted ? "Retomar" : "Iniciar"}
          </button>
        )}

      </div>
      )}
      </div>
    </div>
  );
}
