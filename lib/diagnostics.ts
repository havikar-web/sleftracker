export interface DiagnosticInput {
  chapterName: string;
  subjectName: string;
  readinessScore: number;
  theoryScore: number;
  practiceScore: number;
  pyqScore: number;
  accuracyScore: number;
  testScore: number;
  revisionScore: number;
  questionsSolved: number;
  pyqsSolved: number;
  defaultQuestionTarget: number;
  defaultPYQTarget: number;
  lastRevisedAt?: Date | null;
  testsCount?: number;
}

export interface DiagnosticResult {
  overallHealth: "CRITICAL" | "ATTENTION_NEEDED" | "DEVELOPING" | "HEALTHY" | "EXCELLENT";
  theoryLevel: "Weak" | "Moderate" | "Strong";
  practiceLevel: "Weak" | "Moderate" | "Strong";
  accuracyLevel: "Weak" | "Moderate" | "Strong";
  revisionLevel: "Not Done" | "Due" | "Up to Date";
  recommendedAction: string;
  actionType: "THEORY" | "PRACTICE" | "PYQ" | "ACCURACY_DRILL" | "TEST" | "REVISION";
  actionTarget?: number;
}

export function diagnoseChapter(input: DiagnosticInput): DiagnosticResult {
  const {
    chapterName,
    readinessScore,
    theoryScore,
    practiceScore,
    pyqScore,
    accuracyScore,
    testScore,
    questionsSolved,
    pyqsSolved,
    defaultQuestionTarget,
    defaultPYQTarget,
    lastRevisedAt,
    testsCount = 0,
  } = input;

  // Classify sub-dimensions
  const theoryLevel = theoryScore >= 85 ? "Strong" : theoryScore >= 50 ? "Moderate" : "Weak";
  const practiceLevel = practiceScore >= 75 ? "Strong" : practiceScore >= 45 ? "Moderate" : "Weak";
  const accuracyLevel = accuracyScore >= 75 ? "Strong" : accuracyScore >= 60 ? "Moderate" : "Weak";

  let revisionLevel: "Not Done" | "Due" | "Up to Date" = "Not Done";
  if (lastRevisedAt) {
    const daysSince = Math.floor((Date.now() - new Date(lastRevisedAt).getTime()) / (1000 * 60 * 60 * 24));
    revisionLevel = daysSince > 14 ? "Due" : "Up to Date";
  }

  // Determine overall health
  let overallHealth: DiagnosticResult["overallHealth"] = "DEVELOPING";
  if (readinessScore >= 90 && accuracyLevel === "Strong") {
    overallHealth = "EXCELLENT";
  } else if (readinessScore >= 75) {
    overallHealth = "HEALTHY";
  } else if (readinessScore < 30 || (readinessScore > 50 && accuracyLevel === "Weak")) {
    overallHealth = "ATTENTION_NEEDED";
  }

  // Deterministic Recommendation Flow
  let recommendedAction = "";
  let actionType: DiagnosticResult["actionType"] = "PRACTICE";
  let actionTarget: number | undefined;

  if (theoryScore < 60) {
    actionType = "THEORY";
    recommendedAction = `Cover remaining unread topics in ${chapterName} and create high-yield formula notes.`;
  } else if (practiceScore < 50) {
    const remainingQ = Math.max(15, Math.min(35, defaultQuestionTarget - questionsSolved));
    actionType = "PRACTICE";
    actionTarget = remainingQ;
    recommendedAction = `Build foundation: Solve ${remainingQ} standard textbook & module exercises.`;
  } else if (accuracyLevel === "Weak") {
    actionType = "ACCURACY_DRILL";
    recommendedAction = `Accuracy alert (${Math.round(accuracyScore)}%): Redo previously missed ${chapterName} questions independently without solution hints.`;
  } else if (pyqScore < 70) {
    const remainingPYQs = Math.max(15, Math.min(30, defaultPYQTarget - pyqsSolved));
    actionType = "PYQ";
    actionTarget = remainingPYQs;
    recommendedAction = `Solve ${remainingPYQs} recent JEE Main PYQs (2020–2026) in timed batches.`;
  } else if (testsCount === 0 || testScore < 60) {
    actionType = "TEST";
    recommendedAction = `Take a 20-question timed chapter test for ${chapterName} to benchmark exam speed & negative marking.`;
  } else if (revisionLevel === "Due" || revisionLevel === "Not Done") {
    actionType = "REVISION";
    actionTarget = 15;
    recommendedAction = `Spaced recall due: Solve 15 mixed previous year questions and review formula sheet.`;
  } else {
    actionType = "PRACTICE";
    recommendedAction = `Chapter is in prime condition (${readinessScore}%). Maintain periodic spaced review.`;
  }

  return {
    overallHealth,
    theoryLevel,
    practiceLevel,
    accuracyLevel,
    revisionLevel,
    recommendedAction,
    actionType,
    actionTarget,
  };
}
