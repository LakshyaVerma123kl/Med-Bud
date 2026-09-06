"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { ProgressRing } from "@/components/quiz/ProgressRing";

type TimerMode = "focus" | "break";

interface PomodoroState {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  lastTick: number;
}

export function Pomodoro() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Total time for current mode to calculate progress percentage
  const totalTime = mode === "focus" ? 25 * 60 : 5 * 60;

  // Load state from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("pomodoroState");
    if (saved) {
      try {
        const parsed: PomodoroState = JSON.parse(saved);
        const now = Date.now();
        if (parsed.isActive) {
          // Calculate elapsed time
          const elapsedSeconds = Math.floor((now - parsed.lastTick) / 1000);
          const newTimeLeft = Math.max(0, parsed.timeLeft - elapsedSeconds);
          
          if (newTimeLeft === 0) {
            const nextMode = parsed.mode === "focus" ? "break" : "focus";
            const nextTime = nextMode === "focus" ? 25 * 60 : 5 * 60;
            setIsActive(false);
            setMode(nextMode);
            setTimeLeft(nextTime);
            localStorage.setItem("pomodoroState", JSON.stringify({
              mode: nextMode,
              timeLeft: nextTime,
              isActive: false,
              lastTick: Date.now()
            }));
          } else {
            setTimeLeft(newTimeLeft);
            setIsActive(true);
            setMode(parsed.mode);
          }
        } else {
          setTimeLeft(parsed.timeLeft);
          setMode(parsed.mode);
          setIsActive(false);
        }
      } catch (e) {
        console.error("Failed to parse pomodoro state");
      }
    }
  }, []);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    const newTime = mode === "focus" ? 25 * 60 : 5 * 60;
    setTimeLeft(newTime);
    localStorage.setItem("pomodoroState", JSON.stringify({
      mode,
      timeLeft: newTime,
      isActive: false,
      lastTick: Date.now()
    }));
  }, [mode]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    const newTime = newMode === "focus" ? 25 * 60 : 5 * 60;
    setTimeLeft(newTime);
    localStorage.setItem("pomodoroState", JSON.stringify({
      mode: newMode,
      timeLeft: newTime,
      isActive: false,
      lastTick: Date.now()
    }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          localStorage.setItem("pomodoroState", JSON.stringify({
            mode,
            timeLeft: newTime,
            isActive: true,
            lastTick: Date.now()
          }));
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Switch mode automatically
      const nextMode = mode === "focus" ? "break" : "focus";
      switchMode(nextMode);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Prevent hydration mismatch
  if (!isMounted) return <div className="clean-card rounded-3xl p-6 sm:p-7 h-[340px] flex items-center justify-center border border-border" />;

  const progressPercent = (timeLeft / totalTime) * 100;
  
  // Dynamic styles for the Break Screen feature
  const cardStyle = mode === "break" 
    ? "bg-amber-500/10 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)]" 
    : "bg-card border-border";

  return (
    <div className={`clean-card rounded-3xl p-6 sm:p-7 flex flex-col h-full border transition-all duration-500 ${cardStyle}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-bold flex items-center gap-2 ${mode === 'break' ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
          {mode === "focus" ? (
            <Brain className="w-5 h-5 text-primary" />
          ) : (
            <Coffee className="w-5 h-5 text-amber-500 animate-pulse" />
          )}
          {mode === "focus" ? "Focus Timer" : "Break Time"}
        </h2>
        
        {/* Mode Toggle */}
        <div className="flex bg-background/50 p-1 rounded-xl shadow-inner backdrop-blur-sm border border-border/50">
          <button
            onClick={() => switchMode("focus")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "focus" 
                ? "bg-primary text-white shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            25m
          </button>
          <button
            onClick={() => switchMode("break")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === "break" 
                ? "bg-amber-500 text-white shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            5m
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative mb-8">
          <ProgressRing 
            progress={progressPercent} 
            size={160} 
            strokeWidth={10} 
            color={mode === "focus" ? "hsl(var(--primary))" : "#f59e0b"} 
            showLabel={false}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold tracking-tight font-mono ${mode === 'break' ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-background/80 border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95 shadow-sm"
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
