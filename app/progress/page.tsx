"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSessions } from "@/hooks/useSessions";

type AlignmentStatus = "bom" | "aviso" | "fora-de-trilha";

function getDayName(date: Date): string {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[date.getDay()];
}

export default function ProgressPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading } = useSessions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100); // pequeno atraso para evitar flicker

    return () => clearTimeout(timer);
    //
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, mounted, router]);

  // ✅ Filtrar apenas últimos 7 dias
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const sessionsThisWeek = sessions.filter((s) => {
    const sessionDate = new Date(s.started_at);
    return sessionDate >= sevenDaysAgo;
  });

  if (authLoading || sessionsLoading || !mounted) {
    return (
      <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-20">
        <div className="max-w-3xl w-full mx-auto">
          <div className="rounded-2xl border border-neutral-800 p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-neutral-800 rounded" />
            <div className="h-4 bg-neutral-800 rounded w-2/3" />
            <div className="h-24 bg-neutral-800 rounded" />
          </div>
        </div>
      </main>
    );
  }

  const finishedSessions = sessionsThisWeek.filter((s) => s.ended_at);
  const completedSessions = finishedSessions.filter((s) => s.status === "completed");
  const interruptedSessions = finishedSessions.filter((s) => s.status === "interrupted");

  /* ------------------ métricas ------------------ */
  const totalSessions = mounted ? completedSessions.length : 0;
  const totalInterrupted = mounted ? interruptedSessions.length : 0;

  const totalMinutes = mounted
    ? finishedSessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)
    : 0;

  const daysWithSessions = mounted
    ? new Set(
        finishedSessions.map((s) =>
          new Date(s.started_at).toDateString()
        )
      ).size
    : 0;

  const consistency = mounted && daysWithSessions > 0
    ? Math.round((daysWithSessions / 7) * 100)
    : 0;

  const completionRate =
    mounted && totalSessions + totalInterrupted > 0
      ? Math.round(
          (totalSessions /
            (totalSessions + totalInterrupted)) *
            100
        )
      : 0;

  /* ------------------ padrões ------------------ */
  const morningSessions = mounted
    ? finishedSessions.filter((s) => {
        const h = new Date(s.started_at).getHours();
        return h >= 6 && h < 12;
      }).length
    : 0;

  const afternoonSessions = mounted
    ? finishedSessions.filter((s) => {
        const h = new Date(s.started_at).getHours();
        return h >= 12 && h < 18;
      }).length
    : 0;

  const nightSessions = mounted
    ? finishedSessions.filter((s) => {
        const h = new Date(s.started_at).getHours();
        return h >= 18;
      }).length
    : 0;

  const weekdayDistribution = mounted
    ? finishedSessions.reduce((acc, s) => {
        const day = getDayName(new Date(s.started_at));
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};

  const mostProductiveDay =
    mounted && Object.keys(weekdayDistribution).length
      ? Object.keys(weekdayDistribution).reduce((a, b) =>
          weekdayDistribution[a] >
          weekdayDistribution[b]
            ? a
            : b
        )
      : null;

  const patterns: string[] = [];

  if (mounted && finishedSessions.length > 0) {
    if (morningSessions > afternoonSessions && morningSessions > nightSessions) {
      patterns.push("Você tem melhor performance pela manhã.");
    } else if (afternoonSessions > morningSessions && afternoonSessions > nightSessions) {
      patterns.push("Seu pico de produtividade é à tarde.");
    } else if (nightSessions > morningSessions) {
      patterns.push("Você tende a focar mais à noite.");
    }

    if (completionRate >= 80) {
      patterns.push("Excelente taxa de conclusão das sessões.");
    } else if (completionRate < 50) {
      patterns.push("Muitas sessões foram interrompidas.");
    }

    if (mostProductiveDay) {
      patterns.push(`${mostProductiveDay} foi seu dia mais produtivo.`);
    }
  }

  if (patterns.length === 0) {
    patterns.push("Ainda não há dados suficientes para identificar padrões.");
  }

  /* ------------------ alinhamento ------------------ */
  const alignment: {
    area: string;
    status: AlignmentStatus;
    note: string;
  }[] = [
    {
      area: "Taxa de conclusão",
      status:
        completionRate >= 80
          ? "bom"
          : completionRate >= 60
          ? "aviso"
          : "fora-de-trilha",
      note:
        completionRate >= 80
          ? "Você raramente interrompe sessões."
          : completionRate >= 60
          ? "Algumas sessões foram interrompidas."
          : "Muitas interrupções. Reveja seu ambiente.",
    },
    {
      area: "Volume de prática",
      status:
        totalMinutes >= 300
          ? "bom"
          : totalMinutes >= 120
          ? "aviso"
          : "fora-de-trilha",
      note:
        totalMinutes >= 300
          ? "Boa carga semanal de foco."
          : totalMinutes >= 120
          ? "Carga moderada de foco."
          : "Pouco tempo de foco registrado.",
    },
  ];

  /* ------------------ UI ------------------ */
  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-20">
      <div className="max-w-3xl w-full mx-auto space-y-6 sm:space-y-10">
        <header>
          <h1 className="text-xl sm:text-2xl font-medium">
            Progresso
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Revisão semanal do seu desempenho
          </p>
        </header>

        {/* Week summary */}
        <section className="rounded-2xl border border-neutral-800 p-4 sm:p-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Esta semana
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
            <Stat label="Sessões" value={totalSessions} />
            <Stat
              label="Tempo de foco"
              value={`${(totalMinutes / 60).toFixed(1)}h`}
            />
            <Stat
              label="Consistência"
              value={`${consistency}%`}
            />
            <Stat
              label="Tempo / sessão"
              value={`${
                totalSessions
                  ? Math.round(
                      totalMinutes / totalSessions
                    )
                  : 0
              } min`}
            />
          </div>
        </section>

        {/* Patterns */}
        <section className="rounded-2xl border border-neutral-800 p-4 sm:p-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
            Padrões identificados
          </h2>

          <ul className="space-y-2">
            {patterns.map((p, i) => (
              <li
                key={i}
                className="text-xs sm:text-sm text-neutral-300 flex gap-2"
              >
                <span className="shrink-0">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Alignment */}
        <section className="space-y-2 sm:space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Revisão de alinhamento
          </h2>

          {alignment.map(item => (
            <div
              key={item.area}
              className="rounded-2xl border border-neutral-800 p-4 sm:p-5"
            >
              <div className="flex justify-between gap-2">
                <p className="font-medium text-sm sm:text-base">
                  {item.area}
                </p>
                <span
                  className={`text-xs uppercase shrink-0 font-medium ${
                    item.status === "bom"
                      ? "text-green-400"
                      : item.status === "aviso"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {item.status.replace("-", " ")}
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-neutral-400">
                {item.note}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

/* ---------- helper ---------- */
function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs sm:text-sm text-neutral-500">{label}</p>
      <p className="text-base sm:text-lg font-medium mt-1">{value}</p>
    </div>
  );
}
