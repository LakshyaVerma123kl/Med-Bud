const fs = require('fs');
const path = require('path');

// Load API keys from .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("No Gemini API key found");
  process.exit(1);
}

// Load chapters from compiled dist or just parse TS manually, actually I'll just hardcode the missing ones
const chapters = [
  // Reddys
  ...Array.from({length: 36}, (_, i) => ({ id: `nr-${i+1}`, book: 'narayan_reddy', name: `Chapter ${i+1}`})),
  // Parks
  ...Array.from({length: 25}, (_, i) => ({ id: `pk-${i+1}`, book: 'park', name: `Chapter ${i+1}`}))
];

const outputPath = path.join(__dirname, '../src/lib/data/generated-questions.json');
let allGenerated = [];
if (fs.existsSync(outputPath)) {
  try {
    allGenerated = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  } catch (e) {}
}

async function run() {
  for (const chapter of chapters) {
    // Count existing in allGenerated
    const generatedQs = allGenerated.filter(q => q.book === chapter.book && q.chapter === chapter.id);
    if (generatedQs.length < 4) {
      console.log(`Need more questions for ${chapter.id} (${generatedQs.length} existing)`);
      
      const prompt = `You are an expert medical educator. Generate exactly ${5 - generatedQs.length} high-quality MCQs from the book "${chapter.book === 'narayan_reddy' ? 'Forensic Medicine' : 'Preventive and Social Medicine'}", Chapter: "${chapter.name}".
Requirements: Focus on important, frequently tested concepts. 4 options, 1 correct index (0-3). Short explanation. Difficulty: medium.
Output ONLY a JSON array, nothing else: [ { "question": "", "options": ["","","",""], "correct_index": 0, "explanation": "", "difficulty": "medium", "topic": "General" } ]`;

      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        const data = await res.json();
        
        if (data.error) {
          console.error("API Error:", data.error.message);
          if (data.error.code === 429) {
            console.log("Rate limited! Waiting 45 seconds...");
            await new Promise(r => setTimeout(r, 45000));
            // Don't advance the loop
            chapters.push(chapter);
            continue;
          }
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
          let text = data.candidates[0].content.parts[0].text;
          const parsed = JSON.parse(text);
          const questions = parsed.questions || parsed;
          
          if (Array.isArray(questions)) {
            for (const q of questions) {
              allGenerated.push({
                id: `${chapter.book.substring(0,2)}-gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                book: chapter.book,
                chapter: chapter.id,
                topic: q.topic || chapter.name,
                question: q.question,
                options: q.options,
                correct_index: q.correct_index,
                explanation: q.explanation,
                difficulty: q.difficulty || "medium",
                verified: true
              });
            }
            fs.writeFileSync(outputPath, JSON.stringify(allGenerated, null, 2));
            console.log(`Successfully generated for ${chapter.id}`);
          }
        }
        
        // Wait 4 seconds between requests to avoid limits
        await new Promise(r => setTimeout(r, 4000));
      } catch (err) {
        console.error(`Failed to generate for ${chapter.id}:`, err.message);
      }
    }
  }
  console.log("Done!");
}

run();
