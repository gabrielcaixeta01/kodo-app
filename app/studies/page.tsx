// app/studies/page.tsx

type RiskLevel = "low" | "medium" | "high";

type Subject = {
  id: string;
  name: string;
  professor: string;
  credits: number;
  risk: RiskLevel;
  nextDeadline?: {
    title: string;
    days: number;
  };
  progress: number; // 0 → 100
};

const riskOrder: Record<RiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function StudiesPage() {
  const subjects: Subject[] = [
    {
      id: "sd",
      name: "Sistemas Digitais",
      professor: "João Silva",
      credits: 4,
      risk: "high",
      nextDeadline: {
        title: "Prova 1",
        days: 3,
      },
      progress: 45,
    },
    {
      id: "calc3",
      name: "Cálculo III",
      professor: "Maria Oliveira",
      credits: 4,
      risk: "medium",
      nextDeadline: {
        title: "Lista 4",
        days: 7,
      },
      progress: 65,
    },
    {
      id: "fis",
      name: "Física II",
      professor: "Carlos Lima",
      credits: 4,
      risk: "low",
      progress: 80,
    },
  ];

  const sortedSubjects = [...subjects].sort(
    (a, b) => riskOrder[a.risk] - riskOrder[b.risk]
  );

  const atRiskCount = subjects.filter(s => s.risk === "high").length;
  const upcomingExams = subjects.filter(s => s.nextDeadline).length;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-medium">Studies</h1>
          <p className="text-sm text-neutral-400">
            Current semester overview
          </p>
        </header>

        {/* Overview */}
        <section className="rounded-2xl border border-neutral-800 p-5">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Semester Status
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-neutral-500">Disciplines</p>
              <p className="text-lg">{subjects.length}</p>
            </div>

            <div>
              <p className="text-neutral-500">At risk</p>
              <p className="text-lg">{atRiskCount}</p>
            </div>

            <div>
              <p className="text-neutral-500">Upcoming deadlines</p>
              <p className="text-lg">{upcomingExams}</p>
            </div>
          </div>
        </section>

        {/* Discipline List */}
        <section className="space-y-4">
          {sortedSubjects.map(subject => (
            <div
              key={subject.id}
              className="rounded-2xl border border-neutral-800 p-5 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {subject.professor} · {subject.credits} credits
                  </p>
                </div>

                <span
                  className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${
                    subject.risk === "high"
                      ? "border-red-500/40 text-red-400"
                      : subject.risk === "medium"
                      ? "border-yellow-500/40 text-yellow-400"
                      : "border-green-500/40 text-green-400"
                  }`}
                >
                  {subject.risk} risk
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
                <div>
                  {subject.nextDeadline ? (
                    <>
                      Next: {subject.nextDeadline.title} ·{" "}
                      {subject.nextDeadline.days} days
                    </>
                  ) : (
                    "No upcoming deadlines"
                  )}
                </div>

                <div className="w-32">
                  <div className="h-1 rounded-full bg-neutral-800">
                    <div
                      className="h-1 rounded-full bg-white"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-right">
                    {subject.progress}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
