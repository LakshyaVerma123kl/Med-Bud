"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { ProgressRing } from "@/components/quiz/ProgressRing";

type TimerMode = "focus" | "break";

export function Pomodoro() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Total time for current mode to calculate progress percentage
  const totalTime = mode === "focus" ? 25 * 60 : 5 * 60;

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  }, [mode]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === "focus" ? 25 * 60 : 5 * 60);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play a sound or show notification here in a real app
      // Auto-switch to break if focus finishes?
      if (mode === "focus") {
        switchMode("break");
      } else {
        switchMode("focus");
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Progress is from 0 to 100, we want it to decrease as time goes down
  const progressPercent = (timeLeft / totalTime) * 100;

  return (
    <div className="clean-card rounded-3xl p-6 sm:p-7 flex flex-col h-full bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          {mode === "focus" ? (
            <Brain className="w-5 h-5 text-primary" />
          ) : (
            <Coffee className="w-5 h-5 text-amber-500" />
          )}
          {mode === "focus" ? "Focus Timer" : "Break Time"}
        </h2>
        
        {/* Mode Toggle */}
        <div className="flex bg-muted/50 p-1 rounded-xl">
          <button
            onClick={() => switchMode("focus")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "focus" 
                ? "bg-background text-primary shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            25m
          </button>
          <button
            onClick={() => switchMode("break")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "break" 
                ? "bg-background text-amber-500 shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            5m
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <ProgressRing 
            progress={progressPercent} 
            size={180} 
            strokeWidth={10} 
            color={mode === "focus" ? "hsl(var(--primary))" : "#f59e0b"} 
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold tracking-tight font-mono text-foreground">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTimer}
            className={`w-16 h-16 flex items-center justify-center rounded-2xl text-white shadow-lg transition-all active:scale-95 ${
              isActive 
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25" 
                : mode === "focus" 
                  ? "bg-primary hover:bg-primary/90 shadow-primary/25"
                  : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
            }`}
          >
            {isActive ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current translate-x-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
