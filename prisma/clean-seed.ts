import { PrismaClient } from "@prisma/client";
import { SYLLABUS_DATA } from "./syllabus-data";

const prisma = new PrismaClient();
const DEFAULT_USER_ID = "jee_student_primary";

async function main() {
  console.log("🧹 Running clean reset seed with 100% exact official master chapters & hours...");

  // 1. Clean previous user activities and relations
  await prisma.task.deleteMany({ where: { userId: DEFAULT_USER_ID } });
  await prisma.practiceSession.deleteMany({ where: { userId: DEFAULT_USER_ID } });
  await prisma.studySession.deleteMany({ where: { userId: DEFAULT_USER_ID } });
  await prisma.testError.deleteMany({ where: { test: { userId: DEFAULT_USER_ID } } });
  await prisma.testChapter.deleteMany({ where: { test: { userId: DEFAULT_USER_ID } } });
  await prisma.test.deleteMany({ where: { userId: DEFAULT_USER_ID } });
  await prisma.revision.deleteMany({ where: { userId: DEFAULT_USER_ID } });
  await prisma.readinessSnapshot.deleteMany({ where: { userId: DEFAULT_USER_ID } });
  await prisma.goalMetric.deleteMany({ where: { goal: { userId: DEFAULT_USER_ID } } });
  await prisma.goal.deleteMany({ where: { userId: DEFAULT_USER_ID } });
  await prisma.roadmapChapter.deleteMany({});
  await prisma.roadmapPhase.deleteMany({});
  await prisma.roadmap.deleteMany({});
  await prisma.chapterProgress.deleteMany({});
  await prisma.topicProgress.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.chapter.deleteMany({});

  // 2. Provision User with January 1, 2027 Target
  const targetDate = new Date("2027-01-01T00:00:00.000Z");

  const user = await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {
      name: "JEE Aspirant",
      targetExam: "JEE MAIN 2027",
      targetDate: targetDate,
      currentClass: "Class 11",
      dailyStudyHours: 6.0,
      dailyQuestionTarget: 80,
      weeklyQuestionTarget: 500,
    },
    create: {
      id: DEFAULT_USER_ID,
      name: "JEE Aspirant",
      email: "aspirant@jee-os.internal",
      targetExam: "JEE MAIN 2027",
      targetDate: targetDate,
      currentClass: "Class 11",
      dailyStudyHours: 6.0,
      dailyQuestionTarget: 80,
      weeklyQuestionTarget: 500,
      timezone: "Asia/Kolkata",
      theme: "dark",
    },
  });
  console.log(`👤 Provisioned user with Target Date: ${targetDate.toISOString().split("T")[0]}`);

  // 3. Seed Subjects, Chapters, and Topics
  const chapterMap: Record<string, string> = {};
  let totalHoursSum = 0;
  let totalChaptersCount = 0;

  for (const subData of SYLLABUS_DATA) {
    const subject = await prisma.subject.upsert({
      where: { name: subData.name },
      update: {
        shortName: subData.shortName,
        displayOrder: subData.displayOrder,
        color: subData.color,
      },
      create: {
        name: subData.name,
        shortName: subData.shortName,
        displayOrder: subData.displayOrder,
        color: subData.color,
      },
    });

    let chapOrder = 1;
    for (const chapData of subData.chapters) {
      totalHoursSum += chapData.estimatedHours;
      totalChaptersCount++;

      const chapter = await prisma.chapter.create({
        data: {
          subjectId: subject.id,
          classLevel: chapData.classLevel,
          name: chapData.name,
          slug: chapData.slug,
          displayOrder: chapOrder,
          historicalPriority: chapData.historicalPriority,
          estimatedHours: chapData.estimatedHours,
          defaultQuestionTarget: chapData.defaultQuestionTarget,
          defaultPYQTarget: chapData.defaultPYQTarget,
          prerequisiteIds: chapData.prerequisiteSlugs || [],
        },
      });

      chapterMap[chapData.slug] = chapter.id;

      // Seed Topics
      let topicOrder = 1;
      for (const topicName of chapData.topics) {
        await prisma.topic.create({
          data: {
            chapterId: chapter.id,
            name: topicName,
            displayOrder: topicOrder,
          },
        });
        topicOrder++;
      }

      // Initialize clean 0% progress for every chapter
      await prisma.chapterProgress.create({
        data: {
          userId: user.id,
          chapterId: chapter.id,
          theoryScore: 0,
          practiceScore: 0,
          pyqScore: 0,
          accuracyScore: 0,
          testScore: 0,
          revisionScore: 0,
          readinessScore: 0,
          status: "NOT_STARTED",
          questionsSolved: 0,
          pyqsSolved: 0,
          correctIndependent: 0,
          wrong: 0,
          assisted: 0,
          studyMinutes: 0,
        },
      });

      chapOrder++;
    }
  }

  console.log(`📚 Seeded ${totalChaptersCount} chapters across PCM with ${totalHoursSum} Total Mastery Hours.`);

  // 4. Seed Clean Roadmap
  const roadmap = await prisma.roadmap.create({
    data: {
      userId: user.id,
      name: "JEE Main 2027 Master Roadmap",
      startDate: new Date(),
      targetDate: targetDate,
    },
  });

  const phasesData = [
    {
      name: "Phase 1: High Yield & Core Prerequisites",
      description: "High weightage foundational pillars across Physics, Chemistry, and Mathematics.",
      order: 1,
      startDate: new Date(),
      endDate: new Date("2026-10-15"),
      chapters: [
        "units-dimensions-measurement",
        "kinematics",
        "laws-of-motion",
        "work-energy-power",
        "gravitation",
        "general-organic-chemistry",
        "chemical-bonding-molecular-structure",
        "mole-concept-stoichiometry",
        "periodic-table-periodicity",
        "sets-relations-functions",
        "complex-numbers-and-quadratics",
        "sequences-and-series",
        "straight-lines-and-circles",
      ],
    },
    {
      name: "Phase 2: Mechanics, Physical Chem & Calculus Core",
      description: "Rotational dynamics, electrostatics, thermodynamics, organic functional groups, and calculus.",
      order: 2,
      startDate: new Date("2026-10-16"),
      endDate: new Date("2026-11-30"),
      chapters: [
        "rotational-motion",
        "thermodynamics-physics",
        "electrostatics",
        "current-electricity",
        "equilibrium-chemical-ionic",
        "chemical-thermodynamics",
        "hydrocarbons",
        "haloalkanes-and-haloarenes",
        "differential-calculus",
        "integral-calculus",
        "conic-sections",
      ],
    },
    {
      name: "Phase 3: Advanced Electromagnetism, Inorganic & Vectors/3D",
      description: "Magnetism, AC, Optics, Modern Physics, Coordination chemistry, Vectors & 3D Geometry before Jan 1st.",
      order: 3,
      startDate: new Date("2026-12-01"),
      endDate: new Date("2027-01-01"),
      chapters: [
        "magnetic-effects-and-magnetism",
        "emi-and-ac",
        "ray-optics",
        "wave-optics",
        "atoms-and-nuclei",
        "semiconductor-electronics",
        "coordination-compounds",
        "aldehydes-ketones-carboxylic-acids",
        "d-and-f-block-elements",
        "vector-algebra",
        "three-dimensional-geometry",
        "matrices-and-determinants",
        "probability-and-statistics",
      ],
    },
  ];

  for (const p of phasesData) {
    const newPhase = await prisma.roadmapPhase.create({
      data: {
        roadmapId: roadmap.id,
        name: p.name,
        description: p.description,
        order: p.order,
        startDate: p.startDate,
        endDate: p.endDate,
      },
    });

    let rChapOrder = 1;
    for (const slug of p.chapters) {
      const cId = chapterMap[slug];
      if (cId) {
        await prisma.roadmapChapter.create({
          data: {
            phaseId: newPhase.id,
            chapterId: cId,
            order: rChapOrder,
            suggestedTargetDate: new Date(p.endDate),
          },
        });
        rChapOrder++;
      }
    }
  }

  // 5. Seed Starter Target Task for Week
  const kinId = chapterMap["kinematics"];
  const physSubject = await prisma.subject.findFirst({ where: { name: "Physics" } });

  if (kinId && physSubject) {
    await prisma.task.create({
      data: {
        userId: user.id,
        title: "Kinematics (1D & 2D): Target Chapter (50 Questions)",
        taskType: "QUESTIONS",
        targetType: "QUESTIONS",
        targetValue: 50,
        completedValue: 0,
        priority: "CRITICAL",
        chapterId: kinId,
        subjectId: physSubject.id,
        estimatedMinutes: 100,
        status: "IN_PROGRESS",
        order: 1,
        notes: "Target Chapter: Kinematics (1D & 2D). Solve 50 questions to build chapter readiness.",
      },
    });
  }

  console.log("✨ Clean seed successfully completed with exact master list!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
