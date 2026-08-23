"use server";

import { prisma } from "@/lib/prisma";
import { calculateChapterReadiness } from "@/lib/readiness";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function getTodayTasks(userId: string = DEFAULT_USER_ID) {
  return await prisma.task.findMany({
    where: { userId },
    include: {
      subject: true,
      chapter: true,
      topic: true,
      goal: true,
    },
    orderBy: [
      { status: "asc" }, // IN_PROGRESS / PENDING first
      { order: "asc" },
      { priority: "desc" },
    ],
  });
}

export async function createTask(data: {
  userId?: string;
  title: string;
  taskType: string;
  targetType: string;
  targetValue?: number;
  priority: string;
  dueDate?: Date;
  estimatedMinutes?: number;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  goalId?: string;
  notes?: string;
}) {
  const userId = data.userId || DEFAULT_USER_ID;

  // Get current highest order
  const highest = await prisma.task.findFirst({
    where: { userId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const order = (highest?.order ?? 0) + 1;

  const task = await prisma.task.create({
    data: {
      userId,
      title: data.title,
      taskType: data.taskType,
      targetType: data.targetType,
      targetValue: data.targetValue,
      priority: data.priority,
      dueDate: data.dueDate || new Date(),
      estimatedMinutes: data.estimatedMinutes || 45,
      subjectId: data.subjectId || null,
      chapterId: data.chapterId || null,
      topicId: data.topicId || null,
      goalId: data.goalId || null,
      notes: data.notes || null,
      status: "PENDING",
      order,
    },
  });

  revalidatePath("/");
  revalidatePath("/roadmap");
  revalidatePath("/goals");
  return { success: true, task };
}

export async function updateTaskStatus(
  taskId: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED",
  userId: string = DEFAULT_USER_ID
) {
  const completedAt = status === "COMPLETED" ? new Date() : null;

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      completedAt,
    },
    include: { chapter: true },
  });

  // If task has targetValue and is marked complete, set completedValue = targetValue
  if (status === "COMPLETED" && task.targetValue && task.completedValue < task.targetValue) {
    await prisma.task.update({
      where: { id: taskId },
      data: { completedValue: task.targetValue },
    });
  }

  revalidatePath("/");
  revalidatePath("/roadmap");
  return { success: true, task };
}

export async function logTaskProgress(data: {
  taskId: string;
  completedValue: number;
  correctIndependent?: number;
  wrong?: number;
  assisted?: number;
  timeMinutes?: number;
  markDone?: boolean;
  notes?: string;
  userId?: string;
}) {
  const userId = data.userId || DEFAULT_USER_ID;

  const task = await prisma.task.findUnique({
    where: { id: data.taskId },
    include: { chapter: true, subject: true },
  });

  if (!task) throw new Error("Task not found");

  const newCompletedValue = data.completedValue;
  const isDone =
    data.markDone ||
    (task.targetValue !== null && newCompletedValue >= (task.targetValue || 0));

  // 1. Update task
  await prisma.task.update({
    where: { id: data.taskId },
    data: {
      completedValue: newCompletedValue,
      status: isDone ? "COMPLETED" : "IN_PROGRESS",
      completedAt: isDone ? new Date() : undefined,
      notes: data.notes ? `${task.notes ? task.notes + " | " : ""}${data.notes}` : undefined,
    },
  });

  // 2. If questions were solved and chapter exists, automatically log Practice Session & cascade to ChapterProgress
  const questionsCount = (data.correctIndependent || 0) + (data.wrong || 0) + (data.assisted || 0);

  if (questionsCount > 0 && task.chapterId && task.subjectId) {
    const isPYQ = task.taskType === "PYQS" || task.title.toLowerCase().includes("pyq");

    // Create practice session
    await prisma.practiceSession.create({
      data: {
        userId,
        subjectId: task.subjectId,
        chapterId: task.chapterId,
        topicId: task.topicId,
        source: isPYQ ? "JEE_MAIN_PYQ" : "OTHER",
        sourceDetail: `Task: ${task.title}`,
        questions: questionsCount,
        correctIndependent: data.correctIndependent || 0,
        wrong: data.wrong || 0,
        assisted: data.assisted || 0,
        durationMinutes: data.timeMinutes || 30,
        notes: data.notes,
        date: new Date(),
      },
    });

    // Cascade update to ChapterProgress
    const chapter = task.chapter;
    if (chapter) {
      const progress = await prisma.chapterProgress.findUnique({
        where: {
          userId_chapterId: {
            userId,
            chapterId: task.chapterId,
          },
        },
      });

      const currentQ = progress?.questionsSolved || 0;
      const currentPYQ = progress?.pyqsSolved || 0;
      const currentCorrect = progress?.correctIndependent || 0;
      const currentWrong = progress?.wrong || 0;
      const currentAssisted = progress?.assisted || 0;
      const currentMinutes = progress?.studyMinutes || 0;

      const newQ = currentQ + questionsCount;
      const newPYQ = isPYQ ? currentPYQ + questionsCount : currentPYQ;
      const newCorrect = currentCorrect + (data.correctIndependent || 0);
      const newWrong = currentWrong + (data.wrong || 0);
      const newAssisted = currentAssisted + (data.assisted || 0);
      const newMinutes = currentMinutes + (data.timeMinutes || 0);

      // Recalculate readiness
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
            chapterId: task.chapterId,
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
          chapterId: task.chapterId,
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
  }

  // 3. If time was spent, log study session
  if (data.timeMinutes && data.timeMinutes > 0) {
    await prisma.studySession.create({
      data: {
        userId,
        taskId: task.id,
        chapterId: task.chapterId,
        durationMinutes: data.timeMinutes,
        date: new Date(),
        notes: `Logged from task: ${task.title}`,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/roadmap");
  revalidatePath("/syllabus");
  revalidatePath("/goals");
  revalidatePath("/practice");
  revalidatePath("/analytics");
  return { success: true };
}

export async function reorderTasks(taskIds: string[], userId: string = DEFAULT_USER_ID) {
  const updates = taskIds.map((id, index) =>
    prisma.task.update({
      where: { id, userId },
      data: { order: index + 1 },
    })
  );
  await prisma.$transaction(updates);
  revalidatePath("/");
  return { success: true };
}

export async function deleteTask(taskId: string, userId: string = DEFAULT_USER_ID) {
  await prisma.task.delete({
    where: { id: taskId, userId },
  });
  revalidatePath("/");
  return { success: true };
}

export async function setActiveWeeklyTargetChapter(
  chapterId: string,
  targetQuestions: number = 50,
  userId: string = DEFAULT_USER_ID
) {
  return await addWeeklyTargetChapter(chapterId, targetQuestions, userId);
}

export async function addWeeklyTargetChapter(
  chapterId: string,
  targetQuestions: number = 50,
  userId: string = DEFAULT_USER_ID
) {
  let chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { subject: true },
  });
  if (!chapter) {
    chapter = await prisma.chapter.findUnique({
      where: { slug: chapterId },
      include: { subject: true },
    });
  }
  if (!chapter) {
    console.warn("addWeeklyTargetChapter: Chapter not found for", chapterId);
    return null;
  }

  // Check if target already exists for this chapter
  const existing = await prisma.task.findFirst({
    where: {
      userId,
      chapterId,
      status: "IN_PROGRESS",
    },
    include: {
      subject: true,
      chapter: true,
      topic: true,
      goal: true,
    },
  });

  if (existing) {
    return existing;
  }

  const task = await prisma.task.create({
    data: {
      userId,
      title: `${chapter.name}: Target Chapter (${targetQuestions} Questions)`,
      taskType: "QUESTIONS",
      targetType: "QUESTIONS",
      targetValue: targetQuestions,
      completedValue: 0,
      priority: "CRITICAL",
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      estimatedMinutes: Math.round(targetQuestions * 2),
      status: "IN_PROGRESS",
      order: 0,
      notes: `Target Chapter: ${chapter.name} (${chapter.subject.name}). Solve ${targetQuestions} questions to build chapter readiness.`,
    },
    include: {
      subject: true,
      chapter: true,
      topic: true,
      goal: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/syllabus");
  revalidatePath(`/chapter/${chapter.slug}`);
  return task;
}

export async function addMultipleTargetChapters(
  chapterIds: string[],
  targetQuestions: number = 50,
  userId: string = DEFAULT_USER_ID
) {
  const createdTasks = [];
  for (const chapterId of chapterIds) {
    const task = await addWeeklyTargetChapter(chapterId, targetQuestions, userId);
    createdTasks.push(task);
  }

  revalidatePath("/");
  revalidatePath("/syllabus");
  return createdTasks;
}
