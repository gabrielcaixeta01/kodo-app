"use client";

import { useState } from "react";
import { Activity } from "@/types/activity";
import { useLongPress } from "@/hooks/useLongPress";
import { ActivityActionsPopup } from "./ActivityActionsPopup";

interface ActivityCardProps {
  activity: Activity;
  offset: number;
  isDeleting: boolean;
  isDragging: boolean;
  canDelete: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export function ActivityCard({
  activity,
  offset,
  isDeleting,
  isDragging,
  canDelete,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}: ActivityCardProps) {
  const [showPopup, setShowPopup] = useState(false);

  const { handleStart: handleLongPressStart, handleEnd: handleLongPressEnd } = useLongPress({
    onLongPress: () => {
      // Só abre o popup se o card não foi deslizado
      if (Math.abs(offset) < 5) {
        setShowPopup(true);
      }
    },
    duration: 500,
  });

  const statusColors = {
    pending: "border-neutral-800",
    in_progress: "border-blue-500/30",
    interrupted: "border-yellow-500/30",
    completed: "border-green-500/30",
  };

  const statusLabels = {
    pending: "Pendente",
    in_progress: "Em andamento",
    interrupted: "Interrompida",
    completed: "Concluída",
  };

  const showDelete = offset < -10;

  return (
    <>
      <div 
      className="relative overflow-hidden transition-all duration-300"
      style={{
        opacity: isDeleting ? 0 : 1,
        maxHeight: isDeleting ? 0 : "200px",
        marginBottom: isDeleting ? 0 : undefined,
      }}
    >
      {/* Fundo delete - só mostra para pending e interrupted */}
      {canDelete && (
        <div 
          className="absolute inset-0 rounded-lg bg-red-500/20 flex items-center justify-end pr-4 transition-opacity duration-200"
          style={{ opacity: showDelete ? 1 : 0 }}
        >
          <span className="text-red-400 text-sm font-medium">
            Excluir
          </span>
        </div>
      )}

      {/* Card */}
      <div
        onTouchStart={(e) => {
          handleLongPressStart();
          if (canDelete) onTouchStart(e);
        }}
        onTouchMove={(e) => {
          // Só cancela o long press se houver movimento significativo
          if (Math.abs(offset) > 5) {
            handleLongPressEnd();
          }
          if (canDelete) onTouchMove(e);
        }}
        onTouchEnd={() => {
          handleLongPressEnd();
          if (canDelete) onTouchEnd();
        }}
        onMouseDown={(e) => {
          handleLongPressStart();
          if (canDelete) onMouseDown(e);
        }}
        onMouseMove={(e) => {
          // Só cancela o long press se houver movimento significativo
          if (Math.abs(offset) > 5) {
            handleLongPressEnd();
          }
          if (canDelete) onMouseMove(e);
        }}
        onMouseUp={() => {
          handleLongPressEnd();
          if (canDelete) onMouseUp();
        }}
        onMouseLeave={() => {
          handleLongPressEnd();
          if (canDelete && isDragging) onMouseLeave();
        }}
        style={{
          transform: canDelete ? `translateX(${offset}px)` : "translateX(0)",
          transition:
            isDragging
              ? "none"
              : "transform 0.3s ease-out, opacity 0.3s ease-out",
          opacity: isDeleting ? 0 : 1,
        }}
        className={`relative z-10 rounded-xl border p-4 bg-black cursor-pointer ${statusColors[activity.status]}`}
      >
        <div className="flex justify-between">
          <p className="font-medium">{activity.title}</p>
          <span className="text-xs text-neutral-400">
            {statusLabels[activity.status]}
          </span>
        </div>

        <p className="text-xs text-neutral-500">
          Prioridade: {activity.priority} · Dificuldade: {activity.difficulty}
          {activity.dueDate && (
            <> · Prazo {new Date(activity.dueDate).toLocaleDateString()}</>
          )}
        </p>
      </div>
    </div>

    <ActivityActionsPopup
      activity={activity}
      isOpen={showPopup}
      onClose={() => setShowPopup(false)}
    />
    </>
  );
}
