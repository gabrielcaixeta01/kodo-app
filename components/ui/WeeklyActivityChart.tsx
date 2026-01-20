"use client";

import { useEffect, useMemo, useState } from "react";
import { useActivities } from "@/contexts/ActivityContext";

type DayData = {
  label: string;
  count: number;
};

function getLast7DaysActivity(
  activities: { createdAt: number }[]
): DayData[] {
  const result: DayData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const count = activities.filter(a => {
      const d = new Date(a.createdAt);
      return d >= date && d < nextDate;
    }).length;

    result.push({
      label: date.toLocaleDateString("pt-BR", {
        weekday: "short",
      }),
      count,
    });
  }

  return result;
}

export function WeeklyActivityChart() {
  const { activities } = useActivities();
  const [mounted, setMounted] = useState(false);

  const data = useMemo(
    () => getLast7DaysActivity(activities),
    [activities]
  );

  const maxCount = Math.max(...data.map(d => d.count), 1);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 🔒 evita hydration mismatch
  if (!mounted) return null;

  return (
    <section className="rounded-2xl border border-neutral-800 p-6 bg-neutral-950">
      <h2 className="text-xs uppercase tracking-widest text-neutral-500">
        Últimos 7 dias
      </h2>

      <div className="mt-4 flex items-end gap-4 h-32">
        {data.map((d, i) => {
          const height = (d.count / maxCount) * 100;

          return (
            <div
              key={`day-${i}`}
              className="flex flex-col items-center gap-2 w-10"
            >
              <div className="relative w-3 h-full flex items-end">
                <div
                  className="w-full rounded-full bg-white/80 transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>

              <span className="text-[11px] text-neutral-400">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Atividades criadas por dia
      </p>
    </section>
  );
}
