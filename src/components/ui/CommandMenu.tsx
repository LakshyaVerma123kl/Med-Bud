"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Book, Bookmark, Trophy, FileText, X } from "lucide-react";
import { books } from "@/lib/data/books";
import { narayanReddyChapters, parkChapters } from "@/lib/data/chapters";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 bg-background/80 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)} 
      />
      
      <Command 
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[60vh] sm:max-h-[500px]"
      >
        <div className="flex items-center px-4 py-3 border-b border-border/50 bg-background/50">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Command.Input 
            autoFocus
            placeholder="Search chapters, topics, or features..." 
            className="flex-1 bg-transparent border-none outline-none px-4 text-base placeholder:text-muted-foreground text-foreground"
          />
          <button 
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Command.List className="overflow-y-auto p-2 scroll-smooth">
          <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Quick Links" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            <Command.Item 
              onSelect={() => handleSelect("/dashboard")}
              className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm text-foreground"
            >
              <Trophy className="w-4 h-4" />
              Dashboard
            </Command.Item>
            <Command.Item 
              onSelect={() => handleSelect("/bookmarks")}
              className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm text-foreground"
            >
              <Bookmark className="w-4 h-4" />
              Bookmarks
            </Command.Item>
            <Command.Item 
              onSelect={() => handleSelect("/mock-exam")}
              className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm text-foreground"
            >
              <FileText className="w-4 h-4" />
              Grand Mock Exam
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Books" className="px-2 py-1.5 mt-2 text-xs font-semibold text-muted-foreground">
            {books.map(book => (
              <Command.Item 
                key={book.id}
                onSelect={() => handleSelect(`/book/${book.id}`)}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm text-foreground"
              >
                <span className="text-base">{book.icon}</span>
                <span className="truncate">{book.title}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Chapters" className="px-2 py-1.5 mt-2 text-xs font-semibold text-muted-foreground">
            {[...narayanReddyChapters, ...parkChapters].map((chapter) => (
              <Command.Item 
                key={chapter.id}
                value={`${chapter.id} ${chapter.name}`}
                onSelect={() => handleSelect(`/quiz?book=${chapter.id.startsWith("nr") ? "narayan_reddy" : "park"}&chapter=${chapter.id}`)}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary aria-selected:bg-primary/10 aria-selected:text-primary transition-colors text-sm text-foreground"
              >
                <Book className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="font-mono text-muted-foreground text-xs">{chapter.id.toUpperCase()}</span>
                <span className="truncate">{chapter.name}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
