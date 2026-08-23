export const REVISION_INTERVALS_DAYS = [1, 3, 7, 14, 30, 60];

export function getNextRevisionDate(
  currentRevisionNumber: number,
  recallQuality?: "POOR" | "WEAK" | "OKAY" | "STRONG" | null,
  fromDate: Date = new Date()
): { nextRevisionDate: Date; nextRevisionNumber: number } {
  let nextRevisionNumber = currentRevisionNumber + 1;
  let intervalDays = 7;

  if (recallQuality === "POOR") {
    // Reset or regress interval to 1 day
    nextRevisionNumber = Math.max(1, currentRevisionNumber - 1);
    intervalDays = 1;
  } else if (recallQuality === "WEAK") {
    // Bring earlier
    nextRevisionNumber = currentRevisionNumber;
    intervalDays = 2;
  } else if (recallQuality === "OKAY") {
    const idx = Math.min(currentRevisionNumber, REVISION_INTERVALS_DAYS.length - 1);
    intervalDays = REVISION_INTERVALS_DAYS[idx];
  } else if (recallQuality === "STRONG") {
    const idx = Math.min(currentRevisionNumber + 1, REVISION_INTERVALS_DAYS.length - 1);
    intervalDays = REVISION_INTERVALS_DAYS[idx];
    nextRevisionNumber = currentRevisionNumber + 1;
  } else {
    const idx = Math.min(currentRevisionNumber, REVISION_INTERVALS_DAYS.length - 1);
    intervalDays = REVISION_INTERVALS_DAYS[idx];
  }

  const nextDate = new Date(fromDate);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return { nextRevisionDate: nextDate, nextRevisionNumber };
}

export function categorizeRevision(scheduledDate: Date, isCompleted: boolean): "DUE_TODAY" | "OVERDUE" | "UPCOMING" | "FRESH" {
  if (isCompleted) return "FRESH";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(scheduledDate);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "OVERDUE";
  if (diffDays === 0) return "DUE_TODAY";
  return "UPCOMING";
}
