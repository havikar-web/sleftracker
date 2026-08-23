import { prisma } from "@/lib/prisma";
import { SettingsView } from "@/components/settings/settings-view";

export const revalidate = 0;

export default async function SettingsPage() {
  const DEFAULT_USER_ID = "jee_student_primary";
  const user = await prisma.user.findUnique({ where: { id: DEFAULT_USER_ID } });

  return <SettingsView user={user} />;
}
