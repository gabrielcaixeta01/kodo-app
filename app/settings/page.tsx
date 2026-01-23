// app/settings/page.tsx

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24 sm:pb-16">
      <div className="max-w-3xl w-full mx-auto space-y-6 sm:space-y-10">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-medium">Configurações</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Controle como o KODO funciona para você
          </p>
        </header>

        {/* User Info */}
        <section className="rounded-2xl border border-neutral-800 p-4 sm:p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Conta
          </h2>
          
          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Email</p>
            <p className="text-base">{user?.email}</p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            Sair
          </button>
        </section>
      </div>
    </main>
  );
}
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
        <section className="rounded-2xl border border-neutral-800 p-4 sm:p-6 space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500">
            Sistema
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-neutral-400">Resetar o progresso semanal</p>
              <button 
                onClick={handleResetProgress}
                className="w-full rounded-lg border border-neutral-700 px-4 py-2.5 text-xs sm:text-sm text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-white/5 transition font-medium"
              >
                Resetar
              </button>
            </div>
            
          </div>
        </section>
      </div>
    </main>
  );
}
