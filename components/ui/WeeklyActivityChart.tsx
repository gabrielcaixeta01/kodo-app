"use client";

import { useEffect, useMemo, useState } from "react";
import { useActivities } from "@/hooks/useActivities";
import { useSessions } from "@/hooks/useSessions";

type DayData = {
  label: string;
  count: number;
};

type Session = {
  started_at: string;
  duration: number;
};

function getLast7DaysDuration(sessions: Session[]): DayData[] {
  const result: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('📊 [WeeklyChart] Total sessions:', sessions.length);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Formata a data para YYYY-MM-DD para comparação simples
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const totalMinutes = sessions.filter(s => {
      if (!s.started_at) return false;
      
      // Cria data local para evitar problemas de timezone
      const sessionDate = new Date(s.started_at);
      const sessionDateString = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;
      
      const match = sessionDateString === dateString;
      
      if (match) {
        console.log(`✅ Session matched for ${dateString}:`, {
          started_at: s.started_at,
          duration: s.duration,
          sessionDateString
        });
      }
      
      return match;
    }).reduce((acc, s) => acc + (s.duration || 0), 0);

    console.log(`📅 ${dateString}: ${totalMinutes} minutes`);

    result.push({
      label: date.toLocaleDateString("pt-BR", {
        weekday: "short",
      }),
      count: totalMinutes as number,
    });
  }

  return result;
}

export function WeeklyActivityChart() {
  useActivities();
  const { sessions } = useSessions();
  const [mounted, setMounted] = useState(false);

  const data = useMemo(
    () => getLast7DaysDuration(sessions),
    [sessions]
  );

  const maxCount = Math.max(...data.map(d => d.count), 1);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 🔒 evita hydration mismatch
  if (!mounted) return null;

  return (
    <section className="rounded-2xl border border-neutral-800 p-4 sm:p-6 bg-neutral-950">
      <h2 className="text-xs uppercase tracking-widest text-neutral-500">
        Últimos 7 dias
      </h2>

      <div className="mt-4 flex items-end gap-2 sm:gap-4 h-24 sm:h-32">
        {data.map((d, i) => {
          const height = (d.count / maxCount) * 100;

          return (
            <div
              key={`day-${i}`}
              className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 min-w-0"
            >
              <div className="relative h-full flex items-end w-full">
                <div
                  className="rounded-lg bg-linear-to-b from-emerald-400/90 to-emerald-600 transition-all duration-300 mx-auto"
                  style={{ height: `${height}%`, minHeight: d.count > 0 ? 8 : 2, width: '60%' }}
                />
              </div>

              {/* Minutes label */}
              {d.count > 0 ? (
                <span className="text-[10px] sm:text-[11px] text-neutral-300 leading-none">{d.count}m</span>
              ) : (
                <span className="text-[10px] sm:text-[11px] text-transparent leading-none">0m</span>
              )}

              <span className="text-[10px] sm:text-[11px] text-neutral-400 truncate">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-center italic text-neutral-500">
        Minutos de foco por dia
      </p>
    </section>
  );
}
