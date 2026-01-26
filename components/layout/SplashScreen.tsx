"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const SPLASH_MIN_MS = 3000; // tempo mínimo visível
const FADE_OUT_MS = 350; // duração do fade-out

export function SplashScreen() {
  const router = useRouter();
  const { loading } = useAuth();

  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const startAtRef = useRef<number>(0);
  const redirectedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    startAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    // Só tenta encerrar quando o auth terminar
    if (loading) return;
    if (redirectedRef.current) return;

    redirectedRef.current = true;

    const elapsed = Date.now() - startAtRef.current;
    const remaining = Math.max(0, SPLASH_MIN_MS - elapsed);

    // 1) espera tempo mínimo, 2) faz fade-out, 3) navega
    timeoutRef.current = window.setTimeout(() => {
      setExiting(true);

      timeoutRef.current = window.setTimeout(() => {
        setVisible(false);
        router.replace("/login");
      }, FADE_OUT_MS);
    }, remaining);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [loading, router]);

  if (!visible) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-9999 flex items-center justify-center",
        "bg-black",
        "transition-opacity duration-350",
        exiting ? "opacity-0" : "opacity-100",
      ].join(" ")}
      aria-label="Carregando"
      role="status"
    >
      {/* Background premium (igual suas páginas) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-160 w-160 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-130 w-130 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.20]" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-6">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
          <Image
            src="/kodo.png"
            alt="Kodo"
            fill
            priority
            sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
            className={[
              "object-contain",
              "drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
              "opacity-0 animate-[fadeIn_500ms_ease-out_forwards]",
            ].join(" ")}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-neutral-300">Carregando…</p>
          <div className="h-1 w-28 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-1/3 bg-white/30 animate-[bar_900ms_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* Keyframes inline via tailwind arbitrary (precisa do JIT, que você já tem) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bar {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(140%); }
          100% { transform: translateX(140%); }
        }
      `}</style>
    </div>
  );
}