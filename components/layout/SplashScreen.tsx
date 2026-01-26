"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const SPLASH_DURATION = 3000; // tempo mínimo visível (ms)

export function SplashScreen() {
  const router = useRouter();
  const { loading } = useAuth();

  const [showSplash, setShowSplash] = useState(true);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!loading && !redirectedRef.current) {
      redirectedRef.current = true;

      const timer = setTimeout(() => {
        setShowSplash(false);
        router.replace("/login");
      }, SPLASH_DURATION);

      return () => clearTimeout(timer);
    }
  }, [loading, router]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 bg-black z-9999 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
          <Image
            src="/kodo.png"
            alt="Kodo"
            fill
            priority
            sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
            className="object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)] animate-fade-in"
          />
        </div>

        <p className="text-sm text-neutral-400 animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}