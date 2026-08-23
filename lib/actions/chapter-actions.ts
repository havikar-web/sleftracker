"use server";

import { prisma } from "@/lib/prisma";
import { calculateChapterReadiness } from "@/lib/readiness";
import { calculateChapterPriority } from "@/lib/priority";
import { diagnoseChapter } from "@/lib/diagnostics";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function getChapterBySlug(slug: string, userId: string = DEFAULT_USER_ID) {
  const chapter = await prisma.chapter.findUnique({
    where: { slug },
    include: {
      subject: true,
      topics: {
        orderBy: { displayOrder: "asc" },
        include: {
          progress: {
            where: { userId },
          },
        },
      },
      progress: {
        where: { userId },
      },
      practiceSessions: {
        where: { userId },
        orderBy: { date: "desc" },
        take: 20,
      },
      testChapters: {
        include: {
          test: {
            include: { errors: true },
          },
        },
        orderBy: { test: { date: "desc" } },
        take: 10,
      },
      revisions: {
        where: { userId },
        orderBy: { scheduledDate: "asc" },
      },
    },
  });

  if (!chapter) return null;

  const progress = chapter.progress[0] || null;

  // Compute Topic Completion (Theory Score)
  const totalTopics = chapter.topics.length;
  let masteredTopics = 0;
  chapter.topics.forEach((t) => {
    const st = t.progress[0]?.status;
    if (st === "STRONG" || st === "PRACTISED" || st === "UNDERSTOOD") {
      masteredTopics++;
    }
  });

  const calculatedTheoryScore = totalTopics > 0 ? (masteredTopics / totalTopics) * 100 : 0;

  // Calculate Readiness
  const readiness = calculateChapterReadiness({
    theoryScore: progress?.theoryScore ?? calculatedTheoryScore,
    questionsSolved: progress?.questionsSolved ?? 0,
    questionTarget: chapter.defaultQuestionTarget,
    pyqsSolved: progress?.pyqsSolved ?? 0,
    pyqTarget: chapter.defaultPYQTarget,
    correctIndependent: progress?.correctIndependent ?? 0,
    wrong: progress?.wrong ?? 0,
    assisted: progress?.assisted ?? 0,
    testScore: progress?.testScore ?? 0,
    revisionScore: progress?.revisionScore ?? 0,
    lastRevisedAt: progress?.lastRevisedAt,
    testsTakenCount: chapter.testChapters.length,
    revisionsCount: chapter.revisions.length,
    isManualOverride: progress?.isManualOverride ?? false,
    manualReadiness: progress?.readinessScore,
  });

  // Calculate Priority
  const priority = calculateChapterPriority({
    historicalImportance: chapter.historicalPriority,
    readinessScore: readiness.readinessScore,
    accuracyScore: readiness.accuracyPercentage,
  });

  // Deterministic Diagnostic Next Action
  const diagnostic = diagnoseChapter({
    chapterName: chapter.name,
    subjectName: chapter.subject.name,
    readinessScore: readiness.readinessScore,
    theoryScore: readiness.theoryScore,
    practiceScore: readiness.practiceScore,
    pyqScore: readiness.pyqScore,
    accuracyScore: readiness.accuracyScore,
    testScore: readiness.testScore,
    revisionScore: readiness.revisionScore,
    questionsSolved: progress?.questionsSolved ?? 0,
    pyqsSolved: progress?.pyqsSolved ?? 0,
    defaultQuestionTarget: chapter.defaultQuestionTarget,
    defaultPYQTarget: chapter.defaultPYQTarget,
    lastRevisedAt: progress?.lastRevisedAt,
    testsCount: chapter.testChapters.length,
  });

  // Practice source breakdown
  const sourceBreakdown: Record<string, { total: number; correct: number; assisted: number }> = {};
  chapter.practiceSessions.forEach((p) => {
    const src = p.source;
    if (!sourceBreakdown[src]) {
      sourceBreakdown[src] = { total: 0, correct: 0, assisted: 0 };
    }
    sourceBreakdown[src].total += p.questions;
    sourceBreakdown[src].correct += p.correctIndependent;
    sourceBreakdown[src].assisted += p.assisted;
  });

  return {
    chapter,
    progress,
    readiness,
    priority,
    diagnostic,
    sourceBreakdown,
  };
}

export async function cycleTopicStatus(
  topicId: string,
  chapterId: string,
  userId: string = DEFAULT_USER_ID
) {
  // Get current status
  const current = await prisma.topicProgress.findUnique({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
  });

  const statusCycle = [
    "NOT_STARTED",
    "LEARNING",
    "UNDERSTOOD",
    "PRACTISED",
    "STRONG",
  ];
  const currentIdx = statusCycle.indexOf(current?.status || "NOT_STARTED");
  const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];

  await prisma.topicProgress.upsert({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
    update: { status: nextStatus },
    create: {
      userId,
      topicId,
      status: nextStatus,
    },
  });

  // Re-calculate theory score for the chapter
  const allTopics = await prisma.topic.findMany({
    where: { chapterId },
    include: { progress: { where: { userId } } },
  });

  let completed = 0;
  for (const t of allTopics) {
    const st = t.id === topicId ? nextStatus : (t.progress[0]?.status || "NOT_STARTED");
    if (st === "STRONG" || st === "PRACTISED" || st === "UNDERSTOOD") {
      completed++;
    }
  }

  const newTheoryScore = allTopics.length > 0 ? (completed / allTopics.length) * 100 : 0;

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
  const progress = await prisma.chapterProgress.findUnique({
    where: { userId_chapterId: { userId, chapterId } },
  });

  if (chapter) {
    const calc = calculateChapterReadiness({
      theoryScore: newTheoryScore,
      questionsSolved: progress?.questionsSolved || 0,
      questionTarget: chapter.defaultQuestionTarget,
      pyqsSolved: progress?.pyqsSolved || 0,
      pyqTarget: chapter.defaultPYQTarget,
      correctIndependent: progress?.correctIndependent || 0,
      wrong: progress?.wrong || 0,
      assisted: progress?.assisted || 0,
      testScore: progress?.testScore || 0,
      revisionScore: progress?.revisionScore || 0,
      lastRevisedAt: progress?.lastRevisedAt,
    });

    await prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: {
        theoryScore: newTheoryScore,
        readinessScore: calc.readinessScore,
        status: calc.status,
        lastStudiedAt: new Date(),
      },
      create: {
        userId,
        chapterId,
        theoryScore: newTheoryScore,
        readinessScore: calc.readinessScore,
        status: calc.status,
        lastStudiedAt: new Date(),
      },
    });
  }

  revalidatePath(`/chapter/${chapter?.slug}`);
  revalidatePath("/syllabus");
  revalidatePath("/");
  return { success: true, nextStatus };
}

export async function updateChapterManualProgress(data: {
  chapterId: string;
  theoryScore: number;
  questionsSolved: number;
  pyqsSolved: number;
  correctIndependent: number;
  wrong: number;
  assisted: number;
  testScore?: number;
  revisionScore?: number;
  readinessOverride?: number;
  isManualOverride?: boolean;
  statusOverride?: string;
  userId?: string;
}) {
  const userId = data.userId || DEFAULT_USER_ID;
  let chapter = await prisma.chapter.findUnique({ where: { id: data.chapterId } });
  if (!chapter) {
    chapter = await prisma.chapter.findUnique({ where: { slug: data.chapterId } });
  }
  if (!chapter) {
    console.warn("updateChapterManualProgress: Chapter not found for", data.chapterId);
    return null;
  }

  const calc = calculateChapterReadiness({
    theoryScore: data.theoryScore,
    questionsSolved: data.questionsSolved,
    questionTarget: chapter.defaultQuestionTarget,
    pyqsSolved: data.pyqsSolved,
    pyqTarget: chapter.defaultPYQTarget,
    correctIndependent: data.correctIndependent,
    wrong: data.wrong,
    assisted: data.assisted,
    testScore: data.testScore || 0,
    revisionScore: data.revisionScore || 0,
    isManualOverride: data.isManualOverride,
    manualReadiness: data.readinessOverride,
  });

  const finalStatus = data.statusOverride || calc.status;

  const progress = await prisma.chapterProgress.upsert({
    where: {
      userId_chapterId: {
        userId,
        chapterId: data.chapterId,
      },
    },
    update: {
      theoryScore: data.theoryScore,
      questionsSolved: data.questionsSolved,
      pyqsSolved: data.pyqsSolved,
      correctIndependent: data.correctIndependent,
      wrong: data.wrong,
      assisted: data.assisted,
      practiceScore: calc.practiceScore,
      pyqScore: calc.pyqScore,
      accuracyScore: calc.accuracyScore,
      testScore: data.testScore || 0,
      revisionScore: data.revisionScore || 0,
      readinessScore: calc.readinessScore,
      status: finalStatus,
      isManualOverride: data.isManualOverride || false,
      lastStudiedAt: new Date(),
    },
    create: {
      userId,
      chapterId: data.chapterId,
      theoryScore: data.theoryScore,
      questionsSolved: data.questionsSolved,
      pyqsSolved: data.pyqsSolved,
      correctIndependent: data.correctIndependent,
      wrong: data.wrong,
      assisted: data.assisted,
      practiceScore: calc.practiceScore,
      pyqScore: calc.pyqScore,
      accuracyScore: calc.accuracyScore,
      testScore: data.testScore || 0,
      revisionScore: data.revisionScore || 0,
      readinessScore: calc.readinessScore,
      status: finalStatus,
      isManualOverride: data.isManualOverride || false,
      lastStudiedAt: new Date(),
    },
  });

  revalidatePath(`/chapter/${chapter.slug}`);
  revalidatePath("/syllabus");
  revalidatePath("/roadmap");
  revalidatePath("/");
  return { success: true, progress };
}

export async function getAllChaptersForSyllabus(userId: string = DEFAULT_USER_ID) {
  const subjects = await prisma.subject.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      chapters: {
        orderBy: [{ classLevel: "asc" }, { displayOrder: "asc" }],
        include: {
          topics: true,
          progress: {
            where: { userId },
          },
        },
      },
    },
  });

  return subjects;
}
