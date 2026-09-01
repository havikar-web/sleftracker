"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Plus,
  BookOpen,
  Calendar,
  CheckSquare,
  HelpCircle,
  Zap,
  Target,
  Search,
  X,
  SlidersHorizontal,
  Trash2,
  Check,
} from "lucide-react";
import { cn, formatHours, getSubjectColor, getPriorityLabel, getStatusBadge, getDaysUntil } from "@/lib/utils";
import {
  updateTaskStatus,
  logTaskProgress,
  reorderTasks,
  createTask,
  addWeeklyTargetChapter,
  addMultipleTargetChapters,
  deleteTask,
} from "@/lib/actions/task-actions";
import { logPracticeSession } from "@/lib/actions/practice-actions";
import { getDateActivityDetails } from "@/lib/actions/analytics-actions";
import { useTimer } from "@/components/timer-context";
import { QuickPracticeModal } from "@/components/modals/quick-practice-modal";
import { AddTaskModal } from "@/components/modals/add-task-modal";
import { NaturalLanguageLoggerModal } from "@/components/quick-log/natural-language-logger-modal";
import { ProgressCircle } from "@/components/ui/progress-circle";

export function TodayCommandCenter({
  user,
  overview,
  tasks: initialTasks,
  roadmapSummary,
  revisionsSummary,
  allChapters = [],
  pacing,
}: {
  user: any;
  overview: any;
  tasks: any[];
  roadmapSummary: any;
  revisionsSummary: any;
  allChapters: any[];
  pacing?: any;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const { startTimer, isRunning, activeSession } = useTimer();
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [selectedTaskForPractice, setSelectedTaskForPractice] = useState<any>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [nlpModalOpen, setNlpModalOpen] = useState(false);
  const [targetPickerOpen, setTargetPickerOpen] = useState(false);
  const [inlineTaskTitle, setInlineTaskTitle] = useState("");
  const [isQuickLogging, setIsQuickLogging] = useState<Record<string, boolean>>({});
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [targetQuestions, setTargetQuestions] = useState(50);
  const [chapterSearch, setChapterSearch] = useState("");
  const [modalSubjectFilter, setModalSubjectFilter] = useState<string>("ALL");
  const [modalWeightageFilter, setModalWeightageFilter] = useState<string>("ALL");
  const [isSettingTarget, setIsSettingTarget] = useState(false);

  // Date Navigator & Daily Reset State
  const todayISO = new Date().toISOString().split("T")[0];
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayISO);
  const [selectedDateActivity, setSelectedDateActivity] = useState<any>(null);
  const [isLoadingDateActivity, setIsLoadingDateActivity] = useState(false);

  const isSelectedDateToday = selectedDateStr === todayISO;

  const handleSelectDate = async (newDateStr: string) => {
    setSelectedDateStr(newDateStr);
    if (newDateStr === todayISO) {
      setSelectedDateActivity(null);
      return;
    }
    setIsLoadingDateActivity(true);
    try {
      const data = await getDateActivityDetails(newDateStr);
      setSelectedDateActivity(data);
    } catch (err) {
      console.error("Failed to load date activity:", err);
    } finally {
      setIsLoadingDateActivity(false);
    }
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() - 1);
    handleSelectDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDateStr);
    d.setDate(d.getDate() + 1);
    handleSelectDate(d.toISOString().split("T")[0]);
  };

  const handleResetToToday = () => {
    handleSelectDate(todayISO);
  };

  // Dynamic Days until Jan 1, 2027
  const targetDate = user?.targetDate || "2027-01-01";
  const daysRemaining = pacing?.daysRemaining || getDaysUntil(targetDate);

  // Target Chapter Tasks (tasks linked to a chapter and in progress or pending)
  const targetTasks = tasks.filter((t) => t.chapterId != null && t.status !== "COMPLETED");
  const completedTargetTasks = tasks.filter((t) => t.chapterId != null && t.status === "COMPLETED");
  const regularTasks = tasks.filter((t) => t.chapterId == null);

  // Toggle chapter selection in modal
  const handleToggleModalChapter = (chapterId: string) => {
    setSelectedChapterIds((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  };

  // Set / Add Active Target Chapters (Multi-select support)
  const handleAddTargetChapters = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChapterIds.length === 0) return;

    setIsSettingTarget(true);
    try {
      const newTasks = await addMultipleTargetChapters(selectedChapterIds, targetQuestions);
      // Merge unique tasks
      setTasks((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const added = newTasks.filter((t: any) => !existingIds.has(t.id));
        return [...added, ...prev];
      });
      setSelectedChapterIds([]);
      setTargetPickerOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSettingTarget(false);
    }
  };

  // Delete / Remove a target chapter task
  const handleRemoveTarget = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTask(taskId);
  };

  // Task Completion Toggle
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: nextStatus,
              completedValue: nextStatus === "COMPLETED" && t.targetValue ? t.targetValue : t.completedValue,
            }
          : t
      )
    );
    await updateTaskStatus(taskId, nextStatus as any);
  };

  // Reorder Task up/down
  const handleMoveTask = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= tasks.length) return;

    const newTasks = [...tasks];
    const [moved] = newTasks.splice(index, 1);
    newTasks.splice(newIdx, 0, moved);

    setTasks(newTasks);
    await reorderTasks(newTasks.map((t) => t.id));
  };

  // Inline Task Creation (Type & Enter)
  const handleInlineAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTaskTitle.trim()) return;

    const title = inlineTaskTitle.trim();
    setInlineTaskTitle("");

    try {
      const res = await createTask({
        title,
        taskType: "QUESTIONS",
        targetType: "QUESTIONS",
        targetValue: 25,
        priority: "HIGH",
      });

      if (res.task) {
        setTasks((prev) => [...prev, res.task]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1-Tap Quick Question Log (+10, +20, +30) on a specific Target Chapter
  const handleQuickAddQuestions = async (targetTask: any, count: number) => {
    const chapterId = targetTask.chapterId;
    const subjectId = targetTask.subjectId;
    if (!chapterId) return;

    setIsQuickLogging((prev) => ({ ...prev, [targetTask.id]: true }));

    // Optimistically update task completed questions
    setTasks((prev) =>
      prev.map((t) =>
        t.id === targetTask.id
          ? { ...t, completedValue: (t.completedValue || 0) + count }
          : t
      )
    );

    try {
      await logPracticeSession({
        chapterId,
        subjectId,
        source: "JEE_MAIN_PYQ",
        questions: count,
        correctIndependent: Math.round(count * 0.8),
        wrong: Math.round(count * 0.15),
        assisted: Math.round(count * 0.05),
        durationMinutes: count * 2,
        difficulty: "MEDIUM",
        notes: `1-tap logged +${count} questions for ${targetTask.chapter?.name}`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuickLogging((prev) => ({ ...prev, [targetTask.id]: false }));
    }
  };

  const handleLogProgress = (task: any) => {
    setSelectedTaskForPractice(task);
    setPracticeModalOpen(true);
  };

  // Filtered Chapters for Multi-Select Modal
  const filteredModalChapters = allChapters.filter((c) => {
    if (modalSubjectFilter !== "ALL" && c.subjectName.toLowerCase() !== modalSubjectFilter.toLowerCase()) {
      return false;
    }
    const weightage = c.historicalPriority || 75;
    if (modalWeightageFilter === "HIGH" && weightage < 85) return false;
    if (modalWeightageFilter === "MEDIUM" && (weightage < 70 || weightage >= 85)) return false;
    if (modalWeightageFilter === "FOUNDATION" && weightage >= 70) return false;

    if (!chapterSearch.trim()) return true;
    const q = chapterSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.subjectName.toLowerCase().includes(q);
  });

  // Percentages for rings
  const qPct = Math.min(100, Math.round((overview.todayQuestions / (user?.dailyQuestionTarget || 80)) * 100));
  const studyHours = Math.round((overview.todayStudyMinutes / 60) * 10) / 10;
  const targetHours = pacing?.requiredDailyStudyHours || user?.dailyStudyHours || 6.0;
  const studyPct = Math.min(100, Math.round((studyHours / targetHours) * 100));
  const taskPct = Math.min(100, Math.round((overview.todayTasksCompleted / Math.max(1, overview.todayTasksTotal)) * 100));

  const todayDateStr = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-5">
      {/* 0. DATE NAVIGATOR & DAILY RESET TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-0.5 shadow-xs">
            <button
              onClick={handlePrevDay}
              className="px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Previous Day"
            >
              ◀ Prev Day
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 font-bold text-xs text-zinc-900 dark:text-zinc-100 border-x border-zinc-200 dark:border-zinc-800">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {isSelectedDateToday ? "Today, " : ""}
                {new Date(selectedDateStr + "T00:00:00").toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <button
              onClick={handleNextDay}
              className="px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Next Day"
            >
              Next Day ▶
            </button>
          </div>

          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => e.target.value && handleSelectDate(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 font-mono shadow-xs"
          />

          {!isSelectedDateToday && (
            <button
              onClick={handleResetToToday}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Jump to Today (Live)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Daily Reset: MCQs and study hours reset fresh at 00:00 midnight.</span>
        </div>
      </div>

      {/* PAST DATE ACTIVITY INSPECTOR (Visible when navigating back to any past date) */}
      {!isSelectedDateToday && (
        <div className="p-5 rounded-2xl border-2 border-indigo-500/40 bg-white dark:bg-zinc-950 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Activity & Items Done on</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {new Date(selectedDateStr + "T00:00:00").toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-500">Historical snapshot of MCQs solved, study sessions, and completed tasks</p>
              </div>
            </div>

            <button
              onClick={handleResetToToday}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Back to Today
            </button>
          </div>

          {isLoadingDateActivity ? (
            <div className="py-8 text-center text-xs text-zinc-400 font-mono animate-pulse">
              Loading activity records for this date...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Date Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase">MCQs Solved</div>
                  <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                    {selectedDateActivity?.totalQuestions || 0} Qs
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase">Study Time</div>
                  <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {selectedDateActivity?.totalStudyHours || 0} Hours
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase">Independent (✓)</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedDateActivity?.independentCount || 0} / {selectedDateActivity?.totalQuestions || 0}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-zinc-400 text-[10px] font-bold uppercase">Accuracy Rate</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedDateActivity?.accuracy || 0}%
                  </div>
                </div>
              </div>

              {/* Sessions List */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Logged Sessions & Tasks ({((selectedDateActivity?.studySessions?.length || 0) + (selectedDateActivity?.practiceSessions?.length || 0) + (selectedDateActivity?.completedTasks?.length || 0))} items)
                </div>

                {(!selectedDateActivity?.studySessions?.length && !selectedDateActivity?.practiceSessions?.length && !selectedDateActivity?.completedTasks?.length) ? (
                  <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                    No sessions or tasks recorded on this specific date.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedDateActivity?.studySessions?.map((s: any) => (
                      <div key={s.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            Study Focus
                          </span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {s.chapter?.name || "General Study"}
                          </span>
                          {s.notes && <span className="text-zinc-400 text-[11px]">({s.notes})</span>}
                        </div>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{s.durationMinutes} mins</span>
                      </div>
                    ))}

                    {selectedDateActivity?.practiceSessions?.map((p: any) => (
                      <div key={p.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            MCQ Practice
                          </span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {p.chapter?.name || "Practice Session"}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            ({p.correctIndependent} Indep, {p.assisted} Assist, {p.wrong} Wrong)
                          </span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.questions} MCQs</span>
                      </div>
                    ))}

                    {selectedDateActivity?.completedTasks?.map((t: any) => (
                      <div key={t.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            Task Done
                          </span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {t.title}
                          </span>
                        </div>
                        <span className="font-mono text-zinc-400 text-[11px]">Completed</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. Header Command Ribbon with Circular Progress & Exact Jan 1 Countdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{todayDateStr}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Target: Jan 1st 2027
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
            Good Evening, Aspirant
          </h1>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Exact Countdown: <strong className="font-mono text-blue-600 dark:text-blue-400">{daysRemaining} days remaining</strong> until JEE Main
          </div>
        </div>

        {/* Circular Overall Readiness Ring & Countdown */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl">
            <ProgressCircle
              value={overview.overallReadiness || 0}
              size={64}
              strokeWidth={6}
              color="#3b82f6"
              label="Ready"
            />
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                Overall Syllabus
              </div>
              <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {overview.overallReadiness}% Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REQUIRED DAILY STUDY PACE ENGINE CARD */}
      <div className="p-5 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/20 via-zinc-950/90 to-indigo-950/20 dark:border-zinc-800/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2 flex-wrap">
                <span>Required Daily Study Pace for Jan 1st 2027 Mastery</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  {daysRemaining} Days Remaining
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Dynamic pace computed from 760 mastery hours across Physics, Chemistry, and Mathematics.
              </p>
            </div>
          </div>

          <Link
            href="/focus"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>⚡ Start Study Pace</span>
          </Link>
        </div>

        {/* 4-Stat Pacing Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Required Study Pace</div>
            <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
              {pacing?.requiredDailyStudyHours || 5.8}h <span className="text-xs font-normal text-zinc-400">/ day</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              ({pacing?.requiredDailyStudyMinutes || 348} mins daily)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Required MCQs Pace</div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {pacing?.requiredDailyQuestions || 58} <span className="text-xs font-normal text-zinc-400">MCQs / day</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              ~20 MCQs / subject
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Remaining Syllabus</div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
              {pacing?.remainingHours || 760}h <span className="text-xs font-normal text-zinc-400">/ 760h</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              62 official chapters
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Today Logged</div>
            <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
              {studyHours}h <span className="text-xs font-normal text-zinc-400">/ {pacing?.requiredDailyStudyHours || 5.8}h</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              {overview.todayQuestions} MCQs logged today
            </div>
          </div>
        </div>

        {/* Subject Daily Split Breakdown */}
        {pacing?.subjectBreakdown && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {pacing.subjectBreakdown.map((sub: any) => {
              const colors = getSubjectColor(sub.name);
              return (
                <div
                  key={sub.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", colors.badge)}>
                      {sub.shortName}
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{sub.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{sub.requiredDailyHours}h</span>
                    <span className="text-[10px] text-zinc-400"> / day ({sub.remainingHours}h left)</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2.5 AI NATURAL LANGUAGE QUICK-LOG BANNER */}
      <div className="p-4 rounded-2xl border-2 border-dashed border-blue-500/40 bg-gradient-to-r from-blue-900/10 via-indigo-950/20 to-purple-900/10 dark:border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-500 border border-blue-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Describe What You Did (Auto-Update JEE OS)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                AI NLP Logger
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Type or paste plain text (e.g. <em>&quot;Rotational Motion 2h, solved 25 pyqs from HCV (20 right, 5 wrong)&quot;</em>) — automatically updates study time, MCQs, and readiness!
            </p>
          </div>
        </div>

        <button
          onClick={() => setNlpModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Describe &amp; Auto-Update</span>
        </button>
      </div>

      {/* 2. Today's Targets with Circular Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Questions Circle Card */}
        <div className="jee-card flex items-center justify-between p-4">
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Questions Today</div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              {overview.todayQuestions} <span className="text-xs text-zinc-400 font-normal">/ {user?.dailyQuestionTarget || 120}</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {qPct}% of target
            </div>
          </div>
          <ProgressCircle value={qPct} size={56} strokeWidth={5} color="#10b981" />
        </div>

        {/* Study Time Circle Card */}
        <div className="jee-card flex items-center justify-between p-4">
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Focused Study</div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              {studyHours}h <span className="text-xs text-zinc-400 font-normal">/ {targetHours}h</span>
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              {studyPct}% of target
            </div>
          </div>
          <ProgressCircle value={studyPct} size={56} strokeWidth={5} color="#3b82f6" />
        </div>

        {/* Academic Tasks Circle Card */}
        <div className="jee-card flex items-center justify-between p-4">
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Tasks Completed</div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
              {overview.todayTasksCompleted} <span className="text-xs text-zinc-400 font-normal">/ {overview.todayTasksTotal}</span>
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              {taskPct}% completed
            </div>
          </div>
          <ProgressCircle value={taskPct} size={56} strokeWidth={5} color="#6366f1" />
        </div>
      </div>

      {/* 3. Subject Readiness Glance with Mini Rings */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {overview.subjectStats?.filter((sub: any) => sub.chapterCount > 0).slice(0, 3).map((sub: any) => {
          const colors = getSubjectColor(sub.name);
          return (
            <Link
              key={sub.id}
              href="/syllabus"
              className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex items-center justify-between gap-2 shadow-sm"
            >
              <div>
                <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{sub.name}</span>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{sub.chapterCount} chapters</div>
              </div>
              <ProgressCircle value={sub.readiness} size={42} strokeWidth={4} color={colors.bar} />
            </Link>
          );
        })}
      </div>

      {/* 4. MULTIPLE TARGET CHAPTERS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              THIS WEEK&apos;S TARGET CHAPTERS
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold">
              {targetTasks.length} Active
            </span>
          </div>

          <button
            onClick={() => setTargetPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Target Chapter</span>
          </button>
        </div>

        {/* Target Chapters Grid */}
        {targetTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetTasks.map((target) => {
              const colors = target.subject ? getSubjectColor(target.subject.name) : getSubjectColor("Physics");
              const targetGoal = target.targetValue || 50;
              const solved = target.completedValue || 0;
              const completionPct = Math.min(100, Math.round((solved / targetGoal) * 100));
              const wScore = Math.round(target.chapter?.historicalPriority || 75);

              return (
                <div
                  key={target.id}
                  className="p-5 rounded-2xl border-2 border-blue-500/30 bg-white dark:bg-zinc-950/80 shadow-md relative overflow-hidden flex flex-col justify-between space-y-3"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400" />

                  {/* Header Row */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {target.subject && (
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", colors.badge)}>
                            {target.subject.shortName}
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          Class {target.chapter?.classLevel || 11}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[9px] font-mono font-bold",
                            wScore >= 85
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                              : wScore >= 70
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                              : "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                          )}
                        >
                          {wScore}% ROI
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveTarget(target.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                        title="Remove Target Chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
                      {target.chapter ? (
                        <Link href={`/chapter/${target.chapter.slug}`} className="hover:underline">
                          {target.chapter.name}
                        </Link>
                      ) : (
                        target.title
                      )}
                    </div>
                  </div>

                  {/* Target Goal Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-500 font-medium">Goal Progress:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400">
                        {solved} / {targetGoal} Questions ({completionPct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>

                  {/* 1-Tap Frictionless Action Bar */}
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/70 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold">
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <Zap className="w-3 h-3 fill-current" /> 1-Tap Quick Log:
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickAddQuestions(target, 10)}
                        disabled={isQuickLogging[target.id]}
                        className="flex-1 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-[11px] font-bold text-zinc-800 dark:text-zinc-100 shadow-xs transition-all active:scale-95 text-center"
                      >
                        +10 Q
                      </button>
                      <button
                        onClick={() => handleQuickAddQuestions(target, 20)}
                        disabled={isQuickLogging[target.id]}
                        className="flex-1 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shadow-xs transition-all active:scale-95 text-center"
                      >
                        +20 Q
                      </button>
                      <button
                        onClick={() => handleQuickAddQuestions(target, 30)}
                        disabled={isQuickLogging[target.id]}
                        className="flex-1 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-[11px] font-bold text-blue-600 dark:text-blue-400 shadow-xs transition-all active:scale-95 text-center"
                      >
                        +30 Q
                      </button>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Link
                      href={target.chapter?.slug ? `/focus?chapter=${target.chapter.slug}` : "/focus"}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs transition-colors active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>⚡ Solve MCQs</span>
                    </Link>

                    <button
                      onClick={() => handleToggleTask(target.id, target.status)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800/60 rounded-lg transition-colors active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 text-center space-y-3">
            <div className="h-10 w-10 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">No Target Chapters Added for This Week</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Select 1 or more target chapters across Physics, Chemistry, or Maths to guide your week&apos;s question practice.
              </p>
            </div>

            <button
              onClick={() => setTargetPickerOpen(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Select Target Chapters</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. NEXT Tasks Section with Instant Inline Task Adder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              UPCOMING STUDY TASKS
            </span>
            <span className="text-[11px] font-mono text-zinc-400">({regularTasks.length})</span>
          </div>

          <button
            onClick={() => setTaskModalOpen(true)}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Detailed Task
          </button>
        </div>

        {/* Instant Inline Task Adder */}
        <form onSubmit={handleInlineAddTask} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="+ Type a quick study task & press Enter (e.g. 'Solve 25 Kinematics questions')..."
            value={inlineTaskTitle}
            onChange={(e) => setInlineTaskTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden focus:border-blue-500 shadow-sm"
          />
        </form>

        {regularTasks.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 text-xs">
            No further tasks queued for today. Use the box above to add one instantly.
          </div>
        ) : (
          <div className="space-y-2">
            {regularTasks.map((task, idx) => {
              const colors = task.subject ? getSubjectColor(task.subject.name) : null;
              const isDone = task.status === "COMPLETED";

              return (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl border transition-all",
                    isDone
                      ? "bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 text-zinc-400 opacity-60"
                      : "bg-white dark:bg-zinc-950/70 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <button
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className="text-zinc-400 hover:text-emerald-500 transition-colors shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {colors && (
                          <span className={cn("px-1.5 py-0.2 rounded text-[10px] font-medium", colors.badge)}>
                            {task.subject?.shortName}
                          </span>
                        )}
                        <span className={cn("text-xs font-semibold truncate", isDone && "line-through")}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {task.chapter && <span>{task.chapter.name}</span>}
                        {task.targetValue && (
                          <>
                            <span>•</span>
                            <span className="font-mono">
                              {task.completedValue} / {task.targetValue} {task.targetType.toLowerCase()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={cn("badge-tag text-[10px]", getPriorityLabel(task.priority).class)}>
                      {getPriorityLabel(task.priority).label}
                    </span>

                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMoveTask(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 rounded"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveTask(idx, "down")}
                        disabled={idx === regularTasks.length - 1}
                        className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 rounded"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Target Chapters Multi-Select Modal */}
      {targetPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xl animate-in fade-in duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Select This Week&apos;s Target Chapters (Multi-Select)
                </h2>
              </div>
              <button
                onClick={() => setTargetPickerOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTargetChapters} className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Search & Subject Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search chapters (e.g. 'Kinematics', 'GOC', 'Limits')..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  {["ALL", "Physics", "Chemistry", "Mathematics", "Biology"].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setModalSubjectFilter(sub)}
                      className={cn(
                        "px-2.5 py-1.5 text-[11px] font-semibold rounded-xl border transition-all",
                        modalSubjectFilter === sub
                          ? "bg-zinc-900 dark:bg-zinc-800 text-white border-zinc-900 dark:border-zinc-700 shadow-sm"
                          : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                      )}
                    >
                      {sub === "ALL" ? "All" : sub.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weightage Tiers Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mr-1">Weightage:</span>
                {[
                  { id: "ALL", label: "All" },
                  { id: "HIGH", label: "🔥 High (85%+)" },
                  { id: "MEDIUM", label: "⚡ Medium (70-84%)" },
                  { id: "FOUNDATION", label: "📘 Foundation (<70%)" },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setModalWeightageFilter(w.id)}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-semibold rounded-full border transition-all whitespace-nowrap",
                      modalWeightageFilter === w.id
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-bold shadow-sm"
                        : "bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-100"
                    )}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              {/* Multi-Select Chapter Grid */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 bg-zinc-50/50 dark:bg-zinc-900/40">
                {filteredModalChapters.map((chap) => {
                  const isSelected = selectedChapterIds.includes(chap.id);
                  const colors = getSubjectColor(chap.subjectName);
                  const wScore = Math.round(chap.historicalPriority || 75);

                  return (
                    <div
                      key={chap.id}
                      onClick={() => handleToggleModalChapter(chap.id)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-all border",
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                          : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 truncate">
                        <div className={cn(
                          "w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors",
                          isSelected ? "bg-white text-blue-600 border-white" : "border-zinc-400 bg-transparent"
                        )}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[10px] font-semibold",
                            isSelected ? "bg-white/20 text-white" : colors.badge
                          )}
                        >
                          {chap.subjectName}
                        </span>
                        <span className="truncate">{chap.name}</span>
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[9px] font-mono font-bold",
                            isSelected
                              ? "bg-white/20 text-white"
                              : wScore >= 85
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                              : wScore >= 70
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                              : "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                          )}
                        >
                          {wScore}% ROI
                        </span>
                      </div>
                      <span className="text-[10px] opacity-70 font-mono shrink-0">Class {chap.classLevel}</span>
                    </div>
                  );
                })}
              </div>

              {/* Target Question Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span>Target Question Goal (Per Chapter)</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{targetQuestions} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  {[25, 50, 75, 100, 150].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTargetQuestions(num)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all",
                        targetQuestions === num
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                          : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                      )}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 font-medium">
                  {selectedChapterIds.length} chapter(s) selected
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetPickerOpen(false)}
                    className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSettingTarget || selectedChapterIds.length === 0}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-sm transition-all"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Add {selectedChapterIds.length} Target Chapters</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <QuickPracticeModal
        isOpen={practiceModalOpen}
        onClose={() => {
          setPracticeModalOpen(false);
          setSelectedTaskForPractice(null);
        }}
        preselectedChapterId={selectedTaskForPractice?.chapterId}
        chapters={allChapters}
      />

      <AddTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        chapters={allChapters}
      />

      <NaturalLanguageLoggerModal
        isOpen={nlpModalOpen}
        onClose={() => setNlpModalOpen(false)}
        allChapters={allChapters}
      />
    </div>
  );
}
