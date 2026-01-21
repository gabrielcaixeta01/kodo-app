// app/settings/page.tsx

"use client";

import { useState } from "react";
import { DailyTimeSlider } from "@/components/ui/DailyTimeSlider";

type EnergyLevel = "baixa" | "média" | "alta";

export default function SettingsPage() {
  const [energy, setEnergy] = useState<EnergyLevel>("média");
  const [dailyTime, setDailyTime] = useState(120); // minutes

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
                    onClick={() => setEnergy(e)}
                    className={`px-4 py-1.5 rounded-full border text-xs uppercase tracking-widest transition ${
                      energy === e
                        ? "border-white text-white bg-white/5"
                        : "border-neutral-700 text-neutral-500 hover:border-neutral-600 hover:text-neutral-400"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <DailyTimeSlider 
                value={dailyTime} 
                onChange={setDailyTime}
              />
            </div>
          </div>
        </section>

        {/* System */}
        <section className="rounded-2xl border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Sistema
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">Resetar o progresso semanal</p>
              <button className="w-full rounded-lg border border-neutral-700 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-white/5 transition">
                Resetar
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">Apagar todos os dados locais</p>
              <button className="w-full rounded-lg border border-red-500/30 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:border-red-500/50 hover:bg-red-950/20 transition">
                Apagar
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
