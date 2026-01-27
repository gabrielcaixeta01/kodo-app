"use client";

import { Activity } from "@/types/activity";
import { PlayIcon, CheckCircleIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import { useMemo, useState } from "react";
import { useSwipeDelete } from "@/hooks/useSwipeDelete";

interface Props {
  activity: Activity;
  onStart?: () => void | Promise<void>;
  onDelete?: (id: string) => void;
}

function formatDatePtBR(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ActivityCard({ activity, onStart, onDelete }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const isCompleted = activity.status === "completed";
  const isInterrupted = activity.status === "interrupted";

  const { setRef, handleStart, handleMove, handleEnd } = useSwipeDelete({
    onDelete: onDelete || (() => {}),
  });

  const dueDateLabel = useMemo(() => formatDatePtBR(activity.due_date), [activity.due_date]);

  // Chips continuam translúcidos porque ficam DENTRO do card opaco (não vazam o vermelho)
  const difficultyChip: Record<Activity["difficulty"], string> = {
    baixa: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    "média": "border-amber-500/25 bg-amber-500/10 text-amber-200",
    alta: "border-rose-500/25 bg-rose-500/10 text-rose-200",
  };

  const priorityChip: Record<Activity["priority"], string> = {
    baixa: "border-sky-500/25 bg-sky-500/10 text-sky-200",
    "média": "border-orange-500/25 bg-orange-500/10 text-orange-200",
    alta: "border-red-500/25 bg-red-500/10 text-red-200",
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
    <div className="relative overflow-hidden rounded-md">
      {/* Background delete */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 bg-red-500 border-2 border-black rounded-3xl">
        <span className="text-white font-semibold text-sm">Deletar</span>
      </div>

      {/* Card (100% opaco p/ não vazar o vermelho) */}
      <div
        ref={setRef(activity.id)}
        onPointerDown={(e) => handleStart(activity.id, e)}
        onPointerMove={(e) => handleMove(activity.id, e)}
        onPointerUp={() => handleEnd(activity.id)}
        onPointerCancel={() => handleEnd(activity.id)}
        className={[
          "group relative select-none touch-pan-y",
          "rounded-3xl p-4 sm:p-5",
          // ✅ opaco
          "bg-neutral-950",
          // ✅ borda + ring premium
          "border border-white/10 ring-1 ring-black/40",
          // ✅ sombras sutis (depth sem transparência)
          "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          "transition-transform duration-200 will-change-transform",
        ].join(" ")}
      >
        {/* top shine opaco (não deixa ver o vermelho) */}
        <div className="pointer-events-none rounded-3xl absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* subtle inner divider */}
        <div className="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Title row */}
            <div className="flex items-center gap-2">
              {isCompleted && (
                <CheckCircleIcon className="w-5 h-5 text-emerald-300/90 shrink-0" />
              )}

              <h3
                className={[
                  "text-sm sm:text-base font-semibold text-white truncate",
                  isCompleted ? "line-through decoration-white/20" : "",
                ].join(" ")}
                title={activity.title}
              >
                {activity.title}
              </h3>
            </div>

            {/* Subline */}
            {(dueDateLabel || isCompleted) && (
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                {dueDateLabel && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDaysIcon className="w-4 h-4 text-neutral-500" />
                    <span>{dueDateLabel}</span>
                  </span>
                )}
              </div>
            )}

            {/* Tags only when NOT completed */}
            {!isCompleted && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {isInterrupted && (
                  <span className="text-xs px-2.5 py-1 rounded-full border border-orange-500/25 bg-orange-500/10 text-orange-200">
                    Interrompida
                  </span>
                )}

                <span
                  className={[
                    "text-xs px-2.5 py-1 rounded-full border",
                    "tracking-tight",
                    difficultyChip[activity.difficulty],
                  ].join(" ")}
                >
                  Dificuldade: {activity.difficulty}
                </span>

                <span
                  className={[
                    "text-xs px-2.5 py-1 rounded-full border",
                    priorityChip[activity.priority],
                  ].join(" ")}
                >
                  Prioridade: {activity.priority}
                </span>
              </div>
            )}
          </div>

          {/* Right pill */}
          {isCompleted ? (
            <span className="text-[11px] text-neutral-300 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
              Concluída
            </span>
          ) : (
            <span className="text-[11px] text-neutral-400 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
              {activity.estimated_time}min
            </span>
          )}
        </div>

        {/* Bottom row only for NOT completed */}
        {!isCompleted && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-neutral-500">
              {dueDateLabel ? `Até ${dueDateLabel}` : "Sem data"}
            </div>

            {onStart && (
              <button
                onClick={handleClick}
                disabled={isLoading}
                className={[
                  "flex items-center gap-2 px-3 py-2 rounded-2xl",
                  "bg-white/5 border border-white/10 text-white",
                  "hover:bg-white/8 hover:border-white/15 transition",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                <PlayIcon className="w-4 h-4" />
                {isLoading ? "Iniciando..." : isInterrupted ? "Retomar" : "Iniciar"}
              </button>
            )}
          </div>
        )}

        {/* Divider for completed */}
        {isCompleted && <div className="mt-4 h-px w-full bg-white/5" />}
      </div>
    </div>
  );
}