import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { TimerProvider } from "@/components/timer-context";
import { AppShell } from "@/components/app-shell";
import { PwaRegister } from "@/components/pwa-register";
import { prisma } from "@/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEE OS — Serious Academic Operating System for JEE Aspirants",
  description:
    "Know exactly what to study, what matters most, how much of the JEE syllabus is genuinely ready, what is falling behind, and what action to take next.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch chapters for global modal selectors
  let chapters: any[] = [];
  try {
    const rawChapters = await prisma.chapter.findMany({
      include: { subject: true },
      orderBy: [{ subject: { displayOrder: "asc" } }, { classLevel: "asc" }, { displayOrder: "asc" }],
    });
    chapters = rawChapters.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      subjectName: c.subject.name,
      subjectId: c.subjectId,
      color: c.subject.color,
      classLevel: c.classLevel,
    }));
  } catch (err) {
    console.error("Layout chapter fetch error:", err);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TimerProvider>
            <AppShell chapters={chapters}>{children}</AppShell>
            <PwaRegister />
          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
