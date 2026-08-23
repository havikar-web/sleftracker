import { getRevisionsGrouped } from "@/lib/actions/revision-actions";
import { RevisionView } from "@/components/revision/revision-view";

export const revalidate = 0;

export default async function RevisionPage() {
  const DEFAULT_USER_ID = "jee_student_primary";
  const revisionsData = await getRevisionsGrouped(DEFAULT_USER_ID);

  return <RevisionView revisionsData={revisionsData} />;
}
