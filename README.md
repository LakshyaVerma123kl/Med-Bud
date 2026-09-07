<div align="center">
  <img src="public/icon.jpg" alt="MedQuiz Pro Logo" width="120" />
  <h1>🩺 MedQuiz Pro</h1>
  <p><strong>AI-Powered Medical Revision Platform for MBBS Students</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
</div>

---

## 🌟 Overview

MedQuiz Pro is a production-grade medical revision platform built for MBBS students preparing for NEET PG and university exams. It transforms standard Indian medical textbooks (*K.S. Narayan Reddy's Forensic Medicine* and *Park's Preventive & Social Medicine*) into an interactive, AI-driven learning experience with active recall, spaced repetition, and custom quiz generation from any uploaded document.

## ✨ Features

### 📚 Textbook Question Banks
Pre-loaded, chapter-wise MCQs from K.S. Narayan Reddy (Forensic Medicine) and Park (Preventive & Social Medicine). Questions are AI-generated with detailed clinical explanations and textbook citations.

### 📄 Custom Quiz Generation (Any Document)
Upload any PDF or DOCX file — medical or non-medical — and the AI generates a structured quiz with a summary, key concepts, and clinical-vignette style MCQs. Supports custom AI instructions like *"Focus on definitions"*, *"Make it True/False"*, or *"Make it extremely difficult"*.

### 🧠 Spaced Repetition & Daily Review
SM-2 algorithm tracks your weak areas and surfaces questions at optimal intervals. Never forget what you've studied.

### 📊 Dashboard & Analytics
Track your streaks, chapter mastery, overall accuracy, and unlock achievement badges. Visualize your progress over time with clean charts.

### 📝 Notes, Summaries & Flashcards
AI-generated chapter summaries with key concepts, mnemonics, and tips. Export to **PDF**, **Anki (TSV)**, or **Markdown** for offline study.

### 🏥 Mock Examinations
Timed, multi-chapter mock exams that simulate real exam conditions with randomized question pools.

### 🔐 Optional Auth & Cloud Sync
Sign in with Google (via Supabase Auth) to sync your progress, bookmarks, and spaced repetition data across devices. No login required to use the app — it works fully offline with `localStorage`.

### ⚙️ Settings & Account Management
Manage your profile, force cloud sync, clear local data, or permanently delete your account.

### 🎨 Premium Academic UI
Hand-crafted "Academic Green + Paper" design system with `Source Serif 4` typography, clean dark mode, and fully responsive layouts. No generic SaaS aesthetics.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion |
| **Backend** | Next.js Route Handlers, Node.js Runtime |
| **Database** | Supabase PostgreSQL with Row Level Security |
| **Auth** | Supabase Auth (Google OAuth, Email/Password) |
| **AI** | Multi-provider failover: Groq, Gemini, OpenRouter |
| **Typography** | `react-markdown`, KaTeX, `@tailwindcss/typography` |
| **Exports** | PDF (print layout), Anki TSV, Markdown |

---

## 📖 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LakshyaVerma123kl/Med-Bud.git
   cd Med-Bud
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:** Create a `.env` file at the root.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   GROQ_API_KEY=your_groq_key
   GEMINI_API_KEY=your_gemini_key
   DATABASE_URL=your_database_url
   ```
4. **Database Setup:** Use the Supabase SQL editor to create the required tables:
   - `questions` — AI-generated chapter questions
   - `pdf_quizzes` — Custom uploaded document quizzes
   - `chapter_summaries` — AI-generated chapter summaries and notes
   - `user_profiles` — User progress sync (with RLS policies)
5. **Launch:**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (PDF processing, questions, auth)
│   ├── book/[bookId]/      # Chapter browser
│   ├── quiz/               # Quiz engine
│   ├── dashboard/          # Progress dashboard
│   ├── login/              # Supabase Auth UI
│   ├── settings/           # User settings & account management
│   └── pdf-quiz/           # Custom document quiz viewer
├── components/             # React components
│   ├── layout/             # Navbar
│   ├── quiz/               # QuizContent, NotesModal, SummaryModal
│   ├── pdf/                # PDFUploader
│   └── dashboard/          # Pomodoro, analytics charts
├── hooks/                  # Custom hooks
│   ├── useProgress.ts      # Progress tracking with cloud sync
│   ├── useBookmarks.ts     # Bookmarks with cloud sync
│   ├── useSpacedRepetition.ts  # SM-2 algorithm with cloud sync
│   └── useSync.ts          # Supabase cloud sync layer
└── lib/                    # Utilities
    ├── ai/                 # Multi-provider AI client with failover
    ├── data/               # Textbook definitions and seed data
    └── supabase.ts         # Supabase client configuration
```

---

<div align="center">
  <i>Built for medical students who take their revision seriously.</i>
</div>
