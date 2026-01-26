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
    <nav className="fixed bottom-0 left-0 right-0 z-30">
      {/* subtle fade to content */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-linear-to-t from-black/80 to-transparent" />

      <div
        className="
          mx-auto max-w-3xl
          px-3 pb-3
        "
      >
        <div
          className="
            flex items-center justify-between
            h-16 sm:h-18
            rounded-3xl
            border border-white/10
            bg-white/5 backdrop-blur-xl
            shadow-[0_-1px_0_rgba(255,255,255,0.04)]
          "
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group relative flex-1 h-full
                  flex items-center justify-center
                "
              >
                <div
                  className={[
                    "flex flex-col items-center gap-1",
                    "text-[11px] sm:text-xs transition",
                    isActive
                      ? "text-white font-medium"
                      : "text-neutral-400 group-hover:text-neutral-200",
                  ].join(" ")}
                >
                  {/* Active indicator */}
                  <span
                    className={[
                      "px-3 py-1.5 rounded-full transition ease-in-out duration-500",
                      isActive
                        ? "bg-white/10 border border-white/15"
                        : "border border-transparent group-hover:bg-white/5",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>

                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}