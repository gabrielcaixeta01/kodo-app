// app/settings/page.tsx

type EnergyLevel = "baixa" | "média" | "alta";

export default function SettingsPage() {
  // mocks (depois vêm do storage)
  const energy: EnergyLevel = "média";
  const dailyTime = 120; // minutes
  const focusMode = true;
  const localOnly = true;

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-16">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-medium">Configurações</h1>
          <p className="text-sm text-neutral-400">
            Controle como o KODO funciona para você
          </p>
        </header>

        {/* Daily Context */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Contexto diário
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Energy */}
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">
                Nível de energia padrão
              </p>

              <div className="flex gap-2">
                {(["baixa", "média", "alta"] as EnergyLevel[]).map(e => (
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
                Tempo disponível por dia
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
            Comportamento de decisão
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium">Modo foco</p>
              <p className="text-sm text-neutral-400">
                Sugere apenas uma ação por vez
              </p>
            </div>

            <span
              className={`text-xs uppercase tracking-widest ${
                focusMode ? "text-green-400" : "text-neutral-500"
              }`}
            >
              {focusMode ? "Ativado" : "Desativado"}
            </span>
          </div>
        </section>

        {/* Privacy */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Privacidade
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium">Dados locais</p>
              <p className="text-sm text-neutral-400">
                Seus dados nunca saem deste dispositivo
              </p>
            </div>

            <span
              className={`text-xs uppercase tracking-widest ${
                localOnly ? "text-green-400" : "text-neutral-500"
              }`}
            >
              {localOnly ? "Ativado" : "Desativado"}
            </span>
          </div>
        </section>

        {/* System */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Sistema
          </h2>

          <div className="grid gap-5 p-2 md:grid-cols-2">
            <button className="rounded-xl border border-neutral-700 py-2.5 text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition">
              Resetar aprendizado de decisão
            </button>

            <button className="rounded-xl border border-red-500/40 py-2.5 text-sm text-red-400 hover:border-red-500 hover:text-red-300 transition">
              Apagar todos os dados locais
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
