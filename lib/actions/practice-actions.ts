"use server";

import { prisma } from "@/lib/prisma";
import { calculateChapterReadiness } from "@/lib/readiness";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function logPracticeSession(data: {
  userId?: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  source: string;
  sourceDetail?: string;
  yearRange?: string;
  questions: number;
  correctIndependent: number;
  wrong: number;
  assisted: number;
  unattempted?: number;
  durationMinutes?: number;
  difficulty?: string;
  notes?: string;
  date?: Date;
}) {
  const userId = data.userId || DEFAULT_USER_ID;

  // 1. Create PracticeSession record
  const session = await prisma.practiceSession.create({
    data: {
      userId,
      subjectId: data.subjectId,
      chapterId: data.chapterId,
      topicId: data.topicId || null,
      source: data.source,
      sourceDetail: data.sourceDetail || null,
      yearRange: data.yearRange || null,
      questions: data.questions,
      correctIndependent: data.correctIndependent,
      wrong: data.wrong,
      assisted: data.assisted,
      unattempted: data.unattempted || 0,
      durationMinutes: data.durationMinutes || 30,
      difficulty: data.difficulty || "MEDIUM",
      notes: data.notes || null,
      date: data.date || new Date(),
    },
  });

  // 2. If duration was logged, also create StudySession
  if (data.durationMinutes && data.durationMinutes > 0) {
    await prisma.studySession.create({
      data: {
        userId,
        chapterId: data.chapterId,
        durationMinutes: data.durationMinutes,
        date: data.date || new Date(),
        notes: `Practice session: ${data.questions} questions (${data.source})`,
      },
    });
  }

  // 3. Cascade update ChapterProgress
  const chapter = await prisma.chapter.findUnique({
    where: { id: data.chapterId },
  });

  if (chapter) {
    const isPYQ =
      data.source === "JEE_MAIN_PYQ" ||
      data.source === "JEE_ADVANCED_PYQ" ||
      (data.sourceDetail && data.sourceDetail.toLowerCase().includes("pyq"));

    const progress = await prisma.chapterProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId: data.chapterId,
        },
      },
    });

    const currentQ = progress?.questionsSolved || 0;
    const currentPYQ = progress?.pyqsSolved || 0;
    const currentCorrect = progress?.correctIndependent || 0;
    const currentWrong = progress?.wrong || 0;
    const currentAssisted = progress?.assisted || 0;
    const currentMinutes = progress?.studyMinutes || 0;

    const newQ = currentQ + data.questions;
    const newPYQ = isPYQ ? currentPYQ + data.questions : currentPYQ;
    const newCorrect = currentCorrect + data.correctIndependent;
    const newWrong = currentWrong + data.wrong;
    const newAssisted = currentAssisted + data.assisted;
    const newMinutes = currentMinutes + (data.durationMinutes || 0);

    const calc = calculateChapterReadiness({
      theoryScore: progress?.theoryScore || 0,
      questionsSolved: newQ,
      questionTarget: chapter.defaultQuestionTarget,
      pyqsSolved: newPYQ,
      pyqTarget: chapter.defaultPYQTarget,
      correctIndependent: newCorrect,
      wrong: newWrong,
      assisted: newAssisted,
      testScore: progress?.testScore || 0,
      revisionScore: progress?.revisionScore || 0,
      lastRevisedAt: progress?.lastRevisedAt,
    });

    await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: data.chapterId,
        },
      },
      update: {
        questionsSolved: newQ,
        pyqsSolved: newPYQ,
        correctIndependent: newCorrect,
        wrong: newWrong,
        assisted: newAssisted,
        studyMinutes: newMinutes,
        practiceScore: calc.practiceScore,
        pyqScore: calc.pyqScore,
        accuracyScore: calc.accuracyScore,
        readinessScore: calc.readinessScore,
        status: calc.status,
        lastStudiedAt: new Date(),
      },
      create: {
        userId,
        chapterId: data.chapterId,
        questionsSolved: newQ,
        pyqsSolved: newPYQ,
        correctIndependent: newCorrect,
        wrong: newWrong,
        assisted: newAssisted,
        studyMinutes: newMinutes,
        practiceScore: calc.practiceScore,
        pyqScore: calc.pyqScore,
        accuracyScore: calc.accuracyScore,
        readinessScore: calc.readinessScore,
        status: calc.status,
        lastStudiedAt: new Date(),
      },
    });
  }

  // 4. Update linked tasks if any match this chapter
  const pendingTask = await prisma.task.findFirst({
    where: {
      userId,
      chapterId: data.chapterId,
      status: "IN_PROGRESS",
      taskType: { in: ["QUESTIONS", "PYQS", "BOOK_PRACTICE"] },
    },
  });

  if (pendingTask && pendingTask.targetValue) {
    const updatedVal = pendingTask.completedValue + data.questions;
    await prisma.task.update({
      where: { id: pendingTask.id },
      data: {
        completedValue: updatedVal,
        status: updatedVal >= pendingTask.targetValue ? "COMPLETED" : "IN_PROGRESS",
        completedAt: updatedVal >= pendingTask.targetValue ? new Date() : undefined,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/practice");
  revalidatePath("/syllabus");
  revalidatePath("/roadmap");
  revalidatePath("/goals");
  revalidatePath("/analytics");
  return { success: true, session };
}

export async function getPracticeHistory(options?: {
  userId?: string;
  limit?: number;
  subjectId?: string;
  chapterId?: string;
}) {
  const userId = options?.userId || DEFAULT_USER_ID;
  const limit = options?.limit || 50;

  return await prisma.practiceSession.findMany({
    where: {
      userId,
      subjectId: options?.subjectId,
      chapterId: options?.chapterId,
    },
    include: {
      subject: true,
      chapter: true,
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}
