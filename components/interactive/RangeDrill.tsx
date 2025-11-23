import React, { useState, useRef } from 'react';
import { CandleChart } from '../charts/CandleChart';
import { BarReplay } from '../charts/BarReplay';
import { Candle, Timeframe } from '../../types';
import { generateCurriculumPattern } from '../../services/candleDataGenerator';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface RangeDrillProps {
    onComplete: (score: number) => void;
    onHeartLoss: () => void;
    timeframe?: Timeframe;
}

// Interactive drill: Draw the Candle Range
export const RangeDrill: React.FC<RangeDrillProps> = ({ 
    onComplete, 
    onHeartLoss,
    timeframe = '15m'
}) => {
    const [candles] = useState<Candle[]>(() => generateCurriculumPattern('ranging', timeframe));
    const [selectedCandle, setSelectedCandle] = useState<number | null>(null);
    const [drawnRange, setDrawnRange] = useState<{ high: number; low: number } | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [attempts, setAttempts] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleCandleSelect = (index: number) => {
        if (score !== null) return; // Already completed
        setSelectedCandle(index);
    };

    const handleRangeDraw = (high: number, low: number) => {
        if (!selectedCandle || score !== null) return;
        setDrawnRange({ high, low });
    };

    const handleSubmit = () => {
        if (!selectedCandle || !drawnRange) return;

        const candle = candles[selectedCandle];
        const tolerance = (candle.high - candle.low) * 0.05; // 5% tolerance
        
        const highCorrect = Math.abs(drawnRange.high - candle.high) <= tolerance;
        const lowCorrect = Math.abs(drawnRange.low - candle.low) <= tolerance;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (highCorrect && lowCorrect) {
            const newScore = 100;
            setScore(newScore);
            onComplete(newScore);
        } else {
            if (newAttempts >= 3) {
                onHeartLoss();
                setScore(0);
            }
        }
    };

    const handleReset = () => {
        setSelectedCandle(null);
        setDrawnRange(null);
        setScore(null);
        setAttempts(0);
    };

    return (
        <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-bold text-emerald-900 mb-2">Range Drawing Drill</h3>
                <p className="text-sm text-emerald-800">
                    Select a candle and draw its range (high to low). You have 3 attempts.
                </p>
            </div>

            {score === null ? (
                <>
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <CandleChart
                            candles={candles}
                            timeframe={timeframe}
                            width={700}
                            height={300}
                            onCandleHover={(candle, index) => {
                                if (candle) handleCandleSelect(index);
                            }}
                        />
                    </div>

                    {selectedCandle !== null && (
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="text-sm text-slate-700 mb-2">
                                Selected Candle: {selectedCandle + 1}
                            </p>
                            <p className="text-xs text-slate-500 mb-4">
                                Draw the range by clicking and dragging on the chart (implementation needed)
                            </p>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                                Submit Range
                            </button>
                        </div>
                    )}

                    <div className="text-sm text-slate-600">
                        Attempts: {attempts} / 3
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                    {score > 0 ? (
                        <>
                            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-emerald-900 mb-2">Correct!</h3>
                            <p className="text-slate-600">Score: {score}%</p>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-red-900 mb-2">Incorrect</h3>
                            <p className="text-slate-600 mb-4">You've lost a heart. Try again!</p>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2 mx-auto"
                            >
                                <RotateCcw size={16} />
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

