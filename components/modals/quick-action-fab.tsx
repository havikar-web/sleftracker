"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  PenTool,
  CheckSquare,
  RotateCcw,
  FileCheck2,
  Target,
  Play,
} from "lucide-react";
import { useTimer } from "@/components/timer-context";
import { cn } from "@/lib/utils";

export function QuickActionFab({
  onOpenTask,
  onOpenPractice,
  onOpenTest,
  onOpenGoal,
  onOpenRevision,
}: {
  onOpenTask: () => void;
  onOpenPractice: () => void;
  onOpenTest?: () => void;
  onOpenGoal?: () => void;
  onOpenRevision?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { startTimer, isRunning } = useTimer();

  const handleAction = (cb?: () => void) => {
    setIsOpen(false);
    if (cb) cb();
  };

  return (
    <>
      {/* Backdrop when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-100"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Action Menu */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 flex flex-col items-end">
        {/* Menu Items */}
        {isOpen && (
          <div className="mb-3 flex flex-col gap-2 animate-in slide-in-from-bottom-5 duration-150">
            <button
              onClick={() => handleAction(onOpenPractice)}
              className="flex items-center gap-2.5 px-3.5 py-2 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-full shadow-lg hover:bg-emerald-900 transition-transform active:scale-95"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Log Practice</span>
            </button>

            <button
              onClick={() => handleAction(onOpenTask)}
              className="flex items-center gap-2.5 px-3.5 py-2 bg-blue-950 border border-blue-800 text-blue-300 text-xs font-semibold rounded-full shadow-lg hover:bg-blue-900 transition-transform active:scale-95"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>

            {!isRunning && (
              <button
                onClick={() => {
                  startTimer();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold rounded-full shadow-lg hover:bg-indigo-900 transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Study Timer</span>
              </button>
            )}

            {onOpenTest && (
              <button
                onClick={() => handleAction(onOpenTest)}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-full shadow-lg hover:bg-zinc-800 transition-transform active:scale-95"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Log Test</span>
              </button>
            )}

            {onOpenGoal && (
              <button
                onClick={() => handleAction(onOpenGoal)}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-full shadow-lg hover:bg-zinc-800 transition-transform active:scale-95"
              >
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Goal</span>
              </button>
            )}
          </div>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Quick Actions"
          className={cn(
            "h-12 w-12 rounded-full shadow-xl flex items-center justify-center text-white transition-all transform active:scale-90",
            isOpen
              ? "bg-zinc-800 rotate-45 border border-zinc-700"
              : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/30"
          )}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
