import React from "react";
import { prisma } from "@/lib/prisma";
import { FocusSessionView } from "@/components/focus/focus-session-view";

export const dynamic = "force-dynamic";

export default async function FocusPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const targetChapterSlug = resolvedSearchParams?.chapter;

  const chapters = await prisma.chapter.findMany({
    include: {
      subject: true,
      topics: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: [
      { subject: { displayOrder: "asc" } },
      { classLevel: "asc" },
      { displayOrder: "asc" },
    ],
  });

  const formattedChapters = chapters.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    subjectId: c.subjectId,
    subjectName: c.subject.name,
    classLevel: c.classLevel,
    historicalPriority: c.historicalPriority || 75,
    topics: c.topics.map((t) => ({
      id: t.id,
      name: t.name,
    })),
  }));

  const defaultChap = targetChapterSlug
    ? formattedChapters.find((c) => c.slug === targetChapterSlug)?.id
    : formattedChapters[0]?.id;

  return (
    <div className="py-2">
      <FocusSessionView
        allChapters={formattedChapters}
        defaultChapterId={defaultChap}
      />
    </div>
  );
}
