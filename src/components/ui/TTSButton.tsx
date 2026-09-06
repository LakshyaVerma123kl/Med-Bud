"use client";

import { useState, useEffect } from "react";
import { Volume2, Square } from "lucide-react";

interface TTSButtonProps {
  text: string;
  className?: string;
}

export function TTSButton({ text, className = "" }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
    }
    
    // Stop speaking when component unmounts
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  const toggleSpeech = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const cleanText = text
        .replace(/[*#_`]/g, "") // Remove basic markdown
        .replace(/\n/g, ". "); // Replace newlines with pauses
        
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggleSpeech}
      title={isPlaying ? "Stop reading" : "Read aloud"}
      className={`p-1.5 rounded-md transition-colors ${
        isPlaying 
          ? "bg-primary text-white" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      } ${className}`}
    >
      {isPlaying ? (
        <Square className="w-4 h-4 fill-current" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );
}
