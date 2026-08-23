import { getTodayTasks } from "@/lib/actions/task-actions";
import { getAnalyticsOverview } from "@/lib/actions/analytics-actions";
import { getRoadmapData } from "@/lib/actions/roadmap-actions";
import { getRevisionsGrouped } from "@/lib/actions/revision-actions";
import { calculateDailyStudyPacing } from "@/lib/pacing";
import { TodayCommandCenter } from "@/components/today/today-command-center";
import { prisma } from "@/lib/prisma";

export const revalidate = 0; // Dynamic server component

export default async function TodayPage() {
  const DEFAULT_USER_ID = "jee_student_primary";

  const [user, tasks, overview, roadmapData, revisionsSummary, rawChapters, pacing] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: DEFAULT_USER_ID } }),
      getTodayTasks(DEFAULT_USER_ID),
      getAnalyticsOverview(DEFAULT_USER_ID),
      getRoadmapData(DEFAULT_USER_ID),
      getRevisionsGrouped(DEFAULT_USER_ID),
      prisma.chapter.findMany({
        include: { subject: true },
        orderBy: [{ subject: { displayOrder: "asc" } }, { classLevel: "asc" }, { displayOrder: "asc" }],
      }),
      calculateDailyStudyPacing(DEFAULT_USER_ID),
    ]);

  const allChapters = rawChapters.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    subjectName: c.subject.name,
    subjectId: c.subjectId,
    color: c.subject.color,
    classLevel: c.classLevel,
    historicalPriority: c.historicalPriority || 75,
    estimatedHours: c.estimatedHours || 12,
  }));

  const activePhase = roadmapData?.roadmap.phases[0] || null;
  const roadmapSummary = {
    phaseCompletion: activePhase?.phaseCompletion || 0,
    daysBehind: roadmapData?.overallMetrics?.daysBehind || 0,
  };

  return (
    <TodayCommandCenter
      user={user}
      overview={overview}
      tasks={tasks}
      roadmapSummary={roadmapSummary}
      revisionsSummary={revisionsSummary}
      allChapters={allChapters}
      pacing={pacing}
    />
  );
}
