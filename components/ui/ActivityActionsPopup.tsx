"use client";

import { useState } from "react";
import { Activity, Difficulty, Priority } from "@/types/activity";
import { useActivities } from "@/hooks/useActivities";

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

  const [title, setTitle] = useState(activity.title);
  const [difficulty, setDifficulty] = useState<Difficulty>(activity.difficulty);
  const [priority, setPriority] = useState<Priority>(activity.priority);
  const [due_date, setDueDate] = useState(
    activity.due_date ? new Date(activity.due_date).toISOString().split('T')[0] : ""
  );

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    updateActivity(activity.id, {
      title: title.trim(),
      difficulty,
      priority,
      due_date: due_date ? new Date(due_date).toISOString() : undefined,
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
          border border-neutral-700 bg-neutral-900 p-4 sm:p-6
          transition-all duration-300
          ease-[cubic-bezier(0.16,1,0.3,1)]
          max-h-[90vh] overflow-y-auto
          ${isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"}
        `}
      >
        <h2 className="text-base sm:text-lg font-medium text-white mb-4">
          Editar atividade
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Título */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl bg-black border border-neutral-700
                       px-4 py-3 text-sm sm:text-base focus:outline-none
                       focus:border-neutral-500 transition"
            placeholder="Título da atividade"
          />

          {/* Dificuldade */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2">
              Dificuldade
            </label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as Difficulty)}
              className="w-full rounded-xl bg-black border border-neutral-700
                         px-4 py-3 text-sm sm:text-base focus:outline-none
                         focus:border-neutral-500 transition text-white"
            >
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2">
              Prioridade
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              className="w-full rounded-xl bg-black border border-neutral-700
                         px-4 py-3 text-sm sm:text-base focus:outline-none
                         focus:border-neutral-500 transition text-white"
            >
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {/* Data de vencimento */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2">
              Data de vencimento
            </label>
            <input
              type="date"
              value={due_date}
              onChange={e => setDueDate(e.target.value)}
              className="w-full rounded-xl bg-black border border-neutral-700
                         px-4 py-3 text-sm sm:text-base focus:outline-none
                         focus:border-neutral-500 transition"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-neutral-700 px-4 py-2.5
                         text-sm font-medium text-neutral-300 hover:bg-neutral-900/50
                         transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-white px-4 py-2.5
                         text-sm font-medium text-black hover:bg-neutral-200
                         transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
