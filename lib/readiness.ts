import { clamp } from "./utils";

export interface ReadinessCalculationInput {
  theoryScore: number;         // 0 - 100
  questionsSolved: number;
  questionTarget: number;
  pyqsSolved: number;
  pyqTarget: number;
  correctIndependent: number;
  wrong: number;
  assisted: number;
  testScore?: number;          // 0 - 100
  revisionScore?: number;      // 0 - 100
  lastRevisedAt?: Date | null;
  testsTakenCount?: number;
  revisionsCount?: number;
  isManualOverride?: boolean;
  manualReadiness?: number;
}

export interface ReadinessResult {
  theoryScore: number;
  practiceScore: number;
  pyqScore: number;
  accuracyScore: number;
  testScore: number;
  revisionScore: number;
  readinessScore: number;
  status:
    | "NOT_STARTED"
    | "LEARNING"
    | "PRACTISING"
    | "DEVELOPING"
    | "TEST_READY"
    | "MASTERED"
    | "NEEDS_REVISION";
  accuracyPercentage: number;
  masteryGaps: string[];
}

export const WEIGHTS = {
  THEORY: 0.25,
  PRACTICE_VOLUME: 0.25,
  PYQ: 0.20,
  ACCURACY: 0.15,
  TESTING: 0.10,
  REVISION: 0.05,
};

export function calculateChapterReadiness(input: ReadinessCalculationInput): ReadinessResult {
  const targetQ = Math.max(1, input.questionTarget || 100);
  const targetPYQ = Math.max(1, input.pyqTarget || 50);

  // 1. Theory Score (0 - 100)
  const theoryScore = clamp(input.theoryScore || 0);

  // 2. Practice Volume Score (0 - 100, clamped at target)
  const practiceScore = clamp(((input.questionsSolved || 0) / targetQ) * 100);

  // 3. PYQ Completion Score (0 - 100, clamped at target)
  const pyqScore = clamp(((input.pyqsSolved || 0) / targetPYQ) * 100);

  // 4. Independent Accuracy Score
  // Independent accuracy = Independent Correct / (Independent Correct + Wrong + Assisted)
  const totalAttempted =
    (input.correctIndependent || 0) + (input.wrong || 0) + (input.assisted || 0);
  const accuracyPercentage =
    totalAttempted > 0
      ? ((input.correctIndependent || 0) / totalAttempted) * 100
      : 0;
  const accuracyScore = clamp(accuracyPercentage);

  // 5. Test Score
  const testScore = clamp(input.testScore || 0);

  // 6. Revision Score
  let revisionScore = clamp(input.revisionScore || 0);
  // If chapter was revised previously, factor in decay
  if (input.lastRevisedAt) {
    const daysSinceRevision = Math.floor(
      (Date.now() - new Date(input.lastRevisedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceRevision > 30) {
      revisionScore = Math.max(20, revisionScore - 40);
    } else if (daysSinceRevision > 14) {
      revisionScore = Math.max(40, revisionScore - 20);
    }
  }

  // Combined Multi-Dimensional Readiness Score
  let calculatedReadiness =
    WEIGHTS.THEORY * theoryScore +
    WEIGHTS.PRACTICE_VOLUME * practiceScore +
    WEIGHTS.PYQ * pyqScore +
    WEIGHTS.ACCURACY * accuracyScore +
    WEIGHTS.TESTING * testScore +
    WEIGHTS.REVISION * revisionScore;

  calculatedReadiness = Math.round(clamp(calculatedReadiness) * 10) / 10;

  const finalReadiness =
    input.isManualOverride && typeof input.manualReadiness === "number"
      ? clamp(input.manualReadiness)
      : calculatedReadiness;

  // Determine Mastery Gaps
  const masteryGaps: string[] = [];
  if (theoryScore < 90) masteryGaps.push("Theory < 90%");
  if (pyqScore < 80) masteryGaps.push("PYQ coverage < 80%");
  if (accuracyScore < 75) masteryGaps.push("Independent accuracy < 75%");
  if ((input.testsTakenCount || 0) < 1 && testScore < 60) masteryGaps.push("At least 1 chapter test needed");
  if ((input.revisionsCount || 0) < 1 && revisionScore < 50) masteryGaps.push("At least 1 revision cycle needed");

  // Determine Status
  let status: ReadinessResult["status"] = "NOT_STARTED";

  // Check if needs revision
  const isHighReadiness = finalReadiness >= 75;
  const hasOldRevision =
    input.lastRevisedAt &&
    (Date.now() - new Date(input.lastRevisedAt).getTime()) / (1000 * 60 * 60 * 24) > 21;

  if (isHighReadiness && hasOldRevision) {
    status = "NEEDS_REVISION";
  } else if (finalReadiness >= 90 && masteryGaps.length === 0) {
    status = "MASTERED";
  } else if (finalReadiness >= 80) {
    status = "TEST_READY";
  } else if (finalReadiness >= 65) {
    status = "DEVELOPING";
  } else if (finalReadiness >= 35) {
    status = "PRACTISING";
  } else if (finalReadiness >= 5) {
    status = "LEARNING";
  } else {
    status = "NOT_STARTED";
  }

  return {
    theoryScore: Math.round(theoryScore * 10) / 10,
    practiceScore: Math.round(practiceScore * 10) / 10,
    pyqScore: Math.round(pyqScore * 10) / 10,
    accuracyScore: Math.round(accuracyScore * 10) / 10,
    testScore: Math.round(testScore * 10) / 10,
    revisionScore: Math.round(revisionScore * 10) / 10,
    readinessScore: finalReadiness,
    status,
    accuracyPercentage: Math.round(accuracyPercentage * 10) / 10,
    masteryGaps,
  };
}
