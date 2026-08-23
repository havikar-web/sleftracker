"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Filter,
} from "lucide-react";
import { cn, getSubjectColor, getStatusBadge, getPriorityLabel, formatHours } from "@/lib/utils";
import { shiftPhaseTimeline } from "@/lib/actions/roadmap-actions";
import { ProgressCircle } from "@/components/ui/progress-circle";

export function RoadmapView({ roadmapData }: { roadmapData: any }) {
  const [activeTab, setActiveTab] = useState<"PHASES" | "PRIORITY_MAP">("PHASES");
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(
    roadmapData?.roadmap?.phases[0]?.id || ""
  );
  const [isShifting, setIsShifting] = useState(false);

  if (!roadmapData || !roadmapData.roadmap) {
    return (
      <div className="p-10 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-xs">
        No active roadmap configured.
      </div>
    );
  }

  const { roadmap, priorityMap, overallMetrics } = roadmapData;
  const activePhase =
    roadmap.phases.find((p: any) => p.id === selectedPhaseId) || roadmap.phases[0];

  const handleShiftTimeline = async (phaseId: string, days: number) => {
    setIsShifting(true);
    try {
      await shiftPhaseTimeline(phaseId, days);
    } catch (e) {
      console.error(e);
    } finally {
      setIsShifting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
            <Compass className="w-4 h-4" /> Strategic Sequence Engine
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {roadmap.name || "Main JEE 2027 Master Roadmap"}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Phase-driven order of attack calibrated for Jan 1st 2027 milestone
          </p>
        </div>

        {/* Status Metrics with Circular Gauge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right px-3.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Schedule Adherence</div>
            <div className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">
              {overallMetrics.daysBehind > 0 ? `${overallMetrics.daysBehind} Days Behind` : "On Schedule"}
            </div>
          </div>

          <div className="text-right px-3.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Roadmap Solved</div>
            <div className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {overallMetrics.totalRoadmapSolvedQ} <span className="text-xs text-zinc-400 font-normal">/ {overallMetrics.totalRoadmapTargetQ} Qs</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher: Phases vs Priority Map */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("PHASES")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === "PHASES"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            )}
          >
            Phases Timeline
          </button>
          <button
            onClick={() => setActiveTab("PRIORITY_MAP")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeTab === "PRIORITY_MAP"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            )}
          >
            Priority Map (Do Now / Next / Later)
          </button>
        </div>

        {activeTab === "PHASES" && activePhase && (
          <button
            onClick={() => handleShiftTimeline(activePhase.id, 7)}
            disabled={isShifting}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 border border-amber-300 dark:border-amber-800/50 rounded-xl transition-colors"
          >
            <Clock className="w-3.5 h-3.5" /> Shift Phase (+7 Days)
          </button>
        )}
      </div>

      {/* VIEW 1: PHASES TIMELINE */}
      {activeTab === "PHASES" && (
        <div className="space-y-5">
          {/* Phase Selector Tabs with Mini Progress Circles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roadmap.phases.map((phase: any) => {
              const isSelected = phase.id === activePhase?.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 shadow-sm",
                    isSelected
                      ? "bg-blue-50/50 dark:bg-zinc-900 border-blue-500 shadow-sm"
                      : "bg-white dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50"
                  )}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{phase.name}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{phase.chapters.length} chapters</div>
                  </div>
                  <ProgressCircle value={phase.phaseCompletion} size={44} strokeWidth={4.5} color="#3b82f6" />
                </button>
              );
            })}
          </div>

          {/* Active Phase Details Header */}
          {activePhase && (
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 space-y-3 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">{activePhase.name}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{activePhase.description}</p>
                </div>
                <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 shrink-0">
                  {new Date(activePhase.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  {" — "}
                  {new Date(activePhase.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>

              {/* Phase Metrics Ribbon */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-zinc-100 dark:border-zinc-850">
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl">
                  <div className="text-[10px] text-zinc-500">Chapters</div>
                  <div className="font-bold font-mono text-zinc-800 dark:text-zinc-200">{activePhase.chapters.length}</div>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl">
                  <div className="text-[10px] text-zinc-500">Question Target</div>
                  <div className="font-bold font-mono text-zinc-800 dark:text-zinc-200">
                    {activePhase.phaseSolvedQ} / {activePhase.phaseTotalQ}
                  </div>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl">
                  <div className="text-[10px] text-zinc-500">Phase Completion</div>
                  <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{activePhase.phaseCompletion}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Active Phase Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activePhase?.chapters.map((rc: any) => {
              const chapter = rc.chapter;
              const colors = getSubjectColor(chapter.subject.name);
              const badge = getStatusBadge(rc.progress?.status || "NOT_STARTED");
              const priorityBadge = getPriorityLabel(rc.priorityInfo.priorityTier);

              return (
                <div
                  key={rc.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/70 p-4 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    {/* Header: Subject + Class + Priority */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={cn("badge-tag text-[10px] font-semibold", colors.badge)}>
                        {chapter.subject.name} • Class {chapter.classLevel}
                      </span>
                      <span className={cn("badge-tag text-[10px]", priorityBadge.class)}>
                        {priorityBadge.icon} {priorityBadge.label}
                      </span>
                    </div>

                    {/* Title + Circular Progress */}
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/chapter/${chapter.slug}`}
                        className="text-sm font-bold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 flex-1"
                      >
                        {chapter.name}
                      </Link>
                      <ProgressCircle value={rc.readiness} size={38} strokeWidth={4} color={colors.bar} />
                    </div>

                    {/* Prerequisite Warnings Banner */}
                    {rc.prereqWarnings?.length > 0 && (
                      <div className="p-2 mt-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-300">
                        {rc.prereqWarnings[0]}
                      </div>
                    )}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <div className="p-2 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-850">
                        <span>PYQs: </span>
                        <strong className="font-mono text-zinc-800 dark:text-zinc-200">
                          {rc.solvedPYQ} / {rc.targetPYQ}
                        </strong>
                      </div>
                      <div className="p-2 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-850">
                        <span>Questions: </span>
                        <strong className="font-mono text-zinc-800 dark:text-zinc-200">
                          {rc.solvedQ} / {rc.targetQ}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-850 text-xs">
                    <span className={cn("badge-tag text-[10px]", badge.class)}>{badge.label}</span>
                    <Link
                      href={`/chapter/${chapter.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                    >
                      Detail <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: SMART PRIORITY MAP */}
      {activeTab === "PRIORITY_MAP" && (
        <div className="space-y-4">
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-600 dark:text-zinc-400">
            <strong>Deterministic Priority Matrix:</strong> Categorized dynamically using Exam Importance × Remaining Readiness × Urgency × Weakness Gaps.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* DO NOW */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300">
                <span>🔥 DO NOW</span>
                <span className="font-mono">{priorityMap.DO_NOW.length}</span>
              </div>
              <div className="space-y-2">
                {priorityMap.DO_NOW.map((item: any) => {
                  const colors = getSubjectColor(item.chapter.subject.name);
                  return (
                    <Link
                      key={item.id}
                      href={`/chapter/${item.chapter.slug}`}
                      className="block p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className={cn("px-1.5 py-0.2 rounded font-semibold", colors.badge)}>
                          {item.chapter.subject.shortName}
                        </span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">Score {item.priorityInfo.score}</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.chapter.name}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">{item.readiness}% Ready</div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* DO NEXT */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300">
                <span>🟠 DO NEXT</span>
                <span className="font-mono">{priorityMap.DO_NEXT.length}</span>
              </div>
              <div className="space-y-2">
                {priorityMap.DO_NEXT.map((item: any) => {
                  const colors = getSubjectColor(item.chapter.subject.name);
                  return (
                    <Link
                      key={item.id}
                      href={`/chapter/${item.chapter.slug}`}
                      className="block p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className={cn("px-1.5 py-0.2 rounded font-semibold", colors.badge)}>
                          {item.chapter.subject.shortName}
                        </span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">Score {item.priorityInfo.score}</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.chapter.name}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">{item.readiness}% Ready</div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* LATER */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span>⚪ LATER</span>
                <span className="font-mono">{priorityMap.LATER.length}</span>
              </div>
              <div className="space-y-2">
                {priorityMap.LATER.map((item: any) => {
                  const colors = getSubjectColor(item.chapter.subject.name);
                  return (
                    <Link
                      key={item.id}
                      href={`/chapter/${item.chapter.slug}`}
                      className="block p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className={cn("px-1.5 py-0.2 rounded font-semibold", colors.badge)}>
                          {item.chapter.subject.shortName}
                        </span>
                        <span className="font-mono text-zinc-500">Score {item.priorityInfo.score}</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.chapter.name}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">{item.readiness}% Ready</div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* MAINTAIN / REVISE */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <span>🟢 MAINTAIN & REVISE</span>
                <span className="font-mono">{priorityMap.MAINTAIN_REVISE.length}</span>
              </div>
              <div className="space-y-2">
                {priorityMap.MAINTAIN_REVISE.map((item: any) => {
                  const colors = getSubjectColor(item.chapter.subject.name);
                  return (
                    <Link
                      key={item.id}
                      href={`/chapter/${item.chapter.slug}`}
                      className="block p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className={cn("px-1.5 py-0.2 rounded font-semibold", colors.badge)}>
                          {item.chapter.subject.shortName}
                        </span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.readiness}%</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.chapter.name}</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400/80 mt-1">High Readiness</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
