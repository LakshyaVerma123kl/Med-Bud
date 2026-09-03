import { Metadata } from "next";
import { getBookById } from "@/lib/data/books";
import { BookId } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ bookId: string }> }): Promise<Metadata> {
  const { bookId } = await params;
  const book = getBookById(bookId as BookId);

  if (!book) {
    return {
      title: "Book Not Found - MedQuiz",
    };
  }

  return {
    title: `${book.subject} Quiz Bank - MedQuiz Pro`,
    description: `Master ${book.subject} with highly accurate MCQs based on ${book.author}'s textbook.`,
    openGraph: {
      title: `${book.subject} Quiz Bank - MedQuiz Pro`,
      description: `Master ${book.subject} with highly accurate MCQs based on ${book.author}'s textbook.`,
    },
  };
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
