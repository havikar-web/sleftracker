"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WeeklyReviewView({ overview }: { overview: any }) {
  const weekTargetQ = overview.user?.weeklyQuestionTarget || 700;
  const targetStudyHours = (overview.user?.dailyStudyHours || 7.0) * 6; // 6 study days
  const qPct = Math.min(100, Math.round((overview.weekQuestions / Math.max(1, weekTargetQ)) * 100));
  const studyPct = Math.min(100, Math.round((overview.weekStudyHours / Math.max(1, targetStudyHours)) * 100));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
            <CalendarCheck className="w-4 h-4" /> Academic Debrief
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Weekly Study Executive Summary
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Holistic weekly audit of question volume, focused hours, accuracy, and roadmap adherence
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl shrink-0">
          <div>
            <div className="text-[10px] text-zinc-500 font-medium">Weekly Goal Status</div>
            <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {qPct}% Question Target
            </div>
          </div>
        </div>
      </div>

      {/* 4 Weekly KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="jee-card">
          <div className="text-[11px] text-zinc-500 font-medium">Questions Solved</div>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {overview.weekQuestions} <span className="text-xs text-zinc-400 font-normal">/ {weekTargetQ}</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${qPct}%` }} />
          </div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-500 font-medium">Focused Study Time</div>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {overview.weekStudyHours}h <span className="text-xs text-zinc-400 font-normal">/ {targetStudyHours}h</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${studyPct}%` }} />
          </div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-500 font-medium">Tasks Completed</div>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {overview.todayTasksCompleted} <span className="text-xs text-zinc-400 font-normal">/ {Math.max(overview.todayTasksTotal, overview.todayTasksCompleted)}</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{
                width: `${
                  overview.todayTasksTotal > 0
                    ? Math.min(100, Math.round((overview.todayTasksCompleted / overview.todayTasksTotal) * 100))
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        <div className="jee-card">
          <div className="text-[11px] text-zinc-500 font-medium">Independent Accuracy</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {overview.independentAccuracy}%
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">
            {overview.independentAccuracy > 0 ? "Calculated from practice" : "No practice logged yet"}
          </div>
        </div>
      </div>

      {/* Highlights & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Progressed Chapters */}
        <div className="jee-card space-y-3 border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" /> Closest to Mastery
          </div>

          <div className="space-y-2 text-xs">
            {overview.closestToMastery?.length > 0 ? (
              overview.closestToMastery.map((item: any) => (
                <div key={item.id} className="p-3 bg-white dark:bg-zinc-950/80 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">{item.chapter.name} ({item.readinessScore}% Readiness)</div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {item.questionsSolved} questions logged • {item.accuracyScore}% accuracy.
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-400 text-xs">
                Log practice sessions to track chapters closest to mastery.
              </div>
            )}
          </div>
        </div>

        {/* Needs Attention / Accuracy Vulnerabilities */}
        <div className="jee-card space-y-3 border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> Accuracy Vulnerabilities
          </div>

          <div className="space-y-2 text-xs">
            {overview.weakestAccuracy?.length > 0 ? (
              overview.weakestAccuracy.map((item: any) => (
                <div key={item.id} className="p-3 bg-white dark:bg-zinc-950/80 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">{item.chapter.name} ({item.accuracyScore}% Accuracy)</div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {item.questionsSolved} questions solved. Review mistake taxonomy.
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-400 text-xs">
                No accuracy vulnerabilities detected yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
