import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env relative to the project root
dotenv.config({ path: resolve(__dirname, '../.env') });

import { createClient } from '@supabase/supabase-js';
import { seedQuestions } from '../src/lib/data/seed-questions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !adminKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, adminKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log(`Starting to insert ${seedQuestions.length} questions...`);

  let successCount = 0;
  let errorCount = 0;

  // We can insert them in batches
  const batchSize = 50;
  for (let i = 0; i < seedQuestions.length; i += batchSize) {
    const batch = seedQuestions.slice(i, i + batchSize);
    
    const { data, error } = await supabase.from('questions').upsert(
      batch.map(q => ({
        content_hash: q.content_hash,
        book: q.book,
        chapter: q.chapter,
        topic: q.topic || 'General',
        question: q.question,
        options: JSON.stringify(q.options),
        correct_index: q.correct_index,
        explanation: q.explanation,
        difficulty: q.difficulty,
        source: q.source,
        verified: q.verified,
        verified_by: q.verified_by,
        confidence: q.confidence,
        created_at: q.created_at,
        updated_at: q.updated_at
      })),
      { onConflict: 'content_hash' }
    );

    if (error) {
      console.error("Batch insert error:", error);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${successCount} total)`);
    }
  }

  console.log(`Done. Success: ${successCount}, Errors: ${errorCount}`);
  process.exit(0);
}

run();
