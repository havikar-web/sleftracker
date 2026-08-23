"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PenTool,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Filter,
  Plus,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn, getSubjectColor, formatDuration } from "@/lib/utils";
import { QuickPracticeModal } from "@/components/modals/quick-practice-modal";

export function PracticeHubView({
  practiceHistory,
  stats,
  allChapters = [],
}: {
  practiceHistory: any[];
  stats: any;
  allChapters: any[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedSource, setSelectedSource] = useState("ALL");

  const filteredHistory = practiceHistory.filter((item) => {
    if (selectedSubject !== "ALL" && item.subject.name !== selectedSubject) return false;
    if (selectedSource !== "ALL" && item.source !== selectedSource) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <PenTool className="w-4 h-4" /> Practice Engine
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Question Practice & Independent Accuracy
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Strict separation between independent solves, assisted attempts, and conceptual mistakes
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-sm shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ Log Practice Session</span>
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Questions */}
        <div className="jee-card">
          <div className="text-[11px] text-zinc-400 font-medium">Total Solved</div>
          <div className="text-xl font-bold font-mono text-zinc-100 mt-1">{stats.totalQuestions}</div>
          <div className="text-[10px] text-zinc-400 mt-1">Across all JEE subjects</div>
        </div>

        {/* Independent Accuracy */}
        <div className="jee-card">
          <div className="text-[11px] text-zinc-400 font-medium">Independent Accuracy</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {stats.independentAccuracy}%
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">Solved without hints/solutions</div>
        </div>

        {/* Assisted Questions */}
        <div className="jee-card">
          <div className="text-[11px] text-zinc-400 font-medium">Assisted Questions</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {stats.assistedQuestions}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">Required hints or AI help</div>
        </div>

        {/* Wrong Questions */}
        <div className="jee-card">
          <div className="text-[11px] text-zinc-400 font-medium">Mistakes / Gaps</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">{stats.wrongQuestions}</div>
          <div className="text-[10px] text-zinc-400 mt-1">Flagged for error review</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-zinc-800 text-xs">
        <span className="text-zinc-500 font-medium mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>

        {/* Subject Filter */}
        {["ALL", "Physics", "Chemistry", "Mathematics", "Biology"].map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={cn(
              "px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors",
              selectedSubject === sub
                ? "bg-zinc-800 text-white border-zinc-700 font-semibold"
                : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-850"
            )}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Practice Session History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span>Logged Practice Sessions ({filteredHistory.length})</span>
          <span className="font-mono text-[11px]">Real-time database records</span>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">
            No practice logs found. Start logging sessions to track your independent accuracy.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredHistory.map((sess: any) => {
              const colors = getSubjectColor(sess.subject.name);
              const totalAttempted = sess.correctIndependent + sess.wrong + sess.assisted;
              const accuracy =
                totalAttempted > 0 ? Math.round((sess.correctIndependent / totalAttempted) * 100) : 0;

              return (
                <div
                  key={sess.id}
                  className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  {/* Left: Subject + Chapter + Source */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("badge-tag text-[10px] font-semibold", colors.badge)}>
                        {sess.subject.name}
                      </span>
                      <Link
                        href={`/chapter/${sess.chapter.slug}`}
                        className="font-bold text-sm text-zinc-100 hover:text-blue-400 transition-colors"
                      >
                        {sess.chapter.name}
                      </Link>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {sess.source.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                      <span>{new Date(sess.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                      <span>•</span>
                      <span>{sess.durationMinutes} minutes</span>
                      {sess.sourceDetail && (
                        <>
                          <span>•</span>
                          <span className="italic text-zinc-500 truncate max-w-xs">{sess.sourceDetail}</span>
                        </>
                      )}
                    </div>

                    {sess.notes && (
                      <p className="text-[11px] text-zinc-400 bg-zinc-900/60 p-1.5 rounded border border-zinc-850 mt-1">
                        {sess.notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Question Breakdown & Accuracy */}
                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-850">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-zinc-200 font-bold">{sess.questions} Qs:</span>
                      <span className="text-emerald-400">{sess.correctIndependent} ✓</span>
                      <span className="text-rose-400">{sess.wrong} ✗</span>
                      {sess.assisted > 0 && <span className="text-amber-400">{sess.assisted} 💡</span>}
                    </div>

                    <div className="text-right pl-3 border-l border-zinc-800">
                      <div className="text-[10px] text-zinc-400">Accuracy</div>
                      <div
                        className={cn(
                          "font-mono font-bold text-sm",
                          accuracy >= 75
                            ? "text-emerald-400"
                            : accuracy >= 60
                            ? "text-amber-400"
                            : "text-rose-400"
                        )}
                      >
                        {accuracy}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Practice Modal */}
      <QuickPracticeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        chapters={allChapters}
      />
    </div>
  );
}
