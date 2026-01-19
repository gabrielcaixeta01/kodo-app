"use client";

import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionPage() {
  const { session, endSession } = useSession();
  const router = useRouter();

  // ✅ mounted sem effect
  const [mounted] = useState(
    () => typeof window !== "undefined"
  );

  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // 🔹 redireciona se não houver sessão
  useEffect(() => {
    if (mounted && !session) {
      router.replace("/");
    }
  }, [mounted, session, router]);

  // 🔹 controla o tempo
  useEffect(() => {
    if (!mounted || !session) return;

    function updateTime() {
      if (!session) return;
      const diff = Date.now() - session.startedAt;
      setElapsedMinutes(Math.floor(diff / 60000));
    }

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [mounted, session]);

  // 🔒 guarda de render
  if (!mounted) return null;
  if (!session) return null;

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-neutral-800 p-6 space-y-6">
        <h1 className="text-xl font-medium">
          Focus session
        </h1>

        <div className="space-y-1">
          <p className="text-sm text-neutral-400">
            Current action
          </p>
          <p className="text-lg font-medium">
            {session.actionTitle}
          </p>
        </div>

        <p className="text-sm text-neutral-500">
          Elapsed time: {elapsedMinutes} min
        </p>

        <button
          onClick={() => {
            endSession();
            router.push("/reflect");
          }}
          className="w-full rounded-xl border border-red-500/40 py-2 text-sm text-red-400 hover:border-red-500 hover:text-red-300 transition"
        >
          End session
        </button>
      </div>
    </main>
  );
}
