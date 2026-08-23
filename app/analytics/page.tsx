import { getAnalyticsOverview } from "@/lib/actions/analytics-actions";
import { AnalyticsView } from "@/components/analytics/analytics-view";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const DEFAULT_USER_ID = "jee_student_primary";
  const overview = await getAnalyticsOverview(DEFAULT_USER_ID);

  return <AnalyticsView overview={overview} />;
}
