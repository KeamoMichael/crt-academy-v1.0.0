
import { PlacementQuestion } from "../types";

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "p1",
    question: "What is the primary function of the Asian Range?",
    options: ["To set the trend for the day", "To accumulate orders (Liquidity)", "To provide high probability entries", "Nothing, it's just night time"],
    correctIndex: 1,
    weight: 1,
    relatedLevel: 0 // Basic
  },
  {
    id: "p2",
    question: "If London creates the Low of the Day, what do we expect New York to do?",
    options: ["Reverse completely", "Create a lower low", "Expand in the trend direction (Continuation)", "Chop sideways"],
    correctIndex: 2,
    weight: 2,
    relatedLevel: 0 // Time logic
  },
  {
    id: "p3",
    question: "Price sweeps a High and closes back INSIDE the range. What is this called?",
    options: ["Breakout", "Turtle Soup (Purge)", "Continuation", "Momentum Shift"],
    correctIndex: 1,
    weight: 3,
    relatedLevel: 1 // Range Logic
  },
  {
    id: "p4",
    question: "In a Weekly Profile, which day typically forms the Low of the Week in a Bullish market?",
    options: ["Monday", "Tuesday", "Thursday", "Friday"],
    correctIndex: 1,
    weight: 4,
    relatedLevel: 2 // Profile Logic
  },
  {
    id: "p5",
    question: "You see a setup at 6:30 PM NY time. Do you take it?",
    options: ["Yes, if the chart looks good", "No, Time > Price (Dead Zone)", "Yes, it's the Asian Open", "Only if it's XAUUSD"],
    correctIndex: 1,
    weight: 2,
    relatedLevel: 0 // Discipline
  }
];

export const calculatePlacementLevel = (answers: Record<string, number>): number => {
  let score = 0;
  let maxScore = 0;

  PLACEMENT_QUESTIONS.forEach(q => {
    maxScore += q.weight;
    if (answers[q.id] === q.correctIndex) {
      score += q.weight;
    }
  });

  const percentage = score / maxScore;

  if (percentage > 0.85) return 2; // Skip to Level 3 (Advanced)
  if (percentage > 0.5) return 1;  // Skip to Level 2 (Intermediate)
  return 0; // Start at Level 1
};
