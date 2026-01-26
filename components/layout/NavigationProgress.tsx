"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Inicia barra sempre que a rota muda
    const t0 = setTimeout(() => {
      setVisible(true);
      setProgress(0);
    }, 0);

    const t1 = setTimeout(() => setProgress(35), 10);
    const t2 = setTimeout(() => setProgress(65), 180);
    const t3 = setTimeout(() => setProgress(90), 360);

    const t4 = setTimeout(() => {
      setProgress(100);
      // Pequena espera antes de esconder para evitar flicker
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }, 600);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-0.75 z-50 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
