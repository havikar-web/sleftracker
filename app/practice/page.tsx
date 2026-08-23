import { getPracticeHistory } from "@/lib/actions/practice-actions";
import { getAnalyticsOverview } from "@/lib/actions/analytics-actions";
import { PracticeHubView } from "@/components/practice/practice-hub-view";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function PracticePage() {
  const DEFAULT_USER_ID = "jee_student_primary";

  const [practiceHistory, overview, rawChapters] = await Promise.all([
    getPracticeHistory({ userId: DEFAULT_USER_ID, limit: 50 }),
    getAnalyticsOverview(DEFAULT_USER_ID),
    prisma.chapter.findMany({
      include: { subject: true },
      orderBy: [{ subject: { displayOrder: "asc" } }, { classLevel: "asc" }, { displayOrder: "asc" }],
    }),
  ]);

  const allChapters = rawChapters.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    subjectName: c.subject.name,
    subjectId: c.subjectId,
    color: c.subject.color,
    classLevel: c.classLevel,
  }));

  const stats = {
    totalQuestions: overview.totalQuestions,
    independentAccuracy: overview.independentAccuracy,
    assistedQuestions: overview.assistedQuestions,
    wrongQuestions: overview.wrongQuestions,
  };

  return (
    <PracticeHubView
      practiceHistory={practiceHistory}
      stats={stats}
      allChapters={allChapters}
    />
  );
}
