import { PrismaClient } from "@prisma/client";
import { SYLLABUS_DATA } from "./syllabus-data";

const prisma = new PrismaClient();

const DEFAULT_USER_ID = "jee_student_primary";

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Create or upsert Default User
  const user = await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: {
      id: DEFAULT_USER_ID,
      name: "JEE Aspirant",
      email: "aspirant@jee-os.internal",
      targetExam: "JEE Main + Advanced 2027",
      targetDate: new Date("2027-05-01T00:00:00.000Z"),
      currentClass: "Class 11",
      dailyStudyHours: 7.0,
      dailyQuestionTarget: 120,
      weeklyQuestionTarget: 700,
      timezone: "Asia/Kolkata",
      theme: "dark",
    },
  });
  console.log(`👤 User provisioned: ${user.name} (${user.id})`);

  // 2. Clear previous syllabus data cleanly if needed or upsert
  console.log("📚 Seeding Subjects, Chapters, and Topics...");
  const chapterMap: Record<string, string> = {}; // slug -> id

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
          prerequisiteIds: chapData.prerequisiteSlugs || [],
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
          prerequisiteIds: chapData.prerequisiteSlugs || [],
        },
      });

      chapterMap[chapData.slug] = chapter.id;

      // Seed Topics
      let topicOrder = 1;
      for (const topicName of chapData.topics) {
        // Find existing topic or create
        const existing = await prisma.topic.findFirst({
          where: {
            chapterId: chapter.id,
            name: topicName,
          },
        });

        if (!existing) {
          await prisma.topic.create({
            data: {
              chapterId: chapter.id,
              name: topicName,
              displayOrder: topicOrder,
            },
          });
        }
        topicOrder++;
      }

      chapOrder++;
    }
  }

  console.log("✅ Syllabus seeded successfully.");

  // 3. Seed Preloaded Roadmap & Phases
  console.log("🗺️ Seeding Roadmap & Phases...");
  let roadmap = await prisma.roadmap.findFirst({
    where: { userId: user.id },
  });

  if (!roadmap) {
    roadmap = await prisma.roadmap.create({
      data: {
        userId: user.id,
        name: "Main JEE 2027 Master Roadmap",
        startDate: new Date("2026-08-01"),
        targetDate: new Date("2027-04-30"),
      },
    });
  }

  const phasesData = [
    {
      name: "Phase 1: High ROI & Foundations",
      description: "High weightage, scoring prerequisite pillars across PCM.",
      order: 1,
      startDate: new Date("2026-08-01"),
      endDate: new Date("2026-09-30"),
      chapters: [
        "units-and-measurements",
        "gravitation",
        "electrostatics",
        "current-electricity",
        "mole-concept",
        "goc",
        "chemical-bonding",
        "thermodynamics-chemistry",
        "limits",
        "straight-lines",
        "sequences-and-series",
        "quadratic-equations",
      ],
    },
    {
      name: "Phase 2: Core Coverage",
      description: "Fundamental mechanics, physical chemistry, coordinate geometry, and calculus foundations.",
      order: 2,
      startDate: new Date("2026-10-01"),
      endDate: new Date("2026-11-30"),
      chapters: [
        "kinematics",
        "laws-of-motion",
        "work-energy-power",
        "coordination-compounds",
        "hydrocarbons",
        "ionic-equilibrium",
        "circle",
        "continuity",
        "differentiability",
        "aod",
        "matrices",
        "determinants",
      ],
    },
    {
      name: "Phase 3: Deep Syllabus Completion",
      description: "Rotational dynamics, organic reaction chains, integral calculus, 3D geometry & electromagnetism.",
      order: 3,
      startDate: new Date("2026-12-01"),
      endDate: new Date("2027-01-31"),
      chapters: [
        "rotational-motion",
        "ray-optics",
        "wave-optics",
        "moving-charges-magnetism",
        "emi",
        "alternating-current",
        "haloalkanes-haloarenes",
        "alcohols-phenols-ethers",
        "aldehydes-ketones",
        "indefinite-integration",
        "definite-integration",
        "vector-algebra",
        "three-dimensional-geometry",
        "probability-12",
      ],
    },
    {
      name: "Phase 4: Consolidation & High-Yield Revision",
      description: "Modern physics, semiconductors, d-block, biomolecules, error log remediation & targeted revision.",
      order: 4,
      startDate: new Date("2027-02-01"),
      endDate: new Date("2027-03-15"),
      chapters: [
        "dual-nature",
        "atomic-physics",
        "nuclear-physics",
        "semiconductors",
        "d-and-f-block",
        "amines-diazonium",
        "biomolecules-chemistry",
        "differential-equations",
        "area-under-curves",
      ],
    },
    {
      name: "Phase 5: Full Mock & Exam Mode",
      description: "Full-length CBT timed mock tests, paper analysis, speed refinement and final polish.",
      order: 5,
      startDate: new Date("2027-03-16"),
      endDate: new Date("2027-04-30"),
      chapters: [],
    },
  ];

  for (const p of phasesData) {
    const existingPhase = await prisma.roadmapPhase.findFirst({
      where: { roadmapId: roadmap.id, order: p.order },
    });

    let phaseId = existingPhase?.id;
    if (!existingPhase) {
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
      phaseId = newPhase.id;
    }

    if (phaseId) {
      let rChapOrder = 1;
      for (const slug of p.chapters) {
        const cId = chapterMap[slug];
        if (cId) {
          const existingRC = await prisma.roadmapChapter.findFirst({
            where: { phaseId, chapterId: cId },
          });
          if (!existingRC) {
            await prisma.roadmapChapter.create({
              data: {
                phaseId,
                chapterId: cId,
                order: rChapOrder,
                suggestedTargetDate: new Date(p.endDate),
              },
            });
          }
          rChapOrder++;
        }
      }
    }
  }

  // 4. Seed Chapter Progress with Realistic Demo States
  console.log("📈 Seeding realistic Chapter Progress...");

  const demoProgressData: Array<{
    slug: string;
    theoryScore: number;
    practiceScore: number;
    pyqScore: number;
    accuracyScore: number;
    testScore: number;
    revisionScore: number;
    readinessScore: number;
    status: string;
    questionsSolved: number;
    pyqsSolved: number;
    correctIndependent: number;
    wrong: number;
    assisted: number;
    studyMinutes: number;
    lastStudiedAt: Date;
    lastRevisedAt?: Date;
  }> = [
    {
      slug: "gravitation",
      theoryScore: 100,
      practiceScore: 71,
      pyqScore: 72,
      accuracyScore: 74,
      testScore: 60,
      revisionScore: 40,
      readinessScore: 73,
      status: "PRACTISING",
      questionsSolved: 71,
      pyqsSolved: 43,
      correctIndependent: 52,
      wrong: 11,
      assisted: 8,
      studyMinutes: 402, // 6h 42m
      lastStudiedAt: new Date(),
      lastRevisedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "units-and-measurements",
      theoryScore: 100,
      practiceScore: 100,
      pyqScore: 100,
      accuracyScore: 90,
      testScore: 95,
      revisionScore: 90,
      readinessScore: 96,
      status: "MASTERED",
      questionsSolved: 80,
      pyqsSolved: 40,
      correctIndependent: 72,
      wrong: 4,
      assisted: 4,
      studyMinutes: 480,
      lastStudiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastRevisedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "current-electricity",
      theoryScore: 95,
      practiceScore: 75,
      pyqScore: 73,
      accuracyScore: 79,
      testScore: 70,
      revisionScore: 50,
      readinessScore: 75,
      status: "DEVELOPING",
      questionsSolved: 95,
      pyqsSolved: 55,
      correctIndependent: 75,
      wrong: 12,
      assisted: 8,
      studyMinutes: 520,
      lastStudiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastRevisedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "ray-optics",
      theoryScore: 80,
      practiceScore: 45,
      pyqScore: 40,
      accuracyScore: 68,
      testScore: 50,
      revisionScore: 20,
      readinessScore: 55,
      status: "PRACTISING",
      questionsSolved: 45,
      pyqsSolved: 25,
      correctIndependent: 35,
      wrong: 6,
      assisted: 4,
      studyMinutes: 310,
      lastStudiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "goc",
      theoryScore: 100,
      practiceScore: 85,
      pyqScore: 75,
      accuracyScore: 75,
      testScore: 72,
      revisionScore: 60,
      readinessScore: 82,
      status: "TEST_READY",
      questionsSolved: 140,
      pyqsSolved: 75,
      correctIndependent: 105,
      wrong: 20,
      assisted: 15,
      studyMinutes: 650,
      lastStudiedAt: new Date(),
      lastRevisedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "chemical-bonding",
      theoryScore: 60,
      practiceScore: 30,
      pyqScore: 25,
      accuracyScore: 62,
      testScore: 0,
      revisionScore: 0,
      readinessScore: 35,
      status: "LEARNING",
      questionsSolved: 35,
      pyqsSolved: 15,
      correctIndependent: 22,
      wrong: 8,
      assisted: 5,
      studyMinutes: 240,
      lastStudiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "coordination-compounds",
      theoryScore: 90,
      practiceScore: 60,
      pyqScore: 57,
      accuracyScore: 73,
      testScore: 55,
      revisionScore: 30,
      readinessScore: 65,
      status: "DEVELOPING",
      questionsSolved: 70,
      pyqsSolved: 40,
      correctIndependent: 51,
      wrong: 11,
      assisted: 8,
      studyMinutes: 420,
      lastStudiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "limits",
      theoryScore: 90,
      practiceScore: 65,
      pyqScore: 69,
      accuracyScore: 71,
      testScore: 45,
      revisionScore: 20,
      readinessScore: 64,
      status: "PRACTISING",
      questionsSolved: 85,
      pyqsSolved: 45,
      correctIndependent: 60,
      wrong: 15,
      assisted: 10,
      studyMinutes: 480,
      lastStudiedAt: new Date(),
    },
    {
      slug: "vector-algebra",
      theoryScore: 75,
      practiceScore: 45,
      pyqScore: 43,
      accuracyScore: 70,
      testScore: 40,
      revisionScore: 0,
      readinessScore: 50,
      status: "PRACTISING",
      questionsSolved: 55,
      pyqsSolved: 28,
      correctIndependent: 38,
      wrong: 10,
      assisted: 7,
      studyMinutes: 300,
      lastStudiedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "differential-equations",
      theoryScore: 60,
      practiceScore: 35,
      pyqScore: 33,
      accuracyScore: 65,
      testScore: 0,
      revisionScore: 0,
      readinessScore: 40,
      status: "LEARNING",
      questionsSolved: 40,
      pyqsSolved: 20,
      correctIndependent: 26,
      wrong: 8,
      assisted: 6,
      studyMinutes: 210,
      lastStudiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const dp of demoProgressData) {
    const cId = chapterMap[dp.slug];
    if (cId) {
      await prisma.chapterProgress.upsert({
        where: {
          userId_chapterId: {
            userId: user.id,
            chapterId: cId,
          },
        },
        update: {
          theoryScore: dp.theoryScore,
          practiceScore: dp.practiceScore,
          pyqScore: dp.pyqScore,
          accuracyScore: dp.accuracyScore,
          testScore: dp.testScore,
          revisionScore: dp.revisionScore,
          readinessScore: dp.readinessScore,
          status: dp.status,
          questionsSolved: dp.questionsSolved,
          pyqsSolved: dp.pyqsSolved,
          correctIndependent: dp.correctIndependent,
          wrong: dp.wrong,
          assisted: dp.assisted,
          studyMinutes: dp.studyMinutes,
          lastStudiedAt: dp.lastStudiedAt,
          lastRevisedAt: dp.lastRevisedAt,
        },
        create: {
          userId: user.id,
          chapterId: cId,
          theoryScore: dp.theoryScore,
          practiceScore: dp.practiceScore,
          pyqScore: dp.pyqScore,
          accuracyScore: dp.accuracyScore,
          testScore: dp.testScore,
          revisionScore: dp.revisionScore,
          readinessScore: dp.readinessScore,
          status: dp.status,
          questionsSolved: dp.questionsSolved,
          pyqsSolved: dp.pyqsSolved,
          correctIndependent: dp.correctIndependent,
          wrong: dp.wrong,
          assisted: dp.assisted,
          studyMinutes: dp.studyMinutes,
          lastStudiedAt: dp.lastStudiedAt,
          lastRevisedAt: dp.lastRevisedAt,
        },
      });

      // Update topic progress for Gravitation and GOC
      const topics = await prisma.topic.findMany({
        where: { chapterId: cId },
      });
      for (const t of topics) {
        let topicStatus = "UNDERSTOOD";
        if (dp.readinessScore >= 80) topicStatus = "STRONG";
        else if (dp.readinessScore >= 60) topicStatus = "PRACTISED";
        else if (dp.readinessScore >= 30) topicStatus = "LEARNING";
        else topicStatus = "NOT_STARTED";

        await prisma.topicProgress.upsert({
          where: {
            userId_topicId: {
              userId: user.id,
              topicId: t.id,
            },
          },
          update: { status: topicStatus },
          create: {
            userId: user.id,
            topicId: t.id,
            status: topicStatus,
          },
        });
      }
    }
  }

  // 5. Seed Today's Tasks
  console.log("📝 Seeding Today's Tasks...");
  const gravId = chapterMap["gravitation"];
  const limitsId = chapterMap["limits"];
  const gocId = chapterMap["goc"];
  const waveOpticsId = chapterMap["wave-optics"];

  const physSubject = await prisma.subject.findFirst({ where: { name: "Physics" } });
  const chemSubject = await prisma.subject.findFirst({ where: { name: "Chemistry" } });
  const mathSubject = await prisma.subject.findFirst({ where: { name: "Mathematics" } });

  // Delete existing tasks for clean demo state
  await prisma.task.deleteMany({ where: { userId: user.id } });

  const tasksData = [
    {
      title: "Escape Velocity + Satellites (Solve PYQs)",
      taskType: "PYQS",
      targetType: "QUESTIONS",
      targetValue: 60,
      completedValue: 37,
      priority: "CRITICAL",
      chapterId: gravId,
      subjectId: physSubject?.id,
      estimatedMinutes: 60,
      status: "IN_PROGRESS",
      order: 1,
      notes: "Focus on orbital velocity and geostationary orbit radius calculations.",
    },
    {
      title: "Limits: 50 Questions Practice",
      taskType: "QUESTIONS",
      targetType: "QUESTIONS",
      targetValue: 50,
      completedValue: 20,
      priority: "HIGH",
      chapterId: limitsId,
      subjectId: mathSubject?.id,
      estimatedMinutes: 50,
      status: "PENDING",
      order: 2,
      notes: "Target standard 0/0 factorisation and trigonometric forms.",
    },
    {
      title: "GOC: Intermediate Stability & Acidity Problems",
      taskType: "QUESTIONS",
      targetType: "QUESTIONS",
      targetValue: 30,
      completedValue: 30,
      priority: "HIGH",
      chapterId: gocId,
      subjectId: chemSubject?.id,
      estimatedMinutes: 45,
      status: "COMPLETED",
      order: 3,
      notes: "Carbocation rearrangement and ortho-effect review.",
    },
    {
      title: "Wave Optics: Start Theory & Huygens Principle",
      taskType: "THEORY",
      targetType: "MINUTES",
      targetValue: 45,
      completedValue: 0,
      priority: "MEDIUM",
      chapterId: waveOpticsId,
      subjectId: physSubject?.id,
      estimatedMinutes: 45,
      status: "PENDING",
      order: 4,
    },
  ];

  for (const td of tasksData) {
    await prisma.task.create({
      data: {
        userId: user.id,
        ...td,
        dueDate: new Date(),
      },
    });
  }

  // 6. Seed Practice Sessions
  console.log("🎯 Seeding Practice Sessions...");
  await prisma.practiceSession.deleteMany({ where: { userId: user.id } });

  const practiceLogs = [
    {
      chapterId: gravId!,
      subjectId: physSubject!.id,
      source: "JEE_MAIN_PYQ",
      sourceDetail: "JEE Main 2020-2025",
      questions: 20,
      correctIndependent: 15,
      wrong: 3,
      assisted: 2,
      durationMinutes: 42,
      difficulty: "MEDIUM",
      notes: "Strong satellite orbital energy concepts.",
    },
    {
      chapterId: gravId!,
      subjectId: physSubject!.id,
      source: "HCV",
      sourceDetail: "Concepts of Physics Vol 1 - Exercises",
      questions: 18,
      correctIndependent: 14,
      wrong: 2,
      assisted: 2,
      durationMinutes: 40,
      difficulty: "MEDIUM",
    },
    {
      chapterId: gocId!,
      subjectId: chemSubject!.id,
      source: "JEE_MAIN_PYQ",
      sourceDetail: "Acidity & Basicity PYQs",
      questions: 30,
      correctIndependent: 22,
      wrong: 5,
      assisted: 3,
      durationMinutes: 50,
      difficulty: "HARD",
    },
    {
      chapterId: limitsId!,
      subjectId: mathSubject!.id,
      source: "CENGAGE",
      sourceDetail: "Calculus Single Choice Questions",
      questions: 25,
      correctIndependent: 18,
      wrong: 4,
      assisted: 3,
      durationMinutes: 45,
      difficulty: "MEDIUM",
    },
  ];

  for (const pl of practiceLogs) {
    await prisma.practiceSession.create({
      data: {
        userId: user.id,
        ...pl,
        date: new Date(),
      },
    });
  }

  // 7. Seed Tests & Errors
  console.log("📝 Seeding Tests & Error Analysis...");
  await prisma.test.deleteMany({ where: { userId: user.id } });

  const test1 = await prisma.test.create({
    data: {
      userId: user.id,
      name: "Gravitation Timed Chapter Test",
      testType: "CHAPTER",
      durationMinutes: 45,
      totalMarks: 80,
      score: 56,
      physicsScore: 56,
      questions: 20,
      correct: 15,
      wrong: 4,
      unattempted: 1,
      percentile: 94.2,
      notes: "Lost 4 marks on silly algebra mistake in escape velocity ratio.",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  if (gravId) {
    await prisma.testChapter.create({
      data: {
        testId: test1.id,
        chapterId: gravId,
      },
    });
  }

  await prisma.testError.createMany({
    data: [
      { testId: test1.id, errorType: "SILLY_MISTAKE", count: 2, notes: "Sign error in gravitational potential formula" },
      { testId: test1.id, errorType: "CONCEPT_ERROR", count: 1, notes: "Confusion between binding energy and orbital KE" },
      { testId: test1.id, errorType: "CALCULATION_ERROR", count: 1, notes: "Square root simplification error" },
    ],
  });

  // 8. Seed Goals
  console.log("🎯 Seeding Goals...");
  await prisma.goal.deleteMany({ where: { userId: user.id } });

  const g1 = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Finish High Weightage JEE Syllabus",
      description: "Complete all Tier 1 high ROI chapters across Physics, Chemistry, and Math.",
      goalType: "LONG_TERM",
      startDate: new Date("2026-08-01"),
      endDate: new Date("2026-11-15"),
      priority: "CRITICAL",
      status: "IN_PROGRESS",
    },
  });

  await prisma.goalMetric.create({
    data: {
      goalId: g1.id,
      metricType: "CHAPTER_READINESS",
      targetValue: 80,
      currentValue: 54,
    },
  });

  const g2 = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "August Mastery Closure",
      description: "Master Gravitation, GOC, Limits and log 1,000 solved questions.",
      goalType: "MONTHLY",
      startDate: new Date("2026-08-01"),
      endDate: new Date("2026-08-31"),
      priority: "HIGH",
      status: "IN_PROGRESS",
    },
  });

  await prisma.goalMetric.createMany({
    data: [
      { goalId: g2.id, metricType: "QUESTIONS", targetValue: 1000, currentValue: 680 },
      { goalId: g2.id, metricType: "TESTS", targetValue: 5, currentValue: 3 },
    ],
  });

  const g3 = await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Weekly Sprint (350 Questions)",
      description: "Finish GOC & Limits, Electrostatics 60%, 350 questions, 2 chapter tests",
      goalType: "WEEKLY",
      startDate: new Date("2026-08-18"),
      endDate: new Date("2026-08-25"),
      priority: "HIGH",
      status: "IN_PROGRESS",
    },
  });

  await prisma.goalMetric.create({
    data: {
      goalId: g3.id,
      metricType: "QUESTIONS",
      targetValue: 350,
      currentValue: 187,
    },
  });

  // 9. Seed Spaced Revisions
  console.log("🔄 Seeding Spaced Revisions...");
  await prisma.revision.deleteMany({ where: { userId: user.id } });

  if (gravId) {
    await prisma.revision.create({
      data: {
        userId: user.id,
        chapterId: gravId,
        scheduledDate: new Date(), // Due today
        revisionNumber: 2,
        status: "PENDING",
      },
    });
  }

  if (gocId) {
    await prisma.revision.create({
      data: {
        userId: user.id,
        chapterId: gocId,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
        revisionNumber: 3,
        status: "PENDING",
      },
    });
  }

  // 10. Seed Readiness Snapshots for Historical Trends
  console.log("📊 Seeding Readiness Historical Snapshots...");
  await prisma.readinessSnapshot.deleteMany({ where: { userId: user.id } });

  const snapshots = [
    { date: new Date("2026-08-01"), overallReadiness: 23, physicsReadiness: 21, chemistryReadiness: 25, mathReadiness: 23, totalQuestions: 150, totalStudyHours: 18 },
    { date: new Date("2026-08-08"), overallReadiness: 27, physicsReadiness: 26, chemistryReadiness: 30, mathReadiness: 25, totalQuestions: 380, totalStudyHours: 48 },
    { date: new Date("2026-08-15"), overallReadiness: 33, physicsReadiness: 34, chemistryReadiness: 36, mathReadiness: 29, totalQuestions: 620, totalStudyHours: 82 },
    { date: new Date("2026-08-23"), overallReadiness: 37, physicsReadiness: 39, chemistryReadiness: 41, mathReadiness: 31, totalQuestions: 887, totalStudyHours: 114 },
  ];

  for (const s of snapshots) {
    await prisma.readinessSnapshot.create({
      data: {
        userId: user.id,
        ...s,
      },
    });
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
