
import React, { useState, useRef } from 'react';
import { ArrowLeft, ZoomIn, Layers, MoveHorizontal, MoveVertical, RotateCcw, MousePointer2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { generateFractalCandles } from '../services/marketData';
import { generateCurriculumPattern } from '../services/candleDataGenerator';
import { Candle, Timeframe } from '../types';
import { CandleChart } from '../components/charts/CandleChart';

export const FractalPeeler: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [level, setLevel] = useState(0);
    const [timeframe, setTimeframe] = useState<Timeframe>('1D');
    
    // Generate realistic candles based on curriculum patterns
    const [candles, setCandles] = useState<Candle[]>(() => {
        // Start with a daily pattern
        return generateCurriculumPattern('three-candles', '1D');
    });

    const peel = () => {
        if (level >= 2) return; // Max depth for demo
        
        // Generate lower timeframe candles
        const nextTimeframe: Timeframe = level === 0 ? '4H' : '1H';
        const newCandles = generateCurriculumPattern('three-candles', nextTimeframe);
        setCandles(newCandles);
        setTimeframe(nextTimeframe);
        setLevel(l => l + 1);
    };

    const reset = () => {
        const initialCandles = generateCurriculumPattern('three-candles', '1D');
        setCandles(initialCandles);
        setTimeframe('1D');
        setLevel(0);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="text-slate-600" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Fractal Peeler</h2>
                    <p className="text-slate-500 text-sm">Peel the candle to reveal structure. Drag chart to pan.</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
                {/* Controls Column */}
                <div className="md:col-span-1 space-y-4 flex flex-col">
                    <Card title="Fractal Controls">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Timeframe:</span>
                                <span className="font-bold font-mono text-emerald-600">
                                    {timeframe}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Candles:</span>
                                <span className="font-bold">{candles.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Level:</span>
                                <span className="font-bold">{level + 1} / 3</span>
                            </div>
                            
                            <div className="pt-2 space-y-2">
                                <button 
                                    onClick={peel} 
                                    disabled={level >= 2}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all shadow-sm"
                                >
                                    <ZoomIn size={18} />
                                    Peel Layer
                                </button>
                                <button 
                                    onClick={reset} 
                                    className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-lg font-medium transition-all"
                                >
                                    <Layers size={18} />
                                    Reset Structure
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card title="Lesson Info">
                        <div className="space-y-3 text-sm text-slate-600">
                            <p>
                                <strong className="text-slate-900">Lesson:</strong> Use the Peel Layer button to reveal the internal structure of higher timeframe candles.
                            </p>
                            <p>
                                A <strong>wick</strong> on the Daily timeframe is actually a <strong>trend</strong> or <strong>reversal</strong> on the lower timeframe.
                            </p>
                            <p>
                                A <strong>body</strong> on the Daily is a <strong>trend</strong> on the 15-minute.
                            </p>
                        </div>
                    </Card>
                    
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-emerald-800 text-sm mt-auto">
                        <strong>Lesson:</strong> Use the tools to inspect how the 'wick' of a higher timeframe is actually a 'trend' on the lower timeframe.
                    </div>
                </div>

                {/* Visualizer */}
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-inner relative overflow-hidden flex flex-col h-[500px] md:h-auto">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-700">
                                Fractal Structure: {timeframe}
                            </div>
                            <div className="text-xs text-slate-500">
                                {candles.length} candles visible
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                        <CandleChart
                            candles={candles}
                            timeframe={timeframe}
                            width={700}
                            height={400}
                            showGrid={true}
                        />
                    </div>
                    
                    {/* Legend Overlay */}
                    <div className="absolute top-16 left-4 pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded border border-slate-200 text-xs font-mono text-slate-500 shadow-sm">
                            XAUUSD • {timeframe}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};