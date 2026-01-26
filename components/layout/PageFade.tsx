"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Props {
  children: ReactNode;
}

export function PageFade({ children }: Props) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Garante que skeleton aparece antes do fade in
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false);
    const id = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={`transition-opacity duration-700 ease-out ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {children}
    </div>
  );
}
