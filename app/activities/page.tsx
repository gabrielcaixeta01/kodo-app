"use client";

import { useState, useEffect } from "react";
import { useActivities } from "@/contexts/ActivityContext";
import {
  Difficulty,
  Priority,
} from "@/types/activity";
import { AddActivityForm } from "@/components/ui/AddActivityForm";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { useSwipeDelete } from "@/hooks/useSwipeDelete";
import { dateStringToTimestamp } from "@/lib/dateUtils";


export default function ActivitiesPage() {
  const { activities, addActivity, updateActivity, deleteActivity } =
    useActivities();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("média");
  const [priority, setPriority] =
    useState<Priority>("média");
  const [dueDate, setDueDate] = useState("");

  const {
    draggingId,
    offsets,
    deletingIds,
    handleStart,
    handleMove,
    handleEnd,
  } = useSwipeDelete({
    onDelete: deleteActivity,
  });

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
      dueDate: dueDate ? dateStringToTimestamp(dueDate) : undefined,
      status: "pending",
    });

    setTitle("");
    setDifficulty("média");
    setPriority("média");
    setDueDate("");
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-20">
      <div className="max-w-3xl w-full mx-auto space-y-6 sm:space-y-10">
        <header>
          <h1 className="text-xl sm:text-2xl font-medium">
            Atividades
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Gerencie suas atividades para alcançar seus objetivos
          </p>
        </header>

        {/* Add activity */}
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

        {/* Activities list */}
        <section className="space-y-2.5 sm:space-y-3">
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
            const offset = offsets[activity.id] || 0;
            const isDragging = draggingId === activity.id;
            const isDeleting = deletingIds.has(activity.id);
            const canDelete = activity.status === "pending" || activity.status === "interrupted";
            
            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                offset={offset}
                isDeleting={isDeleting}
                isDragging={isDragging}
                canDelete={canDelete}
                onTouchStart={e => canDelete && handleStart(activity.id, e)}
                onTouchMove={e => canDelete && handleMove(activity.id, e)}
                onTouchEnd={() => canDelete && handleEnd(activity.id)}
                onMouseDown={e => canDelete && handleStart(activity.id, e)}
                onMouseMove={e => canDelete && handleMove(activity.id, e)}
                onMouseUp={() => canDelete && handleEnd(activity.id)}
                onMouseLeave={() => canDelete && draggingId === activity.id && handleEnd(activity.id)}
              />
            );
          })}
        </section>

        {/* Completed activities */}
        <section className="space-y-2.5 sm:space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Concluídas
          </h2>

          {!mounted && (
            <p className="text-sm text-neutral-500">
              Carregando atividades...
            </p>
          )}

          {mounted && activities.filter(a => a.status == "completed").length === 0 && (
            <p className="text-sm text-neutral-500">
              Nenhuma atividade concluída ainda.
            </p>
          )}

          {mounted && activities
            .filter(a => a.status == "completed")
            .map(activity => {
            const offset = offsets[activity.id] || 0;
            const isDragging = draggingId === activity.id;
            const isDeleting = deletingIds.has(activity.id);
            const canDelete = activity.status !== "in_progress";
            
            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                offset={offset}
                isDeleting={isDeleting}
                isDragging={isDragging}
                canDelete={canDelete}
                onTouchStart={e => canDelete && handleStart(activity.id, e)}
                onTouchMove={e => canDelete && handleMove(activity.id, e)}
                onTouchEnd={() => canDelete && handleEnd(activity.id)}
                onMouseDown={e => canDelete && handleStart(activity.id, e)}
                onMouseMove={e => canDelete && handleMove(activity.id, e)}
                onMouseUp={() => canDelete && handleEnd(activity.id)}
                onMouseLeave={() => canDelete && draggingId === activity.id && handleEnd(activity.id)}
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}
