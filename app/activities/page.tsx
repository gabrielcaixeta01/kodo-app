"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";
import { Activity, Difficulty, Priority } from "@/types/activity";
import { AddActivityForm } from "@/components/ui/AddActivityForm";
import { ActivityCard } from "@/components/ui/ActivityCard";

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
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Migração defensiva
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
    handleAddActivity();
  }

  async function handleAddActivity() {
    // ✅ Evita múltiplos envios
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Mapear dificuldade para energy_required
      const energyMap: Record<Difficulty, Activity["energy_required"]> = {
        baixa: "low",
        média: "medium",
        alta: "high",
      };

      // ✅ Aguarda completar
      await addActivity(
        title.trim(),
        30,
        energyMap[difficulty],
        difficulty,
        priority,
        dueDate || undefined
      );

      // ✅ Só limpa se conseguiu
      setTitle("");
      setDifficulty("média");
      setPriority("média");
      setDueDate("");
      setSuccess("Atividade criada com sucesso!");

      // Limpa mensagem de sucesso após 2 segundos
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar atividade"
      );
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
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao iniciar atividade"
      );
    }
  }

  const activeActivities = activities.filter(
    (a) => a.status !== "completed"
  );

  const completedActivities = activities.filter(
    (a) => a.status === "completed"
  );

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-xl sm:text-2xl font-medium">Atividades</h1>
          <p className="text-sm text-neutral-400">
            Gerencie suas atividades
          </p>
        </header>

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

        {/* ✅ Feedback de sucesso */}
        {success && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* ✅ Feedback de erro */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Ativas */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Atividades
          </h2>

          {mounted && activeActivities.length === 0 && (
            <p className="text-sm text-neutral-500">
              Nenhuma atividade ainda.
            </p>
          )}

          {activeActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onStart={() => handleStartActivity(activity.id, activity.title)}
              onDelete={deleteActivity}
            />
          ))}
        </section>

        {/* Concluídas */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Concluídas
          </h2>

          {completedActivities.length === 0 && (
            <p className="text-sm text-neutral-500">
              Nenhuma atividade concluída ainda.
            </p>
          )}

          {completedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDelete={deleteActivity}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
