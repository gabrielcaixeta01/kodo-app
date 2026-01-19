"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Studies", href: "/studies" },
  { label: "Path", href: "/path" },
  { label: "Reflect", href: "/reflect" },
];

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-neutral-800 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-3xl flex justify-around py-3">
        {navItems.map(item => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition ${
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
