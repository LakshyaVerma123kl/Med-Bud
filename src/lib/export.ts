import { Question } from "./types";

/**
 * Strips markdown and HTML tags for a clean string, but preserves basic structure.
 */
function stripMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/[*_~`]/g, "") // Remove bold, italic, strikethrough, inline code
    .replace(/<[^>]+>/g, "") // Remove any stray HTML tags
    .replace(/\n/g, " ") // Replace newlines with spaces to avoid breaking TSV
    .replace(/\t/g, " "); // Replace tabs with spaces to avoid breaking TSV
}

/**
 * Generates a TSV formatted string compatible with Anki import.
 * Format: Front \t Back
 * Front: The question.
 * Back: The options, the correct answer, and the explanation.
 */
export function generateAnkiTSV(questions: Question[]): string {
  let tsvContent = "";

  questions.forEach((q) => {
    const front = stripMarkdown(q.question);

    // Format options as a lettered list: A) Option 1 <br> B) Option 2
    const optionsHtml = q.options
      .map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${stripMarkdown(opt)}`)
      .join("<br>");

    const correctAnswer = stripMarkdown(q.options[q.correct_index]);
    const explanation = stripMarkdown(q.explanation);

    const back = `${optionsHtml}<br><br><b>Correct Answer:</b> ${correctAnswer}<br><br><b>Explanation:</b><br>${explanation}`;

    tsvContent += `${front}\t${back}\n`;
  });

  return tsvContent;
}

/**
 * Triggers a browser download of the given content.
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports markdown content as a downloadable .md file.
 * Prepends a title header and cleans up formatting.
 */
export function downloadMarkdown(content: string, title: string, filename: string) {
  const header = `# ${title}\n\n_Exported from MedQuiz Pro_\n\n---\n\n`;
  const fullContent = header + content;
  downloadFile(fullContent, filename, "text/markdown");
}
