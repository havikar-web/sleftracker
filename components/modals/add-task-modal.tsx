"use client";

import React, { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { createTask } from "@/lib/actions/task-actions";

interface ChapterOption {
  id: string;
  name: string;
  subjectName: string;
  subjectId: string;
  classLevel: number;
}

export function AddTaskModal({
  isOpen,
  onClose,
  chapters = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  chapters?: ChapterOption[];
}) {
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedClass, setSelectedClass] = useState<number>(11);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("QUESTIONS");
  const [targetType, setTargetType] = useState("QUESTIONS");
  const [targetValue, setTargetValue] = useState<number>(30);
  const [priority, setPriority] = useState("HIGH");
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const filteredChapters = chapters.filter((c) => {
    if (selectedSubject !== "ALL" && c.subjectName !== selectedSubject) return false;
    if (selectedClass && c.classLevel !== selectedClass) return false;
    return true;
  });

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || filteredChapters[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createTask({
        title,
        taskType,
        targetType,
        targetValue: targetValue || undefined,
        priority,
        estimatedMinutes,
        chapterId: selectedChapter?.id || undefined,
        subjectId: selectedChapter?.subjectId || undefined,
        notes: notes || undefined,
      });
      setTitle("");
      setNotes("");
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
        className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <h2 className="text-sm font-semibold text-zinc-100">Add Academic Study Task</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Title */}
          <div>
            <label className="block font-medium text-zinc-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Gravitation: Solve 30 PYQs on Satellites"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Subject & Class Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Subject Filter</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedChapterId("");
                }}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value="ALL">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Class Level</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(parseInt(e.target.value));
                  setSelectedChapterId("");
                }}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value={11}>Class 11</option>
                <option value={12}>Class 12</option>
              </select>
            </div>
          </div>

          {/* Chapter */}
          <div>
            <label className="block font-medium text-zinc-300 mb-1">Linked Chapter</label>
            <select
              value={selectedChapterId || selectedChapter?.id || ""}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden focus:border-blue-500"
            >
              {filteredChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.subjectName}] {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Type & Target Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Task Type</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value="QUESTIONS">Question Practice</option>
                <option value="PYQS">JEE PYQs</option>
                <option value="THEORY">Theory / Lectures</option>
                <option value="BOOK_PRACTICE">Book Practice (HCV/Cengage)</option>
                <option value="REVISION">Spaced Revision</option>
                <option value="TEST">Mock / Chapter Test</option>
                <option value="ERROR_REVIEW">Error Analysis & Fixes</option>
                <option value="NOTES">Formula & Short Notes</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Target Type</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value="QUESTIONS">Questions Count</option>
                <option value="MINUTES">Study Minutes</option>
                <option value="PAGES">Pages / Problem Set</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="NONE">No Numeric Target</option>
              </select>
            </div>
          </div>

          {/* Target Value, Priority & Estimated Time */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Target Value</label>
              <input
                type="number"
                min="1"
                value={targetValue}
                onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value="CRITICAL">🔥 Critical</option>
                <option value="HIGH">🟠 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">⚪ Low</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Est. Minutes</label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 30)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-zinc-300 mb-1">Notes / Subtopic Context</label>
            <input
              type="text"
              placeholder="e.g. Focus on satellite energy conservation"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
            />
          </div>

          {/* Submit */}
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
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
