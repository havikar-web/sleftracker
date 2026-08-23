"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  BookOpen,
  Target,
  PenTool,
  BarChart3,
  FileCheck2,
  RotateCcw,
  CalendarCheck,
  Settings,
  Flame,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const PRIMARY_NAV = [
  { name: "Today", href: "/", icon: LayoutDashboard },
  { name: "Focus & MCQ Timer", href: "/focus", icon: Flame },
  { name: "Roadmap", href: "/roadmap", icon: Compass },
  { name: "Syllabus", href: "/syllabus", icon: BookOpen },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Practice", href: "/practice", icon: PenTool },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export const SECONDARY_NAV = [
  { name: "Mock Tests", href: "/tests", icon: FileCheck2 },
  { name: "Revision", href: "/revision", icon: RotateCcw },
  { name: "Weekly Review", href: "/review", icon: CalendarCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/80 backdrop-blur-md h-screen sticky top-0 shrink-0 select-none shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              JEE OS <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">2027</span>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Target: Jan 1st Mains</div>
          </div>
        </Link>

        {/* Theme Switcher Button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400"
          title="Toggle Theme"
        >
          <Sun className="w-3.5 h-3.5 hidden dark:block text-amber-400" />
          <Moon className="w-3.5 h-3.5 block dark:hidden text-zinc-700" />
        </button>
      </div>

      {/* Global Search Button */}
      <div className="p-3">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            Quick Search...
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Primary Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          <div className="px-2 mb-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Command
          </div>
          <nav className="space-y-1">
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Deep Tools Nav */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Evaluation & Tools
          </div>
          <nav className="space-y-1">
            {SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile & Streak info */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40">
        <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/60 rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Active Target</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Jan 1st</span>
        </div>
      </div>
    </aside>
  );
}
