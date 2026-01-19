// app/reflect/page.tsx

type WeeklyStats = {
  studySessions: number;
  totalMinutes: number;
  consistency: number; // 0 → 100
  suggestedActionsCompleted: number;
  suggestedActionsTotal: number;
};

type PatternInsight = {
  id: string;
  text: string;
};

type AlignmentReview = {
  area: string;
  status: "good" | "warning" | "off-track";
  note: string;
};

const alignmentColor: Record<AlignmentReview["status"], string> = {
  good: "text-green-400",
  warning: "text-yellow-400",
  "off-track": "text-red-400",
};

export default function ReflectPage() {
  const stats: WeeklyStats = {
    studySessions: 6,
    totalMinutes: 340,
    consistency: 60,
    suggestedActionsCompleted: 4,
    suggestedActionsTotal: 6,
  };

  const patterns: PatternInsight[] = [
    {
      id: "p1",
      text: "You focused better in the morning than at night.",
    },
    {
      id: "p2",
      text: "Medium-energy tasks had the highest completion rate.",
    },
    {
      id: "p3",
      text: "Sistemas Digitais required more effort than expected.",
    },
  ];

  const alignment: AlignmentReview[] = [
    {
      area: "Academic path",
      status: "good",
      note: "Consistent study sessions across core subjects.",
    },
    {
      area: "Career path",
      status: "warning",
      note: "Low progress on portfolio-related work.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-16">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-medium">Reflect</h1>
          <p className="text-sm text-neutral-400">
            Week of Jan 13 → Jan 19
          </p>
        </header>

        {/* Week Summary */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            This week
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-neutral-500">Study sessions</p>
              <p className="text-lg">{stats.studySessions}</p>
            </div>

            <div>
              <p className="text-neutral-500">Focus time</p>
              <p className="text-lg">
                {(stats.totalMinutes / 60).toFixed(1)}h
              </p>
            </div>

            <div>
              <p className="text-neutral-500">Consistency</p>
              <p className="text-lg">{stats.consistency}%</p>
            </div>

            <div>
              <p className="text-neutral-500">Suggested actions</p>
              <p className="text-lg">
                {stats.suggestedActionsCompleted} /{" "}
                {stats.suggestedActionsTotal}
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
            {patterns.map(p => (
              <li
                key={p.id}
                className="rounded-xl border border-neutral-800 p-4"
              >
                {p.text}
              </li>
            ))}
          </ul>
        </section>

        {/* Alignment Review */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Alignment review
          </h2>

          <div className="space-y-4">
            {alignment.map(item => (
              <div
                key={item.area}
                className="rounded-2xl border border-neutral-800 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.area}</p>
                  <span
                    className={`text-xs uppercase tracking-widest ${alignmentColor[item.status]}`}
                  >
                    {item.status.replace("-", " ")}
                  </span>
                </div>

                <p className="mt-2 text-sm text-neutral-400">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* System Adjustments */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            System adjustments
          </h2>

          <p className="text-sm text-neutral-400">
            Based on this week, KODO will slightly prioritize
            medium-energy tasks and earlier study sessions.
          </p>
        </section>
      </div>
    </main>
  );
}
