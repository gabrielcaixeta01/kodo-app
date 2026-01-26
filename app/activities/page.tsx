"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";
import { Activity, Difficulty, Priority } from "@/types/activity";
import { AddActivityForm } from "@/components/ui/AddActivityForm";
import { ActivityCard } from "@/components/ui/ActivityCard";
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function ActivitiesPage() {
  const router = useRouter();
  const { activities, addActivity, updateActivity, deleteActivity } = useActivities();
  const { startSession, sessions } = useSessions();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("média");
  const [priority, setPriority] = useState<Priority>("média");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeActivities = useMemo(
    () => activities.filter((a) => a.status !== "completed"),
    [activities]
  );

  const completedActivities = useMemo(
    () => activities.filter((a) => a.status === "completed"),
    [activities]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    handleAddActivity();
  }

  async function handleAddActivity() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const energyMap: Record<Difficulty, Activity["energy_required"]> = {
        baixa: "low",
        média: "medium",
        alta: "high",
      };

      await addActivity(
        title.trim(),
        30,
        energyMap[difficulty],
        difficulty,
        priority,
        dueDate || undefined
      );

      setTitle("");
      setDifficulty("média");
      setPriority("média");
      setDueDate("");

      setSuccess("Atividade criada com sucesso!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar atividade");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStartActivity(activityId: string, activityTitle: string) {
    try {
      const lastInterrupted = sessions.find(
        (s) => s.activity_id === activityId && s.status === "interrupted"
      );
      const resumeMinutes = lastInterrupted?.duration ?? 0;

      await updateActivity(activityId, { status: "in_progress" });
      await startSession(activityId, activityTitle, resumeMinutes);
      router.push("/focus");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao iniciar atividade");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background (subtle premium) */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-[35%] -left-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
      </div>

      <div className="relative mx-auto max-w-3xl p-4 sm:p-6 pb-40 sm:pb-32 space-y-6 sm:space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <ClipboardDocumentListIcon className="h-4 w-4" />
            <span>Atividades</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Atividades
              </h1>
              <p className="text-sm text-neutral-400">
                Gerencie suas atividades e mantenha o foco.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Ativas: <span className="text-neutral-200">{activeActivities.length}</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Concluídas: <span className="text-neutral-200">{completedActivities.length}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Add form inside a glass card */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-200">
              <SparklesIcon className="h-5 w-5 text-neutral-300" />
              <span>Nova atividade</span>
            </div>
            <span className="text-xs text-neutral-500">
              Crie rápido, execute melhor.
            </span>
          </div>

          <div className="p-4 sm:p-6">
            <AddActivityForm
              title={title}
              setTitle={setTitle}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              priority={priority}
              setPriority={setPriority}
              dueDate={dueDate}
              setDueDate={setDueDate}
              onSubmit={handleSubmit}
            />

            {/* Feedback */}
            <div className="mt-4 space-y-3">
              {success && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-300 mt-0.5" />
                    <p className="text-sm text-emerald-200">{success}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-300 mt-0.5" />
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Subtle helper row */}
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
              <span>Dica: priorize “alta” para o que destrava seu dia.</span>
              <span className="hidden sm:inline">
                Tempo padrão: <span className="text-neutral-300">30min</span>
              </span>
            </div>
          </div>
        </section>

        {/* Active */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              Ativas
            </h2>
            <span className="text-[11px] text-neutral-400 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
              {activeActivities.length} itens
            </span>
          </div>

          {mounted && activeActivities.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-neutral-300">Nenhuma atividade por aqui.</p>
              <p className="mt-1 text-xs text-neutral-500">
                Crie uma acima e comece com uma sessão curta de foco.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {activeActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onStart={() => handleStartActivity(activity.id, activity.title)}
                onDelete={deleteActivity}
              />
            ))}
          </div>
        </section>

        {/* Completed */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              Concluídas
            </h2>
            <span className="text-[11px] text-neutral-400 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
              {completedActivities.length} itens
            </span>
          </div>

          {completedActivities.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-neutral-300">Ainda nada concluído.</p>
              <p className="mt-1 text-xs text-neutral-500">
                Concluir uma por dia muda o jogo.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {completedActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onDelete={deleteActivity}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}