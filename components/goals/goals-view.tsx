"use client";

import React, { useState } from "react";
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
  X,
  Loader2,
} from "lucide-react";
import { cn, getPriorityLabel } from "@/lib/utils";
import { createGoal, deleteGoal } from "@/lib/actions/goal-actions";

export function GoalsView({ goals, allChapters = [] }: { goals: any[]; allChapters: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [goalType, setGoalType] = useState("WEEKLY");
  const [priority, setPriority] = useState("HIGH");
  const [metricType, setMetricType] = useState("QUESTIONS");
  const [targetValue, setTargetValue] = useState(350);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const end = new Date();
      if (goalType === "DAILY") end.setDate(end.getDate() + 1);
      else if (goalType === "WEEKLY") end.setDate(end.getDate() + 7);
      else if (goalType === "MONTHLY") end.setMonth(end.getMonth() + 1);
      else end.setMonth(end.getMonth() + 3);

      await createGoal({
        title,
        goalType,
        priority,
        startDate: now,
        endDate: end,
        metrics: [
          {
            metricType,
            targetValue,
          },
        ],
      });
      setTitle("");
      setModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <Target className="w-4 h-4" /> Goal Alignment Matrix
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Academic Milestone Goals</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Auto-synchronized metrics derived live from practice logs, tests, and chapter readiness
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors shadow-sm shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const priorityBadge = getPriorityLabel(goal.priority);
          const daysLeft = Math.ceil(
            (new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={goal.id}
              className="p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-700 transition-colors space-y-3 flex flex-col justify-between"
            >
              <div>
                {/* Header: Goal Type + Priority + Deadline */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {goal.goalType.replace("_", " ")}
                    </span>
                    <span className={cn("badge-tag text-[10px]", priorityBadge.class)}>
                      {priorityBadge.icon} {priorityBadge.label}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400">
                    {daysLeft > 0 ? `${daysLeft}d left` : "Due today"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white">{goal.title}</h3>
                {goal.description && (
                  <p className="text-xs text-zinc-400 mt-1">{goal.description}</p>
                )}

                {/* Metrics Breakdown */}
                <div className="mt-3.5 space-y-2.5">
                  {goal.metrics.map((m: any) => (
                    <div key={m.id} className="p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-850">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-300 font-medium">
                          {m.metricType.replace("_", " ")}
                        </span>
                        <span className="font-mono text-zinc-200 font-bold">
                          {m.currentValue} / {m.targetValue}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${m.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Goal Progress Footer */}
              <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Aggregate Progress</span>
                <span className="font-mono font-bold text-emerald-400">{goal.overallProgress}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-100">Create Academic Goal</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Sprint: 350 Questions across PCM"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Goal Tier</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
                  >
                    <option value="WEEKLY">Weekly Sprint</option>
                    <option value="MONTHLY">Monthly Target</option>
                    <option value="LONG_TERM">Long Term Milestone</option>
                    <option value="DAILY">Daily Target</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
                  >
                    <option value="CRITICAL">🔥 Critical</option>
                    <option value="HIGH">🟠 High</option>
                    <option value="MEDIUM">🟡 Medium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Target Metric</label>
                  <select
                    value={metricType}
                    onChange={(e) => setMetricType(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
                  >
                    <option value="QUESTIONS">Solved Questions</option>
                    <option value="STUDY_HOURS">Focused Study Hours</option>
                    <option value="TESTS">Mock Tests Taken</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Target Value</label>
                  <input
                    type="number"
                    min="1"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Create Goal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
