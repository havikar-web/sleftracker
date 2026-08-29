"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Square,
  Search,
  Moon,
  Sun,
  Plus,
  Flame,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import { useTimer } from "@/components/timer-context";
import { useTheme } from "next-themes";
import { getDaysUntil } from "@/lib/utils";

export function Header({
  onOpenSearch,
  onOpenQuickAction,
  onOpenQuickPractice,
  onOpenDescribe,
  targetDate = "2027-01-01",
}: {
  onOpenSearch?: () => void;
  onOpenQuickAction?: () => void;
  onOpenQuickPractice?: () => void;
  onOpenDescribe?: () => void;
  targetDate?: string | Date;
}) {
  const { isRunning, isPaused, seconds, activeSession, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer } = useTimer();
  const { theme, setTheme } = useTheme();
  const [isFinishing, setIsFinishing] = useState(false);

  const daysRemaining = getDaysUntil(targetDate);

  // Format active timer string HH:MM:SS
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const timeStr = `${hrs > 0 ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const handleStop = async () => {
    setIsFinishing(true);
    await stopTimer();
    setIsFinishing(false);
  };

  const handleDiscard = () => {
    if (seconds > 30) {
      if (!window.confirm("⚠️ End timer without saving?\n\nThis study time will NOT be added to your daily progress.")) {
        return;
      }
    }
    resetTimer();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/80 px-4 backdrop-blur-md">
      {/* Mobile Brand / Target */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="h-7 w-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            ⚡
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">JEE OS</span>
        </Link>

        {/* Target Countdown Pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-700 dark:text-zinc-300">
          <span className="font-bold text-blue-600 dark:text-blue-400">JEE MAIN 2027</span>
          <span className="text-zinc-400">•</span>
          <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
            {daysRemaining} Days to Jan 1st
          </span>
        </div>
      </div>

      {/* Right Controls: Study Timer Bar + Quick Actions + Theme */}
      <div className="flex items-center gap-2">
        {/* Active Timer Indicator */}
        {isRunning ? (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 rounded-md text-blue-700 dark:text-blue-300 text-xs shadow-sm">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: "8s" }} />
            <span className="font-mono font-semibold">{timeStr}</span>
            <div className="flex items-center gap-1 ml-1">
              {isPaused ? (
                <button
                  onClick={resumeTimer}
                  className="p-1 hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded text-blue-800 dark:text-blue-200 cursor-pointer"
                  title="Resume"
                >
                  <Play className="w-3 h-3 fill-current" />
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="p-1 hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded text-blue-800 dark:text-blue-200 cursor-pointer"
                  title="Pause"
                >
                  <Pause className="w-3 h-3 fill-current" />
                </button>
              )}

              {/* Discard without saving */}
              <button
                onClick={handleDiscard}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-rose-500 rounded text-zinc-400 cursor-pointer"
                title="End without saving to progress (Discard)"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Save and add to progress */}
              <button
                onClick={handleStop}
                disabled={isFinishing}
                className="p-1 hover:bg-rose-100 dark:hover:bg-rose-950 hover:text-rose-600 dark:hover:text-rose-300 rounded text-zinc-500 cursor-pointer"
                title="Finish & Save (+ Progress)"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/focus"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors shadow-xs"
          >
            <Play className="w-3 h-3 text-emerald-600 dark:text-emerald-400 fill-current" />
            <span>Study &amp; MCQ Timer</span>
          </Link>
        )}

        {/* AI Quick Describe Button */}
        {onOpenDescribe && (
          <button
            onClick={onOpenDescribe}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-300 dark:border-blue-800/80 rounded-md transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Describe what you studied in natural language to auto-update JEE OS"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Describe</span>
          </button>
        )}

        {/* Quick Practice Button */}
        <button
          onClick={onOpenQuickPractice}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/60 rounded-md transition-colors shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Practice</span>
        </button>

        {/* Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors"
          title="Search (⌘K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-1 p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors"
          title="Toggle Light/Dark Theme"
        >
          <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
          <Moon className="w-4 h-4 block dark:hidden text-zinc-700" />
        </button>
      </div>
    </header>
  );
}
