/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActivities } from "@/contexts/ActivityContext";
import { Difficulty, Priority } from "@/types/activity";

function getDateInputValue(timestamp?: number) {
  if (!timestamp) return "";
  const iso = new Date(timestamp).toISOString();
  return iso.split("T")[0];
}

export default function ActivityPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { activities, updateActivity } = useActivities();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("média");
  const [priority, setPriority] =
    useState<Priority>("média");
  const [dueDate, setDueDate] = useState("");

  const activity = useMemo(
    () =>
      activities.find(item => item.id === params.id),
    [activities, params.id]
  );

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!activity) return;
    setTitle(activity.title);
    setDifficulty(activity.difficulty);
    setPriority(activity.priority);
    setDueDate(getDateInputValue(activity.dueDate));
  }, [activity]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activity || !title.trim()) return;

    updateActivity(activity.id, {
      title: title.trim(),
      difficulty,
      priority,
      dueDate: dueDate
        ? new Date(dueDate).getTime()
        : undefined,
    });

    router.push("/studies");
  }

  const showNotFound = mounted && !activity;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <button
            onClick={() => router.back()}
            className="text-xs text-neutral-400 hover:text-white transition"
          >
            Voltar
          </button>
          <h1 className="text-2xl font-medium">Editar atividade</h1>
          {activity && (
            <p className="text-sm text-neutral-500">
              Criada em {new Date(activity.createdAt).toLocaleDateString()}
            </p>
          )}
        </header>

        {!mounted && (
          <div className="rounded-2xl border border-neutral-800 p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-neutral-800 rounded w-24"></div>
            <div className="h-10 bg-neutral-800 rounded"></div>
            <div className="h-10 bg-neutral-800 rounded"></div>
          </div>
        )}

        {showNotFound && (
          <div className="rounded-2xl border border-neutral-800 p-6 space-y-3">
            <p className="text-sm text-neutral-300">
              Atividade não encontrada.
            </p>
            <button
              onClick={() => router.push("/studies")}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-white/40 transition"
            >
              Voltar para Estudos
            </button>
          </div>
        )}

        {mounted && activity && (
          <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-500">
                  Título
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-black border border-neutral-700 px-4 py-2 text-sm focus:outline-none"
                  placeholder="Título da atividade"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500">
                    Dificuldade
                  </label>
                  <select
                    value={difficulty}
                    onChange={e =>
                      setDifficulty(e.target.value as Difficulty)
                    }
                    className="rounded-xl bg-black border border-neutral-700 px-3 py-2 text-sm"
                  >
                    <option value="baixa">Baixa dificuldade</option>
                    <option value="média">Dificuldade média</option>
                    <option value="alta">Alta dificuldade</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500">
                    Prioridade
                  </label>
                  <select
                    value={priority}
                    onChange={e =>
                      setPriority(e.target.value as Priority)
                    }
                    className="rounded-xl bg-black border border-neutral-700 px-3 py-2 text-sm"
                  >
                    <option value="baixa">Baixa prioridade</option>
                    <option value="média">Prioridade média</option>
                    <option value="alta">Alta prioridade</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500">
                    Prazo
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="rounded-xl bg-black border border-neutral-700 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-white/40 transition"
                >
                  Salvar alterações
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/studies")}
                  className="rounded-xl border border-neutral-800 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:border-white/20 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}