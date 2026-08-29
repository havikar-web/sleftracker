"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  BookOpen,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  X,
  ArrowRight,
  HelpCircle,
  XCircle,
  Check,
  Edit3,
} from "lucide-react";
import { cn, getSubjectColor } from "@/lib/utils";
import {
  parseNaturalLanguageInput,
  ParsedActivity,
  ChapterCatalogItem,
} from "@/lib/nlp-log-parser";
import { executeNaturalLanguageLogs } from "@/lib/actions/nlp-log-actions";

export function NaturalLanguageLoggerModal({
  isOpen,
  onClose,
  allChapters = [],
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  allChapters: any[];
  onSuccess?: () => void;
}) {
  const [inputText, setInputText] = useState("");
  const [parsedItems, setParsedItems] = useState<ParsedActivity[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);

  // Formatted chapters catalog for parser
  const chapterCatalog: ChapterCatalogItem[] = allChapters.map((c) => ({
    id: c.id,
    name: c.name,
    subjectName: c.subjectName || "Physics",
    slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  // Parse text into structured activities
  const handleParse = (textToParse: string = inputText) => {
    if (!textToParse.trim()) {
      setParsedItems([]);
      return;
    }
    const results = parseNaturalLanguageInput(textToParse, chapterCatalog);
    setParsedItems(results);
  };

  // Auto-parse on debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim().length > 5) {
        handleParse(inputText);
      } else if (!inputText.trim()) {
        setParsedItems([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputText]);

  // Quick Prompt Presets
  const quickPresets = [
    "Studied Rotational Motion for 2 hours, solved 25 PYQs (20 right, 3 assisted, 2 wrong) from HCV",
    "Watched 1.5h lecture on Definite Integration and solved 10 PYQs",
    "Did 30 questions in Chemical Bonding in 45 mins (25 right, 5 wrong)",
    "Revised Thermodynamics formulas for 30 mins, need revision in Carnot cycle",
  ];

  // Update a single parsed activity field
  const handleUpdateItem = (id: string, updates: Partial<ParsedActivity>) => {
    setParsedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };

        // Auto update chapter details if chapterId changed
        if (updates.chapterId) {
          const chap = allChapters.find((c) => c.id === updates.chapterId);
          if (chap) {
            updated.chapterName = chap.name;
            updated.subjectName = chap.subjectName;
          }
        }
        return updated;
      })
    );
  };

  // Remove an item
  const handleRemoveItem = (id: string) => {
    setParsedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Execute and Auto-Update Database
  const handleExecute = async () => {
    if (parsedItems.length === 0) return;
    setIsExecuting(true);
    try {
      const res = await executeNaturalLanguageLogs(parsedItems);
      if (res.success) {
        setSuccessResult(res);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Failed to execute natural language log:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>AI Quick Log & Auto-Updater</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                  Instant NLP
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Just describe what you studied — JEE OS parses and updates your readiness automatically
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {!successResult ? (
            <>
              {/* Natural Language Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span>Type or Paste What You Did:</span>
                  <span className="text-[11px] text-zinc-400 font-normal">Supports multiple chapters & notes</span>
                </label>

                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. Studied Rotational Motion for 2 hours, solved 25 pyqs (20 right, 3 assisted, 2 wrong) from HCV and watched 1hr lecture on Definite Integration..."
                  className="w-full p-3.5 text-xs rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-blue-500 shadow-inner resize-none leading-relaxed"
                />

                {/* Quick Presets Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">Try Example:</span>
                  {quickPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInputText(preset);
                        handleParse(preset);
                      }}
                      className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 text-[10px] transition-all border border-zinc-200 dark:border-zinc-800 truncate max-w-[280px]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parsed Activities Live Preview */}
              {parsedItems.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Detected {parsedItems.length} Activity {parsedItems.length > 1 ? "Sessions" : "Session"} to Auto-Update
                    </span>
                    <span className="text-[11px] text-zinc-400">Click any field to edit before confirming</span>
                  </div>

                  <div className="space-y-3">
                    {parsedItems.map((item, index) => {
                      const colors = getSubjectColor(item.subjectName || "Physics");
                      const acc = item.questions > 0 ? Math.round((item.correctIndependent / item.questions) * 100) : 0;

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-3 relative group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", colors.badge)}>
                                {item.subjectName}
                              </span>

                              {/* Chapter Select Dropdown */}
                              <select
                                value={item.chapterId || ""}
                                onChange={(e) => handleUpdateItem(item.id, { chapterId: e.target.value })}
                                className="px-2.5 py-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-bold text-xs text-zinc-900 dark:text-zinc-100"
                              >
                                {allChapters.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name} ({c.subjectName})
                                  </option>
                                ))}
                              </select>

                              {/* Activity Type Badge */}
                              <select
                                value={item.activityType}
                                onChange={(e) => handleUpdateItem(item.id, { activityType: e.target.value as any })}
                                className="px-2 py-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-semibold text-[11px] text-blue-600 dark:text-blue-400"
                              >
                                <option value="MCQ">⚡ MCQ Practice</option>
                                <option value="THEORY">📖 Theory Reading</option>
                                <option value="LECTURE">▶ Video Lecture</option>
                                <option value="REVISION">🔄 Formula Revision</option>
                              </select>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-zinc-400 hover:text-rose-500 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Metric Inputs Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                            {/* Study Duration */}
                            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase block">Duration (Mins)</label>
                              <input
                                type="number"
                                min="1"
                                value={item.durationMinutes}
                                onChange={(e) => handleUpdateItem(item.id, { durationMinutes: parseInt(e.target.value) || 0 })}
                                className="w-full font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 bg-transparent border-0 p-0 text-sm focus:outline-hidden"
                              />
                            </div>

                            {/* Total Questions */}
                            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                              <label className="text-[10px] text-zinc-400 font-bold uppercase block">Total MCQs</label>
                              <input
                                type="number"
                                min="0"
                                value={item.questions}
                                onChange={(e) => handleUpdateItem(item.id, { questions: parseInt(e.target.value) || 0 })}
                                className="w-full font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5 bg-transparent border-0 p-0 text-sm focus:outline-hidden"
                              />
                            </div>

                            {/* Independent Correct */}
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                              <label className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">Independent (✓)</label>
                              <input
                                type="number"
                                min="0"
                                value={item.correctIndependent}
                                onChange={(e) => handleUpdateItem(item.id, { correctIndependent: parseInt(e.target.value) || 0 })}
                                className="w-full font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 bg-transparent border-0 p-0 text-sm focus:outline-hidden"
                              />
                            </div>

                            {/* Wrong */}
                            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                              <label className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase block">Wrong (✗)</label>
                              <input
                                type="number"
                                min="0"
                                value={item.wrong}
                                onChange={(e) => handleUpdateItem(item.id, { wrong: parseInt(e.target.value) || 0 })}
                                className="w-full font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5 bg-transparent border-0 p-0 text-sm focus:outline-hidden"
                              />
                            </div>
                          </div>

                          {/* Source & Notes */}
                          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                            <div className="flex items-center gap-2">
                              <span>Source:</span>
                              <select
                                value={item.source}
                                onChange={(e) => handleUpdateItem(item.id, { source: e.target.value })}
                                className="px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300"
                              >
                                <option value="JEE_MAIN_PYQ">JEE Main PYQ</option>
                                <option value="JEE_ADV_PYQ">JEE Advanced PYQ</option>
                                <option value="HCV">H.C. Verma</option>
                                <option value="CENGAGE_MODULE">Coaching / Cengage</option>
                              </select>
                            </div>

                            {item.questions > 0 && (
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {acc}% Accuracy
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Success Feedback Card */
            <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4 animate-in zoom-in-95">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Successfully Updated JEE OS!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  Logged {successResult.executedCount} sessions • {successResult.totalLoggedMinutes} minutes of focused study • {successResult.totalLoggedQuestions} MCQs auto-calculated into Chapter Readiness
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2">
                {successResult.executedSummaries?.map((s: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-500/20 text-left">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{s.chapterName}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {s.durationMinutes} mins • {s.questions} MCQs
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    setSuccessResult(null);
                    setInputText("");
                    setParsedItems([]);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!successResult && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleExecute}
              disabled={isExecuting || parsedItems.length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>
                {isExecuting
                  ? "Auto-Updating..."
                  : `Confirm & Auto-Update (${parsedItems.length} ${parsedItems.length === 1 ? "Session" : "Sessions"})`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
