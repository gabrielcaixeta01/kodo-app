"use client";

import { useSession } from "@/contexts/SessionContext";
import { useEffect, useState } from "react";

type AlignmentStatus = "bom" | "aviso" | "fora-de-trilha";

function minutesBetween(start: number, end: number) {
  return Math.floor((end - start) / 60000);
}

export default function ReflectPage() {
  const { history } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ---------- métricas reais ----------
  const totalSessions = mounted ? history.length : 0;

  const totalMinutes = mounted
    ? history.reduce((sum, s) => {
        return sum + minutesBetween(s.startedAt, s.endedAt);
      }, 0)
    : 0;

  // dias únicos com sessão (consistência simples)
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

  // ---------- padrões simples ----------
  const morningSessions = mounted
    ? history.filter(s => {
        const hour = new Date(s.startedAt).getHours();
        return hour >= 6 && hour < 12;
      }).length
    : 0;

  const nightSessions = mounted
    ? history.filter(s => {
        const hour = new Date(s.startedAt).getHours();
        return hour >= 18;
      }).length
    : 0;

  const patterns: string[] = [];

  if (mounted) {
    if (morningSessions > nightSessions) {
      patterns.push(
        "Você tende a focar mais pela manhã."
      );
    }

    if (nightSessions > morningSessions) {
      patterns.push(
        "Você tende a focar mais à noite."
      );
    }

    if (totalMinutes > 300) {
      patterns.push(
        "Seu tempo total de foco aumentou esta semana."
      );
    }

    if (patterns.length === 0) {
      patterns.push(
        "Ainda não há dados suficientes para identificar padrões."
      );
    }
  }

  // ---------- alinhamento simples ----------
  const alignment: {
    area: string;
    status: AlignmentStatus;
    note: string;
  }[] = [
    {
      area: "Disciplina de foco",
      status:
        consistency >= 60
          ? "bom"
          : consistency >= 30
          ? "aviso"
          : "fora-de-trilha",
      note:
        consistency >= 60
          ? "Você manteve um ritmo de estudo consistente."
          : "Tente distribuir as sessões por mais dias.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-medium">Progresso</h1>
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
            <div>
              <p className="text-neutral-500">Sessões</p>
              <p className="text-lg">{totalSessions}</p>
            </div>

            <div>
              <p className="text-neutral-500">Tempo de foco</p>
              <p className="text-lg">
                {(totalMinutes / 60).toFixed(1)}h
              </p>
            </div>

            <div>
              <p className="text-neutral-500">Consistência</p>
              <p className="text-lg">{consistency}%</p>
            </div>

            <div>
              <p className="text-neutral-500">Tempo por sessão</p>
              <p className="text-lg">
                {totalSessions
                  ? Math.round(
                      totalMinutes / totalSessions
                    )
                  : 0}{" "}
                min
              </p>
            </div>
          </div>
        </section>

        {/* Patterns */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Padrões identificados
          </h2>

          <ul className="space-y-2 text-sm text-neutral-400">
            {patterns.map((p, i) => (
              <li
                key={i}
                className="rounded-xl border border-neutral-800 p-4"
              >
                {p}
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
              <div className="flex items-center justify-between">
                <p className="font-medium">{item.area}</p>
                <span
                  className={`text-xs uppercase tracking-widest ${
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

        {/* System adjustment (informativo) */}
        <section className="rounded-2xl border border-neutral-800 p-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
            Ajuste do sistema
          </h2>

          <p className="text-sm text-neutral-400">
            KODO irá favorecer gradualmente os horários e tipos de ação
            onde você mostrou maior consistência.
          </p>
        </section>
      </div>
    </main>
  );
}
