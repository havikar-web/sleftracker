"use server";

import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = "jee_student_primary";

export async function exportAllUserData(userId: string = DEFAULT_USER_ID) {
  const [user, chapterProgress, practiceSessions, studySessions, tests, goals, revisions] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.chapterProgress.findMany({
        where: { userId },
        include: { chapter: { include: { subject: true } } },
      }),
      prisma.practiceSession.findMany({
        where: { userId },
        include: { chapter: true, subject: true },
        orderBy: { date: "desc" },
      }),
      prisma.studySession.findMany({
        where: { userId },
        orderBy: { date: "desc" },
      }),
      prisma.test.findMany({
        where: { userId },
        include: { testChapters: true, errors: true },
        orderBy: { date: "desc" },
      }),
      prisma.goal.findMany({
        where: { userId },
        include: { metrics: true },
      }),
      prisma.revision.findMany({
        where: { userId },
        include: { chapter: true },
      }),
    ]);

  return {
    exportDate: new Date().toISOString(),
    user,
    chapterProgress,
    practiceSessions,
    studySessions,
    tests,
    goals,
    revisions,
  };
}
