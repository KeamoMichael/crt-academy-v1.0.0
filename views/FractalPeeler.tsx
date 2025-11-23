
import React, { useState, useRef } from 'react';
import { ArrowLeft, ZoomIn, Layers, MoveHorizontal, MoveVertical, RotateCcw, MousePointer2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { generateFractalCandles } from '../services/marketData';
import { Candle } from '../types';

export const FractalPeeler: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [level, setLevel] = useState(0);
    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);
    const [offsetY, setOffsetY] = useState(0);
    
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastMousePos = useRef<{x: number, y: number} | null>(null);
    
    // Initial "Daily" candle
    const parentCandle: Candle = { 
        time: 'Daily', 
        open: 100, 
        close: 140, 
        high: 150, 
        low: 90 
    };

    const [candles, setCandles] = useState<Candle[]>([parentCandle]);

    const peel = () => {
        if (level >= 2) return; // Max depth for demo
        const newCandles: Candle[] = [];
        candles.forEach(c => {
            newCandles.push(...generateFractalCandles(c, 4));
        });
        setCandles(newCandles);
        setLevel(l => l + 1);
    };

    const reset = () => {
        setCandles([parentCandle]);
        setLevel(0);
        setOffsetY(0); 
    };

    const resetView = () => {
        setScaleX(1);
        setScaleY(1);
        setOffsetY(0);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !lastMousePos.current || !containerRef.current) return;
        
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;

        containerRef.current.scrollLeft -= deltaX;

        const containerHeight = containerRef.current.clientHeight || 500;
        const baseRange = 200; 
        const priceDelta = (deltaY / containerHeight) * (baseRange / scaleY);
        
        setOffsetY(prev => prev + priceDelta);

        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        lastMousePos.current = null;
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            lastMousePos.current = null;
        }
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
                                    {level === 0 ? 'Daily' : level === 1 ? 'H4' : 'H1'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Candles:</span>
                                <span className="font-bold">{candles.length}</span>
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

                    <Card title="Chart Tools">
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                                        <MoveHorizontal size={14} /> Time Scale
                                    </label>
                                    <span className="text-xs font-mono text-slate-400">{scaleX.toFixed(1)}x</span>
                                </div>
                                <input 
                                    type="range" min="0" max="4" step="0.1" 
                                    value={scaleX} 
                                    onChange={(e) => setScaleX(parseFloat(e.target.value))}
                                    className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                                        <MoveVertical size={14} /> Price Scale
                                    </label>
                                    <span className="text-xs font-mono text-slate-400">{scaleY.toFixed(1)}x</span>
                                </div>
                                <input 
                                    type="range" min="0.5" max="3" step="0.1" 
                                    value={scaleY} 
                                    onChange={(e) => setScaleY(parseFloat(e.target.value))}
                                    className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <button 
                                onClick={resetView} 
                                className="w-full py-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-dashed border-emerald-200 flex items-center justify-center gap-2 transition-colors"
                            >
                                <RotateCcw size={12} /> Reset View
                            </button>
                             <div className="text-xs text-slate-400 flex items-center gap-2 justify-center pt-2">
                                <MousePointer2 size={12} />
                                <span>Drag chart to move</span>
                            </div>
                        </div>
                    </Card>
                    
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-emerald-800 text-sm mt-auto">
                        <strong>Lesson:</strong> Use the tools to inspect how the 'wick' of a higher timeframe is actually a 'trend' on the lower timeframe.
                    </div>
                </div>

                {/* Visualizer */}
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-inner relative overflow-hidden flex flex-col h-[500px] md:h-auto select-none">
                    {/* Grid Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    {/* Chart Canvas */}
                    <div 
                        ref={containerRef}
                        className={`overflow-x-auto overflow-y-hidden flex-1 w-full h-full relative custom-scrollbar flex ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                         <div className="flex items-end h-full m-auto px-20 gap-1 py-10 transition-transform duration-75 ease-linear">
                            {candles.map((candle, idx) => {
                                // Scaling Math
                                const baseRange = 200;
                                const baseMin = 50;
                                // Apply Offset (Pan Y)
                                const midPoint = baseMin + (baseRange / 2) + offsetY; 
                                
                                // When we zoom Y, we shrink the effective range visible within the 0-100% height container
                                const effectiveRange = baseRange / scaleY;
                                const effectiveMin = midPoint - (effectiveRange / 2);

                                const getHeight = (val: number) => ((val - effectiveMin) / effectiveRange) * 100;
                                
                                const highH = getHeight(candle.high);
                                const lowH = getHeight(candle.low);
                                const openH = getHeight(candle.open);
                                const closeH = getHeight(candle.close);
                                
                                const isBullish = candle.close > candle.open;
                                const color = isBullish ? 'bg-emerald-500' : 'bg-slate-800';
                                const wickColor = isBullish ? 'bg-emerald-500' : 'bg-slate-800';
                                
                                const bodyTop = Math.max(openH, closeH);
                                const bodyBottom = Math.min(openH, closeH);

                                // Don't render if completely out of vertical view (optimization)
                                if (lowH > 150 || highH < -50) return null;

                                return (
                                    <div key={idx} 
                                         className="relative h-full flex-shrink-0 group" 
                                         style={{ 
                                             width: `${50 * scaleX}px`,
                                         }}
                                    >
                                        {/* Wick */}
                                        <div className={`absolute w-[2px] left-1/2 -translate-x-1/2 ${wickColor} opacity-60`}
                                             style={{ 
                                                 bottom: `${Math.max(0, lowH)}%`, 
                                                 height: `${Math.min(100, highH) - Math.max(0, lowH)}%` 
                                             }}
                                        />
                                        {/* Body */}
                                        <div className={`absolute w-[80%] left-[10%] rounded-sm ${color} shadow-sm group-hover:brightness-110 z-10`}
                                             style={{ 
                                                 bottom: `${Math.max(0, bodyBottom)}%`, 
                                                 height: `${Math.max(1, Math.min(100, bodyTop) - Math.max(0, bodyBottom))}%` 
                                             }}
                                        >
                                            {/* Tooltip */}
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1.5 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none transition-opacity border border-slate-700">
                                                <div className="font-mono">H:{candle.high.toFixed(1)} L:{candle.low.toFixed(1)}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Legend Overlay */}
                    <div className="absolute top-4 left-4 flex items-center gap-4 pointer-events-none">
                        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded border border-slate-200 text-xs font-mono text-slate-500 shadow-sm">
                            USD/CRT • {level === 0 ? 'D' : level === 1 ? '4H' : '1H'}
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