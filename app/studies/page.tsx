"use client";

import { useState, useEffect } from "react";
import { useActivities } from "@/contexts/ActivityContext";
import {
  Difficulty,
  Priority,
} from "@/types/activity";

export default function StudiesPage() {
  const { activities, addActivity } =
    useActivities();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("medium");
  const [priority, setPriority] =
    useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

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
    setDifficulty("medium");
    setPriority("medium");
    setDueDate("");
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <header>
          <h1 className="text-2xl font-medium">
            Studies
          </h1>
          <p className="text-sm text-neutral-400">
            Activities that require action
          </p>
        </header>

        {/* Add activity */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Add activity
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
              placeholder="Activity title"
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
                <option value="low">
                  Low difficulty
                </option>
                <option value="medium">
                  Medium difficulty
                </option>
                <option value="high">
                  High difficulty
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
                <option value="low">
                  Low priority
                </option>
                <option value="medium">
                  Medium priority
                </option>
                <option value="high">
                  High priority
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
              Add activity
            </button>
          </form>
        </section>

        {/* Activities list */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Activities
          </h2>

          {!mounted && (
            <p className="text-sm text-neutral-500">
              Loading activities...
            </p>
          )}

          {mounted && activities.length === 0 && (
            <p className="text-sm text-neutral-500">
              No activities yet.
            </p>
          )}

          {mounted && activities.map(activity => (
            <div
              key={activity.id}
              className="rounded-xl border border-neutral-800 p-4"
            >
              <p className="font-medium">
                {activity.title}
              </p>
              <p className="text-xs text-neutral-500">
                Priority: {activity.priority} ·
                Difficulty: {activity.difficulty}
                {activity.dueDate && (
                  <>
                    {" "}
                    · Due{" "}
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
