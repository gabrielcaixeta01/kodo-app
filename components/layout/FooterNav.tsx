"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Atividades", href: "/activities" },
  { label: "Progresso", href: "/progress" },
  { label: "Configurações", href: "/settings" },
];

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed z-10 bottom-0 left-0 right-0 border-t border-neutral-800 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-3xl flex justify-around py-3 sm:py-5 px-2">
        {navItems.map(item => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs sm:text-sm px-2 py-1.5 rounded transition ${
                isActive
                  ? "text-white font-medium bg-neutral-900/50"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/30"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
