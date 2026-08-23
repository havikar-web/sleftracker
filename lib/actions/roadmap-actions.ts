"use server";

import { prisma } from "@/lib/prisma";
import { calculateChapterPriority } from "@/lib/priority";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function getRoadmapData(userId: string = DEFAULT_USER_ID) {
  let roadmap = await prisma.roadmap.findFirst({
    where: { userId },
    include: {
      phases: {
        orderBy: { order: "asc" },
        include: {
          chapters: {
            orderBy: { order: "asc" },
            include: {
              chapter: {
                include: {
                  subject: true,
                  progress: { where: { userId } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!roadmap) {
    return null;
  }

  // Pre-fetch all chapter progress for prerequisite calculations
  const allProgress = await prisma.chapterProgress.findMany({
    where: { userId },
    include: { chapter: true },
  });
  const progressMap = new Map(allProgress.map((p) => [p.chapter.slug, p]));

  // Process phases and chapters
  let totalRoadmapChapters = 0;
  let overdueCount = 0;
  let totalRoadmapTargetQ = 0;
  let totalRoadmapSolvedQ = 0;

  const phasesWithMetrics = roadmap.phases.map((phase) => {
    let phaseTotalQ = 0;
    let phaseSolvedQ = 0;
    let phaseTotalReadiness = 0;
    const chaptersCount = phase.chapters.length;

    const processedChapters = phase.chapters.map((rc) => {
      const chapter = rc.chapter;
      const prog = chapter.progress[0] || null;
      const readiness = prog?.readinessScore || 0;
      const solvedQ = prog?.questionsSolved || 0;
      const targetQ = rc.questionTargetOverride || chapter.defaultQuestionTarget;
      const targetPYQ = rc.pyqTargetOverride || chapter.defaultPYQTarget;
      const solvedPYQ = prog?.pyqsSolved || 0;

      phaseTotalQ += targetQ;
      phaseSolvedQ += solvedQ;
      phaseTotalReadiness += readiness;
      totalRoadmapChapters++;
      totalRoadmapTargetQ += targetQ;
      totalRoadmapSolvedQ += solvedQ;

      // Check target date and overdue status
      const targetDate = rc.userTargetDate || rc.suggestedTargetDate || phase.endDate;
      const isOverdue = new Date(targetDate).getTime() < Date.now() && readiness < 75;
      if (isOverdue) overdueCount++;

      // Check Prerequisite Chains
      const prereqWarnings: string[] = [];
      if (chapter.prerequisiteIds && chapter.prerequisiteIds.length > 0) {
        for (const prereqSlug of chapter.prerequisiteIds) {
          const prereqProg = progressMap.get(prereqSlug);
          const prereqReadiness = prereqProg?.readinessScore || 0;
          if (prereqReadiness < 40) {
            prereqWarnings.push(
              `Recommended first: ${prereqProg?.chapter?.name || prereqSlug} is only ${prereqReadiness}% ready.`
            );
          }
        }
      }

      // Calculate Priority Score & Category
      const priorityInfo = calculateChapterPriority({
        historicalImportance: chapter.historicalPriority,
        readinessScore: readiness,
        targetDate,
        accuracyScore: prog?.accuracyScore,
        priorityOverride: (rc.priorityOverride as any) || null,
      });

      return {
        ...rc,
        chapter,
        progress: prog,
        readiness,
        solvedQ,
        targetQ,
        solvedPYQ,
        targetPYQ,
        targetDate,
        isOverdue,
        prereqWarnings,
        priorityInfo,
      };
    });

    const phaseCompletion =
      chaptersCount > 0 ? Math.round(phaseTotalReadiness / chaptersCount) : 0;

    return {
      ...phase,
      chapters: processedChapters,
      phaseCompletion,
      phaseTotalQ,
      phaseSolvedQ,
    };
  });

  // Build Priority Map Buckets (DO NOW, DO NEXT, LATER, MAINTAIN_REVISE)
  const allRoadmapChapters = phasesWithMetrics.flatMap((p) => p.chapters);

  const priorityMap = {
    DO_NOW: allRoadmapChapters.filter((c) => c.priorityInfo.category === "DO_NOW"),
    DO_NEXT: allRoadmapChapters.filter((c) => c.priorityInfo.category === "DO_NEXT"),
    LATER: allRoadmapChapters.filter((c) => c.priorityInfo.category === "LATER"),
    MAINTAIN_REVISE: allRoadmapChapters.filter((c) => c.priorityInfo.category === "MAINTAIN_REVISE"),
  };

  return {
    roadmap: {
      ...roadmap,
      phases: phasesWithMetrics,
    },
    priorityMap,
    overallMetrics: {
      totalRoadmapChapters,
      overdueCount,
      totalRoadmapTargetQ,
      totalRoadmapSolvedQ,
      daysBehind: overdueCount > 0 ? Math.min(14, overdueCount * 2) : 0,
    },
  };
}

export async function shiftPhaseTimeline(phaseId: string, daysToShift: number) {
  const phase = await prisma.roadmapPhase.findUnique({ where: { id: phaseId } });
  if (!phase) throw new Error("Phase not found");

  const shiftMs = daysToShift * 24 * 60 * 60 * 1000;
  const newStartDate = new Date(phase.startDate.getTime() + shiftMs);
  const newEndDate = new Date(phase.endDate.getTime() + shiftMs);

  await prisma.roadmapPhase.update({
    where: { id: phaseId },
    data: {
      startDate: newStartDate,
      endDate: newEndDate,
    },
  });

  revalidatePath("/roadmap");
  revalidatePath("/");
  return { success: true };
}
