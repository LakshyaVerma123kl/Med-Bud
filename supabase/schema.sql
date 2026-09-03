-- MedQuiz Pro — Full PostgreSQL Schema for Supabase
-- Run this in Supabase SQL Editor to set up all tables

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. Questions Table
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book TEXT NOT NULL CHECK (book IN ('narayan_reddy', 'park')),
  chapter TEXT NOT NULL,
  topic TEXT,
  question TEXT NOT NULL,
  options JSONB NOT NULL,  -- array of 4 strings
  correct_index INTEGER NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  source TEXT NOT NULL DEFAULT 'seed' CHECK (source IN ('seed', 'ai_variation', 'ai_generated')),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by TEXT,
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  content_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_book_chapter ON questions(book, chapter);
CREATE INDEX idx_questions_verified ON questions(verified);
CREATE INDEX idx_questions_content_hash ON questions(content_hash);

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. Quiz Attempts Table
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  chosen_index INTEGER NOT NULL,
  correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_question ON quiz_attempts(question_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. Chapter Mastery Table
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS chapter_mastery (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter TEXT NOT NULL,
  accuracy_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  questions_attempted INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, book, chapter)
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. User Profiles Table (extends auth.users)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  total_questions_answered INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  overall_accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  badges JSONB NOT NULL DEFAULT '[]'::JSONB,
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. Review Queue (for mid-confidence AI-generated questions)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_data JSONB NOT NULL,
  verification_data JSONB NOT NULL,
  book TEXT NOT NULL,
  chapter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_review_queue_status ON review_queue(status);

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. Row Level Security Policies
-- ══════════════════════════════════════════════════════════════════════════════

-- Questions: anyone can read verified questions
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read verified questions" ON questions
  FOR SELECT USING (verified = TRUE);

-- Quiz attempts: users can only see their own
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chapter mastery: users can only see/update their own
ALTER TABLE chapter_mastery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own mastery" ON chapter_mastery
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own mastery" ON chapter_mastery
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mastery" ON chapter_mastery
  FOR UPDATE USING (auth.uid() = user_id);

-- User profiles: users can only see/update their own
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. Helper Functions
-- ══════════════════════════════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
