"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Target, PenTool, FileCheck2, Loader2, ArrowRight } from "lucide-react";
import { globalSearch } from "@/lib/actions/search-actions";
import { cn, getSubjectColor } from "@/lib/utils";

export function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    chapters: any[];
    topics: any[];
    tasks: any[];
    tests: any[];
    goals: any[];
  }>({ chapters: [], topics: [], tasks: [], tests: [], goals: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({ chapters: [], topics: [], tasks: [], tests: [], goals: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults({ chapters: [], topics: [], tasks: [], tests: [], goals: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await globalSearch(query);
        setResults(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasResults =
    results.chapters.length > 0 ||
    results.topics.length > 0 ||
    results.tasks.length > 0 ||
    results.tests.length > 0 ||
    results.goals.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search chapters, topics, tasks, tests, goals... (e.g. 'grav', 'limits', 'goc')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-300 rounded-md"
          >
            <kbd className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">ESC</kbd>
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3 text-xs">
          {query.length >= 2 && !isLoading && !hasResults && (
            <div className="py-8 text-center text-zinc-500">
              No matching academic records found for &quot;{query}&quot;.
            </div>
          )}

          {/* Chapters */}
          {results.chapters.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Chapters
              </div>
              <div className="space-y-1">
                {results.chapters.map((c) => {
                  const colors = getSubjectColor(c.subject.name);
                  const readiness = c.progress[0]?.readinessScore || 0;
                  return (
                    <Link
                      key={c.id}
                      href={`/chapter/${c.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-900/50 hover:bg-zinc-850 border border-zinc-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", colors.badge)}>
                          {c.subject.shortName}
                        </span>
                        <span className="font-medium text-zinc-200 group-hover:text-white">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">Class {c.classLevel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-400">{readiness}% Ready</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topics */}
          {results.topics.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Subtopics
              </div>
              <div className="space-y-1">
                {results.topics.map((t) => (
                  <Link
                    key={t.id}
                    href={`/chapter/${t.chapter.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-1.5 rounded-md bg-zinc-900/40 hover:bg-zinc-850 border border-zinc-800/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-zinc-200 group-hover:text-white truncate">{t.name}</span>
                      <span className="text-[11px] text-zinc-500 truncate">in {t.chapter.name}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-500 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {results.tasks.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-emerald-400" /> Tasks
              </div>
              <div className="space-y-1">
                {results.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-900/40 border border-zinc-800/40"
                  >
                    <span className="text-zinc-200">{task.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tests */}
          {results.tests.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-rose-400" /> Mock Tests
              </div>
              <div className="space-y-1">
                {results.tests.map((test) => (
                  <Link
                    key={test.id}
                    href="/tests"
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-900/40 hover:bg-zinc-850 border border-zinc-800/40 transition-colors"
                  >
                    <span className="text-zinc-200">{test.name}</span>
                    <span className="font-mono text-zinc-400">{test.score}/{test.totalMarks} marks</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
