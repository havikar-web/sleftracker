"use client";

import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle, Sparkles, HelpCircle, Loader2 } from "lucide-react";
import { logPracticeSession } from "@/lib/actions/practice-actions";
import { cn } from "@/lib/utils";

interface ChapterOption {
  id: string;
  name: string;
  subjectName: string;
  subjectId: string;
  color: string;
}

export function QuickPracticeModal({
  isOpen,
  onClose,
  preselectedChapterId,
  chapters = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  preselectedChapterId?: string;
  chapters?: ChapterOption[];
}) {
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [source, setSource] = useState("JEE_MAIN_PYQ");
  const [questions, setQuestions] = useState(20);
  const [correctIndependent, setCorrectIndependent] = useState(15);
  const [wrong, setWrong] = useState(3);
  const [assisted, setAssisted] = useState(2);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (preselectedChapterId) {
      setSelectedChapterId(preselectedChapterId);
    } else if (chapters.length > 0 && !selectedChapterId) {
      setSelectedChapterId(chapters[0].id);
    }
  }, [preselectedChapterId, chapters]);

  if (!isOpen) return null;

  const totalInput = correctIndependent + wrong + assisted;
  const independentAccuracy =
    totalInput > 0 ? Math.round((correctIndependent / totalInput) * 100) : 0;

  // Auto-balance questions if user changes sub-counters
  const handleCorrectChange = (val: number) => {
    const v = Math.max(0, val);
    setCorrectIndependent(v);
    setQuestions(v + wrong + assisted);
  };

  const handleWrongChange = (val: number) => {
    const v = Math.max(0, val);
    setWrong(v);
    setQuestions(correctIndependent + v + assisted);
  };

  const handleAssistedChange = (val: number) => {
    const v = Math.max(0, val);
    setAssisted(v);
    setQuestions(correctIndependent + wrong + v);
  };

  const filteredChapters = chapters.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChapterId && !selectedChapter) return;

    setIsSubmitting(true);
    try {
      await logPracticeSession({
        subjectId: selectedChapter?.subjectId || "",
        chapterId: selectedChapterId || selectedChapter?.id || "",
        source,
        questions: questions || totalInput,
        correctIndependent,
        wrong,
        assisted,
        durationMinutes,
        difficulty,
        notes: notes || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Log Practice Session</h2>
              <p className="text-[11px] text-zinc-400">Takes &lt;15 seconds • Auto-updates chapter readiness</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Chapter Selector */}
          <div>
            <label className="block font-medium text-zinc-300 mb-1">Target Chapter</label>
            <select
              value={selectedChapterId || selectedChapter?.id}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.subjectName}] {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source & Difficulty Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Practice Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500"
              >
                <option value="JEE_MAIN_PYQ">JEE Main PYQ</option>
                <option value="JEE_ADVANCED_PYQ">JEE Advanced PYQ</option>
                <option value="HCV">HC Verma</option>
                <option value="CENGAGE">Cengage / BM Sharma</option>
                <option value="COACHING_MODULE">Coaching Sheet / Module</option>
                <option value="NCERT">NCERT Exercises</option>
                <option value="OTHER">Other Book / Test Series</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium (Standard JEE)</option>
                <option value="HARD">Hard (Advanced Level)</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>
          </div>

          {/* Question Breakdown Steppers */}
          <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between text-zinc-300 font-medium">
              <span>Question Breakdown</span>
              <span className="font-mono text-zinc-400 font-bold text-sm">
                {totalInput} Questions
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Correct Independent */}
              <div className="p-2 bg-emerald-950/30 border border-emerald-900/50 rounded-md text-center">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" /> Independent
                </div>
                <input
                  type="number"
                  min="0"
                  value={correctIndependent}
                  onChange={(e) => handleCorrectChange(parseInt(e.target.value) || 0)}
                  className="w-full text-center text-base font-bold bg-transparent text-emerald-200 mt-1 focus:outline-hidden"
                />
              </div>

              {/* Wrong */}
              <div className="p-2 bg-rose-950/30 border border-rose-900/50 rounded-md text-center">
                <div className="text-[11px] font-semibold text-rose-400 flex items-center justify-center gap-1">
                  <X className="w-3 h-3" /> Wrong
                </div>
                <input
                  type="number"
                  min="0"
                  value={wrong}
                  onChange={(e) => handleWrongChange(parseInt(e.target.value) || 0)}
                  className="w-full text-center text-base font-bold bg-transparent text-rose-200 mt-1 focus:outline-hidden"
                />
              </div>

              {/* Assisted */}
              <div className="p-2 bg-amber-950/30 border border-amber-900/50 rounded-md text-center">
                <div className="text-[11px] font-semibold text-amber-400 flex items-center justify-center gap-1" title="Solved after hint/solution/teacher help">
                  <HelpCircle className="w-3 h-3" /> Assisted
                </div>
                <input
                  type="number"
                  min="0"
                  value={assisted}
                  onChange={(e) => handleAssistedChange(parseInt(e.target.value) || 0)}
                  className="w-full text-center text-base font-bold bg-transparent text-amber-200 mt-1 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Live Accuracy Output */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-zinc-400 border-t border-zinc-800">
              <span>Independent Accuracy:</span>
              <span
                className={cn(
                  "font-mono font-bold",
                  independentAccuracy >= 75
                    ? "text-emerald-400"
                    : independentAccuracy >= 60
                    ? "text-amber-400"
                    : "text-rose-400"
                )}
              >
                {independentAccuracy}%
              </span>
            </div>
          </div>

          {/* Time Spent & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Time Spent (Minutes)</label>
              <input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Tough orbital energy questions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || totalInput === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-md transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Practice Session</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
