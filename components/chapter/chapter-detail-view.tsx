"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  FileCheck2,
  Calendar,
  Layers,
  Award,
  Zap,
  CheckCheck,
  Target,
} from "lucide-react";
import { cn, getSubjectColor, getStatusBadge, getPriorityLabel } from "@/lib/utils";
import { cycleTopicStatus, updateChapterManualProgress } from "@/lib/actions/chapter-actions";
import { logPracticeSession } from "@/lib/actions/practice-actions";
import { setActiveWeeklyTargetChapter } from "@/lib/actions/task-actions";
import { QuickPracticeModal } from "@/components/modals/quick-practice-modal";
import { useTimer } from "@/components/timer-context";
import { ProgressCircle } from "@/components/ui/progress-circle";

export function ChapterDetailView({
  chapter,
  progress,
  readiness,
  priority,
  diagnostic,
  sourceBreakdown,
  allChapters = [],
}: {
  chapter: any;
  progress: any;
  readiness: any;
  priority: any;
  diagnostic: any;
  sourceBreakdown: Record<string, any>;
  allChapters: any[];
}) {
  const [topics, setTopics] = useState(chapter.topics);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [liveReadiness, setLiveReadiness] = useState(readiness.readinessScore || 0);
  const [liveQuestionsSolved, setLiveQuestionsSolved] = useState(progress?.questionsSolved || 0);
  const { startTimer } = useTimer();

  const colors = getSubjectColor(chapter.subject.name);
  const statusBadge = getStatusBadge(readiness.status);
  const priorityBadge = getPriorityLabel(priority.priorityTier);

  // 1-click topic cycle
  const handleTopicClick = async (topicId: string) => {
    const statusCycle = ["NOT_STARTED", "LEARNING", "UNDERSTOOD", "PRACTISED", "STRONG"];
    const currentTopic = topics.find((t: any) => t.id === topicId);
    const currentStatus = currentTopic?.progress[0]?.status || "NOT_STARTED";
    const nextStatus = statusCycle[(statusCycle.indexOf(currentStatus) + 1) % statusCycle.length];

    setTopics((prev: any[]) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              progress: [{ status: nextStatus }],
            }
          : t
      )
    );

    await cycleTopicStatus(topicId, chapter.id);
  };

  // Batch Update all topics in 1 click!
  const handleBatchTopics = async (targetStatus: "UNDERSTOOD" | "PRACTISED" | "STRONG" | "NOT_STARTED") => {
    setTopics((prev: any[]) =>
      prev.map((t) => ({
        ...t,
        progress: [{ status: targetStatus }],
      }))
    );

    let theoryScore = 0;
    if (targetStatus === "UNDERSTOOD") theoryScore = 75;
    if (targetStatus === "PRACTISED") theoryScore = 90;
    if (targetStatus === "STRONG") theoryScore = 100;

    await updateChapterManualProgress({
      chapterId: chapter.id,
      theoryScore,
      questionsSolved: liveQuestionsSolved,
      pyqsSolved: progress?.pyqsSolved || 0,
      correctIndependent: progress?.correctIndependent || 0,
      wrong: progress?.wrong || 0,
      assisted: progress?.assisted || 0,
    });
  };

  // 1-Tap Quick Question Add
  const handleQuickAddQuestions = async (count: number) => {
    setLiveQuestionsSolved((prev: number) => prev + count);
    await logPracticeSession({
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      source: "JEE_MAIN_PYQ",
      questions: count,
      correctIndependent: Math.round(count * 0.8),
      wrong: Math.round(count * 0.15),
      assisted: Math.round(count * 0.05),
      durationMinutes: count * 2,
      difficulty: "MEDIUM",
      notes: `Quick 1-tap logged +${count} questions`,
    });
  };

  const getTopicStatusColor = (st: string) => {
    switch (st) {
      case "STRONG":
        return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40";
      case "PRACTISED":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40";
      case "UNDERSTOOD":
        return "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/40";
      case "LEARNING":
        return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="space-y-3">
        <Link
          href="/syllabus"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Syllabus
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={cn("badge-tag text-xs font-semibold", colors.badge)}>
                {chapter.subject.name}
              </span>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Class {chapter.classLevel}</span>
              <span className={cn("badge-tag text-xs", priorityBadge.class)}>
                {priorityBadge.icon} {priorityBadge.label} Priority
              </span>
              <span className={cn("badge-tag text-xs", statusBadge.class)}>
                {statusBadge.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {chapter.name}
            </h1>
          </div>

          {/* Large Circular Readiness Ring & Action Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
              <ProgressCircle value={liveReadiness} size={70} strokeWidth={6} color="#3b82f6" label="Ready" />
              <div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold">
                  Chapter Readiness
                </div>
                <div className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {liveReadiness}% Score
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={async () => {
                  await setActiveWeeklyTargetChapter(chapter.id, 50);
                  alert(`🎯 Set "${chapter.name}" as this week's active target chapter on your Today dashboard!`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-sm active:scale-95"
              >
                <Target className="w-3.5 h-3.5" /> Set as Week Target
              </button>
              <button
                onClick={() => setPracticeModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800/60 rounded-xl transition-colors shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" /> Log Practice
              </button>
              <Link
                href={`/focus?chapter=${chapter.slug}`}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 rounded-xl transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-current" /> Focus & MCQ Room
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Tap Frictionless Quick Question Buttons */}
      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4 fill-current" /> 1-Tap Practice Logger for {chapter.name}
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            {liveQuestionsSolved} / {chapter.defaultQuestionTarget} Target Qs
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickAddQuestions(10)}
            className="flex-1 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-100 shadow-sm transition-all active:scale-95 text-center"
          >
            +10 Solved
          </button>
          <button
            onClick={() => handleQuickAddQuestions(25)}
            className="flex-1 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm transition-all active:scale-95 text-center"
          >
            +25 Solved
          </button>
          <button
            onClick={() => handleQuickAddQuestions(50)}
            className="flex-1 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-blue-600 dark:text-blue-400 shadow-sm transition-all active:scale-95 text-center"
          >
            +50 Solved
          </button>
        </div>
      </div>

      {/* Recommended Next Action (Deterministic Diagnostic Box) */}
      <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider">
              RECOMMENDED NEXT ACTION
            </div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {diagnostic.recommendedAction}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              <span>Theory: <strong>{diagnostic.theoryLevel}</strong></span>
              <span>•</span>
              <span>Practice: <strong>{diagnostic.practiceLevel}</strong></span>
              <span>•</span>
              <span>Accuracy: <strong>{diagnostic.accuracyLevel}</strong></span>
              <span>•</span>
              <span>Revision: <strong>{diagnostic.revisionLevel}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPracticeModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 border border-blue-300 dark:border-blue-700/60 rounded-xl whitespace-nowrap"
        >
          Execute Now
        </button>
      </div>

      {/* 6-Dimension Readiness Matrix with Circular Rings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-bold uppercase tracking-wider">Multi-Dimensional Readiness Dimensions</span>
          <span className="text-[11px] font-mono">Weighted Algorithm</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Theory */}
          <div className="jee-card flex flex-col items-center text-center p-3.5">
            <ProgressCircle value={readiness.theoryScore} size={48} strokeWidth={4.5} color="#6366f1" />
            <div className="text-[10px] text-zinc-500 font-bold uppercase mt-2">Theory (25%)</div>
            <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">{readiness.theoryScore}%</div>
          </div>

          {/* Practice */}
          <div className="jee-card flex flex-col items-center text-center p-3.5">
            <ProgressCircle value={readiness.practiceScore} size={48} strokeWidth={4.5} color="#3b82f6" />
            <div className="text-[10px] text-zinc-500 font-bold uppercase mt-2">Practice Vol (25%)</div>
            <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">{readiness.practiceScore}%</div>
          </div>

          {/* PYQs */}
          <div className="jee-card flex flex-col items-center text-center p-3.5">
            <ProgressCircle value={readiness.pyqScore} size={48} strokeWidth={4.5} color="#10b981" />
            <div className="text-[10px] text-zinc-500 font-bold uppercase mt-2">PYQs (20%)</div>
            <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">{readiness.pyqScore}%</div>
          </div>

          {/* Accuracy */}
          <div className="jee-card flex flex-col items-center text-center p-3.5">
            <ProgressCircle value={readiness.accuracyScore} size={48} strokeWidth={4.5} color="#f59e0b" />
            <div className="text-[10px] text-zinc-500 font-bold uppercase mt-2">Accuracy (15%)</div>
            <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">{readiness.accuracyScore}%</div>
          </div>

          {/* Testing */}
          <div className="jee-card flex flex-col items-center text-center p-3.5">
            <ProgressCircle value={readiness.testScore} size={48} strokeWidth={4.5} color="#f43f5e" />
            <div className="text-[10px] text-zinc-500 font-bold uppercase mt-2">Testing (10%)</div>
            <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">{readiness.testScore}%</div>
          </div>

          {/* Revision */}
          <div className="jee-card flex flex-col items-center text-center p-3.5">
            <ProgressCircle value={readiness.revisionScore} size={48} strokeWidth={4.5} color="#a855f7" />
            <div className="text-[10px] text-zinc-500 font-bold uppercase mt-2">Revision (5%)</div>
            <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">{readiness.revisionScore}%</div>
          </div>
        </div>
      </div>

      {/* Subtopics Checklist with Batch Updating Buttons */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Subtopic Mastery Checklist ({topics.length} topics)
            </h2>
            <p className="text-[11px] text-zinc-500">
              Click individual topic badges to cycle status, or use 1-click batch buttons below:
            </p>
          </div>

          {/* Batch Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleBatchTopics("UNDERSTOOD")}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 shadow-sm active:scale-95"
            >
              ✓ All Understood
            </button>
            <button
              onClick={() => handleBatchTopics("STRONG")}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 shadow-sm active:scale-95"
            >
              ★ All Strong
            </button>
            <button
              onClick={() => handleBatchTopics("NOT_STARTED")}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 shadow-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {topics.map((t: any, idx: number) => {
            const st = t.progress[0]?.status || "NOT_STARTED";
            return (
              <div
                key={t.id}
                onClick={() => handleTopicClick(t.id)}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 cursor-pointer select-none transition-all group shadow-sm"
              >
                <span className="text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white truncate mr-2">
                  <span className="text-zinc-400 font-mono mr-1.5">{idx + 1}.</span>
                  {t.name}
                </span>

                <span className={cn("badge-tag text-[10px] font-semibold shrink-0", getTopicStatusColor(st))}>
                  {st.replace("_", " ")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practice Modal */}
      <QuickPracticeModal
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        preselectedChapterId={chapter.id}
        chapters={allChapters}
      />
    </div>
  );
}
