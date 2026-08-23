"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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

const STORAGE_KEY = "jee_active_timer_v2";

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  // References for exact timestamp-based delta calculations
  const startTimestampRef = useRef<number | null>(null);
  const accumulatedSecondsRef = useRef<number>(0);

  // Synchronize elapsed seconds from exact real-time timestamps
  const syncElapsed = useCallback(() => {
    if (startTimestampRef.current && !isPaused) {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - startTimestampRef.current) / 1000);
      const total = accumulatedSecondsRef.current + Math.max(0, elapsedSinceStart);
      setSeconds(total);
      return total;
    }
    return accumulatedSecondsRef.current;
  }, [isPaused]);

  // Load active timer from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim() !== "" && saved !== "undefined" && saved !== "null") {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.activeSession) {
          accumulatedSecondsRef.current = parsed.accumulatedSeconds || 0;
          setIsPaused(parsed.isPaused || false);
          setActiveSession(parsed.activeSession);

          if (parsed.isRunning && !parsed.isPaused && parsed.startTimestamp) {
            startTimestampRef.current = parsed.startTimestamp;
            const now = Date.now();
            const elapsed = Math.floor((now - parsed.startTimestamp) / 1000);
            const total = (parsed.accumulatedSeconds || 0) + Math.max(0, elapsed);
            setSeconds(total);
            setIsRunning(true);
          } else {
            startTimestampRef.current = null;
            setSeconds(parsed.accumulatedSeconds || 0);
            setIsRunning(parsed.isRunning || false);
          }
        }
      }
    } catch (e) {
      console.error("Timer parse error:", e);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  // Timer Tick with Timestamp Delta + Background Tab Visibility Resync
  useEffect(() => {
    let interval: any = null;

    if (isRunning && !isPaused) {
      // Periodic tick
      interval = setInterval(() => {
        syncElapsed();
      }, 1000);
    }

    // Immediate resync on visibilitychange and focus (when user switches tabs back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncElapsed();
      }
    };

    const handleFocus = () => {
      syncElapsed();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isRunning, isPaused, syncElapsed]);

  // Persist timer state to localStorage whenever state changes
  useEffect(() => {
    if (isRunning && activeSession) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isRunning,
          isPaused,
          startTimestamp: startTimestampRef.current,
          accumulatedSeconds: accumulatedSecondsRef.current,
          activeSession,
        })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isRunning, isPaused, activeSession, seconds]);

  // Start Timer
  const startTimer = useCallback((session?: Partial<ActiveSession>) => {
    const now = Date.now();
    const newSession: ActiveSession = {
      chapterId: session?.chapterId,
      chapterName: session?.chapterName || "Focused JEE Study",
      subjectName: session?.subjectName,
      taskId: session?.taskId,
      taskTitle: session?.taskTitle,
      startTime: now,
    };

    startTimestampRef.current = now;
    accumulatedSecondsRef.current = 0;
    setSeconds(0);
    setActiveSession(newSession);
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  // Pause Timer
  const pauseTimer = useCallback(() => {
    if (startTimestampRef.current) {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - startTimestampRef.current) / 1000);
      accumulatedSecondsRef.current += Math.max(0, elapsedSinceStart);
      startTimestampRef.current = null;
      setSeconds(accumulatedSecondsRef.current);
    }
    setIsPaused(true);
  }, []);

  // Resume Timer
  const resumeTimer = useCallback(() => {
    startTimestampRef.current = Date.now();
    setIsPaused(false);
  }, []);

  // Reset Timer
  const resetTimer = useCallback(() => {
    startTimestampRef.current = null;
    accumulatedSecondsRef.current = 0;
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setActiveSession(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Stop & Log Study Session
  const stopTimer = useCallback(
    async (notes?: string) => {
      const finalTotalSeconds = syncElapsed();
      if (!isRunning && finalTotalSeconds === 0) return null;

      const durationMinutes = Math.max(1, Math.round(finalTotalSeconds / 60));

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
    [isRunning, activeSession, resetTimer, syncElapsed]
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
