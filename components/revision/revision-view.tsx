"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import { cn, getSubjectColor } from "@/lib/utils";
import { completeRevision } from "@/lib/actions/revision-actions";

export function RevisionView({ revisionsData }: { revisionsData: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRev, setSelectedRev] = useState<any>(null);
  const [recallQuality, setRecallQuality] = useState<"POOR" | "WEAK" | "OKAY" | "STRONG">("STRONG");
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [questionsSolved, setQuestionsSolved] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { dueToday = [], overdue = [], upcoming = [], fresh = [] } = revisionsData;

  const handleOpenComplete = (rev: any) => {
    setSelectedRev(rev);
    setModalOpen(true);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRev) return;

    setIsSubmitting(true);
    try {
      await completeRevision({
        revisionId: selectedRev.id,
        recallQuality,
        durationMinutes,
        questionsSolved,
      });
      setModalOpen(false);
      setSelectedRev(null);
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
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
            <RotateCcw className="w-4 h-4" /> Spaced Repetition Engine
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Active Spaced Revision</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Dynamic recall schedules (1d → 3d → 7d → 14d → 30d) calibrated to prevent syllabus decay
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg shrink-0">
          <div>
            <div className="text-[10px] text-zinc-400 font-medium">Due For Action</div>
            <div className="text-xl font-bold font-mono text-indigo-400">
              {dueToday.length + overdue.length} Chapters
            </div>
          </div>
        </div>
      </div>

      {/* 4 Revision Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. DUE TODAY */}
        <div className="jee-card space-y-3 border-indigo-500/30 bg-indigo-950/10">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Due Today ({dueToday.length})
              </h2>
            </div>
            <span className="text-[10px] text-indigo-400 font-mono">High Retention Impact</span>
          </div>

          <div className="space-y-2">
            {dueToday.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">All today&apos;s revisions completed!</div>
            ) : (
              dueToday.map((rev: any) => {
                const colors = getSubjectColor(rev.chapter.subject.name);
                return (
                  <div
                    key={rev.id}
                    className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("badge-tag text-[10px]", colors.badge)}>
                          {rev.chapter.subject.shortName}
                        </span>
                        <Link
                          href={`/chapter/${rev.chapter.slug}`}
                          className="font-bold text-zinc-100 hover:text-blue-400 truncate"
                        >
                          {rev.chapter.name}
                        </Link>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                        Cycle #{rev.revisionNumber} • Scheduled for Today
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenComplete(rev)}
                      className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0 active:scale-95 transition-colors"
                    >
                      Log Recall
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2. OVERDUE */}
        <div className="jee-card space-y-3 border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Overdue Revisions ({overdue.length})
              </h2>
            </div>
            <span className="text-[10px] text-rose-400 font-mono">Memory Decaying</span>
          </div>

          <div className="space-y-2">
            {overdue.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">No overdue revisions. Excellent!</div>
            ) : (
              overdue.map((rev: any) => {
                const colors = getSubjectColor(rev.chapter.subject.name);
                return (
                  <div
                    key={rev.id}
                    className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("badge-tag text-[10px]", colors.badge)}>
                          {rev.chapter.subject.shortName}
                        </span>
                        <Link
                          href={`/chapter/${rev.chapter.slug}`}
                          className="font-bold text-zinc-100 hover:text-blue-400 truncate"
                        >
                          {rev.chapter.name}
                        </Link>
                      </div>
                      <div className="text-[11px] text-rose-400 mt-1 font-mono">
                        Overdue by {Math.abs(Math.round((new Date(rev.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenComplete(rev)}
                      className="px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shrink-0 active:scale-95 transition-colors"
                    >
                      Revise Now
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. UPCOMING */}
        <div className="jee-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Upcoming ({upcoming.length})
            </h2>
            <span className="text-[10px] text-zinc-500 font-mono">Next 7–30 Days</span>
          </div>

          <div className="space-y-2">
            {upcoming.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">No upcoming revisions queued.</div>
            ) : (
              upcoming.map((rev: any) => {
                const colors = getSubjectColor(rev.chapter.subject.name);
                const daysUntil = Math.ceil(
                  (new Date(rev.scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={rev.id}
                    className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={cn("badge-tag text-[10px]", colors.badge)}>
                        {rev.chapter.subject.shortName}
                      </span>
                      <span className="font-medium text-zinc-200 truncate">{rev.chapter.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0">Due in {daysUntil}d</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 4. FRESH (Recently Completed) */}
        <div className="jee-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Freshly Retained ({fresh.length})
            </h2>
            <span className="text-[10px] text-zinc-500 font-mono">Reinforced</span>
          </div>

          <div className="space-y-2">
            {fresh.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">Complete a revision to see it here.</div>
            ) : (
              fresh.map((rev: any) => {
                const colors = getSubjectColor(rev.chapter.subject.name);
                return (
                  <div
                    key={rev.id}
                    className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={cn("badge-tag text-[10px]", colors.badge)}>
                        {rev.chapter.subject.shortName}
                      </span>
                      <span className="font-medium text-zinc-200 truncate">{rev.chapter.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/40 border border-emerald-900/50">
                      Recall: {rev.recallQuality || "STRONG"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Log Recall Modal */}
      {modalOpen && selectedRev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h2 className="text-sm font-semibold text-zinc-100">Log Revision Recall Feedback</h2>
                <p className="text-[11px] text-zinc-400">{selectedRev.chapter.name}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleComplete} className="mt-4 space-y-4 text-xs">
              {/* Recall Quality Selector */}
              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  How was your retention/recall quality?
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: "STRONG", label: "Strong", desc: "+30 days", class: "bg-emerald-950/40 border-emerald-800 text-emerald-300" },
                    { id: "OKAY", label: "Okay", desc: "+14 days", class: "bg-blue-950/40 border-blue-800 text-blue-300" },
                    { id: "WEAK", label: "Weak", desc: "+2 days", class: "bg-amber-950/40 border-amber-800 text-amber-300" },
                    { id: "POOR", label: "Poor", desc: "+1 day", class: "bg-rose-950/40 border-rose-800 text-rose-300" },
                  ].map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setRecallQuality(q.id as any)}
                      className={cn(
                        "p-2 rounded-lg border text-center transition-all",
                        recallQuality === q.id
                          ? cn(q.class, "ring-2 ring-white/20 font-bold")
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      )}
                    >
                      <div className="text-xs">{q.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{q.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Spent & Questions Solved */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Time Spent (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Questions Solved</label>
                  <input
                    type="number"
                    min="0"
                    value={questionsSolved}
                    onChange={(e) => setQuestionsSolved(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 font-mono"
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
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Save Recall & Reschedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
