"use client";

import { useState, useEffect } from "react";
import { useActivities } from "@/contexts/ActivityContext";
import {
  Difficulty,
  Priority,
} from "@/types/activity";
import { useRouter } from "next/navigation";


export default function StudiesPage() {
  const { activities, addActivity } =
    useActivities();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("média");
  const [priority, setPriority] =
    useState<Priority>("média");
  const [dueDate, setDueDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    addActivity({
      title: title.trim(),
      difficulty,
      priority,
      dueDate: dueDate
        ? new Date(dueDate).getTime()
        : undefined,
    });

    setTitle("");
    setDifficulty("média");
    setPriority("média");
    setDueDate("");
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <header>
          <h1 className="text-2xl font-medium">
            Estudos
          </h1>
          <p className="text-sm text-neutral-400">
            Atividades que requerem ação
          </p>
        </header>

        {/* Add activity */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Adicionar atividade
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              value={title}
              onChange={e =>
                setTitle(e.target.value)
              }
              placeholder="Título da atividade"
              className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-2 text-sm focus:outline-none"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <select
                value={difficulty}
                onChange={e =>
                  setDifficulty(
                    e.target.value as Difficulty
                  )
                }
                className="rounded-xl bg-black border border-neutral-700 px-3 py-2 text-sm"
              >
                <option value="baixa">
                  Baixa dificuldade
                </option>
                <option value="média">
                  Dificuldade média
                </option>
                <option value="alta">
                  Alta dificuldade
                </option>
              </select>

              <select
                value={priority}
                onChange={e =>
                  setPriority(
                    e.target.value as Priority
                  )
                }
                className="rounded-xl bg-black border border-neutral-700 px-3 py-2 text-sm"
              >
                <option value="baixa">
                  Baixa prioridade
                </option>
                <option value="média">
                  Prioridade média
                </option>
                <option value="alta">
                  Alta prioridade
                </option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={e =>
                  setDueDate(e.target.value)
                }
                className="rounded-xl bg-black border border-neutral-700 px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-white/40 transition"
            >
              Adicionar atividade
            </button>
          </form>
        </section>

        {/* Activities list */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Atividades
          </h2>

          {!mounted && (
            <p className="text-sm text-neutral-500">
              Carregando atividades...
            </p>
          )}

          {mounted && activities.length === 0 && (
            <p className="text-sm text-neutral-500">
              Nenhuma atividade ainda.
            </p>
          )}

          {mounted && activities.map(activity => (
            <div
              key={activity.id}
              onClick={() => router.push(`/activity/${activity.id}`)}
              className="rounded-xl border border-neutral-800 p-4"
            >
              <p className="font-medium">
                {activity.title}
              </p>
              <p className="text-xs text-neutral-500">
                Prioridade: {activity.priority} ·
                Dificuldade: {activity.difficulty}
                {activity.dueDate && (
                  <>
                    {" "}
                    · Prazo{" "}
                    {new Date(
                      activity.dueDate
                    ).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
