import { getAnalyticsOverview } from "@/lib/actions/analytics-actions";
import { WeeklyReviewView } from "@/components/review/weekly-review-view";

export const revalidate = 0;

export default async function ReviewPage() {
  const DEFAULT_USER_ID = "jee_student_primary";
  const overview = await getAnalyticsOverview(DEFAULT_USER_ID);

  return <WeeklyReviewView overview={overview} />;
}
