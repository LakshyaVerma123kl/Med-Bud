import { MotivationalFeedback } from "./types";

const correctResponses: MotivationalFeedback[] = [
  { message: "Excellent! Textbook-perfect answer.", type: "correct", emoji: "🎯" },
  { message: "Brilliant. You have this concept locked in.", type: "correct", emoji: "🧠" },
  { message: "Outstanding! High-yield knowledge right there.", type: "correct", emoji: "⭐" },
  { message: "Perfect. Keep this energy going.", type: "correct", emoji: "🔥" },
  { message: "You're on fire! Mastery level rising.", type: "correct", emoji: "📈" },
  { message: "Nailed it! That's exam-ready knowledge.", type: "correct", emoji: "💎" },
  { message: "Superb! You clearly know your material.", type: "correct", emoji: "🏆" },
  { message: "Spot on! That's the mark of a prepared student.", type: "correct", emoji: "✨" },
  { message: "Phenomenal recall! Keep building momentum.", type: "correct", emoji: "🚀" },
  { message: "That's gold-standard knowledge. Well done!", type: "correct", emoji: "🥇" },
];

const incorrectResponses: MotivationalFeedback[] = [
  { message: "Not quite, but great attempt. Let's fix this concept permanently.", type: "incorrect", emoji: "💪" },
  { message: "Close one! Here's the correct understanding…", type: "incorrect", emoji: "🔍" },
  { message: "Learning moment unlocked. This is how experts are made.", type: "incorrect", emoji: "📚" },
  { message: "Good thinking, but the standard answer is different. Here's why…", type: "incorrect", emoji: "💡" },
  { message: "No worries — this is a common confusion point. Let's clarify it.", type: "incorrect", emoji: "🤝" },
  { message: "Almost there! This subtlety trips up many students.", type: "incorrect", emoji: "🎓" },
  { message: "Not this time, but you'll remember it forever now.", type: "incorrect", emoji: "🧩" },
  { message: "Every great doctor missed a few along the way. Keep going!", type: "incorrect", emoji: "❤️" },
  { message: "Think of this as building a stronger foundation.", type: "incorrect", emoji: "🏗️" },
  { message: "That was tricky! Now you have the correct answer memorized.", type: "incorrect", emoji: "🌟" },
];

export function getMotivationalFeedback(isCorrect: boolean): MotivationalFeedback {
  const pool = isCorrect ? correctResponses : incorrectResponses;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getStreakMessage(streak: number): string {
  if (streak >= 20) return "🔥 LEGENDARY! 20+ streak — you're unstoppable!";
  if (streak >= 15) return "🌟 Incredible! 15+ streak — mastery at its finest!";
  if (streak >= 10) return "⚡ Amazing! 10+ streak — you're in the zone!";
  if (streak >= 7) return "🎯 Fantastic! 7+ streak — keep the momentum!";
  if (streak >= 5) return "✨ Great run! 5+ in a row — you're getting stronger!";
  if (streak >= 3) return "💪 Nice streak of 3! Building confidence!";
  return "";
}

export function getAccuracyMessage(accuracy: number): string {
  if (accuracy >= 95) return "Near-perfect performance! You're exam-ready.";
  if (accuracy >= 85) return "Excellent accuracy! Strong command of the material.";
  if (accuracy >= 75) return "Good job! You have a solid foundation.";
  if (accuracy >= 60) return "Decent start! Focus on weak areas to improve.";
  return "Keep practicing! Every attempt makes you stronger.";
}

export function getCompletionMessage(accuracy: number): string {
  if (accuracy >= 90) return "🏆 Outstanding performance! You've mastered this material.";
  if (accuracy >= 75) return "🌟 Great job! A few more sessions and you'll ace this.";
  if (accuracy >= 60) return "💪 Solid effort! Review the explanations to strengthen weak spots.";
  return "📚 Good practice session! Focus on the explanations and try again — you'll improve fast.";
}
