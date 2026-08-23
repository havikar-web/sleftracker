import { getRoadmapData } from "@/lib/actions/roadmap-actions";
import { RoadmapView } from "@/components/roadmap/roadmap-view";

export const revalidate = 0;

export default async function RoadmapPage() {
  const DEFAULT_USER_ID = "jee_student_primary";
  const roadmapData = await getRoadmapData(DEFAULT_USER_ID);

  return <RoadmapView roadmapData={roadmapData} />;
}
