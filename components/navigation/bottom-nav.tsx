"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Target,
  PenTool,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_NAV_ITEMS = [
  { name: "Today", href: "/", icon: LayoutDashboard },
  { name: "Roadmap", href: "/roadmap", icon: Compass },
  { name: "Syllabus", href: "/syllabus", icon: BookOpen },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Practice", href: "/practice", icon: PenTool },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800/80 px-2 py-1.5 pb-safe shadow-md">
      <div className="flex items-center justify-around">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl text-[10px] font-semibold transition-all",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 active:scale-95"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 mb-0.5 transition-transform",
                  isActive ? "scale-110 text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
