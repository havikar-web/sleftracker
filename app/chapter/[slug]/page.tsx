import { notFound } from "next/navigation";
import { getChapterBySlug } from "@/lib/actions/chapter-actions";
import { ChapterDetailView } from "@/components/chapter/chapter-detail-view";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function ChapterPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const DEFAULT_USER_ID = "jee_student_primary";

  const [data, rawChapters] = await Promise.all([
    getChapterBySlug(params.slug, DEFAULT_USER_ID),
    prisma.chapter.findMany({
      include: { subject: true },
      orderBy: [{ subject: { displayOrder: "asc" } }, { classLevel: "asc" }, { displayOrder: "asc" }],
    }),
  ]);

  if (!data || !data.chapter) {
    notFound();
  }

  const allChapters = rawChapters.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    subjectName: c.subject.name,
    subjectId: c.subjectId,
    color: c.subject.color,
    classLevel: c.classLevel,
  }));

  return (
    <ChapterDetailView
      chapter={data.chapter}
      progress={data.progress}
      readiness={data.readiness}
      priority={data.priority}
      diagnostic={data.diagnostic}
      sourceBreakdown={data.sourceBreakdown}
      allChapters={allChapters}
    />
  );
}
