"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Atividades", href: "/activities" },
  { label: "Progresso", href: "/progress" },
  { label: "Configurações", href: "/settings" },
];

export function FooterNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading || !user || pathname === "/login") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-800 bg-black/90 backdrop-blur">
      <div
        className="
          mx-auto max-w-3xl
          flex justify-around items-center
          h-16 sm:h-20
          px-2
        "
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center
                flex-1
                h-full
                text-xs sm:text-sm
                transition
                ${
                  isActive
                    ? "text-white font-medium"
                    : "text-neutral-400 hover:text-neutral-200"
                }
              `}
            >
              <span
                className={`
                  px-3 py-2 rounded-lg
                  ${
                    isActive
                      ? "bg-neutral-900/60"
                      : "hover:bg-neutral-900/40"
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
