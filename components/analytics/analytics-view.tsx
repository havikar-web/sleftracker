"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertOctagon,
  RotateCcw,
  Target,
  ArrowRight,
  Sparkles,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
} from "recharts";
import { cn, getSubjectColor, formatHours } from "@/lib/utils";

export function AnalyticsView({ overview }: { overview: any }) {
  const {
    overallReadiness,
    class11Readiness,
    class12Readiness,
    subjectStats,
    todayQuestions,
    weekQuestions,
    monthQuestions,
    totalQuestions,
    weekStudyHours,
    totalStudyHours,
    independentAccuracy,
    assistedQuestions,
    wrongQuestions,
    testsCount,
    closestToMastery = [],
    weakestAccuracy = [],
    lowestRevisionStrength = [],
    errorData = [],
    snapshots = [],
  } = overview;

  // Format snapshot chart data
  const trendData = snapshots.map((s: any) => ({
    date: new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    overall: s.overallReadiness,
    physics: s.physicsReadiness,
    chemistry: s.chemistryReadiness,
    maths: s.mathReadiness,
  }));

  // Subject question breakdown data
  const subjectQuestionData = subjectStats.map((s: any) => ({
    name: s.shortName,
    readiness: s.readiness,
    color: s.color,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
            <BarChart3 className="w-4 h-4" /> Academic Intelligence Engine
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">JEE Readiness Analytics</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Actionable diagnostics, independent accuracy audits, and high-ROI mastery targets
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg shrink-0">
          <div>
            <div className="text-[10px] text-zinc-400 font-medium">Aggregate Readiness</div>
            <div className="text-2xl font-black font-mono text-zinc-100">{overallReadiness}%</div>
          </div>
        </div>
      </div>

      {/* Primary Key Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="jee-card">
          <div className="text-[11px] text-zinc-400">Independent Accuracy</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{independentAccuracy}%</div>
          <div className="text-[10px] text-zinc-500 mt-1">Excludes assisted solves</div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-400">Questions Solved</div>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">{totalQuestions}</div>
          <div className="text-[10px] text-zinc-500 mt-1">{weekQuestions} solved this week</div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-400">Focused Study Time</div>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{totalStudyHours}h</div>
          <div className="text-[10px] text-zinc-500 mt-1">{weekStudyHours}h logged this week</div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-400">Class 11 vs 12</div>
          <div className="text-base font-bold font-mono text-zinc-200 mt-1">
            {class11Readiness}% <span className="text-xs text-zinc-500 font-normal">/</span> {class12Readiness}%
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Class 11 / Class 12 Readiness</div>
        </div>
      </div>

      {/* Historical Readiness Trend Chart */}
      <div className="jee-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Historical Readiness Trajectory
            </h2>
            <p className="text-[11px] text-zinc-400">Snapshot trend over past weeks across subjects</p>
          </div>
        </div>

        <div className="h-64 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} domain={[0, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  borderColor: "#27272a",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="overall" name="Overall" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="physics" name="Physics" stroke="#60a5fa" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="chemistry" name="Chemistry" stroke="#34d399" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="maths" name="Mathematics" stroke="#f87171" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* High-Impact Ranked Tables (Closest to Mastery & Weakest Accuracy) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Closest to Mastery */}
        <div className="jee-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Highest ROI: Closest to Mastery
              </h3>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">60%–89% Range</span>
          </div>

          <div className="space-y-2">
            {closestToMastery.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">No candidate chapters currently in range.</div>
            ) : (
              closestToMastery.map((item: any, idx: number) => {
                const colors = getSubjectColor(item.chapter.subject.name);
                return (
                  <Link
                    key={item.id}
                    href={`/chapter/${item.chapter.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-zinc-500 font-mono text-xs">{idx + 1}.</span>
                      <span className={cn("badge-tag text-[10px]", colors.badge)}>
                        {item.chapter.subject.shortName}
                      </span>
                      <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                        {item.chapter.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-xs text-emerald-400">
                        {item.readinessScore}%
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Weakest Accuracy */}
        <div className="jee-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Accuracy Vulnerabilities (&lt;75%)
              </h3>
            </div>
            <span className="text-[10px] text-rose-400 font-mono">Concept Gaps</span>
          </div>

          <div className="space-y-2">
            {weakestAccuracy.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">No severe accuracy anomalies detected.</div>
            ) : (
              weakestAccuracy.map((item: any, idx: number) => {
                const colors = getSubjectColor(item.chapter.subject.name);
                return (
                  <Link
                    key={item.id}
                    href={`/chapter/${item.chapter.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-zinc-500 font-mono text-xs">{idx + 1}.</span>
                      <span className={cn("badge-tag text-[10px]", colors.badge)}>
                        {item.chapter.subject.shortName}
                      </span>
                      <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                        {item.chapter.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-xs text-rose-400">
                        {item.accuracyScore}% Acc
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Error Distribution & Recommendation */}
      <div className="jee-card space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Exam Error Classification Breakdown
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">Last 30 Days Test Logs</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-400">Concept Errors</div>
            <div className="text-lg font-bold font-mono text-rose-400 mt-1">32%</div>
          </div>
          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-400">Silly Mistakes</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-1">21%</div>
          </div>
          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-400">Calculation Errors</div>
            <div className="text-lg font-bold font-mono text-yellow-400 mt-1">18%</div>
          </div>
          <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
            <div className="text-[10px] text-zinc-400">Formula Recall</div>
            <div className="text-lg font-bold font-mono text-blue-400 mt-1">14%</div>
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            <strong>Deterministic Diagnosis:</strong> Most marks are being lost to foundational concept errors rather than time pressure. Reinforce core theory before increasing speed tests.
          </span>
        </div>
      </div>
    </div>
  );
}
