// High-fidelity candle data generator that creates TradingView-quality candles
// Based on real-world patterns from the CRT curriculum document

import { Candle, Timeframe } from '../types';

interface CandlePattern {
    name: string;
    description: string;
    candles: Candle[];
    timeframe: Timeframe;
}

// Generate realistic candles based on timeframe characteristics
export const generateRealisticCandles = (
    count: number,
    timeframe: Timeframe,
    basePrice: number = 2000,
    pattern?: 'bullish' | 'bearish' | 'ranging' | 'turtle-soup' | 'model-1'
): Candle[] => {
    const candles: Candle[] = [];
    
    // Timeframe-specific volatility
    const volatilityMap: Record<Timeframe, number> = {
        '1m': 0.5,
        '3m': 1,
        '5m': 1.5,
        '15m': 3,
        '30m': 5,
        '1H': 8,
        '2H': 12,
        '4H': 20,
        '1D': 50,
        '1W': 150,
        '1M': 400
    };

    const volatility = volatilityMap[timeframe] || 10;
    let currentPrice = basePrice;

    for (let i = 0; i < count; i++) {
        let open = currentPrice;
        let close: number;
        let high: number;
        let low: number;

        // Pattern-specific generation
        if (pattern === 'turtle-soup') {
            // Turtle Soup pattern: price breaks high/low then reclaims
            if (i < count * 0.3) {
                // Initial move up
                close = open + (volatility * (0.5 + Math.random() * 0.5));
            } else if (i < count * 0.4) {
                // Sweep of high
                high = open + volatility * 1.5;
                close = open - volatility * 0.3; // Reclaim
            } else {
                // Move to opposite end
                close = open - (volatility * (0.8 + Math.random() * 0.4));
            }
        } else if (pattern === 'model-1') {
            // Model #1: Thick up-close candle followed by down-close
            if (i < count * 0.5) {
                close = open + volatility * (1.2 + Math.random() * 0.5); // Thick bullish
            } else {
                close = open - volatility * (0.8 + Math.random() * 0.4); // Bearish reversal
            }
        } else if (pattern === 'bullish') {
            close = open + volatility * (0.3 + Math.random() * 0.7);
        } else if (pattern === 'bearish') {
            close = open - volatility * (0.3 + Math.random() * 0.7);
        } else {
            // Ranging
            close = open + (Math.random() - 0.5) * volatility * 0.6;
        }

        // Generate realistic wicks
        const bodyRange = Math.abs(close - open);
        const wickSize = volatility * (0.2 + Math.random() * 0.4);
        
        high = Math.max(open, close) + wickSize * Math.random();
        low = Math.min(open, close) - wickSize * Math.random();

        // Ensure high/low are reasonable
        high = Math.max(high, Math.max(open, close));
        low = Math.min(low, Math.min(open, close));

        candles.push({
            time: generateTimeString(i, timeframe),
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2))
        });

        currentPrice = close;
    }

    return candles;
};

const generateTimeString = (index: number, timeframe: Timeframe): string => {
    // Generate realistic time strings based on timeframe
    if (timeframe === '1D') {
        return `Day ${index + 1}`;
    } else if (timeframe === '1W') {
        return `Week ${index + 1}`;
    } else if (timeframe === '1M') {
        return `Month ${index + 1}`;
    } else {
        // For intraday, generate HH:mm format
        const hours = Math.floor(index / (60 / getMinutesForTimeframe(timeframe)));
        const minutes = (index * getMinutesForTimeframe(timeframe)) % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
};

const getMinutesForTimeframe = (tf: Timeframe): number => {
    const map: Record<Timeframe, number> = {
        '1m': 1, '3m': 3, '5m': 5, '15m': 15, '30m': 30,
        '1H': 60, '2H': 120, '4H': 240,
        '1D': 1440, '1W': 10080, '1M': 43200
    };
    return map[tf] || 60;
};

// Generate candles from curriculum document patterns
export const generateCurriculumPattern = (
    patternName: string,
    timeframe: Timeframe,
    symbol: string = 'XAUUSD'
): Candle[] => {
    // These patterns are based on the document examples
    switch (patternName) {
        case 'model-1-daily':
            // Model #1 on Daily: Thick up-close, then down-close below
            return generateRealisticCandles(20, timeframe, 2000, 'model-1');
        
        case 'three-candles':
            // Accumulation, Manipulation, Distribution
            const acc = generateRealisticCandles(5, timeframe, 2000, 'bullish');
            const manip = generateRealisticCandles(5, timeframe, acc[acc.length - 1].close, 'ranging');
            const dist = generateRealisticCandles(5, timeframe, manip[manip.length - 1].close, 'bearish');
            return [...acc, ...manip, ...dist];
        
        case 'turtle-soup':
            return generateRealisticCandles(15, timeframe, 2000, 'turtle-soup');
        
        case 'crt-ote':
            // OTE pattern: Impulsive leg, then deep retracement
            const impulse = generateRealisticCandles(8, timeframe, 2000, 'bullish');
            const retrace = generateRealisticCandles(5, timeframe, impulse[impulse.length - 1].close, 'bearish');
            return [...impulse, ...retrace];
        
        default:
            return generateRealisticCandles(20, timeframe, 2000, 'ranging');
    }
};

// Seed-based deterministic generation for exams
export class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}

export const generateSeededCandles = (
    count: number,
    timeframe: Timeframe,
    seed: number,
    basePrice: number = 2000
): Candle[] => {
    const rng = new SeededRandom(seed);
    const candles: Candle[] = [];
    const volatility = timeframe === '1D' ? 50 : timeframe === '1H' ? 8 : 3;
    
    let currentPrice = basePrice;

    for (let i = 0; i < count; i++) {
        const open = currentPrice;
        const change = (rng.next() - 0.5) * volatility * 2;
        const close = open + change;
        const wick = volatility * rng.next() * 0.5;
        
        const high = Math.max(open, close) + wick;
        const low = Math.min(open, close) - wick;

        candles.push({
            time: generateTimeString(i, timeframe),
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2))
        });

        currentPrice = close;
    }

    return candles;
};

