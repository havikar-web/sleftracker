"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  Flame,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { cn, getStatusBadge, getPriorityLabel } from "@/lib/utils";
import { updateChapterManualProgress } from "@/lib/actions/chapter-actions";
import { logPracticeSession } from "@/lib/actions/practice-actions";
import { markChapterNeedsRevision } from "@/lib/actions/revision-actions";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { QuickPracticeModal } from "@/components/modals/quick-practice-modal";

export function BiologyTrackView({
  subject,
  chapters = [],
  stats,
}: {
  subject: any;
  chapters: any[];
  stats: any;
}) {
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterWeightage, setFilterWeightage] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [chapterStates, setChapterStates] = useState<Record<string, any>>({});
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [selectedChapterForPractice, setSelectedChapterForPractice] = useState<any>(null);

  const toggleExpand = (id: string) => {
    setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1-Click Status Updater
  const handleQuickStatusChange = async (chapter: any, newStatus: string) => {
    let score = 0;
    if (newStatus === "NEEDS_REVISION") score = 40;
    if (newStatus === "LEARNING") score = 25;
    if (newStatus === "PRACTISING") score = 50;
    if (newStatus === "DEVELOPING") score = 70;
    if (newStatus === "TEST_READY") score = 85;
    if (newStatus === "MASTERED") score = 95;

    setChapterStates((prev) => ({
      ...prev,
      [chapter.id]: {
        status: newStatus,
        readinessScore: score,
      },
    }));

    if (newStatus === "NEEDS_REVISION") {
      await markChapterNeedsRevision(chapter.id);
    } else {
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
    }
  };

  // 1-Click +10 Questions
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
      source: "NEET_PYQ",
      questions: 10,
      correctIndependent: 8,
      assisted: 1,
      wrong: 1,
      durationMinutes: 20,
      difficulty: "MEDIUM",
      notes: "Quick +10 NCERT Practice from Biology Side Track",
    });
  };

  // Filtering Chapters
  const filteredChapters = chapters.filter((chap) => {
    if (selectedClass !== "ALL" && chap.classLevel.toString() !== selectedClass) return false;

    const currentStatus = chapterStates[chap.id]?.status ?? chap.progress[0]?.status ?? "NOT_STARTED";
    if (filterStatus !== "ALL" && currentStatus !== filterStatus) return false;

    const prioScore = chap.historicalPriority || 75;
    if (filterWeightage === "HIGH" && prioScore < 85) return false;
    if (filterWeightage === "MEDIUM" && (prioScore < 70 || prioScore >= 85)) return false;
    if (filterWeightage === "FOUNDATION" && prioScore >= 70) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = chap.name.toLowerCase().includes(q);
      const matchTopic = chap.topics?.some((t: any) => t.name.toLowerCase().includes(q));
      if (!matchName && !matchTopic) return false;
    }

    return true;
  });

  const totalBioChapters = chapters.length;
  const class11Chaps = chapters.filter((c) => c.classLevel === 11);
  const class12Chaps = chapters.filter((c) => c.classLevel === 12);

  const avgReadiness =
    totalBioChapters > 0
      ? Math.round(
          chapters.reduce(
            (acc, c) => acc + (chapterStates[c.id]?.readinessScore ?? c.progress[0]?.readinessScore ?? 0),
            0
          ) / totalBioChapters
        )
      : 0;

  const totalQuestionsDone = chapters.reduce(
    (acc, c) => acc + (chapterStates[c.id]?.questionsSolved ?? c.progress[0]?.questionsSolved ?? 0),
    0
  );

  const totalStudyHours =
    Math.round(
      (chapters.reduce((acc, c) => acc + (c.progress[0]?.studyMinutes ?? 0), 0) / 60) * 10
    ) / 10;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-zinc-950 to-indigo-950/20 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                🧬 Side Track Tracked Separately
              </span>
              <span className="text-xs text-zinc-400">• Botany &amp; Zoology</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Biology Syllabus &amp; Mastery Hub</span>
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Completely independent from core JEE PCM pacing. Track all 31 chapters across NCERT Class 11 and 12 with dedicated accuracy, topics, and revision cycles.
            </p>
          </div>

          {/* Header Action Button */}
          <Link
            href="/focus"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Study Biology (Timer)</span>
          </Link>
        </div>
      </div>

      {/* 2. 4-Stat Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Overall Bio Readiness */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Bio Readiness</div>
            <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5">
              {avgReadiness}%
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Overall Mastery</div>
          </div>
          <ProgressCircle value={avgReadiness} size={48} strokeWidth={5} color="#a855f7" />
        </div>

        {/* Total Questions Solved */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">MCQs Solved</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {totalQuestionsDone}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Questions logged</div>
        </div>

        {/* Total Study Hours */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Study Time</div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
            {totalStudyHours}h
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Logged study sessions</div>
        </div>

        {/* Total Chapters Count */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Chapters</div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
            31 <span className="text-xs font-normal text-zinc-400">Chapters</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            18 (Cl 11) • 13 (Cl 12)
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Toolbar */}
      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Class Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            {[
              { id: "ALL", label: `All (${chapters.length})` },
              { id: "11", label: `Class 11 (${class11Chaps.length})` },
              { id: "12", label: `Class 12 (${class12Chaps.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedClass(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer",
                  selectedClass === tab.id
                    ? "bg-purple-600 text-white shadow-xs font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search Biology chapters & topics (e.g. 'Photosynthesis', 'Genetics')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-500"
            />
          </div>
        </div>

        {/* Sub-Filters (Status & Weightage) */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900 flex-wrap text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mr-1">Status:</span>
            {[
              { id: "ALL", label: "All" },
              { id: "NEEDS_REVISION", label: "⚠️ Needs Revision" },
              { id: "MASTERED", label: "👑 Mastered" },
              { id: "PRACTISING", label: "⚡ Practising" },
              { id: "LEARNING", label: "📖 Learning" },
              { id: "NOT_STARTED", label: "⭕ Not Started" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={cn(
                  "px-2.5 py-1 text-[11px] rounded-lg border transition-all whitespace-nowrap cursor-pointer",
                  filterStatus === st.id
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-bold shadow-xs"
                    : "bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                )}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Weightage Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mr-1">Priority:</span>
            {[
              { id: "ALL", label: "All" },
              { id: "HIGH", label: "🔥 High (85%+)" },
              { id: "MEDIUM", label: "Medium" },
            ].map((wt) => (
              <button
                key={wt.id}
                onClick={() => setFilterWeightage(wt.id)}
                className={cn(
                  "px-2.5 py-1 text-[11px] rounded-lg border transition-all cursor-pointer",
                  filterWeightage === wt.id
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-bold shadow-xs"
                    : "bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100"
                )}
              >
                {wt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Chapters List Accordion */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
          <span>Showing {filteredChapters.length} of {chapters.length} Biology Chapters</span>
          <span>1-Click Update Readiness &amp; Practice</span>
        </div>

        {filteredChapters.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 text-zinc-500 text-xs">
            No Biology chapters match your search or filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChapters.map((chap) => {
              const currentStatus =
                chapterStates[chap.id]?.status ?? chap.progress[0]?.status ?? "NOT_STARTED";
              const currentReadiness =
                chapterStates[chap.id]?.readinessScore ?? chap.progress[0]?.readinessScore ?? 0;
              const currentQuestions =
                chapterStates[chap.id]?.questionsSolved ?? chap.progress[0]?.questionsSolved ?? 0;
              const isExpanded = expandedChapters[chap.id];
              const statusBadge = getStatusBadge(currentStatus);
              const priorityInfo = getPriorityLabel(chap.historicalPriority || 75);

              return (
                <div
                  key={chap.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden transition-all hover:border-purple-500/40"
                >
                  {/* Chapter Header Bar */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleExpand(chap.id)}
                        className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors mt-0.5 shrink-0"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                            Class {chap.classLevel}
                          </span>
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border", statusBadge.class)}>
                            {statusBadge.label}
                          </span>
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono border", priorityInfo.class)}>
                            {priorityInfo.icon} {priorityInfo.label} ({chap.historicalPriority}%)
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            ⏳ {chap.hoursRange || `${chap.estimatedHours || 12} Hours`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/chapter/${chap.slug}`}
                            className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          >
                            {chap.name}
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Controls */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      {/* Readiness Metric */}
                      <div className="text-right font-mono">
                        <div className="text-base font-bold text-purple-600 dark:text-purple-400">
                          {currentReadiness}%
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {currentQuestions}/{chap.defaultQuestionTarget || 120} Qs
                        </div>
                      </div>

                      {/* Quick 1-Click Status Dropdown */}
                      <select
                        value={currentStatus}
                        onChange={(e) => handleQuickStatusChange(chap, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 font-semibold text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer"
                      >
                        <option value="NOT_STARTED">⭕ Not Started</option>
                        <option value="LEARNING">📖 Learning (25%)</option>
                        <option value="PRACTISING">⚡ Practising (50%)</option>
                        <option value="DEVELOPING">📈 Developing (70%)</option>
                        <option value="TEST_READY">🧪 Test Ready (85%)</option>
                        <option value="MASTERED">👑 Mastered (95%)</option>
                        <option value="NEEDS_REVISION">⚠️ Needs Revision</option>
                      </select>

                      {/* +10 Questions Quick Click */}
                      <button
                        onClick={() => handleQuickAdd10(chap)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 transition-all cursor-pointer"
                        title="Quick Log 10 Solved Questions"
                      >
                        +10 Qs
                      </button>

                      {/* Practice Modal Open */}
                      <button
                        onClick={() => {
                          setSelectedChapterForPractice(chap);
                          setPracticeModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-850 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 border border-zinc-200 dark:border-zinc-750 transition-colors cursor-pointer"
                        title="Log Detailed Practice Session"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Subtopics Accordion */}
                  {isExpanded && chap.topics && chap.topics.length > 0 && (
                    <div className="p-4 bg-zinc-50/70 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 space-y-2 text-xs">
                      <div className="font-bold text-[11px] uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                        <span>Core Subtopics &amp; Concepts ({chap.topics.length}):</span>
                        <span className="text-[10px] text-zinc-500 font-normal">NCERT Syllabus Outline</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {chap.topics.map((top: any, idx: number) => (
                          <div
                            key={top.id || idx}
                            className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                            <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate">
                              {top.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Practice Modal */}
      <QuickPracticeModal
        isOpen={practiceModalOpen}
        onClose={() => {
          setPracticeModalOpen(false);
          setSelectedChapterForPractice(null);
        }}
        preselectedChapterId={selectedChapterForPractice?.id}
        chapters={chapters}
      />
    </div>
  );
}
