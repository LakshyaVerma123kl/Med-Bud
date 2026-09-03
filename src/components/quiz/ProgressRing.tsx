"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 5,
  className = "",
  showLabel = true,
  color,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (color) return color;
    if (progress >= 80) return "var(--success)";
    if (progress >= 60) return "var(--accent)";
    if (progress >= 40) return "#F59E0B";
    return "var(--error)";
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.3}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-bold" style={{ color: getColor() }}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
