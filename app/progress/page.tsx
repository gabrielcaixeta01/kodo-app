"use client";

import { useSession } from "@/contexts/SessionContext";
import { useEffect, useState } from "react";

type AlignmentStatus = "bom" | "aviso" | "fora-de-trilha";

function minutesBetween(start: number, end: number) {
  return Math.floor((end - start) / 60000);
}

function getDayName(date: Date): string {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return days[date.getDay()];
}

export default function ProgressPage() {
  const { history, interrupted } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  /* ------------------ métricas ------------------ */
  const totalSessions = mounted ? history.length : 0;
  const totalInterrupted = mounted ? interrupted.length : 0;

  const totalMinutes = mounted
    ? history.reduce(
        (sum, s) => sum + minutesBetween(s.startedAt, s.endedAt),
        0
      )
    : 0;

  const daysWithSessions = mounted
    ? new Set(
        history.map(s =>
          new Date(s.startedAt).toDateString()
        )
      ).size
    : 0;

  const consistency = Math.min(
    Math.round((daysWithSessions / 7) * 100),
    100
  );

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
    ? history.filter(s => {
        const h = new Date(s.startedAt).getHours();
        return h >= 6 && h < 12;
      }).length
    : 0;

  const afternoonSessions = mounted
    ? history.filter(s => {
        const h = new Date(s.startedAt).getHours();
        return h >= 12 && h < 18;
      }).length
    : 0;

  const nightSessions = mounted
    ? history.filter(s => {
        const h = new Date(s.startedAt).getHours();
        return h >= 18;
      }).length
    : 0;

  const weekdayDistribution = mounted
    ? history.reduce((acc, s) => {
        const day = getDayName(new Date(s.startedAt));
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

  if (mounted) {
    if (
      morningSessions > afternoonSessions &&
      morningSessions > nightSessions
    ) {
      patterns.push(
        "Você tem melhor performance pela manhã."
      );
    } else if (
      afternoonSessions > morningSessions &&
      afternoonSessions > nightSessions
    ) {
      patterns.push(
        "Seu pico de produtividade é à tarde."
      );
    } else if (nightSessions > morningSessions) {
      patterns.push(
        "Você tende a focar mais à noite."
      );
    }

    if (completionRate >= 80) {
      patterns.push(
        "Excelente taxa de conclusão das sessões."
      );
    } else if (completionRate < 50) {
      patterns.push(
        "Muitas sessões foram interrompidas."
      );
    }

    if (mostProductiveDay) {
      patterns.push(
        `${mostProductiveDay} foi seu dia mais produtivo.`
      );
    }

    if (patterns.length === 0) {
      patterns.push(
        "Ainda não há dados suficientes para identificar padrões."
      );
    }
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
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <header>
          <h1 className="text-2xl font-medium">
            Progresso
          </h1>
          <p className="text-sm text-neutral-400">
            Revisão semanal do seu desempenho
          </p>
        </header>

        {/* Week summary */}
        <section className="rounded-2xl border border-neutral-800 p-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Esta semana
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
        <section className="rounded-2xl border border-neutral-800 p-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
            Padrões identificados
          </h2>

          <ul className="space-y-2">
            {patterns.map((p, i) => (
              <li
                key={i}
                className="text-sm text-neutral-300 flex gap-2"
              >
                <span>•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Alignment */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Revisão de alinhamento
          </h2>

          {alignment.map(item => (
            <div
              key={item.area}
              className="rounded-2xl border border-neutral-800 p-5"
            >
              <div className="flex justify-between">
                <p className="font-medium">
                  {item.area}
                </p>
                <span
                  className={`text-xs uppercase ${
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
              <p className="mt-2 text-sm text-neutral-400">
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
      <p className="text-neutral-500">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
