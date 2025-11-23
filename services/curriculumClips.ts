// Curriculum-to-Clip Mapping System
// Maps curriculum lessons to visual clips with source references

export interface ClipMetadata {
    id: string;
    lessonId: string;
    moduleId: string;
    courseId: string;
    clipPurpose: 'demo' | 'practice' | 'assessment' | 'revision';
    sourceFile: string;
    sourcePageOrSlide: string; // Page number or slide identifier from PDF
    symbol: string;
    timeframe: string;
    replaySeed?: number; // For deterministic replay
    startCandleIndex?: number;
    endCandleIndex?: number;
    description: string;
    interactionPolicy?: {
        maxAttempts: number;
        allowRewind: boolean;
        showHints: boolean;
        heartsCost: number;
    };
    gradingTolerances?: {
        timeframe: string;
        priceTolerance: number;
        timeTolerance: number;
    };
}

// Course 1: CRT Foundations
export const COURSE_1_CLIPS: ClipMetadata[] = [
    {
        id: 'c1-m1-demo-1',
        lessonId: 'l1-m1-2',
        moduleId: 'M1',
        courseId: 'L1',
        clipPurpose: 'demo',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: 'Section 1 - What is CRT',
        symbol: 'XAUUSD',
        timeframe: '1D',
        description: 'Every candle is a range - basic demonstration',
        interactionPolicy: {
            maxAttempts: 0,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    },
    {
        id: 'c1-m1-practice-1',
        lessonId: 'l1-m1-2',
        moduleId: 'M1',
        courseId: 'L1',
        clipPurpose: 'practice',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: 'Section 1 - Candle Anatomy',
        symbol: 'XAUUSD',
        timeframe: '4H',
        description: 'Draw the candle range - interactive drill',
        interactionPolicy: {
            maxAttempts: 3,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    }
];

// Course 2: Structure of CRT Models
export const COURSE_2_CLIPS: ClipMetadata[] = [
    {
        id: 'c2-m3-demo-1',
        lessonId: 'l2-m3-1',
        moduleId: 'M3',
        courseId: 'L2',
        clipPurpose: 'demo',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: 'Model #1 slide',
        symbol: 'XAUUSD',
        timeframe: '1D',
        description: 'Model #1: Bearish entry demonstration',
        interactionPolicy: {
            maxAttempts: 0,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    },
    {
        id: 'c2-m3-assessment-1',
        lessonId: 'l2-m3-1',
        moduleId: 'M3',
        courseId: 'L2',
        clipPurpose: 'assessment',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: 'Model #1 examples',
        symbol: 'XAUUSD',
        timeframe: '1D',
        replaySeed: 12345,
        description: 'Model ID Drill - identify the model type',
        interactionPolicy: {
            maxAttempts: 2,
            allowRewind: false,
            showHints: false,
            heartsCost: 1
        }
    }
];

// Course 3: Secrets of the Three Candles
export const COURSE_3_CLIPS: ClipMetadata[] = [
    {
        id: 'c3-m27-demo-1',
        lessonId: 'l3-m27-1',
        moduleId: 'M2.7',
        courseId: 'L3',
        clipPurpose: 'demo',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: '1D) Secrets of the three candles',
        symbol: 'XAUUSD',
        timeframe: '1D',
        description: 'Three candle model demonstration - Accumulation, Manipulation, Distribution',
        interactionPolicy: {
            maxAttempts: 0,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    },
    {
        id: 'c3-m27-practice-1',
        lessonId: 'l3-m27-1',
        moduleId: 'M2.7',
        courseId: 'L3',
        clipPurpose: 'practice',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: 'Three candles examples',
        symbol: 'XAUUSD',
        timeframe: '1H',
        description: 'Fractal Peeler - identify candle structure across timeframes',
        interactionPolicy: {
            maxAttempts: 3,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    }
];

// Course 4: CRT Entry Models
export const COURSE_4_CLIPS: ClipMetadata[] = [
    {
        id: 'c4-entry-demo-1',
        lessonId: 'l4-m6-1',
        moduleId: 'M6',
        courseId: 'L4',
        clipPurpose: 'demo',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: '1D) Secrets of the three candles, CRT entry models',
        symbol: 'XAUUSD',
        timeframe: '1D',
        description: 'Model #1 entry demonstration - Daily timeframe',
        interactionPolicy: {
            maxAttempts: 0,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    },
    {
        id: 'c4-entry-assessment-1',
        lessonId: 'l4-m6-2',
        moduleId: 'M6',
        courseId: 'L4',
        clipPurpose: 'assessment',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: 'Model #1 execution examples',
        symbol: 'XAUUSD',
        timeframe: '1H',
        replaySeed: 54321,
        description: 'Entry Execution Drill - place entry, SL, TP with pot protection',
        interactionPolicy: {
            maxAttempts: 2,
            allowRewind: false,
            showHints: false,
            heartsCost: 1
        },
        gradingTolerances: {
            timeframe: '1H',
            priceTolerance: 0.5, // 0.5% price tolerance
            timeTolerance: 1 // 1 candle tolerance
        }
    }
];

// Course 5: CRT SMT & Correlation
export const COURSE_5_CLIPS: ClipMetadata[] = [
    {
        id: 'c5-smt-demo-1',
        lessonId: 'c5-smt-1',
        moduleId: 'M5',
        courseId: 'L5',
        clipPurpose: 'demo',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: '1D) Secrets of the three candles, SMT',
        symbol: 'XAUUSD',
        timeframe: '1D',
        description: 'SMT demonstration - correlation divergence',
        interactionPolicy: {
            maxAttempts: 0,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    }
];

// Course 6: ICT Foundations
export const COURSE_6_CLIPS: ClipMetadata[] = [
    {
        id: 'c6-ict-demo-1',
        lessonId: 'c6-ict-1',
        moduleId: 'M6',
        courseId: 'L6',
        clipPurpose: 'demo',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: '1E) ICT and CRT',
        symbol: 'XAUUSD',
        timeframe: '4H',
        description: 'OHLC relationships and liquidity pools',
        interactionPolicy: {
            maxAttempts: 0,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    }
];

// Course 7: Psychology & Professional Practice
export const COURSE_7_CLIPS: ClipMetadata[] = [
    {
        id: 'c7-journal-demo-1',
        lessonId: 'c7-journal-1',
        moduleId: 'M7',
        courseId: 'L7',
        clipPurpose: 'demo',
        sourceFile: 'Written lectures CRT unlocked.pdf',
        sourcePageOrSlide: '2A) The importance of journalling',
        symbol: 'XAUUSD',
        timeframe: '1D',
        description: 'Reflective replay task example',
        interactionPolicy: {
            maxAttempts: 0,
            allowRewind: true,
            showHints: true,
            heartsCost: 0
        }
    }
];

// Master mapping
export const CURRICULUM_CLIP_MAP: Record<string, ClipMetadata[]> = {
    'L1': COURSE_1_CLIPS,
    'L2': COURSE_2_CLIPS,
    'L3': COURSE_3_CLIPS,
    'L4': COURSE_4_CLIPS,
    'L5': COURSE_5_CLIPS,
    'L6': COURSE_6_CLIPS,
    'L7': COURSE_7_CLIPS
};

// Get clips for a specific lesson
export const getClipsForLesson = (lessonId: string): ClipMetadata[] => {
    const allClips = Object.values(CURRICULUM_CLIP_MAP).flat();
    return allClips.filter(clip => clip.lessonId === lessonId);
};

// Get clips for a specific course
export const getClipsForCourse = (courseId: string): ClipMetadata[] => {
    return CURRICULUM_CLIP_MAP[courseId] || [];
};

