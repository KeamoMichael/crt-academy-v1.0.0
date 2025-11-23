
import { Killzone, WeeklyProfile } from "./types";

export const APP_NAME = "CRT Academy";

export const MAX_HEARTS = 5;
export const XP_PER_LESSON = 15;
export const XP_PER_PERFECT_LESSON = 25;
export const HEART_REGEN_MINUTES = 60;

export const KILLZONES: Record<Killzone, { start: string; end: string; label: string; color: string }> = {
  [Killzone.ASIA]: { start: "20:00", end: "00:00", label: "Asia Range", color: "text-slate-500" },
  [Killzone.LONDON]: { start: "02:00", end: "05:00", label: "London Open", color: "text-emerald-600" },
  [Killzone.NY_AM]: { start: "09:30", end: "11:00", label: "NY AM Session", color: "text-blue-600" },
  [Killzone.NY_PM]: { start: "13:30", end: "16:00", label: "NY PM Session", color: "text-indigo-600" },
  [Killzone.NONE]: { start: "00:00", end: "00:00", label: "Dead Zone", color: "text-gray-400" },
};

export const WEEKLY_PROFILES: WeeklyProfile[] = [
  { day: "Monday", bias: "Neutral", focus: "Range Formation & Accumulation" },
  { day: "Tuesday", bias: "Bullish", focus: "Low of Week Formation (Classic Buy Day)" },
  { day: "Wednesday", bias: "Bullish", focus: "Expansion / Continuation" },
  { day: "Thursday", bias: "Neutral", focus: "Reversal / High of Week" },
  { day: "Friday", bias: "Bearish", focus: "Retracement / Profit Taking" },
];

export const INITIAL_BALANCE = 10000;
export const MAX_DAILY_LOSS = 500;