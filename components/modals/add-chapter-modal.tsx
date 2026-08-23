"use client";

import React, { useState } from "react";
import { X, Plus, BookOpen, Clock, Target, Flame, Layers, Sparkles, Check } from "lucide-react";
import { createCustomChapter } from "@/lib/actions/chapter-actions";
import { cn, getSubjectColor } from "@/lib/utils";

export function AddChapterModal({
  isOpen,
  onClose,
  subjects,
  onChapterCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  subjects: any[];
  onChapterCreated?: (newChapter: any) => void;
}) {
  const [name, setName] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || "");
  const [classLevel, setClassLevel] = useState(11);
  const [estimatedHours, setEstimatedHours] = useState(12);
  const [historicalPriority, setHistoricalPriority] = useState(80);
  const [defaultQuestionTarget, setDefaultQuestionTarget] = useState(100);
  const [defaultPYQTarget, setDefaultPYQTarget] = useState(50);
  const [topicsInput, setTopicsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedSubjectId) return;

    setIsSubmitting(true);
    try {
      const topicsList = topicsInput
        .split(/[,\n]/)
        .map((t) => t.trim())
        .filter(Boolean);

      const created = await createCustomChapter({
        name: name.trim(),
        subjectId: selectedSubjectId,
        classLevel,
        estimatedHours: Number(estimatedHours),
        historicalPriority: Number(historicalPriority),
        defaultQuestionTarget: Number(defaultQuestionTarget),
        defaultPYQTarget: Number(defaultPYQTarget),
        topics: topicsList,
      });

      if (onChapterCreated) {
        onChapterCreated(created);
      }

      // Reset
      setName("");
      setTopicsInput("");
      onClose();
    } catch (err: any) {
      console.error(err);
      alert("Failed to create chapter: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Add Custom Chapter</h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Create a new chapter and integrate it into your curriculum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Chapter Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Chapter Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Advanced Fluid Mechanics / Olympiad Problems"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-blue-500 shadow-xs font-medium"
            />
          </div>

          {/* Subject Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Subject</label>
            <div className="grid grid-cols-3 gap-2">
              {subjects.map((sub) => {
                const isSelected = selectedSubjectId === sub.id;
                const colors = getSubjectColor(sub.name);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={cn(
                      "py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5",
                      isSelected
                        ? cn(colors.badge, "border-current shadow-sm")
                        : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                    )}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class Level & Estimated Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Class Level</label>
              <div className="flex items-center gap-2">
                {[11, 12].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setClassLevel(lvl)}
                    className={cn(
                      "flex-1 py-2 text-xs rounded-xl border font-bold transition-all",
                      classLevel === lvl
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xs"
                        : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    Class {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                <span>Mastery Study Hours</span>
                <span className="font-mono text-blue-600 font-bold">{estimatedHours}h</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
              />
            </div>
          </div>

          {/* Priority ROI & Target Questions */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                <span>Weightage Priority</span>
                <span className="font-mono text-rose-600 font-bold">{historicalPriority}%</span>
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={historicalPriority}
                onChange={(e) => setHistoricalPriority(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>Foundation (50%)</span>
                <span>🔥 High ROI (100%)</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Target Questions</label>
              <input
                type="number"
                min="10"
                max="500"
                step="10"
                value={defaultQuestionTarget}
                onChange={(e) => setDefaultQuestionTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
              />
            </div>
          </div>

          {/* Subtopics (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Subtopics / Key Concepts</span>
              <span className="text-[10px] text-zinc-400 font-normal">Comma or newline separated</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Viscous drag, Stokes law, Terminal velocity, Surface energy"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-blue-500 shadow-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isSubmitting ? "Creating..." : "Create Chapter"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
