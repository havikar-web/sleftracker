"use client";

import React, { useState } from "react";
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
  Calendar,
  Zap,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
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
  AreaChart,
  Area,
  Legend,
  ComposedChart,
} from "recharts";
import { cn, getSubjectColor, formatHours } from "@/lib/utils";

export function AnalyticsView({ overview }: { overview: any }) {
  const {
    overallReadiness,
    class11Readiness,
    class12Readiness,
    subjectStats,
    todayQuestions,
    todayStudyMinutes,
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
    dailyActivityHistory = [],
    trajectoryPoints = [],
    pacingInfo,
  } = overview;

  const [activeChartTab, setActiveChartTab] = useState<"DAILY" | "TRAJECTORY" | "READINESS">("DAILY");

  // Format snapshot chart data
  const trendData = snapshots.map((s: any) => ({
    date: new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    overall: s.overallReadiness,
    physics: s.physicsReadiness,
    chemistry: s.chemistryReadiness,
    maths: s.mathReadiness,
  }));

  const isAhead = pacingInfo?.isAheadOfSchedule;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
            <BarChart3 className="w-4 h-4" /> Academic Intelligence Engine
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            JEE Performance & Completion Analytics
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Daily MCQ volume tracking, actual vs expected syllabus trajectory, and pacing forecasts for Jan 1st 2027
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl shrink-0">
          <div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
              Aggregate Readiness
            </div>
            <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100">
              {overallReadiness}%
            </div>
          </div>
        </div>
      </div>

      {/* Primary Key Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="jee-card">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Independent Accuracy</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {independentAccuracy}%
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">Excludes assisted solves</div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Questions Solved</div>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {totalQuestions} <span className="text-xs font-normal text-zinc-400">MCQs</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">{todayQuestions} solved today</div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Focused Study Time</div>
          <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {totalStudyHours}h
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {Math.round(todayStudyMinutes / 60 * 10) / 10}h logged today
          </div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Required Daily Pace</div>
          <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {pacingInfo?.requiredDailyPace || 5.8}h <span className="text-xs font-normal text-zinc-400">/ day</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">{pacingInfo?.daysRemaining || 130} days to Jan 1st 2027</div>
        </div>
      </div>

      {/* Main Interactive Chart Section with 3 Tabs */}
      <div className="jee-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-1.5">
              {activeChartTab === "DAILY" && <Zap className="w-4 h-4 text-emerald-500" />}
              {activeChartTab === "TRAJECTORY" && <Compass className="w-4 h-4 text-blue-500" />}
              {activeChartTab === "READINESS" && <TrendingUp className="w-4 h-4 text-indigo-500" />}
              <span>
                {activeChartTab === "DAILY" && "Daily MCQ Volume & Study Progress"}
                {activeChartTab === "TRAJECTORY" && "Syllabus Completion: Expected vs Actual Trajectory"}
                {activeChartTab === "READINESS" && "Historical Subject Readiness Trend"}
              </span>
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {activeChartTab === "DAILY" && "Track questions marked in study sessions and focus hours per day"}
              {activeChartTab === "TRAJECTORY" && "Compare your actual mastery curve against the required pace to finish by Jan 1st 2027"}
              {activeChartTab === "READINESS" && "Snapshot readiness progression across Physics, Chemistry, and Mathematics"}
            </p>
          </div>

          {/* Chart View Switcher Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0 text-xs">
            <button
              onClick={() => setActiveChartTab("DAILY")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                activeChartTab === "DAILY"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-500" /> Daily MCQs
            </button>
            <button
              onClick={() => setActiveChartTab("TRAJECTORY")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                activeChartTab === "TRAJECTORY"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <Compass className="w-3.5 h-3.5 text-blue-500" /> Expected vs Actual
            </button>
            <button
              onClick={() => setActiveChartTab("READINESS")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                activeChartTab === "READINESS"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Readiness Trend
            </button>
          </div>
        </div>

        {/* 1. DAILY PROGRESS & MCQs SOLVED CHART */}
        {activeChartTab === "DAILY" && (
          <div className="space-y-4">
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyActivityHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                  <XAxis dataKey="dateStr" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#71717a" fontSize={11} tickLine={false} label={{ value: "MCQs Solved", angle: -90, position: "insideLeft", fontSize: 10, fill: "#71717a" }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6366f1" fontSize={11} tickLine={false} label={{ value: "Study Hours", angle: 90, position: "insideRight", fontSize: 10, fill: "#6366f1" }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const data = payload[0]?.payload;
                      return (
                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl text-xs space-y-1.5">
                          <div className="font-bold text-zinc-200 border-b border-zinc-800 pb-1 flex items-center justify-between gap-4">
                            <span>{label} ({data?.dayName})</span>
                            <span className="text-emerald-400 font-mono">{data?.accuracy}% Accuracy</span>
                          </div>
                          <div className="text-emerald-400 flex justify-between gap-3">
                            <span>Independent (✓):</span>
                            <strong className="font-mono">{data?.independent}</strong>
                          </div>
                          <div className="text-amber-400 flex justify-between gap-3">
                            <span>Assisted (💡):</span>
                            <strong className="font-mono">{data?.assisted}</strong>
                          </div>
                          <div className="text-rose-400 flex justify-between gap-3">
                            <span>Wrong (✗):</span>
                            <strong className="font-mono">{data?.wrong}</strong>
                          </div>
                          <div className="text-blue-400 pt-1 border-t border-zinc-800 flex justify-between gap-3 font-semibold">
                            <span>Total MCQs:</span>
                            <strong className="font-mono">{data?.mcqsSolved} Qs</strong>
                          </div>
                          <div className="text-indigo-400 flex justify-between gap-3 font-semibold">
                            <span>Study Logged:</span>
                            <strong className="font-mono">{data?.studyHours} Hours</strong>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar yAxisId="left" dataKey="independent" name="Independent (✓)" stackId="mcqs" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar yAxisId="left" dataKey="assisted" name="Assisted (💡)" stackId="mcqs" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar yAxisId="left" dataKey="wrong" name="Wrong (✗)" stackId="mcqs" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="studyHours" name="Study Hours" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Summary Glance */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="text-zinc-400 text-[10px] font-bold uppercase">14-Day MCQs Total</div>
                <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {dailyActivityHistory.reduce((acc: number, d: any) => acc + d.mcqsSolved, 0)} MCQs
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="text-zinc-400 text-[10px] font-bold uppercase">14-Day Study Hours</div>
                <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {Math.round(dailyActivityHistory.reduce((acc: number, d: any) => acc + d.studyHours, 0) * 10) / 10}h
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="text-zinc-400 text-[10px] font-bold uppercase">Average Daily Pace</div>
                <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  {Math.round((dailyActivityHistory.reduce((acc: number, d: any) => acc + d.studyHours, 0) / 14) * 10) / 10}h / day
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="text-zinc-400 text-[10px] font-bold uppercase">Independent Solves</div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {dailyActivityHistory.reduce((acc: number, d: any) => acc + d.independent, 0)} (✓)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SYLLABUS COMPLETION TRAJECTORY (EXPECTED VS ACTUAL VS PROJECTED) */}
        {activeChartTab === "TRAJECTORY" && (
          <div className="space-y-4">
            {/* Forecast Callout Banner */}
            <div className={cn(
              "p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs",
              isAhead
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
            )}>
              <div className="flex items-start gap-2.5">
                {isAhead ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {isAhead
                      ? "Pacing Ahead of Schedule! Projected Completion: " + pacingInfo?.projectedCompletionDate
                      : "Pacing Forecast: Target Completion by " + (pacingInfo?.projectedCompletionDate || "Jan 2027")}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5">
                    Target: <strong>760 Mastery Hours (62 Chapters)</strong> • Required daily study pace is <strong>{pacingInfo?.requiredDailyPace || 5.8}h / day</strong>.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="p-2 rounded-xl bg-white/60 dark:bg-zinc-900 border border-current/20 font-mono text-center">
                  <div className="text-[9px] uppercase font-bold">Remaining</div>
                  <div className="text-sm font-bold">{pacingInfo?.remainingHours || 760}h / 760h</div>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryPoints} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                  <XAxis dataKey="label" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} domain={[0, 760]} tickLine={false} label={{ value: "Mastery Hours", angle: -90, position: "insideLeft", fontSize: 10, fill: "#71717a" }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl text-xs space-y-1.5">
                          <div className="font-bold text-zinc-200 border-b border-zinc-800 pb-1">
                            Milestone: {label}
                          </div>
                          {d.actualHours !== null && (
                            <div className="text-blue-400 flex justify-between gap-3 font-semibold">
                              <span>Actual Hours Logged:</span>
                              <strong className="font-mono">{d.actualHours}h ({d.actualPct}%)</strong>
                            </div>
                          )}
                          <div className="text-emerald-400 flex justify-between gap-3 font-semibold">
                            <span>Expected Plan Target:</span>
                            <strong className="font-mono">{d.expectedHours}h ({d.expectedPct}%)</strong>
                          </div>
                          {d.projectedHours !== null && (
                            <div className="text-purple-400 flex justify-between gap-3 font-semibold">
                              <span>Forecasted Path:</span>
                              <strong className="font-mono">{d.projectedHours}h ({d.projectedPct}%)</strong>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Line type="monotone" dataKey="expectedHours" name="Expected Target Curve (Jan 1st 2027)" stroke="#10b981" strokeDasharray="4 4" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="actualHours" name="Your Actual Completion" stroke="#3b82f6" strokeWidth={3.5} dot={{ r: 5, fill: "#3b82f6" }} connectNulls={false} />
                  <Line type="monotone" dataKey="projectedHours" name="Projected Pace Forecast" stroke="#a855f7" strokeDasharray="2 2" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. HISTORICAL READINESS TREND */}
        {activeChartTab === "READINESS" && (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Line type="monotone" dataKey="overall" name="Overall" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="physics" name="Physics" stroke="#60a5fa" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="chemistry" name="Chemistry" stroke="#34d399" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="maths" name="Mathematics" stroke="#f87171" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* High-Impact Ranked Tables (Closest to Mastery & Weakest Accuracy) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Closest to Mastery */}
        <div className="jee-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Highest ROI: Closest to Mastery
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">60%–89% Range</span>
          </div>

          <div className="space-y-2">
            {closestToMastery.length === 0 ? (
              <div className="py-6 text-center text-zinc-400 text-xs">No candidate chapters currently in range.</div>
            ) : (
              closestToMastery.map((item: any, idx: number) => {
                const colors = getSubjectColor(item.chapter.subject.name);
                return (
                  <Link
                    key={item.id}
                    href={`/chapter/${item.chapter.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-zinc-400 font-mono text-xs">{idx + 1}.</span>
                      <span className={cn("badge-tag text-[10px]", colors.badge)}>
                        {item.chapter.subject.shortName}
                      </span>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-white truncate">
                        {item.chapter.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {item.readinessScore}%
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Weakest Accuracy */}
        <div className="jee-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                Accuracy Vulnerabilities (&lt;75%)
              </h3>
            </div>
            <span className="text-[10px] text-rose-500 font-mono">Concept Gaps</span>
          </div>

          <div className="space-y-2">
            {weakestAccuracy.length === 0 ? (
              <div className="py-6 text-center text-zinc-400 text-xs">No severe accuracy anomalies detected.</div>
            ) : (
              weakestAccuracy.map((item: any, idx: number) => {
                const colors = getSubjectColor(item.chapter.subject.name);
                return (
                  <Link
                    key={item.id}
                    href={`/chapter/${item.chapter.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-zinc-400 font-mono text-xs">{idx + 1}.</span>
                      <span className={cn("badge-tag text-[10px]", colors.badge)}>
                        {item.chapter.subject.shortName}
                      </span>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-white truncate">
                        {item.chapter.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
                        {item.accuracyScore}% Acc
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
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
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Exam Error Classification Breakdown
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">Last 30 Days Test Logs</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-400">Concept Errors</div>
            <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">32%</div>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-400">Silly Mistakes</div>
            <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">21%</div>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-400">Calculation Errors</div>
            <div className="text-lg font-bold font-mono text-yellow-600 dark:text-yellow-400 mt-1">18%</div>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-400">Formula Recall</div>
            <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">14%</div>
          </div>
        </div>

        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            <strong>Academic Diagnosis:</strong> Most marks are lost to foundational concept gaps rather than speed. Reinforce theory and solve 15+ independent PYQs per chapter before taking full-length mock tests.
          </span>
        </div>
      </div>

      {/* 9. Biology Side Track Analytics Callout */}
      {overview.biologyOverview && (
        <div className="p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-zinc-950 to-purple-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Biology (Botany &amp; Zoology) Side Track
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold">
                  Tracked Independently
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {overview.biologyOverview.chapterCount} Chapters • {overview.biologyOverview.readiness}% Average Readiness (Cl 11: {overview.biologyOverview.class11Readiness}%, Cl 12: {overview.biologyOverview.class12Readiness}%) • Isolated from JEE PCM study targets.
              </p>
            </div>
          </div>

          <Link
            href="/biology"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <span>View Biology Track</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
