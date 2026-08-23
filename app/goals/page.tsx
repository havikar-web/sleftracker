import { getGoalsWithComputedProgress } from "@/lib/actions/goal-actions";
import { GoalsView } from "@/components/goals/goals-view";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function GoalsPage() {
  const DEFAULT_USER_ID = "jee_student_primary";

  const [goals, rawChapters] = await Promise.all([
    getGoalsWithComputedProgress(DEFAULT_USER_ID),
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

  return <GoalsView goals={goals} allChapters={allChapters} />;
}
