// app/settings/page.tsx

type EnergyLevel = "low" | "medium" | "high";

export default function SettingsPage() {
  // mocks (depois vêm do storage)
  const energy: EnergyLevel = "medium";
  const dailyTime = 120; // minutes
  const focusMode = true;
  const localOnly = true;

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-16">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-medium">Settings</h1>
          <p className="text-sm text-neutral-400">
            Control how KODO works for you
          </p>
        </header>

        {/* Daily Context */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Daily context
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Energy */}
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">
                Default energy level
              </p>

              <div className="flex gap-2">
                {(["low", "medium", "high"] as EnergyLevel[]).map(e => (
                  <button
                    key={e}
                    className={`px-4 py-1.5 rounded-full border text-xs uppercase tracking-widest transition ${
                      energy === e
                        ? "border-white text-white"
                        : "border-neutral-700 text-neutral-500 hover:border-neutral-500"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">
                Available time per day
              </p>
              <p className="text-lg font-medium">
                {dailyTime} min
              </p>
            </div>
          </div>
        </section>

        {/* Decision Behavior */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Decision behavior
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium">Focus mode</p>
              <p className="text-sm text-neutral-400">
                Suggest only one action at a time
              </p>
            </div>

            <span
              className={`text-xs uppercase tracking-widest ${
                focusMode ? "text-green-400" : "text-neutral-500"
              }`}
            >
              {focusMode ? "Enabled" : "Disabled"}
            </span>
          </div>
        </section>

        {/* Privacy */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Privacy
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium">Local-only data</p>
              <p className="text-sm text-neutral-400">
                Your data never leaves this device
              </p>
            </div>

            <span
              className={`text-xs uppercase tracking-widest ${
                localOnly ? "text-green-400" : "text-neutral-500"
              }`}
            >
              {localOnly ? "Active" : "Inactive"}
            </span>
          </div>
        </section>

        {/* System */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            System
          </h2>

          <div className="grid gap-5 p-2 md:grid-cols-2">
            <button className="rounded-xl border border-neutral-700 py-2.5 text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition">
              Reset decision learning
            </button>

            <button className="rounded-xl border border-red-500/40 py-2.5 text-sm text-red-400 hover:border-red-500 hover:text-red-300 transition">
              Clear all local data
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
