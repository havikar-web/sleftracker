# JEE OS — Academic Operating System for JEE Aspirants

A high-performance personal academic operating system for serious JEE aspirants to manage curriculum completion, dynamic daily study pacing, multi-chapter weekly targets, live MCQ practice room, test analytics, and retention-scheduled revision.

---

## 🚀 Key Features

- **Dynamic Daily Study Pacing Engine**: Calculates exact daily hours (e.g. 5.8h/day) and MCQs needed across Physics, Chemistry, and Mathematics to master the full syllabus before **January 1st, 2027**.
- **62 Official JEE Master Chapters (760 Total Mastery Hours)**: Exhaustive chapter-by-chapter curriculum with realistic study hours, historical exam weightage ROI (85%+ High Priority), and detailed subtopic hierarchies.
- **Multiple Simultaneous Target Chapters**: Set and manage 1, 2, 3, or more target chapters across PCM with custom question goals (25, 50, 75, 100 Qs).
- **Distraction-Free Focus Study & Live MCQ Room (`/focus`)**: Full-screen study timer with instant 1-tap live MCQ classification (**Independent ✓**, **Assisted 💡**, **Wrong ✗**) with real-time accuracy scoring and auto-saving.
- **1-Tap Frictionless Practice Logging**: Log `+10 Q`, `+20 Q`, `+30 Q` anywhere with a single click.
- **Multi-Dimensional Chapter Readiness Matrix**: 6-dimension weighted algorithm tracking Theory (25%), Practice Volume (25%), PYQs (20%), Accuracy (15%), Mock Tests (10%), and Revision (5%).
- **SuperMemo SM-2 Retention Revision Engine**: Spaced repetition tracking with automated scheduling based on recall quality.
- **Exam Error Diagnostics & Analytics**: Error tag distribution (Concept Gap, Calculation, Trap, Time Pressure), difficulty breakdown, and subject masteries with Recharts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components & Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Neon PostgreSQL preferred)
- **ORM**: [Prisma](https://www.prisma.io/)
- **UI & Icons**: [Lucide React](https://lucide.dev/), Radix UI primitives
- **Analytics**: [Recharts](https://recharts.org/)
- **PWA**: Web App Manifest & Service Worker

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/havikar-web/sleftracker.git
cd sleftracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/jee_tracker_db?schema=public"
```

### 4. Push Database Schema & Seed Data
```bash
npx prisma db push
npx tsx prisma/clean-seed.ts
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
MIT License
