"use server";

import { prisma } from "@/lib/prisma";
import { calculateChapterReadiness } from "@/lib/readiness";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function createTest(data: {
  userId?: string;
  name: string;
  testType: string;
  date?: Date;
  durationMinutes: number;
  totalMarks: number;
  score: number;
  physicsScore?: number;
  chemistryScore?: number;
  mathScore?: number;
  biologyScore?: number;
  questions: number;
  correct: number;
  wrong: number;
  unattempted?: number;
  percentile?: number;
  rank?: number;
  notes?: string;
  chapterIds?: string[];
  errors?: Array<{
    errorType: string;
    count: number;
    notes?: string;
  }>;
}) {
  const userId = data.userId || DEFAULT_USER_ID;

  const test = await prisma.test.create({
    data: {
      userId,
      name: data.name,
      testType: data.testType,
      date: data.date || new Date(),
      durationMinutes: data.durationMinutes || 60,
      totalMarks: data.totalMarks,
      score: data.score,
      physicsScore: data.physicsScore,
      chemistryScore: data.chemistryScore,
      mathScore: data.mathScore,
      biologyScore: data.biologyScore,
      questions: data.questions,
      correct: data.correct,
      wrong: data.wrong,
      unattempted: data.unattempted || 0,
      percentile: data.percentile,
      rank: data.rank,
      notes: data.notes,
    },
  });

  // Link test to chapters
  if (data.chapterIds && data.chapterIds.length > 0) {
    for (const chapterId of data.chapterIds) {
      await prisma.testChapter.create({
        data: {
          testId: test.id,
          chapterId,
        },
      });

      // Update chapter testScore in ChapterProgress
      const testScorePercentage = (data.score / Math.max(1, data.totalMarks)) * 100;
      const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
      const progress = await prisma.chapterProgress.findUnique({
        where: { userId_chapterId: { userId, chapterId } },
      });

      if (chapter) {
        const calc = calculateChapterReadiness({
          theoryScore: progress?.theoryScore || 0,
          questionsSolved: progress?.questionsSolved || 0,
          questionTarget: chapter.defaultQuestionTarget,
          pyqsSolved: progress?.pyqsSolved || 0,
          pyqTarget: chapter.defaultPYQTarget,
          correctIndependent: progress?.correctIndependent || 0,
          wrong: progress?.wrong || 0,
          assisted: progress?.assisted || 0,
          testScore: Math.round(testScorePercentage),
          revisionScore: progress?.revisionScore || 0,
          lastRevisedAt: progress?.lastRevisedAt,
          testsTakenCount: (progress?.testScore ? 1 : 0) + 1,
        });

        await prisma.chapterProgress.upsert({
          where: { userId_chapterId: { userId, chapterId } },
          update: {
            testScore: Math.round(testScorePercentage),
            readinessScore: calc.readinessScore,
            status: calc.status,
            lastStudiedAt: new Date(),
          },
          create: {
            userId,
            chapterId,
            testScore: Math.round(testScorePercentage),
            readinessScore: calc.readinessScore,
            status: calc.status,
            lastStudiedAt: new Date(),
          },
        });
      }
    }
  }

  // Insert error analysis tags
  if (data.errors && data.errors.length > 0) {
    for (const err of data.errors) {
      if (err.count > 0) {
        await prisma.testError.create({
          data: {
            testId: test.id,
            errorType: err.errorType,
            count: err.count,
            notes: err.notes,
          },
        });
      }
    }
  }

  revalidatePath("/tests");
  revalidatePath("/analytics");
  revalidatePath("/");
  return { success: true, test };
}

export async function getAllTests(userId: string = DEFAULT_USER_ID) {
  return await prisma.test.findMany({
    where: { userId },
    include: {
      testChapters: {
        include: { chapter: { include: { subject: true } } },
      },
      errors: true,
    },
    orderBy: { date: "desc" },
  });
}
