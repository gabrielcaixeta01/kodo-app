"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSessions } from "@/hooks/useSessions";
import {
  ChartBarIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type AlignmentStatus = "bom" | "aviso" | "fora-de-trilha";

function getDayName(date: Date): string {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[date.getDay()];
}

function formatHours(mins: number) {
  return `${(mins / 60).toFixed(1)}h`;
}

export default function ProgressPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading } = useSessions();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const now = useMemo(() => new Date(), []);
  const sevenDaysAgo = useMemo(
    () => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    [now]
  );

  const sessionsThisWeek = useMemo(() => {
    return sessions.filter((s) => {
      const sessionDate = new Date(s.started_at);
      return sessionDate >= sevenDaysAgo;
    });
  }, [sessions, sevenDaysAgo]);

  if (authLoading || sessionsLoading) {
    return (
      <main className="min-h-screen bg-black text-white">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
          <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
        </div>

        <div className="relative mx-auto max-w-3xl p-4 sm:p-6 pb-24 sm:pb-20 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 animate-pulse">
            <div className="h-5 w-32 rounded bg-white/10" />
            <div className="mt-2 h-4 w-60 rounded bg-white/10" />
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="h-20 rounded-2xl bg-white/10" />
              <div className="h-20 rounded-2xl bg-white/10" />
              <div className="h-20 rounded-2xl bg-white/10" />
              <div className="h-20 rounded-2xl bg-white/10" />
            </div>
            <div className="mt-6 h-28 rounded-2xl bg-white/10" />
          </div>
        </div>
      </main>
    );
  }

  const finishedSessions = sessionsThisWeek.filter((s) => s.ended_at);
  const completedSessions = finishedSessions.filter((s) => s.status === "completed");
  const interruptedSessions = finishedSessions.filter((s) => s.status === "interrupted");

  /* ------------------ métricas ------------------ */
  const totalSessions = completedSessions.length;
  const totalInterrupted = interruptedSessions.length;
  const totalCompletedMinutes = completedSessions.reduce((sum, s) => sum + (s.duration ?? 0), 0);

  const daysWithSessions = new Set(
    finishedSessions.map((s) => new Date(s.started_at).toDateString())
  ).size;

  const consistency = daysWithSessions > 0 ? Math.round((daysWithSessions / 7) * 100) : 0;

  const completionRate =
    totalSessions + totalInterrupted > 0
      ? Math.round((totalSessions / (totalSessions + totalInterrupted)) * 100)
      : 0;

  const avgMinutesPerSession = totalSessions
    ? Math.round(totalCompletedMinutes / totalSessions)
    : 0;

  const morningSessions = finishedSessions.filter((s) => {
    const h = new Date(s.started_at).getHours();
    return h >= 6 && h < 12;
  }).length;

  const afternoonSessions = finishedSessions.filter((s) => {
    const h = new Date(s.started_at).getHours();
    return h >= 12 && h < 18;
  }).length;

  const nightSessions = finishedSessions.filter((s) => {
    const h = new Date(s.started_at).getHours();
    return h >= 18;
  }).length;

  const weekdayDistribution = finishedSessions.reduce((acc, s) => {
    const day = getDayName(new Date(s.started_at));
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostProductiveDay = Object.keys(weekdayDistribution).length
    ? Object.keys(weekdayDistribution).reduce((a, b) =>
        weekdayDistribution[a] > weekdayDistribution[b] ? a : b
      )
    : null;

  const patterns: string[] = [];

  if (finishedSessions.length > 0) {
    if (morningSessions > afternoonSessions && morningSessions > nightSessions) {
      patterns.push("Você tende a ter melhor performance pela manhã.");
    } else if (afternoonSessions > morningSessions && afternoonSessions > nightSessions) {
      patterns.push("Seu pico de produtividade costuma ser à tarde.");
    } else if (nightSessions > morningSessions) {
      patterns.push("Você costuma focar mais durante a noite.");
    }

    if (completionRate >= 80) patterns.push("Excelente taxa de conclusão das sessões.");
    else if (completionRate < 50) patterns.push("Muitas sessões foram interrompidas.");

    if (mostProductiveDay) patterns.push(`${mostProductiveDay} foi seu dia mais produtivo.`);
  }

  if (patterns.length === 0) {
    patterns.push("Ainda não há dados suficientes para identificar padrões.");
  }

  const alignment: {
    area: string;
    status: AlignmentStatus;
    note: string;
  }[] = [
    {
      area: "Taxa de conclusão",
      status: completionRate >= 80 ? "bom" : completionRate >= 60 ? "aviso" : "fora-de-trilha",
      note:
        completionRate >= 80
          ? "Você raramente interrompe sessões."
          : completionRate >= 60
          ? "Algumas sessões foram interrompidas."
          : "Muitas interrupções. Ajuste ambiente e meta da sessão.",
    },
    {
      area: "Volume de prática",
      status: totalCompletedMinutes >= 300 ? "bom" : totalCompletedMinutes >= 120 ? "aviso" : "fora-de-trilha",
      note:
        totalCompletedMinutes >= 300
          ? "Boa carga semanal de foco."
          : totalCompletedMinutes >= 120
          ? "Carga moderada de foco."
          : "Pouco tempo de foco registrado nesta semana.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute top-[35%] -left-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
      </div>

      <div className="relative mx-auto max-w-3xl p-4 sm:p-6 pb-24 sm:pb-20 space-y-6 sm:space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
            <ChartBarIcon className="h-4 w-4" />
            <span>Progresso</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Progresso
              </h1>
              <p className="text-sm text-neutral-400">
                Revisão semanal do seu desempenho
              </p>
            </div>

            <span className="hidden sm:inline text-xs text-neutral-400 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
              Últimos 7 dias
            </span>
          </div>
        </header>

        {/* Week summary */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]">
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-200">
              <SparklesIcon className="h-5 w-5 text-neutral-300" />
              <span>Esta semana</span>
            </div>

            <span className="text-xs text-neutral-500">
              Resumo rápido
            </span>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile label="Sessões" value={totalSessions} />
              <StatTile label="Tempo de foco" value={formatHours(totalCompletedMinutes)} />
              <StatTile label="Consistência" value={`${consistency}%`} />
              <StatTile label="Tempo / sessão" value={`${avgMinutesPerSession} min`} />
            </div>

            <div className="mt-4 text-xs text-neutral-500">
              Dica: consistência alta costuma bater “picos” de motivação.
            </div>
          </div>
        </section>

        {/* Patterns */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <h2 className="text-sm text-neutral-200">Padrões identificados</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Insights com base nas sessões finalizadas
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <ul className="space-y-3">
              {patterns.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/25 shrink-0" />
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {p}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Alignment */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-neutral-500">
              Revisão de alinhamento
            </h2>
            <span className="text-[11px] text-neutral-400 border border-white/10 bg-white/5 px-2 py-1 rounded-full">
              {alignment.length} métricas
            </span>
          </div>

          <div className="grid gap-3">
            {alignment.map((item) => (
              <AlignmentCard key={item.area} item={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- components ---------- */

function StatTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-neutral-100">
        {value}
      </p>
    </div>
  );
}

function AlignmentCard({
  item,
}: {
  item: { area: string; status: AlignmentStatus; note: string };
}) {
  const statusUI =
    item.status === "bom"
      ? {
          label: "Bom",
          dot: "bg-emerald-400/80",
          pill: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
          Icon: CheckCircleIcon,
        }
      : item.status === "aviso"
      ? {
          label: "Aviso",
          dot: "bg-amber-400/80",
          pill: "border-amber-500/25 bg-amber-500/10 text-amber-200",
          Icon: ExclamationTriangleIcon,
        }
      : {
          label: "Fora",
          dot: "bg-red-400/80",
          pill: "border-red-500/25 bg-red-500/10 text-red-200",
          Icon: XCircleIcon,
        };

  const Icon = statusUI.Icon;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm sm:text-base font-medium text-neutral-100">
            {item.area}
          </p>
          <p className="mt-1 text-sm text-neutral-400 leading-relaxed">
            {item.note}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusUI.dot}`} />
          <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusUI.pill}`}>
            <span className="inline-flex items-center gap-1.5">
              <Icon className="h-4 w-4" />
              {statusUI.label}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}