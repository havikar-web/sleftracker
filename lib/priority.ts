import { clamp } from "./utils";

export interface PriorityInput {
  historicalImportance: number; // 0 - 100 (Exam importance based on historical JEE weightage)
  readinessScore: number;       // 0 - 100
  targetDate?: Date | null;
  accuracyScore?: number;       // 0 - 100
  prerequisiteReadinessAvg?: number; // 0 - 100 (average readiness of prerequisites)
  hasPrerequisiteGaps?: boolean;
  priorityOverride?: "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW" | null;
}

export interface PriorityResult {
  score: number;
  priorityTier: "VERY_HIGH" | "HIGH" | "MEDIUM" | "LOW";
  category: "DO_NOW" | "DO_NEXT" | "LATER" | "MAINTAIN_REVISE";
  isManualOverride: boolean;
}

export function calculateChapterPriority(input: PriorityInput): PriorityResult {
  // If user has a manual override, honor it
  if (input.priorityOverride) {
    let score = 50;
    if (input.priorityOverride === "VERY_HIGH") score = 95;
    if (input.priorityOverride === "HIGH") score = 75;
    if (input.priorityOverride === "MEDIUM") score = 50;
    if (input.priorityOverride === "LOW") score = 25;

    let category: PriorityResult["category"] = "DO_NEXT";
    if (score >= 80) category = "DO_NOW";
    else if (score >= 50) category = "DO_NEXT";
    else category = "LATER";

    if (input.readinessScore >= 80) category = "MAINTAIN_REVISE";

    return {
      score,
      priorityTier: input.priorityOverride,
      category,
      isManualOverride: true,
    };
  }

  const importance = clamp(input.historicalImportance || 70);
  const remainingReadiness = clamp(100 - (input.readinessScore || 0)) / 100; // 0 to 1

  // Urgency modifier based on target date
  let urgency = 1.0;
  if (input.targetDate) {
    const daysUntilTarget = Math.ceil(
      (new Date(input.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilTarget <= 7) urgency = 1.35;
    else if (daysUntilTarget <= 21) urgency = 1.2;
    else if (daysUntilTarget <= 45) urgency = 1.05;
    else urgency = 0.95;
  }

  // Weakness modifier (if accuracy is low, solving gaps is high value)
  let weaknessModifier = 1.0;
  if (typeof input.accuracyScore === "number" && input.accuracyScore > 0) {
    if (input.accuracyScore < 60) weaknessModifier = 1.25;
    else if (input.accuracyScore < 75) weaknessModifier = 1.1;
    else weaknessModifier = 0.95;
  }

  // Prerequisite modifier: If prerequisites are severely incomplete (< 40%), lower direct priority so student fixes foundational chapters first
  let prereqModifier = 1.0;
  if (typeof input.prerequisiteReadinessAvg === "number" && input.prerequisiteReadinessAvg < 40) {
    prereqModifier = 0.75;
  }

  // Calculate raw score
  let rawScore = importance * remainingReadiness * urgency * weaknessModifier * prereqModifier;

  // Boost chapters that are close to mastery (70% - 88% readiness) because finishing them gives high ROI
  if (input.readinessScore >= 70 && input.readinessScore < 89 && importance >= 65) {
    rawScore = Math.max(rawScore, 78);
  }

  const score = Math.round(clamp(rawScore, 5, 99));

  // Determine Tier
  let priorityTier: PriorityResult["priorityTier"] = "MEDIUM";
  if (score >= 80) priorityTier = "VERY_HIGH";
  else if (score >= 65) priorityTier = "HIGH";
  else if (score >= 40) priorityTier = "MEDIUM";
  else priorityTier = "LOW";

  // Determine Category Group
  let category: PriorityResult["category"] = "LATER";
  if (input.readinessScore >= 80) {
    category = "MAINTAIN_REVISE";
  } else if (score >= 70) {
    category = "DO_NOW";
  } else if (score >= 45) {
    category = "DO_NEXT";
  } else {
    category = "LATER";
  }

  return {
    score,
    priorityTier,
    category,
    isManualOverride: false,
  };
}
