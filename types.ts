
export enum View {
  DASHBOARD = 'DASHBOARD',
  VAULT = 'VAULT',
  SIMULATOR = 'SIMULATOR',
  TERMINAL = 'TERMINAL',
  SETTINGS = 'SETTINGS',
  ONBOARDING = 'ONBOARDING',
  PLACEMENT = 'PLACEMENT',
  FINAL_EXAM = 'FINAL_EXAM'
}

export type Timeframe = '1m' | '3m' | '5m' | '15m' | '30m' | '1H' | '2H' | '4H' | '1D' | '1W' | '1M';

export interface Candle {
  time: string; // ISO string or HH:mm
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export enum Killzone {
  ASIA = 'ASIA',
  LONDON = 'LONDON',
  NY_AM = 'NY_AM',
  NY_PM = 'NY_PM',
  NONE = 'NONE'
}

export interface Trade {
  id: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice?: number;
  pnl?: number;
  timestamp: string;
  score: number; // Gamification score based on timing/setup
  notes?: string;
  stopLoss?: number;
  timeframe?: Timeframe;
}

export interface WeeklyProfile {
  day: string;
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  focus: string;
}

export interface SimulatorState {
  balance: number;
  trades: Trade[];
  currentCandleIndex: number;
  isPlaying: boolean;
  selectedTimeframe: Timeframe;
}

// --- CURRICULUM TYPES ---

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTERY';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or text
  componentId?: 'PEELER' | 'TIME_SLIDER' | 'RANGE_CALC' | 'TS_ANIMATION' | 'TSQ_VISUALIZER' | 'WEEKLY_PROFILE' | 'ALIGNMENT_MODEL' | 'CRT_CLASSIFIER' | 'CRT_VARIATIONS' | 'LTF_EXECUTION';
  quiz?: QuizQuestion; // Legacy single question
  questions?: QuizQuestion[]; // Multi-question support
  durationMin: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface LevelExam {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passThreshold: number; // Percentage required to pass (e.g., 80)
  type?: 'QUIZ' | 'SIMULATION'; // Distinguish between multiple choice and live chart exam
}

export interface Level {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  modules: Module[];
  exam?: LevelExam; // The "Boss Fight" to unlock next level
  criteria: {
    minXPMultiplier: number; 
  };
  allowedTimeframes: Timeframe[];
}

export interface UserProgress {
  symbol: string; // Locked symbol (e.g., 'EURUSD')
  level: number; // Current level index (0-3)
  completedLessons: string[]; // IDs of completed lessons
  examsPassed: string[]; // IDs of passed exams
  xp: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  lastRefill?: string; // ISO Date
  weaknesses?: string[]; // Topics the user failed frequently
  placementTaken?: boolean; // Has the user taken the initial assessment?
}

export interface PlacementQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  weight: number; // Higher weight = more advanced question
  relatedLevel: number;
}

// --- EXAM ENGINE TYPES ---

export interface ExamMarker {
    id: string;
    type: 'RANGE_HIGH' | 'RANGE_LOW' | 'PURGE_FLAG' | 'ENTRY';
    price: number;
    timeIndex: number;
    timestamp: string;
}

export interface ExamResult {
    passed: boolean;
    score: number;
    feedback: string[];
    metrics: {
        rangeAccuracy: number;
        timing: number;
        riskManagement: number;
    }
}
