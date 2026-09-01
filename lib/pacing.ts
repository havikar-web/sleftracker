import { prisma } from "@/lib/prisma";
import { getDaysUntil } from "@/lib/utils";

export interface PacingMetrics {
  targetExam: string;
  targetDate: string;
  daysRemaining: number;
  weeksRemaining: number;
  
  // Total Syllabus Mastery Hours
  totalSyllabusHours: number;
  completedHours: number;
  remainingHours: number;
  
  // Daily Required Study Pace
  requiredDailyStudyHours: number;
  requiredDailyStudyMinutes: number;
  
  // Daily Required Questions Pace
  totalQuestionTarget: number;
  completedQuestions: number;
  remainingQuestions: number;
  requiredDailyQuestions: number;
  
  // Subject Breakdowns (PCM Core JEE)
  subjectBreakdown: {
    name: string;
    shortName: string;
    color: string;
    totalHours: number;
    completedHours: number;
    remainingHours: number;
    requiredDailyHours: number;
    requiredDailyMinutes: number;
    chapterCount: number;
  }[];

  // Biology Side Track (Isolated from core JEE pacing)
  biologySummary?: {
    name: string;
    shortName: string;
    color: string;
    chapterCount: number;
    totalHours: number;
    completedHours: number;
    remainingHours: number;
    totalQuestionsTarget: number;
    completedQuestions: number;
    readiness: number;
  } | null;
  
  // Pacing Health & Status
  todayLoggedMinutes: number;
  todayLoggedHours: number;
  todayLoggedQuestions: number;
  pacingHealth: "ON_TRACK" | "WARNING" | "CRITICAL";
  pacingMessage: string;
}

export async function calculateDailyStudyPacing(userId: string = "jee_student_primary"): Promise<PacingMetrics> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studySessions: true,
      practiceSessions: true,
      chapterProgress: true,
    },
  });

  const targetDateStr = user?.targetDate ? user.targetDate.toISOString().split("T")[0] : "2027-01-01";
  const daysRemaining = Math.max(1, getDaysUntil(targetDateStr));
  const weeksRemaining = Math.max(1, Math.round(daysRemaining / 7));

  // Fetch all subjects and chapters
  const subjects = await prisma.subject.findMany({
    include: {
      chapters: {
        include: {
          progress: {
            where: { userId },
          },
        },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  // Separate core JEE PCM subjects from Biology side track
  const pcmSubjects = subjects.filter((s) => s.name !== "Biology");
  const bioSubject = subjects.find((s) => s.name === "Biology");

  let totalSyllabusHours = 0;
  let completedHours = 0;
  let totalQuestionTarget = 0;
  let completedQuestions = 0;

  // Calculate today's logged study minutes
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStudySessions = await prisma.studySession.findMany({
    where: {
      userId,
      date: { gte: today },
    },
  });
  const todayLoggedMinutes = todayStudySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todayLoggedHours = Math.round((todayLoggedMinutes / 60) * 10) / 10;

  const todayPracticeSessions = await prisma.practiceSession.findMany({
    where: {
      userId,
      date: { gte: today },
    },
  });
  const todayLoggedQuestions = todayPracticeSessions.reduce((acc, s) => acc + s.questions, 0);

  // Subject breakdown for PCM core JEE
  const subjectBreakdown = pcmSubjects.map((sub) => {
    let subTotalHours = 0;
    let subCompletedHours = 0;
    let subQuestionsTarget = 0;
    let subCompletedQuestions = 0;

    for (const chap of sub.chapters) {
      const chapHours = chap.estimatedHours || 12;
      const chapTargetQ = chap.defaultQuestionTarget || 100;
      const progress = chap.progress[0];
      const readiness = progress?.readinessScore || 0;
      const qSolved = progress?.questionsSolved || 0;
      const studyMins = progress?.studyMinutes || 0;

      subTotalHours += chapHours;
      // Proportional completed hours based on mastery/study minutes
      const chapCompletedH = Math.min(chapHours, Math.round((studyMins / 60) * 10) / 10 + (readiness >= 90 ? chapHours : (readiness / 100) * chapHours));
      subCompletedHours += chapCompletedH;

      subQuestionsTarget += chapTargetQ;
      subCompletedQuestions += qSolved;
    }

    totalSyllabusHours += subTotalHours;
    completedHours += subCompletedHours;
    totalQuestionTarget += subQuestionsTarget;
    completedQuestions += subCompletedQuestions;

    const subRemainingHours = Math.max(0, subTotalHours - subCompletedHours);
    const subRequiredDailyHours = Math.round((subRemainingHours / daysRemaining) * 10) / 10;
    const subRequiredDailyMinutes = Math.round((subRemainingHours / daysRemaining) * 60);

    return {
      name: sub.name,
      shortName: sub.shortName,
      color: sub.color,
      totalHours: subTotalHours,
      completedHours: Math.round(subCompletedHours * 10) / 10,
      remainingHours: Math.round(subRemainingHours * 10) / 10,
      requiredDailyHours: subRequiredDailyHours,
      requiredDailyMinutes: subRequiredDailyMinutes,
      chapterCount: sub.chapters.length,
    };
  });

  // Calculate Biology Side Track summary separately
  let biologySummary = null;
  if (bioSubject) {
    let bioTotalH = 0;
    let bioCompletedH = 0;
    let bioQTarget = 0;
    let bioQDone = 0;
    let bioReadinessSum = 0;

    for (const chap of bioSubject.chapters) {
      bioTotalH += chap.estimatedHours || 12;
      const progress = chap.progress[0];
      const readiness = progress?.readinessScore || 0;
      bioReadinessSum += readiness;
      bioQDone += progress?.questionsSolved || 0;
      bioQTarget += chap.defaultQuestionTarget || 120;
      const studyMins = progress?.studyMinutes || 0;
      const chapCompletedH = Math.min(chap.estimatedHours || 12, Math.round((studyMins / 60) * 10) / 10 + (readiness >= 90 ? (chap.estimatedHours || 12) : (readiness / 100) * (chap.estimatedHours || 12)));
      bioCompletedH += chapCompletedH;
    }

    biologySummary = {
      name: "Biology",
      shortName: "BIO",
      color: "#a855f7",
      chapterCount: bioSubject.chapters.length,
      totalHours: bioTotalH,
      completedHours: Math.round(bioCompletedH * 10) / 10,
      remainingHours: Math.max(0, Math.round((bioTotalH - bioCompletedH) * 10) / 10),
      totalQuestionsTarget: bioQTarget,
      completedQuestions: bioQDone,
      readiness: bioSubject.chapters.length > 0 ? Math.round(bioReadinessSum / bioSubject.chapters.length) : 0,
    };
  }

  const remainingHours = Math.max(0, totalSyllabusHours - completedHours);
  const requiredDailyStudyHours = Math.round((remainingHours / daysRemaining) * 10) / 10;
  const requiredDailyStudyMinutes = Math.round((remainingHours / daysRemaining) * 60);

  const remainingQuestions = Math.max(0, totalQuestionTarget - completedQuestions);
  const requiredDailyQuestions = Math.max(20, Math.round(remainingQuestions / daysRemaining));

  // Determine pacing health
  let pacingHealth: "ON_TRACK" | "WARNING" | "CRITICAL" = "ON_TRACK";
  let pacingMessage = `Target: ${requiredDailyStudyHours}h study & ${requiredDailyQuestions} MCQs per day to master the entire JEE syllabus before Jan 1st 2027.`;

  if (requiredDailyStudyHours > 9.0) {
    pacingHealth = "CRITICAL";
    pacingMessage = `Urgent Pace Warning: Achieving Jan 1st completion requires ${requiredDailyStudyHours}h/day. Prioritize High-ROI (85%+) chapters immediately.`;
  } else if (requiredDailyStudyHours > 7.0) {
    pacingHealth = "WARNING";
    pacingMessage = `Intensive Study Pace: Maintain ${requiredDailyStudyHours}h/day across PCM to stay on track.`;
  }

  return {
    targetExam: user?.targetExam || "JEE MAIN 2027",
    targetDate: targetDateStr,
    daysRemaining,
    weeksRemaining,
    totalSyllabusHours,
    completedHours: Math.round(completedHours * 10) / 10,
    remainingHours: Math.round(remainingHours * 10) / 10,
    requiredDailyStudyHours,
    requiredDailyStudyMinutes,
    totalQuestionTarget,
    completedQuestions,
    remainingQuestions,
    requiredDailyQuestions,
    subjectBreakdown,
    biologySummary,
    todayLoggedMinutes,
    todayLoggedHours,
    todayLoggedQuestions,
    pacingHealth,
    pacingMessage,
  };
}
