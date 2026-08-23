"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function logStudySession(data: {
  userId?: string;
  durationMinutes: number;
  chapterId?: string;
  taskId?: string;
  notes?: string;
  date?: Date;
}) {
  const userId = data.userId || DEFAULT_USER_ID;

  const session = await prisma.studySession.create({
    data: {
      userId,
      durationMinutes: data.durationMinutes,
      chapterId: data.chapterId || null,
      taskId: data.taskId || null,
      notes: data.notes || null,
      date: data.date || new Date(),
    },
  });

  // If chapter is linked, increment chapter studyMinutes
  if (data.chapterId) {
    await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: data.chapterId,
        },
      },
      update: {
        studyMinutes: { increment: data.durationMinutes },
        lastStudiedAt: new Date(),
      },
      create: {
        userId,
        chapterId: data.chapterId,
        studyMinutes: data.durationMinutes,
        lastStudiedAt: new Date(),
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/analytics");
  return { success: true, session };
}

export async function getStudyTimeStats(userId: string = DEFAULT_USER_ID) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const todaySum = await prisma.studySession.aggregate({
    where: {
      userId,
      date: { gte: today },
    },
    _sum: { durationMinutes: true },
  });

  const weekSum = await prisma.studySession.aggregate({
    where: {
      userId,
      date: { gte: startOfWeek },
    },
    _sum: { durationMinutes: true },
  });

  return {
    todayMinutes: todaySum._sum.durationMinutes || 0,
    weekMinutes: weekSum._sum.durationMinutes || 0,
  };
}
