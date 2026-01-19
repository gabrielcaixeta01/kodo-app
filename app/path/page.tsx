// app/path/page.tsx

type PathCategory = "academic" | "career" | "personal" | "health";

type Path = {
  id: string;
  title: string;
  category: PathCategory;
  deadline?: string;
  progress: number; // 0 → 100 (aproximado)
  alignment: "good" | "warning" | "off-track";
  description: string;
  linkedActions: string[];
};

const categoryLabel: Record<PathCategory, string> = {
  academic: "Academic",
  career: "Career",
  personal: "Personal",
  health: "Health",
};

const alignmentColor: Record<Path["alignment"], string> = {
  good: "text-green-400 border-green-500/40",
  warning: "text-yellow-400 border-yellow-500/40",
  "off-track": "text-red-400 border-red-500/40",
};

export default function PathPage() {
  const paths: Path[] = [
    {
      id: "grad",
      title: "Graduate in Computer Engineering",
      category: "academic",
      deadline: "Dec 2028",
      progress: 55,
      alignment: "good",
      description:
        "Foundation for long-term career and research opportunities.",
      linkedActions: [
        "Study Sistemas Digitais",
        "Maintain consistency in core subjects",
        "Build academic projects",
      ],
    },
    {
      id: "portfolio",
      title: "Build a strong personal portfolio",
      category: "career",
      deadline: "Jun 2026",
      progress: 30,
      alignment: "warning",
      description:
        "Showcase projects, skills and consistency in engineering work.",
      linkedActions: [
        "Work on KODO",
        "Publish projects on GitHub",
        "Improve frontend polish",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-16">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-medium">Path</h1>
          <p className="text-sm text-neutral-400">
            Your long-term directions
          </p>
        </header>

        {/* Active Paths */}
        <section className="space-y-6">
          {paths.map(path => (
            <div
              key={path.id}
              className="rounded-2xl border border-neutral-800 p-6 space-y-5"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-medium">
                    {path.title}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {categoryLabel[path.category]}
                    {path.deadline && ` · ${path.deadline}`}
                  </p>
                </div>

                <span
                  className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${alignmentColor[path.alignment]}`}
                >
                  {path.alignment.replace("-", " ")}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-400">
                {path.description}
              </p>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                  <span>Progress</span>
                  <span>{path.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-800">
                  <div
                    className="h-1.5 rounded-full bg-white"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>

              {/* Linked Actions */}
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
                  Actions contributing to this path
                </p>
                <ul className="space-y-1 text-sm text-neutral-400">
                  {path.linkedActions.map(action => (
                    <li key={action}>• {action}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
