import { prisma } from "@/lib/prisma";
import { BiologyTrackView } from "@/components/biology/biology-track-view";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function BiologyPage() {
  const DEFAULT_USER_ID = "jee_student_primary";

  // Fetch Biology Subject with chapters and progress
  const bioSubject = await prisma.subject.findUnique({
    where: { name: "Biology" },
    include: {
      chapters: {
        include: {
          topics: {
            orderBy: { displayOrder: "asc" },
          },
          progress: {
            where: { userId: DEFAULT_USER_ID },
          },
        },
        orderBy: [{ classLevel: "asc" }, { displayOrder: "asc" }],
      },
    },
  });

  if (!bioSubject) {
    notFound();
  }

  // Fetch practice sessions for Biology
  const bioPracticeHistory = await prisma.practiceSession.findMany({
    where: {
      userId: DEFAULT_USER_ID,
      subjectId: bioSubject.id,
    },
    orderBy: { date: "desc" },
    take: 20,
    include: {
      chapter: true,
      subject: true,
    },
  });

  const totalQuestions = bioPracticeHistory.reduce((acc, s) => acc + s.questions, 0);

  const formattedChapters = bioSubject.chapters.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    classLevel: c.classLevel,
    historicalPriority: c.historicalPriority,
    estimatedHours: c.estimatedHours,
    hoursRange: `${Math.round(c.estimatedHours * 0.8)}–${Math.round(c.estimatedHours * 1.2)} Hours`,
    defaultQuestionTarget: c.defaultQuestionTarget,
    defaultPYQTarget: c.defaultPYQTarget,
    subjectId: bioSubject.id,
    subjectName: bioSubject.name,
    topics: c.topics,
    progress: c.progress,
  }));

  return (
    <BiologyTrackView
      subject={bioSubject}
      chapters={formattedChapters}
      stats={{
        totalQuestions,
        practiceCount: bioPracticeHistory.length,
      }}
    />
  );
}
