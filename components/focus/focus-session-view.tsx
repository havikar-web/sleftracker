"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Square,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  XCircle,
  RotateCcw,
  Clock,
  Target,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  Check,
  Undo2,
  Search,
  Layers,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { cn, getSubjectColor } from "@/lib/utils";
import { logStudySession } from "@/lib/actions/study-actions";
import { logPracticeSession } from "@/lib/actions/practice-actions";
import { ProgressCircle } from "@/components/ui/progress-circle";

interface QuestionLog {
  id: string;
  type: "INDEPENDENT" | "ASSISTED" | "WRONG";
  timestamp: number;
}

export function FocusSessionView({
  allChapters = [],
  defaultChapterId,
}: {
  allChapters: any[];
  defaultChapterId?: string;
}) {
  // Setup state
  const [selectedChapterId, setSelectedChapterId] = useState(defaultChapterId || allChapters[0]?.id || "");
  const [selectedSubtopicIds, setSelectedSubtopicIds] = useState<string[]>([]);
  const [chapterSearch, setChapterSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [weightageFilter, setWeightageFilter] = useState<string>("ALL");
  const [studyMode, setStudyMode] = useState<"MCQ" | "THEORY" | "LECTURE" | "REVISION">("MCQ");
  const [source, setSource] = useState<string>("JEE_MAIN_PYQ");
  const [sessionNotes, setSessionNotes] = useState<string>("");

  // Live session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Live MCQ Question Tally
  const [questionLogs, setQuestionLogs] = useState<QuestionLog[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [completedSummary, setCompletedSummary] = useState<any>(null);

  // Selected chapter object & subtopics
  const activeChapter = allChapters.find((c) => c.id === selectedChapterId) || allChapters[0];
  const activeSubtopics = activeChapter?.topics || [];
  const subjectColors = getSubjectColor(activeChapter?.subjectName || "Physics");

  // Filtered Chapters based on search, subject, and weightage
  const filteredChapters = allChapters.filter((c) => {
    if (subjectFilter !== "ALL" && c.subjectName.toLowerCase() !== subjectFilter.toLowerCase()) {
      return false;
    }
    const weightage = c.historicalPriority || 75;
    if (weightageFilter === "HIGH" && weightage < 85) return false;
    if (weightageFilter === "MEDIUM" && (weightage < 70 || weightage >= 85)) return false;
    if (weightageFilter === "FOUNDATION" && weightage >= 70) return false;

    if (!chapterSearch.trim()) return true;
    const q = chapterSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.subjectName.toLowerCase().includes(q) ||
      c.topics?.some((t: any) => t.name.toLowerCase().includes(q))
    );
  });

  // Toggle Subtopic selection (optional)
  const handleToggleSubtopic = (topicId: string) => {
    setSelectedSubtopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isSessionActive && isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, isRunning]);

  // Start Session
  const handleStartSession = () => {
    if (!selectedChapterId) return;
    setSeconds(0);
    setQuestionLogs([]);
    setIsSessionActive(true);
    setIsRunning(true);
  };

  // Log Single MCQ click
  const handleLogMcq = (type: "INDEPENDENT" | "ASSISTED" | "WRONG") => {
    const newLog: QuestionLog = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      timestamp: Date.now(),
    };
    setQuestionLogs((prev) => [newLog, ...prev]);
  };

  // Undo Last Logged MCQ
  const handleUndo = () => {
    setQuestionLogs((prev) => prev.slice(1));
  };

  // Calculations for live metrics
  const totalSolved = questionLogs.length;
  const independentCount = questionLogs.filter((q) => q.type === "INDEPENDENT").length;
  const assistedCount = questionLogs.filter((q) => q.type === "ASSISTED").length;
  const wrongCount = questionLogs.filter((q) => q.type === "WRONG").length;

  const liveAccuracy =
    totalSolved > 0 ? Math.round((independentCount / totalSolved) * 100) : 0;

  const minutesElapsed = seconds / 60;
  const avgPace =
    totalSolved > 0 ? (minutesElapsed / totalSolved).toFixed(1) : "0.0";

  // Selected subtopics names for display
  const selectedSubtopicNames = activeSubtopics
    .filter((t: any) => selectedSubtopicIds.includes(t.id))
    .map((t: any) => t.name);

  // End Session & Save Everything
  const handleEndSession = async () => {
    setIsRunning(false);
    setIsSaving(true);

    const durationMinutes = Math.max(1, Math.round(seconds / 60));
    const subtopicsText =
      selectedSubtopicNames.length > 0 ? ` [Subtopics: ${selectedSubtopicNames.join(", ")}]` : "";

    try {
      // 1. Save Study Session
      await logStudySession({
        durationMinutes,
        chapterId: activeChapter?.id,
        notes: `${studyMode} Focus Session for ${activeChapter?.name}${subtopicsText}${
          sessionNotes ? ` • ${sessionNotes}` : ""
        }`,
      });

      // 2. If MCQs were logged, save Practice Session (cascades to ChapterProgress)
      if (totalSolved > 0) {
        await logPracticeSession({
          chapterId: activeChapter?.id,
          subjectId: activeChapter?.subjectId,
          source,
          questions: totalSolved,
          correctIndependent: independentCount,
          wrong: wrongCount,
          assisted: assistedCount,
          durationMinutes,
          difficulty: "MEDIUM",
          notes: `Live MCQ Room: ${independentCount} Indep, ${assistedCount} Assist, ${wrongCount} Wrong${subtopicsText}`,
        });
      }

      setCompletedSummary({
        durationMinutes,
        totalSolved,
        independentCount,
        assistedCount,
        wrongCount,
        liveAccuracy,
        chapterName: activeChapter?.name,
        subjectName: activeChapter?.subjectName,
        subtopics: selectedSubtopicNames,
      });
    } catch (err) {
      console.error("Failed to save focus session:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Format active timer HH:MM:SS
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const timeDisplay = `${hrs > 0 ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. SETUP SCREEN (Search Chapter + Optional Subtopics) */}
      {!isSessionActive && !completedSummary && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 shadow-md space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4" /> Focused Study Room
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                What are you studying right now?
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Search any chapter and optionally tag subtopics. Live 1-tap MCQ tracking records every question as Independent, Assisted, or Wrong.
              </p>
            </div>

            {/* 1. Chapter Search & Quick Select (No annoying scrolling!) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  1. Search & Select Focus Chapter
                </label>
                {activeChapter && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    Selected: <strong>{activeChapter.name}</strong> ({activeChapter.subjectName})
                  </span>
                )}
              </div>

              {/* Search Bar & Subject Filter Pills */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Type to search (e.g. 'Kinematics', 'GOC', 'Integration', 'Thermo')..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-blue-500 shadow-sm"
                  />
                  {chapterSearch && (
                    <button
                      onClick={() => setChapterSearch("")}
                      className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {["ALL", "Physics", "Chemistry", "Mathematics"].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubjectFilter(sub)}
                      className={cn(
                        "px-2.5 py-2 text-[11px] font-semibold rounded-xl border transition-all",
                        subjectFilter === sub
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
                    onClick={() => setWeightageFilter(w.id)}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-semibold rounded-full border transition-all whitespace-nowrap",
                      weightageFilter === w.id
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-bold shadow-sm"
                        : "bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-100"
                    )}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              {/* Instant Search Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30">
                {filteredChapters.map((chap) => {
                  const isSelected = selectedChapterId === chap.id;
                  const colors = getSubjectColor(chap.subjectName);
                  const wScore = Math.round(chap.historicalPriority || 75);

                  return (
                    <div
                      key={chap.id}
                      onClick={() => {
                        setSelectedChapterId(chap.id);
                        setSelectedSubtopicIds([]); // reset subtopics on chapter change
                      }}
                      className={cn(
                        "p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2",
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                          : "bg-white dark:bg-zinc-950/70 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                      )}
                    >
                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded text-[9px] font-semibold",
                              isSelected ? "bg-white/20 text-white" : colors.badge
                            )}
                          >
                            {chap.subjectName}
                          </span>
                          <span className="text-[10px] opacity-70 font-mono">Cl {chap.classLevel}</span>
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
                        <div className="text-xs truncate font-medium mt-0.5">{chap.name}</div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 shrink-0 text-white stroke-[3]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Optional Subtopic Selection */}
            {activeSubtopics.length > 0 && (
              <div className="space-y-2 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    2. Specific Subtopics <span className="text-[10px] font-normal text-zinc-400">(Optional)</span>
                  </label>
                  {selectedSubtopicIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedSubtopicIds([])}
                      className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      Clear ({selectedSubtopicIds.length})
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activeSubtopics.map((sub: any) => {
                    const isSelected = selectedSubtopicIds.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleToggleSubtopic(sub.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5",
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                            : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{sub.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Activity Type Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                3. Activity Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "MCQ", label: "MCQ Problem Practice", icon: Zap, desc: "Live clicker enabled" },
                  { id: "THEORY", label: "Theory Reading", icon: BookOpen, desc: "Notes & concepts" },
                  { id: "LECTURE", label: "Video Lecture", icon: Play, desc: "Coaching classes" },
                  { id: "REVISION", label: "Formula Revision", icon: RotateCcw, desc: "Active recall" },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = studyMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setStudyMode(mode.id as any)}
                      className={cn(
                        "p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between",
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                          : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100"
                      )}
                    >
                      <Icon className="w-5 h-5 mb-2" />
                      <div>
                        <div className="text-xs font-bold">{mode.label}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">{mode.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Practice Source (if MCQ Mode) */}
            {studyMode === "MCQ" && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  4. Practice Source
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "JEE_MAIN_PYQ", label: "JEE Main PYQ" },
                    { id: "JEE_ADV_PYQ", label: "JEE Advanced PYQ" },
                    { id: "HCV", label: "H.C. Verma / Standard" },
                    { id: "CENGAGE_MODULE", label: "Coaching Module" },
                  ].map((src) => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setSource(src.id)}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-semibold transition-all",
                        source === src.id
                          ? "bg-zinc-900 dark:bg-zinc-800 text-white border-zinc-900 dark:border-zinc-700 shadow-sm"
                          : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start Button */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-end">
              <button
                onClick={handleStartSession}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus Study Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE LIVE FOCUS MODE WITH 1-TAP MCQ CLICKER */}
      {isSessionActive && !completedSummary && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Session Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("badge-tag text-[10px] font-semibold", subjectColors.badge)}>
                    {activeChapter?.subjectName}
                  </span>
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {activeChapter?.name}
                  </span>
                  {selectedSubtopicNames.length > 0 && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {selectedSubtopicNames.join(", ")}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">
                  {studyMode === "MCQ" ? `MCQ Practice • ${source.replace(/_/g, " ")}` : studyMode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors",
                  isRunning
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                )}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isRunning ? "Pause" : "Resume"}</span>
              </button>

              <button
                onClick={handleEndSession}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{isSaving ? "Saving..." : "Finish & Save"}</span>
              </button>
            </div>
          </div>

          {/* Big Sleek Digital Timer & Live Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timer Card */}
            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col items-center justify-center text-center shadow-sm relative">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-1">
                Active Study Timer
              </div>
              <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-zinc-900 dark:text-white">
                {timeDisplay}
              </div>
              <div className="text-xs text-zinc-500 mt-2 font-mono">
                {isRunning ? "● Timer ticking" : "❚❚ Paused"}
              </div>
            </div>

            {/* Questions Solved & Accuracy */}
            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between shadow-sm">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Total Solved</div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  {totalSolved} <span className="text-xs text-zinc-400 font-normal">MCQs</span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-1">
                  Avg Pace: <strong>{avgPace} min/Q</strong>
                </div>
              </div>
              <ProgressCircle value={liveAccuracy} size={64} strokeWidth={6} color="#10b981" label="Accuracy" />
            </div>

            {/* Breakdown Mini-Gauges */}
            <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-center space-y-2.5 shadow-sm text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">Independent (✓)</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{independentCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <span className="font-semibold text-amber-700 dark:text-amber-300">Assisted (💡)</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{assistedCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <span className="font-semibold text-rose-700 dark:text-rose-300">Wrong (✗)</span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-300">{wrongCount}</span>
              </div>
            </div>
          </div>

          {/* 3. LIVE 1-TAP MCQ CLICKER / LOGGER */}
          <div className="p-6 rounded-3xl border-2 border-blue-500/40 bg-white dark:bg-zinc-950 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-current" />
                  Live MCQ Clicker — Tap As You Solve
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Tap the button that matches how you solved each question:
                </p>
              </div>

              {questionLogs.length > 0 && (
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold"
                  title="Undo last question"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Undo Last
                </button>
              )}
            </div>

            {/* 3 Giant Touch/Click Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* 1. Independent Correct */}
              <button
                onClick={() => handleLogMcq("INDEPENDENT")}
                className="p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex flex-col items-center justify-center text-center shadow-sm transition-all group select-none cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="text-base font-bold">Independent (✓)</div>
                <div className="text-[11px] opacity-90 mt-0.5">Solved alone with zero help</div>
              </button>

              {/* 2. Assisted / Hint */}
              <button
                onClick={() => handleLogMcq("ASSISTED")}
                className="p-5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-white flex flex-col items-center justify-center text-center shadow-sm transition-all group select-none cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div className="text-base font-bold">Assisted (💡)</div>
                <div className="text-[11px] opacity-90 mt-0.5">Needed hint, solution, or notes</div>
              </button>

              {/* 3. Wrong / Mistake */}
              <button
                onClick={() => handleLogMcq("WRONG")}
                className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex flex-col items-center justify-center text-center shadow-sm transition-all group select-none cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
                  <XCircle className="w-6 h-6" />
                </div>
                <div className="text-base font-bold">Wrong (✗)</div>
                <div className="text-[11px] opacity-90 mt-0.5">Conceptual or calculation error</div>
              </button>
            </div>

            {/* Live History Stream / Chips */}
            {questionLogs.length > 0 && (
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-850">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Session Log Stream ({questionLogs.length} logged)
                </div>
                <div className="flex items-center gap-1.5 flex-wrap max-h-24 overflow-y-auto">
                  {questionLogs.map((q, idx) => {
                    const qNum = questionLogs.length - idx;
                    let badgeClass = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-300";
                    let label = "✓ Indep";
                    if (q.type === "ASSISTED") {
                      badgeClass = "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-300";
                      label = "💡 Assist";
                    } else if (q.type === "WRONG") {
                      badgeClass = "bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-300";
                      label = "✗ Wrong";
                    }

                    return (
                      <span
                        key={q.id}
                        className={cn("px-2 py-0.5 text-[11px] font-mono font-semibold rounded-lg border", badgeClass)}
                      >
                        Q{qNum}: {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SESSION COMPLETED DEBRIEF CARD */}
      {completedSummary && (
        <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Session Successfully Saved & Auto-Calculated
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Outstanding Work!
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {completedSummary.chapterName} • {completedSummary.subjectName}
              {completedSummary.subtopics?.length > 0 && ` (${completedSummary.subtopics.join(", ")})`}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-zinc-500 text-[10px] font-medium">Time Logged</div>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                {completedSummary.durationMinutes} mins
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-zinc-500 text-[10px] font-medium">MCQs Solved</div>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                {completedSummary.totalSolved} Qs
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="text-emerald-600 text-[10px] font-medium">Independent ✓</div>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {completedSummary.independentCount}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-zinc-500 text-[10px] font-medium">Accuracy Rate</div>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                {completedSummary.liveAccuracy}%
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setCompletedSummary(null);
                setIsSessionActive(false);
                setSelectedSubtopicIds([]);
              }}
              className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Start Another Session
            </button>

            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              Back to Today Command Center
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
