"use server";

import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = "jee_student_primary";

export async function getAnalyticsOverview(userId: string = DEFAULT_USER_ID) {
  // 1. Fetch user targets
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // 2. Fetch all subjects with chapter progress
  const subjects = await prisma.subject.findMany({
    include: {
      chapters: {
        include: {
          progress: { where: { userId } },
        },
      },
    },
  });

  let totalChapters = 0;
  let totalReadinessSum = 0;
  let class11Count = 0;
  let class11ReadinessSum = 0;
  let class12Count = 0;
  let class12ReadinessSum = 0;

  const subjectStats = subjects.map((sub) => {
    let subReadinessSum = 0;
    const chapCount = sub.chapters.length;

    sub.chapters.forEach((chap) => {
      const readiness = chap.progress[0]?.readinessScore || 0;
      subReadinessSum += readiness;
      totalChapters++;
      totalReadinessSum += readiness;

      if (chap.classLevel === 11) {
        class11Count++;
        class11ReadinessSum += readiness;
      } else if (chap.classLevel === 12) {
        class12Count++;
        class12ReadinessSum += readiness;
      }
    });

    const averageReadiness = chapCount > 0 ? Math.round(subReadinessSum / chapCount) : 0;
    return {
      id: sub.id,
      name: sub.name,
      shortName: sub.shortName,
      color: sub.color,
      readiness: averageReadiness,
      chapterCount: chapCount,
    };
  }).filter((s) => s.chapterCount > 0);

  const overallReadiness =
    totalChapters > 0 ? Math.round(totalReadinessSum / totalChapters) : 0;
  const class11Readiness =
    class11Count > 0 ? Math.round(class11ReadinessSum / class11Count) : 0;
  const class12Readiness =
    class12Count > 0 ? Math.round(class12ReadinessSum / class12Count) : 0;

  // 3. Question Statistics (Today, This Week, Total)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [todayPractice, weekPractice, monthPractice, totalPractice] = await Promise.all([
    prisma.practiceSession.aggregate({
      where: { userId, date: { gte: today } },
      _sum: {
        questions: true,
        correctIndependent: true,
        wrong: true,
        assisted: true,
      },
    }),
    prisma.practiceSession.aggregate({
      where: { userId, date: { gte: startOfWeek } },
      _sum: {
        questions: true,
        correctIndependent: true,
        wrong: true,
        assisted: true,
      },
    }),
    prisma.practiceSession.aggregate({
      where: { userId, date: { gte: startOfMonth } },
      _sum: {
        questions: true,
        correctIndependent: true,
        wrong: true,
        assisted: true,
      },
    }),
    prisma.practiceSession.aggregate({
      where: { userId },
      _sum: {
        questions: true,
        correctIndependent: true,
        wrong: true,
        assisted: true,
      },
    }),
  ]);

  // Total Study Minutes
  const [todayStudy, weekStudy, totalStudy] = await Promise.all([
    prisma.studySession.aggregate({
      where: { userId, date: { gte: today } },
      _sum: { durationMinutes: true },
    }),
    prisma.studySession.aggregate({
      where: { userId, date: { gte: startOfWeek } },
      _sum: { durationMinutes: true },
    }),
    prisma.studySession.aggregate({
      where: { userId },
      _sum: { durationMinutes: true },
    }),
  ]);

  // Tasks counts for today
  const [todayTasksTotal, todayTasksCompleted] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: "COMPLETED" } }),
  ]);

  // 4. Ranked Lists: Closest to Mastery, Weakest Accuracy, Highest Priority
  const allChapterProgress = await prisma.chapterProgress.findMany({
    where: { userId },
    include: {
      chapter: {
        include: { subject: true },
      },
    },
  });

  // Closest to mastery: Readiness between 70% and 89%
  const closestToMastery = [...allChapterProgress]
    .filter((p) => p.readinessScore >= 60 && p.readinessScore < 90)
    .sort((a, b) => b.readinessScore - a.readinessScore)
    .slice(0, 5);

  // Weakest accuracy: with > 15 questions solved and accuracy < 75%
  const weakestAccuracy = [...allChapterProgress]
    .filter((p) => p.questionsSolved >= 15 && p.accuracyScore < 75)
    .sort((a, b) => a.accuracyScore - b.accuracyScore)
    .slice(0, 5);

  // Lowest revision strength: high readiness (> 60%) but revision score < 50
  const lowestRevisionStrength = [...allChapterProgress]
    .filter((p) => p.readinessScore >= 50 && p.revisionScore < 50)
    .sort((a, b) => a.revisionScore - b.revisionScore)
    .slice(0, 5);

  // 5. Error Distribution
  const errorAggregates = await prisma.testError.groupBy({
    by: ["errorType"],
    _sum: { count: true },
    where: { test: { userId } },
  });

  const errorData = errorAggregates.map((err) => ({
    type: err.errorType.replace("_", " "),
    count: err._sum.count || 0,
  }));

  // 6. Readiness snapshots for trend
  const snapshots = await prisma.readinessSnapshot.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    take: 12,
  });

  // 7. Tests taken count
  const testsCount = await prisma.test.count({ where: { userId } });

  // 8. Calculate Independent Accuracy %
  const totalAttempted =
    (totalPractice._sum.correctIndependent || 0) +
    (totalPractice._sum.wrong || 0) +
    (totalPractice._sum.assisted || 0);

  const averageIndependentAccuracy =
    totalAttempted > 0
      ? Math.round(
          ((totalPractice._sum.correctIndependent || 0) / totalAttempted) * 100
        )
      : 0;

  return {
    user,
    overallReadiness,
    class11Readiness,
    class12Readiness,
    subjectStats,
    todayQuestions: todayPractice._sum.questions || 0,
    todayStudyMinutes: todayStudy._sum.durationMinutes || 0,
    todayTasksTotal: todayTasksTotal || 0,
    todayTasksCompleted: todayTasksCompleted || 0,
    weekQuestions: weekPractice._sum.questions || 0,
    weekStudyHours: Math.round(((weekStudy._sum.durationMinutes || 0) / 60) * 10) / 10,
    monthQuestions: monthPractice._sum.questions || 0,
    totalQuestions: totalPractice._sum.questions || 0,
    totalStudyHours: Math.round(((totalStudy._sum.durationMinutes || 0) / 60) * 10) / 10,
    independentAccuracy: averageIndependentAccuracy,
    assistedQuestions: totalPractice._sum.assisted || 0,
    wrongQuestions: totalPractice._sum.wrong || 0,
    testsCount,
    closestToMastery,
    weakestAccuracy,
    lowestRevisionStrength,
    errorData,
    snapshots,
  };
}
