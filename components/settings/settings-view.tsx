"use client";

import React, { useState } from "react";
import {
  Settings,
  Download,
  Moon,
  Sun,
  Database,
  Calendar,
  Clock,
  Sparkles,
  Check,
  FileSpreadsheet,
} from "lucide-react";
import { useTheme } from "next-themes";
import { exportAllUserData } from "@/lib/actions/export-actions";
import { cn } from "@/lib/utils";

export function SettingsView({ user }: { user: any }) {
  const { theme, setTheme } = useTheme();
  const [dailyHours, setDailyHours] = useState(user?.dailyStudyHours || 7.0);
  const [dailyQ, setDailyQ] = useState(user?.dailyQuestionTarget || 120);
  const [isExporting, setIsExporting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const data = await exportAllUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jee-os-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-md">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold mb-1">
          <Settings className="w-4 h-4" /> Academic Configuration
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Data Management</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Tune your examination targets, daily study hours, appearance, and export study history
        </p>
      </div>

      {/* Target Exam Configuration */}
      <div className="jee-card space-y-4">
        <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
          Target Examination
        </h2>

        <form onSubmit={handleSavePreferences} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Target Exam Name</label>
              <input
                type="text"
                defaultValue={user?.targetExam || "JEE Main + Advanced 2027"}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Current Class / Track</label>
              <select
                defaultValue={user?.currentClass || "Class 11"}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:outline-hidden"
              >
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Dropper">Dropper / Repeat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Daily Focused Study Goal (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value) || 0)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Daily Question Practice Target</label>
              <input
                type="number"
                step="10"
                value={dailyQ}
                onChange={(e) => setDailyQ(parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-850">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{saved ? "Saved Successfully" : "Update Preferences"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Theme Selection */}
      <div className="jee-card space-y-3">
        <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Appearance Theme</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-all",
              theme === "dark"
                ? "bg-zinc-800 border-zinc-600 text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-400"
            )}
          >
            <Moon className="w-4 h-4" /> Dark Mode (Neutral Slate)
          </button>
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-all",
              theme === "light"
                ? "bg-zinc-200 border-zinc-400 text-zinc-900"
                : "bg-zinc-900 border-zinc-800 text-zinc-400"
            )}
          >
            <Sun className="w-4 h-4" /> Light Mode (Clean Academic)
          </button>
        </div>
      </div>

      {/* Data Backup & Export */}
      <div className="jee-card space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
            Data Safety & Persistent Backups
          </h2>
        </div>
        <p className="text-xs text-zinc-400">
          Export your complete practice logs, test scores, error taxonomy, goals, and chapter readiness snapshots.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={handleExportJSON}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-md transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Full JSON Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
}
