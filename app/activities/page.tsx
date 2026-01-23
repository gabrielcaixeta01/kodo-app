"use client";

import { useState, useEffect } from "react";
import { useActivities } from "@/hooks/useActivities";
import { Activity, Difficulty, Priority } from "@/types/activity";
import { AddActivityForm } from "@/components/ui/AddActivityForm";
import { ActivityCard } from "@/components/ui/ActivityCard";

export default function ActivitiesPage() {
  const { activities, addActivity, updateActivity } = useActivities();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("média");
  const [priority, setPriority] = useState<Priority>("média");
  const [dueDate, setDueDate] = useState("");

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

    // Mapear dificuldade para energy_required
    const energyMap: Record<Difficulty, Activity["energy_required"]> = {
      baixa: "low",
      média: "medium",
      alta: "high",
    };

    addActivity(
      title.trim(),
      30,          // estimated_time padrão
      energyMap[difficulty],
      difficulty,
      priority,
      dueDate || undefined
    );

    setTitle("");
    setDifficulty("média");
    setPriority("média");
    setDueDate("");
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
              onStart={() => updateActivity(activity.id, { status: "in_progress" })}
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
              onStart={() => updateActivity(activity.id, { status: "pending" })}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
