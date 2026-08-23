import { getAllTests } from "@/lib/actions/test-actions";
import { TestsView } from "@/components/tests/tests-view";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function TestsPage() {
  const DEFAULT_USER_ID = "jee_student_primary";

  const [tests, rawChapters] = await Promise.all([
    getAllTests(DEFAULT_USER_ID),
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

  return <TestsView tests={tests} allChapters={allChapters} />;
}
