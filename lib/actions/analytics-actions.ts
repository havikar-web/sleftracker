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

  // 9. Past 14-Days Daily Activity History (MCQs & Study Hours)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const [recentPracticeSessions, recentStudySessions] = await Promise.all([
    prisma.practiceSession.findMany({
      where: { userId, date: { gte: fourteenDaysAgo } },
      orderBy: { date: "asc" },
    }),
    prisma.studySession.findMany({
      where: { userId, date: { gte: fourteenDaysAgo } },
      orderBy: { date: "asc" },
    }),
  ]);

  const dailyActivityMap = new Map<string, {
    dateStr: string;
    dayName: string;
    mcqsSolved: number;
    independent: number;
    assisted: number;
    wrong: number;
    studyMinutes: number;
    studyHours: number;
    accuracy: number;
  }>();

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dateStr = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
    dailyActivityMap.set(key, {
      dateStr,
      dayName,
      mcqsSolved: 0,
      independent: 0,
      assisted: 0,
      wrong: 0,
      studyMinutes: 0,
      studyHours: 0,
      accuracy: 0,
    });
  }

  recentPracticeSessions.forEach((ps) => {
    const key = ps.date.toISOString().split("T")[0];
    const entry = dailyActivityMap.get(key);
    if (entry) {
      entry.mcqsSolved += ps.questions;
      entry.independent += ps.correctIndependent;
      entry.assisted += ps.assisted;
      entry.wrong += ps.wrong;
    }
  });

  recentStudySessions.forEach((ss) => {
    const key = ss.date.toISOString().split("T")[0];
    const entry = dailyActivityMap.get(key);
    if (entry) {
      entry.studyMinutes += ss.durationMinutes;
      entry.studyHours = Math.round((entry.studyMinutes / 60) * 10) / 10;
    }
  });

  const dailyActivityHistory = Array.from(dailyActivityMap.values()).map((item) => {
    const totalAttempted = item.independent + item.assisted + item.wrong;
    const accuracy = totalAttempted > 0 ? Math.round((item.independent / totalAttempted) * 100) : 0;
    return {
      ...item,
      accuracy,
    };
  });

  // 10. Expected vs Actual Syllabus Completion Trajectory (760 Total Hours Target)
  const TOTAL_SYLLABUS_HOURS = 760;
  const targetDate = new Date(user?.targetDate || "2027-01-01T00:00:00.000Z");
  const now = new Date();
  const msRemaining = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  const totalLoggedHours = Math.round(((totalStudy._sum.durationMinutes || 0) / 60) * 10) / 10;
  const remainingHours = Math.max(0, TOTAL_SYLLABUS_HOURS - totalLoggedHours);
  const requiredDailyPace = Math.round((remainingHours / daysRemaining) * 10) / 10;

  // Compute 7-day rolling daily study average
  const last7DaysStudyMinutes = recentStudySessions
    .filter((s) => s.date.getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000)
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const actualCurrentDailyRate = Math.max(
    0.5,
    Math.round((last7DaysStudyMinutes / 7 / 60) * 10) / 10
  );

  // Generate milestone curve points: 4 historical milestones + Today + 6 future projection milestones
  const trajectoryPoints: any[] = [];

  // Historical / Past Milestones
  for (let i = 4; i >= 1; i--) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - i * 5);
    const dateLabel = pastDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const histHours = Math.max(0, Math.round((totalLoggedHours - (i * actualCurrentDailyRate * 5)) * 10) / 10);
    const expectedHistHours = Math.max(0, Math.round((TOTAL_SYLLABUS_HOURS * (1 - (daysRemaining + i * 5) / 140)) * 10) / 10);

    trajectoryPoints.push({
      label: dateLabel,
      actualHours: histHours,
      actualPct: Math.round((histHours / TOTAL_SYLLABUS_HOURS) * 100),
      expectedHours: expectedHistHours,
      expectedPct: Math.round((expectedHistHours / TOTAL_SYLLABUS_HOURS) * 100),
      projectedHours: null,
      projectedPct: null,
    });
  }

  // Today point
  const todayLabel = "Today";
  const expectedTodayHours = Math.max(
    0,
    Math.round((TOTAL_SYLLABUS_HOURS * (1 - daysRemaining / 140)) * 10) / 10
  );
  trajectoryPoints.push({
    label: todayLabel,
    actualHours: totalLoggedHours,
    actualPct: Math.round((totalLoggedHours / TOTAL_SYLLABUS_HOURS) * 100),
    expectedHours: expectedTodayHours,
    expectedPct: Math.round((expectedTodayHours / TOTAL_SYLLABUS_HOURS) * 100),
    projectedHours: totalLoggedHours,
    projectedPct: Math.round((totalLoggedHours / TOTAL_SYLLABUS_HOURS) * 100),
  });

  // Future Projection Milestones (15d, 30d, 60d, 90d, 120d, Jan 1st 2027)
  const futureIntervals = [
    { days: 15, label: "+15 Days" },
    { days: 30, label: "+30 Days" },
    { days: 60, label: "+60 Days" },
    { days: 90, label: "+90 Days" },
    { days: 120, label: "+120 Days" },
    { days: daysRemaining, label: "Jan 1st 2027" },
  ];

  futureIntervals.forEach((fut) => {
    const futExpectedHours = Math.min(
      TOTAL_SYLLABUS_HOURS,
      Math.round((expectedTodayHours + (TOTAL_SYLLABUS_HOURS - expectedTodayHours) * (fut.days / daysRemaining)) * 10) / 10
    );
    const futProjectedHours = Math.min(
      TOTAL_SYLLABUS_HOURS,
      Math.round((totalLoggedHours + actualCurrentDailyRate * fut.days) * 10) / 10
    );

    trajectoryPoints.push({
      label: fut.label,
      actualHours: null,
      actualPct: null,
      expectedHours: futExpectedHours,
      expectedPct: Math.round((futExpectedHours / TOTAL_SYLLABUS_HOURS) * 100),
      projectedHours: futProjectedHours,
      projectedPct: Math.round((futProjectedHours / TOTAL_SYLLABUS_HOURS) * 100),
    });
  });

  // 11. Calculate Overall Independent Accuracy %
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

  const snapshots = await prisma.readinessSnapshot.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    take: 12,
  });

  const testsCount = await prisma.test.count({ where: { userId } });

  const daysToFinishAtCurrentRate = Math.ceil(remainingHours / actualCurrentDailyRate);
  const projectedCompletionDate = new Date();
  projectedCompletionDate.setDate(projectedCompletionDate.getDate() + daysToFinishAtCurrentRate);
  const isAheadOfSchedule = projectedCompletionDate.getTime() <= targetDate.getTime();

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
    totalStudyHours: totalLoggedHours,
    independentAccuracy: averageIndependentAccuracy,
    assistedQuestions: totalPractice._sum.assisted || 0,
    wrongQuestions: totalPractice._sum.wrong || 0,
    testsCount,
    closestToMastery,
    weakestAccuracy,
    lowestRevisionStrength,
    errorData,
    snapshots,
    dailyActivityHistory,
    trajectoryPoints,
    pacingInfo: {
      totalSyllabusHours: TOTAL_SYLLABUS_HOURS,
      totalLoggedHours,
      remainingHours,
      daysRemaining,
      requiredDailyPace,
      actualCurrentDailyRate,
      projectedCompletionDate: projectedCompletionDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      isAheadOfSchedule,
    },
  };
}

export async function getDateActivityDetails(
  dateStr: string, // "YYYY-MM-DD"
  userId: string = DEFAULT_USER_ID
) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  const [studySessions, practiceSessions, completedTasks, chapters] = await Promise.all([
    prisma.studySession.findMany({
      where: {
        userId,
        date: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { date: "desc" },
    }),
    prisma.practiceSession.findMany({
      where: {
        userId,
        date: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        chapter: { include: { subject: true } },
      },
      orderBy: { date: "desc" },
    }),
    prisma.task.findMany({
      where: {
        userId,
        status: "COMPLETED",
        OR: [
          { completedAt: { gte: startOfDay, lte: endOfDay } },
          { dueDate: { gte: startOfDay, lte: endOfDay } },
        ],
      },
      include: {
        chapter: { include: { subject: true } },
      },
    }),
    prisma.chapter.findMany({
      include: { subject: true },
    }),
  ]);

  const chapterMap = new Map(chapters.map((c) => [c.id, c]));

  const enrichedStudySessions = studySessions.map((s) => ({
    ...s,
    chapter: s.chapterId ? chapterMap.get(s.chapterId) : null,
  }));

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalQuestions = practiceSessions.reduce((acc, p) => acc + p.questions, 0);
  const independentCount = practiceSessions.reduce((acc, p) => acc + p.correctIndependent, 0);
  const assistedCount = practiceSessions.reduce((acc, p) => acc + p.assisted, 0);
  const wrongCount = practiceSessions.reduce((acc, p) => acc + p.wrong, 0);
  const accuracy = totalQuestions > 0 ? Math.round((independentCount / totalQuestions) * 100) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = dateStr === todayStr;

  return {
    dateStr,
    isToday,
    totalStudyMinutes,
    totalStudyHours: Math.round((totalStudyMinutes / 60) * 10) / 10,
    totalQuestions,
    independentCount,
    assistedCount,
    wrongCount,
    accuracy,
    studySessions: enrichedStudySessions,
    practiceSessions,
    completedTasks,
  };
}
