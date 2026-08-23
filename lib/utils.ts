import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
}

export function clamp(value: number, min: number = 0, max: number = 100): number {
  return Math.min(Math.max(value, min), max);
}

export function getDaysUntil(targetDate: Date | string | number): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function getSubjectColor(subjectName: string): {
  badge: string;
  bg: string;
  text: string;
  border: string;
  bar: string;
} {
  const norm = (subjectName || "").toLowerCase();
  if (norm.includes("phys")) {
    return {
      badge: "bg-blue-500/15 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      bg: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500",
      bar: "#3b82f6",
    };
  }
  if (norm.includes("chem")) {
    return {
      badge: "bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      bg: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500",
      bar: "#10b981",
    };
  }
  if (norm.includes("math")) {
    return {
      badge: "bg-rose-500/15 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      bg: "bg-rose-500",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500",
      bar: "#f43f5e",
    };
  }
  if (norm.includes("bio")) {
    return {
      badge: "bg-purple-500/15 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      bg: "bg-purple-500",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500",
      bar: "#a855f7",
    };
  }
  return {
    badge: "bg-zinc-500/15 dark:bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/30",
    bg: "bg-zinc-500",
    text: "text-zinc-700 dark:text-zinc-400",
    border: "border-zinc-500",
    bar: "#71717a",
  };
}

export function getStatusBadge(status: string): { label: string; class: string } {
  switch (status) {
    case "NOT_STARTED":
      return { label: "Not Started", class: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700" };
    case "LEARNING":
      return { label: "Learning", class: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
    case "PRACTISING":
      return { label: "Practising", class: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
    case "DEVELOPING":
      return { label: "Developing", class: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
    case "TEST_READY":
      return { label: "Test Ready", class: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" };
    case "MASTERED":
      return { label: "Mastered", class: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
    case "NEEDS_REVISION":
      return { label: "⚠️ Needs Revision (Forgotten)", class: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40 font-bold" };
    default:
      return { label: status, class: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700" };
  }
}

export function getPriorityLabel(priority: string): { label: string; icon: string; class: string } {
  switch (priority) {
    case "VERY_HIGH":
    case "CRITICAL":
      return { label: "Very High", icon: "🔥", class: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30" };
    case "HIGH":
      return { label: "High", icon: "🟠", class: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30" };
    case "MEDIUM":
      return { label: "Medium", icon: "🟡", class: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/30" };
    case "LOW":
      return { label: "Low", icon: "⚪", class: "text-zinc-600 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/30" };
    default:
      return { label: priority, icon: "•", class: "text-zinc-600 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/30" };
  }
}
