"use server";

import { prisma } from "@/lib/prisma";
import { getNextRevisionDate, categorizeRevision } from "@/lib/revision";
import { calculateChapterReadiness } from "@/lib/readiness";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function getRevisionsGrouped(userId: string = DEFAULT_USER_ID) {
  const revisions = await prisma.revision.findMany({
    where: { userId },
    include: {
      chapter: {
        include: { subject: true },
      },
    },
    orderBy: { scheduledDate: "asc" },
  });

  const dueToday: typeof revisions = [];
  const overdue: typeof revisions = [];
  const upcoming: typeof revisions = [];
  const fresh: typeof revisions = [];

  for (const rev of revisions) {
    const category = categorizeRevision(rev.scheduledDate, rev.status === "COMPLETED");
    if (category === "DUE_TODAY") dueToday.push(rev);
    else if (category === "OVERDUE") overdue.push(rev);
    else if (category === "UPCOMING") upcoming.push(rev);
    else fresh.push(rev);
  }

  return { dueToday, overdue, upcoming, fresh, totalCount: revisions.length };
}

export async function completeRevision(data: {
  revisionId: string;
  recallQuality: "POOR" | "WEAK" | "OKAY" | "STRONG";
  durationMinutes?: number;
  questionsSolved?: number;
  userId?: string;
}) {
  const userId = data.userId || DEFAULT_USER_ID;

  const rev = await prisma.revision.findUnique({
    where: { id: data.revisionId },
    include: { chapter: true },
  });

  if (!rev) throw new Error("Revision record not found");

  // 1. Mark current revision completed
  await prisma.revision.update({
    where: { id: data.revisionId },
    data: {
      status: "COMPLETED",
      completedDate: new Date(),
      recallQuality: data.recallQuality,
      durationMinutes: data.durationMinutes || 25,
      questionsSolved: data.questionsSolved || 15,
    },
  });

  // 2. Schedule next spaced revision
  const { nextRevisionDate, nextRevisionNumber } = getNextRevisionDate(
    rev.revisionNumber,
    data.recallQuality,
    new Date()
  );

  await prisma.revision.create({
    data: {
      userId,
      chapterId: rev.chapterId,
      revisionNumber: nextRevisionNumber,
      scheduledDate: nextRevisionDate,
      status: "PENDING",
    },
  });

  // 3. Update chapter progress lastRevisedAt and revisionScore
  const progress = await prisma.chapterProgress.findUnique({
    where: { userId_chapterId: { userId, chapterId: rev.chapterId } },
  });

  let qualityBonus = 80;
  if (data.recallQuality === "STRONG") qualityBonus = 100;
  if (data.recallQuality === "POOR") qualityBonus = 40;
  if (data.recallQuality === "WEAK") qualityBonus = 60;

  const newRevisionScore = Math.min(100, Math.max(qualityBonus, (progress?.revisionScore || 0) + 20));

  const calc = calculateChapterReadiness({
    theoryScore: progress?.theoryScore || 0,
    questionsSolved: (progress?.questionsSolved || 0) + (data.questionsSolved || 0),
    questionTarget: rev.chapter.defaultQuestionTarget,
    pyqsSolved: progress?.pyqsSolved || 0,
    pyqTarget: rev.chapter.defaultPYQTarget,
    correctIndependent: progress?.correctIndependent || 0,
    wrong: progress?.wrong || 0,
    assisted: progress?.assisted || 0,
    testScore: progress?.testScore || 0,
    revisionScore: newRevisionScore,
    lastRevisedAt: new Date(),
    revisionsCount: (progress?.revisionScore ? 1 : 0) + 1,
  });

  await prisma.chapterProgress.upsert({
    where: { userId_chapterId: { userId, chapterId: rev.chapterId } },
    update: {
      revisionScore: newRevisionScore,
      lastRevisedAt: new Date(),
      readinessScore: calc.readinessScore,
      status: calc.status,
      studyMinutes: (progress?.studyMinutes || 0) + (data.durationMinutes || 0),
      questionsSolved: (progress?.questionsSolved || 0) + (data.questionsSolved || 0),
    },
    create: {
      userId,
      chapterId: rev.chapterId,
      revisionScore: newRevisionScore,
      lastRevisedAt: new Date(),
      readinessScore: calc.readinessScore,
      status: calc.status,
      studyMinutes: data.durationMinutes || 0,
      questionsSolved: data.questionsSolved || 0,
    },
  });

  revalidatePath("/revision");
  revalidatePath("/syllabus");
  revalidatePath("/");
  return { success: true, nextRevisionDate };
}

export async function createManualRevisionSchedule(data: {
  chapterId: string;
  scheduledDate: Date;
  userId?: string;
}) {
  const userId = data.userId || DEFAULT_USER_ID;

  const count = await prisma.revision.count({
    where: { userId, chapterId: data.chapterId },
  });

  const rev = await prisma.revision.create({
    data: {
      userId,
      chapterId: data.chapterId,
      scheduledDate: data.scheduledDate,
      revisionNumber: count + 1,
      status: "PENDING",
    },
  });

  revalidatePath("/revision");
  return { success: true, rev };
}
