"use server";

import { prisma } from "@/lib/prisma";
import { logStudySession } from "@/lib/actions/study-actions";
import { logPracticeSession } from "@/lib/actions/practice-actions";
import { calculateChapterReadiness } from "@/lib/readiness";
import { ParsedActivity } from "@/lib/nlp-log-parser";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "jee_student_primary";

export async function executeNaturalLanguageLogs(
  activities: ParsedActivity[],
  userId: string = DEFAULT_USER_ID
) {
  if (!activities || activities.length === 0) {
    return { success: false, error: "No activities provided to log" };
  }

  let totalLoggedMinutes = 0;
  let totalLoggedQuestions = 0;
  const executedSummaries: any[] = [];

  for (const act of activities) {
    // 1. Resolve chapter and subject ID
    let chapter = null;
    if (act.chapterId) {
      chapter = await prisma.chapter.findUnique({
        where: { id: act.chapterId },
        include: { subject: true },
      });
    } else if (act.chapterName) {
      chapter = await prisma.chapter.findFirst({
        where: {
          OR: [
            { name: { contains: act.chapterName, mode: "insensitive" } },
            { slug: { contains: act.chapterName.toLowerCase().replace(/\s+/g, "-") } },
          ],
        },
        include: { subject: true },
      });
    }

    const durationMinutes = Math.max(1, act.durationMinutes || 30);
    totalLoggedMinutes += durationMinutes;

    // 2. Save Study Session
    await logStudySession({
      userId,
      durationMinutes,
      chapterId: chapter?.id,
      notes: `AI Quick Log (${act.activityType}): ${act.notes}`,
    });

    // 3. Save Practice Session if questions were solved
    if (act.questions > 0 && chapter) {
      totalLoggedQuestions += act.questions;
      await logPracticeSession({
        userId,
        chapterId: chapter.id,
        subjectId: chapter.subjectId,
        source: act.source || "JEE_MAIN_PYQ",
        questions: act.questions,
        correctIndependent: act.correctIndependent || 0,
        assisted: act.assisted || 0,
        wrong: act.wrong || 0,
        durationMinutes,
        difficulty: "MEDIUM",
        notes: `AI Quick Log: ${act.notes}`,
      });
    }

    executedSummaries.push({
      chapterName: chapter?.name || act.chapterName || "General Study",
      subjectName: chapter?.subject?.name || act.subjectName || "General",
      durationMinutes,
      questions: act.questions,
      activityType: act.activityType,
    });
  }

  revalidatePath("/");
  revalidatePath("/analytics");
  revalidatePath("/syllabus");
  revalidatePath("/focus");

  return {
    success: true,
    totalLoggedMinutes,
    totalLoggedQuestions,
    executedCount: activities.length,
    executedSummaries,
  };
}
