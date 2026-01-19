"use client";

import { useSession } from "@/contexts/SessionContext";
import { useEffect, useState } from "react";

type AlignmentStatus = "good" | "warning" | "off-track";

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
        "You focused better during the morning."
      );
    }

    if (nightSessions > morningSessions) {
      patterns.push(
        "Night sessions were more frequent than expected."
      );
    }

    if (totalMinutes > 300) {
      patterns.push(
        "Your total focus time increased this week."
      );
    }

    if (patterns.length === 0) {
      patterns.push(
        "Not enough data yet to identify patterns."
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
      area: "Focus discipline",
      status:
        consistency >= 60
          ? "good"
          : consistency >= 30
          ? "warning"
          : "off-track",
      note:
        consistency >= 60
          ? "You maintained a consistent study rhythm."
          : "Try to distribute sessions across more days.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-medium">Reflect</h1>
          <p className="text-sm text-neutral-400">
            Weekly review
          </p>
        </header>

        {/* Week summary */}
        <section className="rounded-2xl border border-neutral-800 p-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            This week
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-neutral-500">Sessions</p>
              <p className="text-lg">{totalSessions}</p>
            </div>

            <div>
              <p className="text-neutral-500">Focus time</p>
              <p className="text-lg">
                {(totalMinutes / 60).toFixed(1)}h
              </p>
            </div>

            <div>
              <p className="text-neutral-500">Consistency</p>
              <p className="text-lg">{consistency}%</p>
            </div>

            <div>
              <p className="text-neutral-500">Avg / session</p>
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
            Patterns noticed
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
            Alignment review
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
                    item.status === "good"
                      ? "text-green-400"
                      : item.status === "warning"
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
            System adjustment
          </h2>

          <p className="text-sm text-neutral-400">
            KODO will gradually favor time slots and action
            types where you showed higher consistency.
          </p>
        </section>
      </div>
    </main>
  );
}
