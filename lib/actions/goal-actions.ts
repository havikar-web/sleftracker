"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function getGoalsWithComputedProgress(userId: string = DEFAULT_USER_ID) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    include: {
      metrics: true,
      tasks: true,
    },
    orderBy: [{ priority: "desc" }, { endDate: "asc" }],
  });

  // Dynamically compute progress for each goal metric
  const computedGoals = await Promise.all(
    goals.map(async (goal) => {
      const computedMetrics = await Promise.all(
        goal.metrics.map(async (metric) => {
          let currentValue = metric.currentValue;

          if (metric.metricType === "QUESTIONS") {
            const sum = await prisma.practiceSession.aggregate({
              where: {
                userId,
                date: {
                  gte: goal.startDate,
                  lte: goal.endDate,
                },
                ...(metric.subjectId ? { subjectId: metric.subjectId } : {}),
                ...(metric.chapterId ? { chapterId: metric.chapterId } : {}),
              },
              _sum: { questions: true },
            });
            currentValue = sum._sum.questions || 0;
          } else if (metric.metricType === "STUDY_HOURS") {
            const sum = await prisma.studySession.aggregate({
              where: {
                userId,
                date: {
                  gte: goal.startDate,
                  lte: goal.endDate,
                },
              },
              _sum: { durationMinutes: true },
            });
            currentValue = Math.round(((sum._sum.durationMinutes || 0) / 60) * 10) / 10;
          } else if (metric.metricType === "TESTS") {
            const count = await prisma.test.count({
              where: {
                userId,
                date: {
                  gte: goal.startDate,
                  lte: goal.endDate,
                },
              },
            });
            currentValue = count;
          } else if (metric.metricType === "CHAPTER_READINESS" && metric.chapterId) {
            const progress = await prisma.chapterProgress.findUnique({
              where: {
                userId_chapterId: {
                  userId,
                  chapterId: metric.chapterId,
                },
              },
            });
            currentValue = progress?.readinessScore || 0;
          }

          const progressPercent = Math.min(
            100,
            Math.round((currentValue / Math.max(1, metric.targetValue)) * 100)
          );

          return {
            ...metric,
            currentValue,
            progressPercent,
          };
        })
      );

      const overallProgress =
        computedMetrics.length > 0
          ? Math.round(
              computedMetrics.reduce((acc, m) => acc + m.progressPercent, 0) /
                computedMetrics.length
            )
          : 0;

      return {
        ...goal,
        metrics: computedMetrics,
        overallProgress,
      };
    })
  );

  return computedGoals;
}

export async function createGoal(data: {
  userId?: string;
  title: string;
  description?: string;
  goalType: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  metrics: Array<{
    metricType: string;
    targetValue: number;
    subjectId?: string;
    chapterId?: string;
  }>;
}) {
  const userId = data.userId || DEFAULT_USER_ID;

  const goal = await prisma.goal.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      goalType: data.goalType,
      startDate: data.startDate,
      endDate: data.endDate,
      priority: data.priority,
      status: "IN_PROGRESS",
    },
  });

  if (data.metrics && data.metrics.length > 0) {
    for (const m of data.metrics) {
      await prisma.goalMetric.create({
        data: {
          goalId: goal.id,
          metricType: m.metricType,
          targetValue: m.targetValue,
          subjectId: m.subjectId || null,
          chapterId: m.chapterId || null,
        },
      });
    }
  }

  revalidatePath("/goals");
  revalidatePath("/");
  return { success: true, goal };
}

export async function deleteGoal(goalId: string, userId: string = DEFAULT_USER_ID) {
  await prisma.goal.delete({
    where: { id: goalId, userId },
  });
  revalidatePath("/goals");
  return { success: true };
}
