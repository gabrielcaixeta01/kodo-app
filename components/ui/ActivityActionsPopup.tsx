"use client";

import { useState } from "react";
import { Activity, Difficulty, Priority } from "@/types/activity";
import { useActivities } from "@/contexts/ActivityContext";
import { dateStringToTimestamp, timestampToDateString } from "@/lib/dateUtils";

interface Props {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityActionsPopup({
  activity,
  isOpen,
  onClose,
}: Props) {
  const { updateActivity } = useActivities();

  // 🔹 estado inicial vem direto da activity
  const [title, setTitle] = useState(activity.title);
  const [difficulty, setDifficulty] = useState<Difficulty>(activity.difficulty);
  const [priority, setPriority] = useState<Priority>(activity.priority);
  const [dueDate, setDueDate] = useState(
    activity.dueDate ? timestampToDateString(activity.dueDate) : ""
  );

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    updateActivity(activity.id, {
      title: title.trim(),
      difficulty,
      priority,
      dueDate: dueDate ? dateStringToTimestamp(dueDate) : undefined,
    });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Popup */}
      <div
        onClick={e => e.stopPropagation()}
        className={`
          relative w-[90%] max-w-md rounded-2xl
          border border-neutral-700 bg-neutral-900 p-6
          transition-all duration-300
          ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"}
        `}
      >
        <h2 className="text-lg font-medium text-white mb-4">
          Editar atividade
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Título */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl bg-black border border-neutral-700
                       px-4 py-3 text-sm focus:outline-none
                       focus:border-neutral-500 transition"
          />

          {/* Dificuldade */}
          <div className="flex gap-2">
            {(["baixa", "média", "alta"] as Difficulty[]).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex-1 rounded-xl px-4 py-2.5 border text-sm transition
                  ${
                    difficulty === d
                      ? "bg-neutral-800 border-neutral-500 text-white"
                      : "bg-black border-neutral-700 text-neutral-400 hover:border-neutral-500"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Prioridade */}
          <div className="flex gap-2">
            {(["baixa", "média", "alta"] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-xl px-4 py-2.5 border text-sm transition
                  ${
                    priority === p
                      ? "bg-neutral-800 border-neutral-500 text-white"
                      : "bg-black border-neutral-700 text-neutral-400 hover:border-neutral-500"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Prazo */}
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full rounded-xl bg-black border border-neutral-700
                       px-4 py-3 text-sm focus:outline-none
                       focus:border-neutral-500 transition"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white text-black
                       text-sm font-medium hover:opacity-90 transition"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
