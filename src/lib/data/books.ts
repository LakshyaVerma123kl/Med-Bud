import { Book } from "@/lib/types";

export const books: Book[] = [
  {
    id: "narayan_reddy",
    title: "The Essentials of Forensic Medicine & Toxicology",
    author: "K.S. Narayan Reddy",
    subject: "Forensic Medicine & Toxicology",
    description:
      "The definitive Indian textbook on forensic medicine, covering identification, thanatology, injuries, asphyxia, sexual offences, toxicology, and medical jurisprudence.",
    icon: "⚖️",
    chapterCount: 20,
    totalQuestions: 295,
    color: "#1E3A8A",
    gradient: "from-blue-900 via-blue-800 to-indigo-900",
  },
  {
    id: "park",
    title: "Park's Textbook of Preventive & Social Medicine",
    author: "K. Park",
    subject: "Community Medicine",
    description:
      "The gold-standard reference for community medicine, covering epidemiology, communicable and non-communicable diseases, nutrition, MCH, immunization, and national health programmes.",
    icon: "🏥",
    chapterCount: 23,
    totalQuestions: 324,
    color: "#065F46",
    gradient: "from-emerald-900 via-teal-800 to-green-900",
  },
];

export function getBookById(bookId: string): Book | undefined {
  return books.find((b) => b.id === bookId);
}
