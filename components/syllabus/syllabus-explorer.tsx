"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Filter,
  Flame,
  ArrowRight,
  Sparkles,
  Zap,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { cn, getSubjectColor, getStatusBadge, getPriorityLabel } from "@/lib/utils";
import { updateChapterManualProgress } from "@/lib/actions/chapter-actions";
import { logPracticeSession } from "@/lib/actions/practice-actions";
import { setActiveWeeklyTargetChapter } from "@/lib/actions/task-actions";
import { ProgressCircle } from "@/components/ui/progress-circle";

export function SyllabusExplorer({ subjects }: { subjects: any[] }) {
  const [selectedSubject, setSelectedSubject] = useState<string>("Physics");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterWeightage, setFilterWeightage] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"DEFAULT" | "WEIGHTAGE_DESC" | "READINESS_ASC" | "READINESS_DESC">("DEFAULT");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [chapterStates, setChapterStates] = useState<Record<string, any>>({});

  const activeSubject =
    subjects.find((s) => s.name.toLowerCase() === selectedSubject.toLowerCase()) ||
    subjects[0];

  const toggleExpand = (id: string) => {
    setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Quick 1-click status updater directly from syllabus list
  const handleQuickStatusChange = async (chapter: any, newStatus: string) => {
    let score = 0;
    if (newStatus === "LEARNING") score = 25;
    if (newStatus === "PRACTISING") score = 50;
    if (newStatus === "DEVELOPING") score = 70;
    if (newStatus === "TEST_READY") score = 85;
    if (newStatus === "MASTERED") score = 95;

    // Optimistic UI
    setChapterStates((prev) => ({
      ...prev,
      [chapter.id]: {
        status: newStatus,
        readinessScore: score,
      },
    }));

    await updateChapterManualProgress({
      chapterId: chapter.id,
      theoryScore: score,
      questionsSolved: Math.max(10, chapter.progress[0]?.questionsSolved || 0),
      pyqsSolved: Math.max(5, chapter.progress[0]?.pyqsSolved || 0),
      correctIndependent: Math.max(8, chapter.progress[0]?.correctIndependent || 0),
      wrong: 2,
      assisted: 1,
      isManualOverride: true,
      readinessOverride: score,
      statusOverride: newStatus,
    });
  };

  // Quick 1-click +10 Questions directly on chapter
  const handleQuickAdd10 = async (chapter: any) => {
    const currentQ = (chapterStates[chapter.id]?.questionsSolved ?? chapter.progress[0]?.questionsSolved) || 0;
    setChapterStates((prev) => ({
      ...prev,
      [chapter.id]: {
        ...prev[chapter.id],
        questionsSolved: currentQ + 10,
      },
    }));

    await logPracticeSession({
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      source: "JEE_MAIN_PYQ",
      questions: 10,
      correctIndependent: 8,
      wrong: 2,
      assisted: 0,
      durationMinutes: 20,
    });
  };

  // Filter & Sort chapters
  const filteredChapters = (activeSubject?.chapters || [])
    .filter((chap: any) => {
      if (selectedClass !== "ALL" && chap.classLevel.toString() !== selectedClass) {
        return false;
      }

      const state = chapterStates[chap.id];
      const status = state?.status || chap.progress[0]?.status || "NOT_STARTED";
      const weightage = chap.historicalPriority || 75;

      // Status filters
      if (filterStatus === "NOT_STARTED" && status !== "NOT_STARTED") return false;
      if (filterStatus === "ACTIVE" && (status === "NOT_STARTED" || status === "MASTERED")) return false;
      if (filterStatus === "MASTERED" && status !== "MASTERED") return false;
      if (filterStatus === "TEST_READY" && status !== "TEST_READY") return false;

      // Weightage filters
      if (filterWeightage === "HIGH" && weightage < 85) return false;
      if (filterWeightage === "MEDIUM" && (weightage < 70 || weightage >= 85)) return false;
      if (filterWeightage === "FOUNDATION" && weightage >= 70) return false;

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const nameMatch = chap.name.toLowerCase().includes(q);
        const topicMatch = chap.topics?.some((t: any) => t.name.toLowerCase().includes(q));
        if (!nameMatch && !topicMatch) return false;
      }

      return true;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "WEIGHTAGE_DESC") {
        return (b.historicalPriority || 0) - (a.historicalPriority || 0);
      }
      if (sortBy === "READINESS_ASC") {
        const rA = chapterStates[a.id]?.readinessScore ?? a.progress[0]?.readinessScore ?? 0;
        const rB = chapterStates[b.id]?.readinessScore ?? b.progress[0]?.readinessScore ?? 0;
        return rA - rB;
      }
      if (sortBy === "READINESS_DESC") {
        const rA = chapterStates[a.id]?.readinessScore ?? a.progress[0]?.readinessScore ?? 0;
        const rB = chapterStates[b.id]?.readinessScore ?? b.progress[0]?.readinessScore ?? 0;
        return rB - rA;
      }
      return a.displayOrder - b.displayOrder;
    });

  const colors = getSubjectColor(activeSubject?.name || "Physics");

  // Calculate subject readiness
  const totalChaps = activeSubject?.chapters?.length || 1;
  const totalReadiness = (activeSubject?.chapters || []).reduce(
    (acc: number, c: any) => acc + (chapterStates[c.id]?.readinessScore ?? c.progress[0]?.readinessScore ?? 0),
    0
  );
  const subjectReadinessPct = Math.round(totalReadiness / totalChaps);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Official JEE Syllabus Tree
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Filter by weightage, priority ROI, class level & readiness • 1-tap instant progress updating
          </p>
        </div>

        {/* Circular Subject Ring */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl shrink-0">
          <ProgressCircle value={subjectReadinessPct} size={54} strokeWidth={5} color={colors.bar} />
          <div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
              {activeSubject?.name} Ready
            </div>
            <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {subjectReadinessPct}% Mastered
            </div>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {subjects.map((sub) => {
          const isActive = sub.name.toLowerCase() === selectedSubject.toLowerCase();
          const subColors = getSubjectColor(sub.name);
          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub.name);
                setSearchTerm("");
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border",
                isActive
                  ? cn(subColors.badge, "border-current shadow-sm font-bold")
                  : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              {sub.name}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search chapters or subtopics (e.g. 'Newton', 'Satellites', 'GOC')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-zinc-800 dark:text-zinc-200 text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="DEFAULT">Syllabus Order</option>
              <option value="WEIGHTAGE_DESC">Highest Weightage</option>
              <option value="READINESS_ASC">Lowest Readiness</option>
              <option value="READINESS_DESC">Highest Readiness</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1">
            {["ALL", "11", "12"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedClass(lvl)}
                className={cn(
                  "px-3 py-2 text-xs rounded-xl border font-semibold transition-colors",
                  selectedClass === lvl
                    ? "bg-zinc-900 dark:bg-zinc-800 text-white border-zinc-900 dark:border-zinc-700 shadow-sm"
                    : "bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                )}
              >
                {lvl === "ALL" ? "All Classes" : `Class ${lvl}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Weightage Tiers + Status */}
      <div className="space-y-2">
        {/* Weightage Tiers Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mr-1">Weightage:</span>
          {[
            { id: "ALL", label: "All Weightages" },
            { id: "HIGH", label: "🔥 High Weightage (85%+)", color: "text-rose-600 dark:text-rose-400" },
            { id: "MEDIUM", label: "⚡ Medium (70-84%)", color: "text-amber-600 dark:text-amber-400" },
            { id: "FOUNDATION", label: "📘 Foundation (<70%)", color: "text-blue-600 dark:text-blue-400" },
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => setFilterWeightage(w.id)}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-semibold border transition-all whitespace-nowrap",
                filterWeightage === w.id
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-bold shadow-sm"
                  : "bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Readiness Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mr-1">Status:</span>
          {[
            { id: "ALL", label: "All Statuses" },
            { id: "ACTIVE", label: "In Progress" },
            { id: "TEST_READY", label: "Test Ready" },
            { id: "MASTERED", label: "Mastered" },
            { id: "NOT_STARTED", label: "Not Started" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors whitespace-nowrap",
                filterStatus === f.id
                  ? "bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-500/40 font-bold"
                  : "bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-100"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter List with 1-Tap Fast Updaters & Weightage Display */}
      <div className="space-y-2.5">
        {filteredChapters.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-xs">
            No syllabus chapters match the current weightage or status filter criteria.
          </div>
        ) : (
          filteredChapters.map((chap: any) => {
            const state = chapterStates[chap.id];
            const readiness = state?.readinessScore ?? chap.progress[0]?.readinessScore ?? 0;
            const status = state?.status ?? chap.progress[0]?.status ?? "NOT_STARTED";
            const questionsSolved = state?.questionsSolved ?? chap.progress[0]?.questionsSolved ?? 0;
            const isExpanded = expandedChapters[chap.id];
            const weightageScore = Math.round(chap.historicalPriority || 75);

            let weightageBadge = {
              label: "Foundation",
              class: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
              icon: "📘",
            };
            if (weightageScore >= 85) {
              weightageBadge = {
                label: "High Weightage",
                class: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
                icon: "🔥",
              };
            } else if (weightageScore >= 70) {
              weightageBadge = {
                label: "Medium Weightage",
                class: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                icon: "⚡",
              };
            }

            return (
              <div
                key={chap.id}
                className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm space-y-3"
              >
                {/* Main Chapter Summary Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleExpand(chap.id)}
                      className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors mt-0.5"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/chapter/${chap.slug}`}
                          className="font-bold text-xs text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {chap.name}
                        </Link>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          Class {chap.classLevel}
                        </span>

                        {/* Weightage Badge */}
                        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1", weightageBadge.class)}>
                          <span>{weightageBadge.icon}</span>
                          <span>{weightageBadge.label}</span>
                          <span className="font-mono opacity-80 font-normal">({weightageScore}%)</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                        <span>{chap.topics?.length || 0} Subtopics</span>
                        <span>•</span>
                        <span>{questionsSolved} / {chap.defaultQuestionTarget} Qs</span>
                        <span>•</span>
                        <span>{chap.estimatedHours}h Est.</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Fast 1-Tap Status Dropdown + Quick +10 Q + Progress Circle */}
                  <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100 dark:border-zinc-850">
                    {/* Set Week Target Button */}
                    <button
                      onClick={async () => {
                        await setActiveWeeklyTargetChapter(chap.id, 50);
                        alert(`🎯 Set "${chap.name}" as this week's active target!`);
                      }}
                      className="px-2 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 border border-blue-300 dark:border-blue-800/60 rounded-lg shadow-sm active:scale-95"
                      title="Set as this week's target chapter"
                    >
                      🎯 Target
                    </button>

                    {/* 1-Tap Quick Question Add */}
                    <button
                      onClick={() => handleQuickAdd10(chap)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800/60 rounded-lg shadow-sm active:scale-95"
                      title="Instantly log +10 questions"
                    >
                      +10 Q
                    </button>

                    {/* 1-Click Fast Status Selector */}
                    <select
                      value={status}
                      onChange={(e) => handleQuickStatusChange(chap, e.target.value)}
                      className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-hidden cursor-pointer"
                    >
                      <option value="NOT_STARTED">Not Started (0%)</option>
                      <option value="LEARNING">Learning (25%)</option>
                      <option value="PRACTISING">Practising (50%)</option>
                      <option value="DEVELOPING">Developing (70%)</option>
                      <option value="TEST_READY">Test Ready (85%)</option>
                      <option value="MASTERED">Mastered (95%)</option>
                    </select>

                    {/* Circular Progress Ring */}
                    <ProgressCircle value={readiness} size={42} strokeWidth={4} color={colors.bar} />

                    <Link
                      href={`/chapter/${chap.slug}`}
                      className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-lg transition-colors"
                      title="Full Chapter Detail"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Collapsible Subtopics List */}
                {isExpanded && (
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-850/80 space-y-1.5 pl-6 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      Official Subtopics Breakdown
                    </div>
                    {chap.topics && chap.topics.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {chap.topics.map((top: any) => (
                          <div
                            key={top.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs"
                          >
                            <span className="text-zinc-800 dark:text-zinc-200">{top.name}</span>
                            <span className="text-[10px] font-mono text-zinc-400 font-semibold">
                              {status === "MASTERED" ? "Mastered" : "Core"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-400 italic">No subtopics defined for this chapter.</div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
