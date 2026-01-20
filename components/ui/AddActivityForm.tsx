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
    <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
      <h2 className="text-xs uppercase tracking-widest text-neutral-500">
        Adicionar atividade
      </h2>

      <form
        onSubmit={onSubmit}
        className="space-y-5"
      >
        {/* Título */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-neutral-500">
            Título
          </label>
          <input
            value={title}
            onChange={e =>
              setTitle(e.target.value)
            }
            placeholder="Título da atividade"
            className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition"
          />
        </div>

        {/* Dificuldade */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-neutral-500">
            Dificuldade
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDifficulty("baixa")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm border border-neutral-700 transition ${
                difficulty === "baixa"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-black text-neutral-400 hover:border-neutral-500"
              }`}
            >
              Baixa
            </button>
            <button
              type="button"
              onClick={() => setDifficulty("média")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm border border-neutral-700 transition ${
                difficulty === "média"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-black  text-neutral-400 hover:border-neutral-500"
              }`}
            >
              Média
            </button>
            <button
              type="button"
              onClick={() => setDifficulty("alta")}
              className={`flex-1 rounded-xl px-4 border border-neutral-700 py-2.5 text-sm transition ${
                difficulty === "alta"
                  ? "bg-red-500/20 text-red-300"
                  : "bg-black text-neutral-400 hover:border-neutral-500"
              }`}
            >
              Alta
            </button>
          </div>
        </div>

        {/* Prioridade */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-neutral-500">
            Prioridade
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPriority("baixa")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm border border-neutral-700 transition ${
                priority === "baixa"
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-black text-neutral-400 hover:border-neutral-500"
              }`}
            >
              Baixa
            </button>
            <button
              type="button"
              onClick={() => setPriority("média")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm border border-neutral-700 transition ${
                priority === "média"
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-black text-neutral-400 hover:border-neutral-500"
              }`}
            >
              Média
            </button>
            <button
              type="button"
              onClick={() => setPriority("alta")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm border border-neutral-700 transition ${
                priority === "alta"
                  ? "bg-orange-500/20 text-orange-300"
                  : "bg-black text-neutral-400 hover:border-neutral-500"
              }`}
            >
              Alta
            </button>
          </div>
        </div>

        {/* Prazo */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-neutral-500">
            Prazo
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={e =>
              setDueDate(e.target.value)
            }
            className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition"
          />
        </div>

        {/* Botão centralizado */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="rounded-xl border border-white/20 px-8 py-2.5 text-sm hover:border-white/40 hover:bg-white/5 transition"
          >
            Criar atividade
          </button>
        </div>
      </form>
    </section>
  );
}
