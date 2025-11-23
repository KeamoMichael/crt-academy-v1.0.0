import React, { useState } from 'react';
import { BarReplay } from '../charts/BarReplay';
import { Candle, Timeframe } from '../../types';
import { generateCurriculumPattern, generateSeededCandles } from '../../services/candleDataGenerator';
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

interface ModelIDDrillProps {
    onComplete: (score: number) => void;
    onHeartLoss: () => void;
    timeframe?: Timeframe;
    clipSeed?: number;
}

type CRTModel = 'model-1' | 'turtle-soup' | 'crt-ote' | 'three-candles' | 'ranging';

// Interactive drill: Identify CRT Model from replay
export const ModelIDDrill: React.FC<ModelIDDrillProps> = ({ 
    onComplete, 
    onHeartLoss,
    timeframe = '1D',
    clipSeed
}) => {
    const [candles] = useState<Candle[]>(() => {
        if (clipSeed) {
            return generateSeededCandles(30, timeframe, clipSeed);
        }
        // Randomly select a pattern for practice
        const patterns: CRTModel[] = ['model-1', 'turtle-soup', 'crt-ote', 'three-candles'];
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
        return generateCurriculumPattern(randomPattern, timeframe);
    });

    const [selectedModel, setSelectedModel] = useState<CRTModel | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [replayComplete, setReplayComplete] = useState(false);
    const [correctModel, setCorrectModel] = useState<CRTModel>('model-1'); // Would be determined by pattern classifier

    const modelOptions: { value: CRTModel; label: string; description: string }[] = [
        { value: 'model-1', label: 'Model #1', description: 'Thick up-close followed by down-close' },
        { value: 'turtle-soup', label: 'Turtle Soup', description: 'Sweep of high/low then reclaim' },
        { value: 'crt-ote', label: 'CRT OTE', description: 'Impulsive leg with deep retracement' },
        { value: 'three-candles', label: 'Three Candles', description: 'Accumulation, Manipulation, Distribution' },
        { value: 'ranging', label: 'Ranging', description: 'No clear pattern' }
    ];

    // Simple pattern classifier (in production, this would be more sophisticated)
    const classifyPattern = (candles: Candle[]): CRTModel => {
        if (candles.length < 3) return 'ranging';
        
        // Check for Model #1: Thick bullish candle followed by bearish
        const mid = Math.floor(candles.length / 2);
        const firstHalf = candles.slice(0, mid);
        const secondHalf = candles.slice(mid);
        
        const firstAvg = firstHalf.reduce((sum, c) => sum + (c.close - c.open), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, c) => sum + (c.close - c.open), 0) / secondHalf.length;
        
        if (firstAvg > 0 && secondAvg < 0 && Math.abs(firstAvg) > Math.abs(secondAvg) * 1.5) {
            return 'model-1';
        }
        
        // Check for turtle soup: price breaks high then reclaims
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);
        const maxHigh = Math.max(...highs);
        const maxHighIndex = highs.indexOf(maxHigh);
        const minLow = Math.min(...lows);
        const minLowIndex = lows.indexOf(minLow);
        
        if (maxHighIndex < candles.length * 0.4 && candles[candles.length - 1].close < maxHigh * 0.98) {
            return 'turtle-soup';
        }
        
        if (minLowIndex < candles.length * 0.4 && candles[candles.length - 1].close > minLow * 1.02) {
            return 'turtle-soup';
        }
        
        return 'ranging';
    };

    React.useEffect(() => {
        setCorrectModel(classifyPattern(candles));
    }, [candles]);

    const handleSubmit = () => {
        if (!selectedModel || replayComplete === false) return;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (selectedModel === correctModel) {
            const newScore = 100;
            setScore(newScore);
            onComplete(newScore);
        } else {
            if (newAttempts >= 2) {
                onHeartLoss();
                setScore(0);
            }
        }
    };

    const handleReset = () => {
        setSelectedModel(null);
        setScore(null);
        setAttempts(0);
        setReplayComplete(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Model ID Drill</h3>
                <p className="text-sm text-blue-800">
                    Watch the replay and identify the CRT model. You have 2 attempts.
                </p>
            </div>

            {score === null ? (
                <>
                    <BarReplay
                        candles={candles}
                        timeframe={timeframe}
                        speed={2}
                        allowRewind={true}
                        onComplete={() => setReplayComplete(true)}
                    />

                    {replayComplete && (
                        <div className="bg-white rounded-lg border border-slate-200 p-6">
                            <h4 className="font-bold text-slate-900 mb-4">Select the CRT Model:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {modelOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedModel(option.value)}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                                            selectedModel === option.value
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="font-bold text-slate-900">{option.label}</div>
                                        <div className="text-xs text-slate-600 mt-1">{option.description}</div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedModel}
                                className="mt-4 w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                Submit Answer
                            </button>
                            <div className="text-sm text-slate-600 mt-2 text-center">
                                Attempts: {attempts} / 2
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                    {score > 0 ? (
                        <>
                            <Award className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-emerald-900 mb-2">Correct!</h3>
                            <p className="text-slate-600 mb-2">You identified: <strong>{modelOptions.find(o => o.value === correctModel)?.label}</strong></p>
                            <p className="text-slate-600">Score: {score}%</p>
                            <p className="text-xs text-amber-600 mt-2">+10 XP • Model Spotter Badge Progress</p>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-red-900 mb-2">Incorrect</h3>
                            <p className="text-slate-600 mb-2">Correct answer: <strong>{modelOptions.find(o => o.value === correctModel)?.label}</strong></p>
                            <p className="text-slate-600 mb-4">You've lost a heart. Study the pattern and try again!</p>
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

