"use client";

import { useMemo, useState, useEffect } from "react";
import { useActivities } from "@/contexts/ActivityContext";

export function MonthCalendar() {
  const { activities } = useActivities();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const today = useMemo(() => new Date(), []);
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthLabel = new Date(year, month, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1);
  const jsWeekday = firstDay.getDay();
  const mondayIndex = (jsWeekday + 6) % 7;

  const countsByDay = useMemo(() => {
    const map: Record<number, number> = {};
    activities.forEach((a) => {
      if (!a.dueDate) return;
      // Como o timestamp já está em timezone local (via dateStringToTimestamp),
      // não precisamos fazer correção de offset
      const d = new Date(a.dueDate);
      if (d.getFullYear() !== year || d.getMonth() !== month) return;
      map[d.getDate()] = (map[d.getDate()] || 0) + 1;
    });
    return map;
  }, [activities, year, month]);

  // evita hydration mismatch
  if (!mounted) return null;

  const totalCells = Math.ceil((mondayIndex + daysInMonth) / 7) * 7;
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <section className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 sm:p-6">
      <div className="flex items-center justify-center">
        <h2 className="text-xs uppercase tracking-widest text-neutral-500">
          {monthLabel}
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 sm:gap-2 text-center">
        {weekDays.map((d, i) => (
          <div key={`${d}-${i}`} className="h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center text-[10px] sm:text-[11px] text-neutral-500 font-medium">
            {d}
          </div>
        ))}

        {Array.from({ length: totalCells }, (_, idx) => {
          const day = idx - mondayIndex + 1;
          if (day < 1 || day > daysInMonth) {
            return <div key={`empty-${idx}`} className="h-8 sm:h-10 w-8 sm:w-10" />;
          }

          const count = countsByDay[day] || 0;
          const isToday = day === today.getDate();

          return (
            <div
              key={`day-${day}`}
              className={`h-8 sm:h-10 rounded-full p-1 w-8 sm:w-10 flex flex-col items-center justify-center transition
                ${isToday ? "border border-white/30 bg-neutral-800/50" : ""}`}
            >
              <span className={`text-xs sm:text-sm ${isToday ? "text-white font-medium" : "text-neutral-200"}`}>
                {day}
              </span>

              {count > 0 && (
                <div className="mt-0.5 sm:mt-1 flex gap-0.5 sm:gap-1">
                  {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <span
                      key={`dot-${day}-${i}`}
                      className="h-0.5 sm:h-1 w-0.5 sm:w-1 rounded-full bg-red-400"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
