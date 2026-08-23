"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { QuickPracticeModal } from "@/components/modals/quick-practice-modal";
import { AddTaskModal } from "@/components/modals/add-task-modal";
import { GlobalSearchModal } from "@/components/modals/global-search-modal";
import { QuickActionFab } from "@/components/modals/quick-action-fab";
import { useRouter } from "next/navigation";

export function AppShell({
  children,
  chapters = [],
}: {
  children: React.ReactNode;
  chapters: any[];
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Desktop Sidebar */}
      <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Workspace */}
      <div className="flex flex-1 flex-col min-w-0 pb-20 lg:pb-8">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenQuickPractice={() => setIsPracticeOpen(true)}
        />

        <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Quick Action Floating Action Button */}
      <QuickActionFab
        onOpenPractice={() => setIsPracticeOpen(true)}
        onOpenTask={() => setIsTaskOpen(true)}
        onOpenTest={() => router.push("/tests")}
        onOpenGoal={() => router.push("/goals")}
        onOpenRevision={() => router.push("/revision")}
      />

      {/* Global Modals */}
      <QuickPracticeModal
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
        chapters={chapters}
      />

      <AddTaskModal
        isOpen={isTaskOpen}
        onClose={() => setIsTaskOpen(false)}
        chapters={chapters}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
