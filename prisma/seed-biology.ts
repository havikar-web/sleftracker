import { PrismaClient } from "@prisma/client";
import { SYLLABUS_DATA } from "./syllabus-data";

const prisma = new PrismaClient();
const DEFAULT_USER_ID = "jee_student_primary";

async function main() {
  console.log("🌱 Starting Biology Syllabus Sync...");

  // Find Biology subject from SYLLABUS_DATA
  const bioData = SYLLABUS_DATA.find((s) => s.name === "Biology");
  if (!bioData) {
    console.error("❌ Biology data not found in SYLLABUS_DATA");
    return;
  }

  // 1. Upsert Subject
  const subject = await prisma.subject.upsert({
    where: { name: bioData.name },
    update: {
      shortName: bioData.shortName,
      displayOrder: bioData.displayOrder,
      color: bioData.color,
    },
    create: {
      name: bioData.name,
      shortName: bioData.shortName,
      displayOrder: bioData.displayOrder,
      color: bioData.color,
    },
  });
  console.log(`✅ Subject created/updated: ${subject.name} (${subject.id})`);

  // 2. Upsert Chapters & Topics
  let chapOrder = 1;
  for (const chapData of bioData.chapters) {
    const chapter = await prisma.chapter.upsert({
      where: { slug: chapData.slug },
      update: {
        subjectId: subject.id,
        classLevel: chapData.classLevel,
        name: chapData.name,
        displayOrder: chapOrder,
        historicalPriority: chapData.historicalPriority,
        estimatedHours: chapData.estimatedHours,
        defaultQuestionTarget: chapData.defaultQuestionTarget,
        defaultPYQTarget: chapData.defaultPYQTarget,
      },
      create: {
        subjectId: subject.id,
        classLevel: chapData.classLevel,
        name: chapData.name,
        slug: chapData.slug,
        displayOrder: chapOrder,
        historicalPriority: chapData.historicalPriority,
        estimatedHours: chapData.estimatedHours,
        defaultQuestionTarget: chapData.defaultQuestionTarget,
        defaultPYQTarget: chapData.defaultPYQTarget,
      },
    });

    // Upsert Topics for this chapter
    let topOrder = 1;
    for (const topName of chapData.topics) {
      const existing = await prisma.topic.findFirst({
        where: {
          chapterId: chapter.id,
          name: topName,
        },
      });

      if (!existing) {
        await prisma.topic.create({
          data: {
            chapterId: chapter.id,
            name: topName,
            displayOrder: topOrder,
          },
        });
      }
      topOrder++;
    }

    // Ensure ChapterProgress exists for primary user
    await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId: DEFAULT_USER_ID,
          chapterId: chapter.id,
        },
      },
      update: {},
      create: {
        userId: DEFAULT_USER_ID,
        chapterId: chapter.id,
        theoryScore: 0,
        questionsSolved: 0,
        pyqsSolved: 0,
        correctIndependent: 0,
        wrong: 0,
        assisted: 0,
        readinessScore: 0,
        status: "NOT_STARTED",
      },
    });

    console.log(`  ✓ Chapter [${chapOrder}/31]: ${chapter.name} (${chapData.topics.length} topics)`);
    chapOrder++;
  }

  console.log("🎉 Successfully synced all 31 Biology chapters to database!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
