"use client";

import { useState, useEffect } from "react";
import { useActivities } from "@/contexts/ActivityContext";
import {
  Difficulty,
  Priority,
} from "@/types/activity";
import { useRouter } from "next/navigation";


export default function StudiesPage() {
  const { activities, addActivity, updateActivity, deleteActivity } =
    useActivities();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("média");
  const [priority, setPriority] =
    useState<Priority>("média");
  const [dueDate, setDueDate] = useState("");
  const router = useRouter();

  const SWIPE_LIMIT = -120;
  const DELETE_THRESHOLD = -80;

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const [clickTimes, setClickTimes] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Migração: adiciona status para atividades antigas sem esse campo
  useEffect(() => {
    if (!mounted) return;
    activities.forEach(activity => {
      if (!activity.status) {
        updateActivity(activity.id, { status: "pending" });
      }
    });
  }, [mounted, activities, updateActivity]);

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
      status: "pending",
    });

    setTitle("");
    setDifficulty("média");
    setPriority("média");
    setDueDate("");
  }

  function getClientX(e: TouchEvent | React.TouchEvent | React.MouseEvent) {
    return "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  function handleStart(id: string, e: unknown) {
    setDraggingId(id);
    setStartX(getClientX(e as TouchEvent | React.TouchEvent | React.MouseEvent));
    setClickTimes(prev => ({ ...prev, [id]: Date.now() }));
  }

  function handleMove(id: string, e: unknown) {
    if (draggingId !== id) return;

    const currentX = getClientX(e as TouchEvent | React.TouchEvent | React.MouseEvent);
    let diff = currentX - startX;

    if (diff > 0) diff = 0;
    if (diff < SWIPE_LIMIT) diff = SWIPE_LIMIT;

    setOffsets(prev => ({ ...prev, [id]: diff }));
  }

  function handleEnd(id: string) {
    const offset = offsets[id] || 0;

    if (offset < DELETE_THRESHOLD) {
      deleteActivity(id);
    } else {
      setOffsets(prev => ({ ...prev, [id]: 0 }));
    }

    setDraggingId(null);
    setClickTimes(prev => ({ ...prev, [id]: 0 }));
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-20">
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

          {mounted && activities.filter(a => a.status !== "completed").length === 0 && (
            <p className="text-sm text-neutral-500">
              Nenhuma atividade ainda.
            </p>
          )}

          {mounted && activities
            .filter(a => a.status !== "completed")
            .map(activity => {
            const statusColors = {
              pending: "border-neutral-800",
              in_progress: "border-blue-500/30 bg-blue-500/5",
              interrupted: "border-yellow-500/30 bg-yellow-500/5",
              completed: "border-green-500/30 bg-green-500/5",
            };
            const statusLabels = {
              pending: "Pendente",
              in_progress: "Em andamento",
              interrupted: "Interrompida",
              completed: "Concluída",
            };
            const canDelete = activity.status === "pending" || activity.status === "in_progress";
            
            return (
              <div key={activity.id} className="relative overflow-hidden">
                {/* Fundo delete - só mostra para pending e in_progress */}
                {canDelete && (
                  <div className="absolute inset-0 rounded-lg bg-red-500/20 flex items-center justify-end pr-4">
                    <span className="text-red-400 text-sm font-medium">
                      Excluir
                    </span>
                  </div>
                )}

                {/* Card */}
                <div
                  onTouchStart={e => canDelete && handleStart(activity.id, e)}
                  onTouchMove={e => canDelete && handleMove(activity.id, e)}
                  onTouchEnd={() => canDelete && handleEnd(activity.id)}
                  onMouseDown={e => canDelete && handleStart(activity.id, e)}
                  onMouseMove={e => canDelete && handleMove(activity.id, e)}
                  onMouseUp={() => canDelete && handleEnd(activity.id)}
                  onMouseLeave={() => canDelete && draggingId === activity.id && handleEnd(activity.id)}
                  onClick={() => {
                    const offset = offsets[activity.id] || 0;
                    const holdTime = Date.now() - (clickTimes[activity.id] || 0);
                    // Só navega se não arrastou e não segurou muito tempo
                    if (Math.abs(offset) < 5 && holdTime < 200) {
                      router.push(`/activity/${activity.id}`);
                    }
                  }}
                  style={{
                    transform: canDelete ? `translateX(${offsets[activity.id] || 0}px)` : "translateX(0)",
                    transition:
                      draggingId === activity.id
                        ? "none"
                        : "transform 0.25s ease-out",
                  }}
                  className={`relative z-10 rounded-xl border p-4 bg-black cursor-pointer ${statusColors[activity.status || "pending"]}`}
                >
                  <div className="flex justify-between">
                    <p className="font-medium">{activity.title}</p>
                    <span className="text-xs text-neutral-400">
                      {statusLabels[activity.status || "pending"]}
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
            );
          })}
        </section>

        {/* Completed activities */}
        {mounted && activities.filter(a => a.status === "completed").length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              Concluídas
            </h2>

            {activities
              .filter(a => a.status === "completed")
              .map(activity => (
              <div
                key={activity.id}
                onClick={() => router.push(`/activity/${activity.id}`)}
                className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 cursor-pointer hover:border-white/20 transition"
              >
                <div className="flex justify-between">
                  <p className="font-medium text-green-200">{activity.title}</p>
                  <span className="text-xs text-green-400">✓ Concluída</span>
                </div>

                <p className="text-xs text-neutral-500">
                  Prioridade: {activity.priority} · Dificuldade: {activity.difficulty}
                  {activity.dueDate && (
                    <> · Prazo {new Date(activity.dueDate).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              ))}
          </section>
        )}
      </div>
    </main>
  );
}
