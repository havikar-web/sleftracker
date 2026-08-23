"use server";

import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = "jee_student_primary";

export async function globalSearch(query: string, userId: string = DEFAULT_USER_ID) {
  if (!query || query.trim().length < 2) {
    return { chapters: [], topics: [], tasks: [], tests: [], goals: [] };
  }

  const clean = query.trim();

  const [chapters, topics, tasks, tests, goals] = await Promise.all([
    prisma.chapter.findMany({
      where: {
        name: { contains: clean, mode: "insensitive" },
      },
      include: {
        subject: true,
        progress: { where: { userId } },
      },
      take: 6,
    }),
    prisma.topic.findMany({
      where: {
        name: { contains: clean, mode: "insensitive" },
      },
      include: {
        chapter: { include: { subject: true } },
      },
      take: 6,
    }),
    prisma.task.findMany({
      where: {
        userId,
        title: { contains: clean, mode: "insensitive" },
      },
      include: { chapter: true, subject: true },
      take: 5,
    }),
    prisma.test.findMany({
      where: {
        userId,
        name: { contains: clean, mode: "insensitive" },
      },
      take: 5,
    }),
    prisma.goal.findMany({
      where: {
        userId,
        title: { contains: clean, mode: "insensitive" },
      },
      take: 4,
    }),
  ]);

  return { chapters, topics, tasks, tests, goals };
}
