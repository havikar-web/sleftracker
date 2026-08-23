"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Plus,
  Calendar,
  Sparkles,
  AlertOctagon,
  Percent,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
} from "lucide-react";
import { cn, getSubjectColor } from "@/lib/utils";
import { createTest } from "@/lib/actions/test-actions";

export function TestsView({ tests, allChapters = [] }: { tests: any[]; allChapters: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [testType, setTestType] = useState("CHAPTER");
  const [totalMarks, setTotalMarks] = useState(100);
  const [score, setScore] = useState(72);
  const [questions, setQuestions] = useState(25);
  const [correct, setCorrect] = useState(18);
  const [wrong, setWrong] = useState(5);
  const [unattempted, setUnattempted] = useState(2);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [errorType, setErrorType] = useState("SILLY_MISTAKE");
  const [errorCount, setErrorCount] = useState(2);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createTest({
        name,
        testType,
        totalMarks,
        score,
        questions,
        correct,
        wrong,
        unattempted,
        durationMinutes,
        chapterIds: selectedChapterId ? [selectedChapterId] : undefined,
        errors: errorCount > 0 ? [{ errorType, count: errorCount }] : undefined,
        notes: notes || undefined,
      });
      setName("");
      setNotes("");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
            <FileCheck2 className="w-4 h-4" /> Mock & Chapter Test Tracker
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Test Performance & Error Analysis</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Log chapter drills, full JEE Main & Advanced mocks, attempt rates, and classify mistakes
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors shadow-sm shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Test Result</span>
        </button>
      </div>

      {/* Tests Log List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span>Completed Tests ({tests.length})</span>
          <span className="font-mono text-[11px]">Real-time evaluation logs</span>
        </div>

        {tests.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">
            No test records found. Take a chapter test to benchmark readiness.
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => {
              const accuracy =
                test.correct + test.wrong > 0
                  ? Math.round((test.correct / (test.correct + test.wrong)) * 100)
                  : 0;
              const attemptRate =
                test.questions > 0
                  ? Math.round(((test.correct + test.wrong) / test.questions) * 100)
                  : 0;

              return (
                <div
                  key={test.id}
                  className="p-4 sm:p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-700 transition-colors space-y-3 text-xs"
                >
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950/40 text-rose-300 border border-rose-800/50">
                        {test.testType.replace(/_/g, " ")}
                      </span>
                      <h3 className="font-bold text-sm text-zinc-100">{test.name}</h3>
                      {test.testChapters[0] && (
                        <span className="text-[11px] text-zinc-400 font-mono">
                          ({test.testChapters[0].chapter.name})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                      <span>{new Date(test.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                      <span>•</span>
                      <span>{test.durationMinutes} mins</span>
                    </div>
                  </div>

                  {/* Score & Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs pt-1">
                    <div className="p-2 bg-zinc-900/60 rounded border border-zinc-850">
                      <div className="text-[10px] text-zinc-400">Score</div>
                      <div className="text-base font-bold font-mono text-zinc-100">
                        {test.score} <span className="text-xs text-zinc-400 font-normal">/ {test.totalMarks}</span>
                      </div>
                    </div>

                    <div className="p-2 bg-emerald-950/30 rounded border border-emerald-900/50">
                      <div className="text-[10px] text-emerald-400">Correct ✓</div>
                      <div className="text-base font-bold font-mono text-emerald-300">{test.correct}</div>
                    </div>

                    <div className="p-2 bg-rose-950/30 rounded border border-rose-900/50">
                      <div className="text-[10px] text-rose-400">Wrong ✗</div>
                      <div className="text-base font-bold font-mono text-rose-300">{test.wrong}</div>
                    </div>

                    <div className="p-2 bg-zinc-900/60 rounded border border-zinc-850">
                      <div className="text-[10px] text-zinc-400">Accuracy</div>
                      <div className="text-base font-bold font-mono text-emerald-400">{accuracy}%</div>
                    </div>

                    <div className="p-2 bg-zinc-900/60 rounded border border-zinc-850">
                      <div className="text-[10px] text-zinc-400">Attempt Rate</div>
                      <div className="text-base font-bold font-mono text-blue-400">{attemptRate}%</div>
                    </div>
                  </div>

                  {/* Error Tags & Notes */}
                  {(test.errors?.length > 0 || test.notes) && (
                    <div className="pt-2 border-t border-zinc-850 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      {test.errors?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-zinc-500 font-medium">Mistake classifications:</span>
                          {test.errors.map((err: any) => (
                            <span
                              key={err.id}
                              className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-rose-300 font-mono"
                            >
                              {err.errorType.replace(/_/g, " ")} ({err.count})
                            </span>
                          ))}
                        </div>
                      )}

                      {test.notes && <span className="text-zinc-400 italic">{test.notes}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Test Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-100">Log Test Scorecard & Error Analysis</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gravitation Timed Chapter Test #1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
                  >
                    <option value="CHAPTER">Chapter Test</option>
                    <option value="TOPIC">Topic Drill</option>
                    <option value="JEE_MAIN_MOCK">Full JEE Main Mock</option>
                    <option value="JEE_ADV_MOCK">JEE Advanced Mock</option>
                    <option value="PART_SYLLABUS">Part Syllabus Test</option>
                    <option value="COLLEGE">Coaching / College Test</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Linked Chapter</label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
                  >
                    <option value="">-- None / Full Syllabus --</option>
                    {allChapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.subjectName}] {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Marks & Duration */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Score Obtained</label>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Question Breakdown */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Total Qs</label>
                  <input
                    type="number"
                    value={questions}
                    onChange={(e) => setQuestions(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-emerald-400 mb-1">Correct</label>
                  <input
                    type="number"
                    value={correct}
                    onChange={(e) => setCorrect(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-rose-400 mb-1">Wrong</label>
                  <input
                    type="number"
                    value={wrong}
                    onChange={(e) => setWrong(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-400 mb-1">Unattempted</label>
                  <input
                    type="number"
                    value={unattempted}
                    onChange={(e) => setUnattempted(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Mistake Taxonomy Classification */}
              <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-lg space-y-2">
                <div className="font-semibold text-zinc-200 text-xs">Primary Error Classification</div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={errorType}
                    onChange={(e) => setErrorType(e.target.value)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
                  >
                    <option value="CONCEPT_ERROR">Concept Error</option>
                    <option value="SILLY_MISTAKE">Silly Mistake</option>
                    <option value="CALCULATION_ERROR">Calculation Error</option>
                    <option value="FORMULA_ERROR">Formula Recall Error</option>
                    <option value="MISREAD_QUESTION">Misread Question</option>
                    <option value="TIME_PRESSURE">Time Pressure Rush</option>
                    <option value="GUESS">Unwarranted Guess</option>
                    <option value="FORGOT_FACT">Forgot Inorganic Fact</option>
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Mistake count"
                    value={errorCount}
                    onChange={(e) => setErrorCount(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Analysis Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Lost marks on negative sign in gravitational PE formula"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
                />
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
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileCheck2 className="w-3.5 h-3.5" />
                  )}
                  <span>Save Test Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
