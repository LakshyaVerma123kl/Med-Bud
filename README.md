<div align="center">
  <img src="public/icon.jpg" alt="MedQuiz Pro Logo" width="120" />
  <h1>🩺 MedQuiz Pro</h1>
  <p><strong>The Elite AI-Powered Medical Revision Engine</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
</div>

---

## 🌟 Overview

MedQuiz Pro is a production-grade, highly scalable Medical Revision Platform built for MBBS students preparing for NEET PG and university exams. It bridges the gap between static textbook reading and active recall by transforming standard Indian medical literature (*K.S. Narayan Reddy's Forensic Medicine* and *Park's Preventive & Social Medicine*) into an **interactive, AI-driven learning experience.**

## 🚀 Key Technical Features

### 1. Retrieval-Augmented Generation (RAG) for Custom PDFs
Users can upload any medical PDF, lecture note, or research paper. The backend parses the document using a memory-safe `pdf-parse` implementation across Next.js Server Components. The extracted text is processed by Google's **Gemini AI** to automatically generate:
- A structured Markdown summary with key concepts and mnemonics.
- High-yield, clinical-vignette style MCQs.
- All stored persistently via Supabase for community access.

### 2. Hybrid Data Architecture
To ensure high availability and minimize API costs, the application employs a hybrid data strategy:
- **Offline Seed Data**: Statically bundled JSON questions for zero-latency initial loads.
- **Dynamic Database Caching**: AI-generated chapter questions and summaries are instantly cached in **Supabase (PostgreSQL)**, meaning the AI is only invoked for entirely new requests.

### 3. Advanced Hydration & State Management
Built entirely with React 19 and Next.js 15 (App Router), the application uses custom hooks (`useQuiz`, `useProgress`) that elegantly handle complex client-side states (like pseudo-random array shuffling and `localStorage` syncing) without triggering React Hydration Mismatch errors.

### 4. Mathematical Formatting & Typographical Excellence
Complex medical statistics, epidemiological formulas, and LaTeX symbols ($\chi^2$, standard deviation) are beautifully rendered on the fly utilizing a customized `react-markdown` engine injected with `remark-math` and `rehype-katex` plugins. 

### 5. Gamification Engine
Features a robust `localStorage`-synced Progress Dashboard that tracks:
- **Current & Longest Streaks**
- **Chapter Mastery & Global Accuracy**
- **Achievement Badges** (Dynamically unlocked based on performance algorithms)

---

## 🛠️ System Architecture

- **Frontend**: Next.js (App Router), React 19, Tailwind CSS v4, Framer Motion
- **Backend**: Next.js Route Handlers (`/api`), Node.js Runtime
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **AI Integrations**: `@google/genai` (Gemini 1.5 Flash/Pro)
- **Typography & Parsing**: `react-markdown`, `katex`, `@tailwindcss/typography`

## 📖 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/medquiz-pro.git
   cd medquiz-pro
   ```
2. **Install dependencies:** 
   ```bash
   npm install
   ```
3. **Environment Setup:** Create a `.env.local` file at the root.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   GEMINI_API_KEY=your_gemini_key
   ```
4. **Database Migration:** Use the Supabase SQL editor to create the `questions`, `pdf_quizzes`, and `chapter_summaries` tables.
5. **Launch:** 
   ```bash
   npm run dev
   ```

---
<div align="center">
  <i>Engineered with an uncompromising pursuit of perfection.</i>
</div>
