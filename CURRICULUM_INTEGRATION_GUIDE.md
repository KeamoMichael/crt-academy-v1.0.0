# CRT Academy Curriculum Integration Guide

## Overview

This document outlines the integration of TradingView-quality visual systems with the complete 7-course CRT Academy curriculum, based on the "Written lectures CRT unlocked.pdf" document.

## System Architecture

### Core Components

1. **CandleChart Component** (`components/charts/CandleChart.tsx`)
   - TradingView-quality candlestick rendering
   - Canvas-based for performance
   - Real-time hover tooltips
   - Grid and price scale support

2. **BarReplay Engine** (`components/charts/BarReplay.tsx`)
   - Deterministic candle-by-candle playback
   - Speed control (0.5x - 5x)
   - Rewind support (configurable)
   - Progress tracking

3. **Candle Data Generator** (`services/candleDataGenerator.ts`)
   - Realistic OHLC data generation
   - Pattern-based generation (turtle-soup, model-1, etc.)
   - Seed-based deterministic generation for exams
   - Timeframe-aware volatility

4. **Curriculum Clip Mapping** (`services/curriculumClips.ts`)
   - Maps lessons to visual clips
   - Source file references (PDF pages)
   - Interaction policies
   - Grading tolerances

## Integration Status

### ✅ Completed

1. **Profile Icons System**
   - Built-in icon selection (20+ trading/finance themed icons)
   - Custom upload support
   - Circular display throughout platform

2. **Candle Rendering Foundation**
   - High-quality canvas-based rendering
   - TradingView-style appearance
   - OHLC accuracy

3. **Bar-Replay Engine**
   - Playback controls
   - Speed adjustment
   - Progress tracking

4. **Curriculum Clip Mapping Structure**
   - Metadata system for clips
   - Source file references
   - Interaction policies defined

### 🚧 In Progress

1. **Interactive Drills**
   - Range Drill (basic structure)
   - Model ID Drill (needs implementation)
   - Entry Execution Drill (needs implementation)

2. **Curriculum Integration**
   - Lesson-to-clip binding
   - Timeframe gating per course
   - Exam clip seeding

### 📋 Pending

1. **Complete Interactive Modules**
   - Fractal Peeler update
   - Model ID Classifier
   - Entry Execution with SL/TP
   - SMT Correlation Drill
   - Liquidity Map Exercise

2. **Exam System**
   - Seeded clip generation
   - Instructor replay
   - Grading rubrics
   - Revision block generation

3. **Authoring UI**
   - Clip selection from PDF
   - Metadata editor
   - Preview system

## Next Steps

### Immediate (High Priority)

1. **Update FractalPeeler** to use new CandleChart component
2. **Create Model ID Drill** with pattern recognition
3. **Integrate clips with lessons** in TheoryVault
4. **Update Simulator** to use new candle rendering

### Short Term

1. **Complete all interactive drills** from curriculum
2. **Build exam clip system** with seeding
3. **Create revision block generator**
4. **Add instructor review UI**

### Long Term

1. **PDF extraction tooling** for clip creation
2. **Advanced pattern recognition** for auto-grading
3. **Multi-symbol support** for advanced exercises
4. **Performance optimization** for large datasets

## Usage Examples

### Using BarReplay in a Lesson

```tsx
import { BarReplay } from '../components/charts/BarReplay';
import { generateCurriculumPattern } from '../services/candleDataGenerator';

const candles = generateCurriculumPattern('model-1-daily', '1D');
<BarReplay 
    candles={candles}
    timeframe="1D"
    speed={2}
    allowRewind={true}
    onComplete={() => console.log('Replay complete')}
/>
```

### Using Curriculum Clips

```tsx
import { getClipsForLesson } from '../services/curriculumClips';

const clips = getClipsForLesson('l4-m6-1');
// Returns all clips (demo, practice, assessment) for that lesson
```

## Notes

- All candle data should respect the user's locked symbol
- Timeframes are gated by course level
- Exams use seeded generation for consistency
- All clips must reference source PDF pages

