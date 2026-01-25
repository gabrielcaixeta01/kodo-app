"use client";

import { Difficulty, Priority } from "@/types/activity";

interface AddActivityFormProps {
  title: string;
  setTitle: (value: string) => void;
  difficulty: Difficulty;
  setDifficulty: (value: Difficulty) => void;
  priority: Priority;
  setPriority: (value: Priority) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddActivityForm({
  title,
  setTitle,
  difficulty,
  setDifficulty,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  onSubmit,
}: AddActivityFormProps) {
  return (
    <section className="rounded-2xl border border-neutral-800 p-4 sm:p-6 space-y-4">
      <h2 className="text-xs uppercase tracking-widest text-neutral-500">
        Adicionar atividade
      </h2>

      <form
        onSubmit={onSubmit}
        className="space-y-4 sm:space-y-5"
      >
        {/* Título */}
        <input
          value={title}
          onChange={e =>
            setTitle(e.target.value)
          }
          placeholder="Título da atividade"
          className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-neutral-500 transition"
        />

        {/* Dificuldade */}
        <div>
          <label className="block text-xs text-neutral-400 mb-2">Dificuldade</label>
          <div className="flex gap-2">
            {(["baixa", "média", "alta"] as Difficulty[]).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex-1 rounded-xl px-3 sm:px-4 py-2.5 border text-xs sm:text-sm transition font-medium
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
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-xs text-neutral-400 mb-2">Prioridade</label>
          <div className="flex gap-2">
            {(["baixa", "média", "alta"] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-xl px-3 sm:px-4 py-2.5 border text-xs sm:text-sm transition font-medium
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
        </div>

        {/* Prazo */}
        <div>
          <input
            type="date"
            value={dueDate}
            onChange={e =>
              setDueDate(e.target.value)
            }
            className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-neutral-500 transition appearance-none"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-white text-black
                     text-sm sm:text-base font-medium hover:opacity-90 transition"
        >
          Criar atividade
        </button>
      </form>
    </section>
  );
}
