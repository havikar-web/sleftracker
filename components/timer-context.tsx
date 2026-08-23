"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { logStudySession } from "@/lib/actions/study-actions";

interface ActiveSession {
  chapterId?: string;
  chapterName?: string;
  subjectName?: string;
  taskId?: string;
  taskTitle?: string;
  startTime: number;
}

interface TimerContextType {
  isRunning: boolean;
  isPaused: boolean;
  seconds: number;
  activeSession: ActiveSession | null;
  startTimer: (session?: Partial<ActiveSession>) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: (notes?: string) => Promise<{ durationMinutes: number } | null>;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jee_active_timer");
      if (saved && saved.trim() !== "" && saved !== "undefined" && saved !== "null") {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isRunning && parsed.startTime) {
          const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
          setSeconds(Math.max(0, elapsed));
          setIsRunning(true);
          setIsPaused(parsed.isPaused || false);
          setActiveSession(parsed.session);
        }
      }
    } catch (e) {
      console.error("Timer parse error:", e);
      try {
        localStorage.removeItem("jee_active_timer");
      } catch {}
    }
  }, []);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // Persist timer state
  useEffect(() => {
    if (isRunning) {
      localStorage.setItem(
        "jee_active_timer",
        JSON.stringify({
          isRunning,
          isPaused,
          startTime: Date.now() - seconds * 1000,
          session: activeSession,
        })
      );
    } else {
      localStorage.removeItem("jee_active_timer");
    }
  }, [isRunning, isPaused, seconds, activeSession]);

  const startTimer = useCallback((session?: Partial<ActiveSession>) => {
    setActiveSession({
      chapterId: session?.chapterId,
      chapterName: session?.chapterName || "Focused JEE Study",
      subjectName: session?.subjectName,
      taskId: session?.taskId,
      taskTitle: session?.taskTitle,
      startTime: Date.now(),
    });
    setSeconds(0);
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setActiveSession(null);
    localStorage.removeItem("jee_active_timer");
  }, []);

  const stopTimer = useCallback(
    async (notes?: string) => {
      if (!isRunning && seconds === 0) return null;

      const durationMinutes = Math.max(1, Math.round(seconds / 60));

      try {
        await logStudySession({
          durationMinutes,
          chapterId: activeSession?.chapterId,
          taskId: activeSession?.taskId,
          notes: notes || `Timer session: ${activeSession?.taskTitle || activeSession?.chapterName || "General Focus"}`,
        });
      } catch (err) {
        console.error("Failed to auto-save study session:", err);
      }

      resetTimer();
      return { durationMinutes };
    },
    [isRunning, seconds, activeSession, resetTimer]
  );

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        isPaused,
        seconds,
        activeSession,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
