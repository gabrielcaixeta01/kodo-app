"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Atividades", href: "/" },
  { label: "Estudos", href: "/studies" },
  { label: "Objetivos", href: "/goals" },
  { label: "Progresso", href: "/progress" },
  { label: "Configurações", href: "/settings" },
];

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-3xl flex justify-around py-5">
        {navItems.map(item => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs transition ${
                isActive
                  ? "text-white font-medium"
                  : "text-neutral-500 hover:text-neutral-300"
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
