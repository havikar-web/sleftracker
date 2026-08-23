import { getAllChaptersForSyllabus } from "@/lib/actions/chapter-actions";
import { SyllabusExplorer } from "@/components/syllabus/syllabus-explorer";

export const revalidate = 0;

export default async function SyllabusPage() {
  const DEFAULT_USER_ID = "jee_student_primary";
  const subjects = await getAllChaptersForSyllabus(DEFAULT_USER_ID);

  return <SyllabusExplorer subjects={subjects} />;
}
