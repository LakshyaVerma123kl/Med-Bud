import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

import { createClient } from '@supabase/supabase-js';
import { narayanReddyChapters, parkChapters } from '../src/lib/data/chapters';

// We bypass Next.js API here and just import the AI logic directly if possible,
// but since this is a Node script, we can just fetch our own local Next.js API endpoint!
// Wait, to hit our own API we need the server running. 
// It's easier to just call the API over HTTP since the dev server is running,
// but we killed it. Let's start it.

async function generateForChapter(bookId: string, chapterId: string) {
  console.log(`[AI] Generating questions for ${bookId} - ${chapterId}...`);
  try {
    const res = await fetch("http://localhost:3000/api/admin/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": process.env.ADMIN_API_KEY || "super-secret-admin-key-2026",
      },
      body: JSON.stringify({ book: bookId, chapter: chapterId }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Error] API returned ${res.status}: ${err}`);
      return false;
    }

    const data = await res.json();
    console.log(`[Success] Generated ${data.summary?.approved || 0} approved questions for ${chapterId}`);
    return data;
  } catch (error) {
    console.error(`[Fatal Error] Could not generate for ${chapterId}:`, error);
    return false;
  }
}

async function runBulkGeneration() {
  console.log("Starting bulk AI generation across ALL chapters...");
  
  // You can limit this for testing
  const allChapters = [
    ...narayanReddyChapters.map(c => ({ book: 'narayan_reddy', id: c.id })),
    ...parkChapters.map(c => ({ book: 'park', id: c.id }))
  ];

  // We process sequentially to avoid rate limiting the AI APIs
  for (let i = 0; i < allChapters.length; i++) {
    const chapter = allChapters[i];
    let success = false;
    let attempts = 0;
    
    while (!success && attempts < 5) {
      attempts++;
      const result = await generateForChapter(chapter.book, chapter.id);
      
      if (result) {
        success = true;
        console.log("Waiting 15 seconds before next chapter...");
        await new Promise(r => setTimeout(r, 15000));
      } else {
        const backoff = Math.min(60000 * 5, Math.pow(2, attempts) * 15000);
        console.log(`[Rate Limit / Error] Waiting ${backoff/1000}s before retrying ${chapter.id} (Attempt ${attempts})...`);
        await new Promise(r => setTimeout(r, backoff));
      }
    }
    
    if (!success) {
      console.error(`[Fatal] Failed to generate for ${chapter.id} after 5 attempts. Skipping...`);
    }
  }
  
  console.log("Bulk generation complete.");
}

runBulkGeneration();
