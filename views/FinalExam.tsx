
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { Play, AlertOctagon, Flag, MousePointer2, Crosshair, TrendingDown, TrendingUp, ShieldAlert, CheckCircle, ArrowRight, ZoomIn, ZoomOut, MoveHorizontal, MoveVertical, RotateCcw, Hand, Clock, Lock } from 'lucide-react';
import { generateExamScenario, gradeExam } from '../services/examEngine';
import { Candle, ExamMarker, Trade, ExamResult, Timeframe } from '../types';
import { Card } from '../components/ui/Card';
import { INITIAL_BALANCE } from '../constants';

interface FinalExamProps {
    onPass: () => void;
    onFail: () => void;
}

const CandleStickShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;
    const { open, close, high, low } = payload;
    const isBullish = close > open;
    const totalRange = high - low;
    const ratio = totalRange === 0 ? 1 : height / totalRange;
    const openOffset = (high - open) * ratio;
    const closeOffset = (high - close) * ratio;
    const bodyTop = y + Math.min(openOffset, closeOffset);
    const bodyHeight = Math.max(Math.abs(openOffset - closeOffset), 2);
    const color = isBullish ? '#10b981' : '#f43f5e';
    
    return (
        <g>
            <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={y + height} stroke={color} strokeWidth={1.5} />
            <rect x={x} y={bodyTop} width={width} height={bodyHeight} fill={color} stroke={color} rx={1} />
        </g>
    );
};

const TIMEFRAMES: Timeframe[] = ['15m', '1H', '4H', '1D'];

export const FinalExam: React.FC<FinalExamProps> = ({ onPass, onFail }) => {
    const [data, setData] = useState<Candle[]>([]);
    const [groundTruth, setGroundTruth] = useState<any>(null);
    const [playbackIndex, setPlaybackIndex] = useState(30); 
    const [isPlaying, setIsPlaying] = useState(false);
    const [finished, setFinished] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('15m');
    
    const [viewOffset, setViewOffset] = useState(0); 
    const [visibleCandleCount, setVisibleCandleCount] = useState(40); 
    const [priceScale, setPriceScale] = useState(1.0); 

    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{x: number, offset: number} | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    
    const [markers, setMarkers] = useState<ExamMarker[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    
    const [activeTool, setActiveTool] = useState<'NONE' | 'RANGE_HIGH' | 'RANGE_LOW' | 'PURGE_FLAG'>('NONE');
    const [result, setResult] = useState<ExamResult | null>(null);

    const [showTradeModal, setShowTradeModal] = useState(false);
    const [pendingTradeType, setPendingTradeType] = useState<'LONG' | 'SHORT'>('SHORT');
    const [stopLossPrice, setStopLossPrice] = useState<string>('');

    // INIT
    useEffect(() => {
        // For the exam, we generate the scenario once. 
        // In a real app, switching timeframes would aggregate this data. 
        // For this simulation, we stick to the base scenario but allow the UI to "toggle" context
        const scenario = generateExamScenario();
        setData(scenario.data);
        setGroundTruth(scenario.groundTruth);
        setTimeout(() => setIsPlaying(true), 3000);
    }, []);

    useEffect(() => {
        let interval: any;
        if (isPlaying && !finished) {
            interval = setInterval(() => {
                setPlaybackIndex(prev => {
                    if (prev >= data.length - 1) {
                        setIsPlaying(false);
                        setFinished(true);
                        return prev;
                    }
                    const currentCandle = data[prev];
                    setTrades(currentTrades => currentTrades.map(t => {
                         if (t.exitPrice) return t; 
                         const diff = t.type === 'LONG' 
                            ? currentCandle.close - t.entryPrice
                            : t.entryPrice - currentCandle.close;
                         return { ...t, pnl: diff * 100 }; 
                    }));
                    return prev + 1;
                });
            }, 1000); 
        }
        return () => clearInterval(interval);
    }, [isPlaying, data, finished]);

    const visibleData = useMemo(() => {
        const totalAvailable = playbackIndex + 1;
        const endIndex = totalAvailable - viewOffset;
        const startIndex = Math.max(0, endIndex - visibleCandleCount);
        
        return data.slice(startIndex, endIndex).map(d => ({
            ...d,
            amplitude: [d.low, d.high]
        }));
    }, [data, playbackIndex, viewOffset, visibleCandleCount]);

    const yDomain = useMemo(() => {
        if (visibleData.length === 0) return ['auto', 'auto'];
        const lows = visibleData.map(d => d.low);
        const highs = visibleData.map(d => d.high);
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        const range = max - min;
        
        const mid = min + range / 2;
        const scaledRange = range / priceScale;
        const padding = scaledRange * 0.1;

        return [mid - (scaledRange / 2) - padding, mid + (scaledRange / 2) + padding];
    }, [visibleData, priceScale]);

    const handleChartMouseDown = (e: React.MouseEvent) => {
        if (activeTool !== 'NONE') return;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, offset: viewOffset };
    };

    const handleChartMouseMove = (e: React.MouseEvent) => {
        if (activeTool !== 'NONE') return;
        if (!isDragging || !dragStartRef.current || !chartContainerRef.current) return;
        
        const deltaX = e.clientX - dragStartRef.current.x;
        const width = chartContainerRef.current.clientWidth;
        const pixelsPerCandle = width / visibleCandleCount;
        const candlesMoved = Math.round(deltaX / pixelsPerCandle);
        const newOffset = Math.max(0, dragStartRef.current.offset + candlesMoved);
        const maxOffset = Math.max(0, playbackIndex - 5);
        setViewOffset(Math.min(newOffset, maxOffset));
    };

    const handleChartMouseUp = () => {
        setIsDragging(false);
        dragStartRef.current = null;
    };

    const handleChartWheel = (e: React.WheelEvent) => {
        if (e.deltaY < 0) {
            setVisibleCandleCount(prev => Math.max(10, prev - 2));
        } else {
            setVisibleCandleCount(prev => Math.min(100, prev + 2));
        }
    };

    const resetView = () => {
        setViewOffset(0);
        setVisibleCandleCount(40);
        setPriceScale(1);
    };

    const handleChartClick = (e: any) => {
        if (!e || !e.activePayload || activeTool === 'NONE') return;
        if (isDragging) return;

        const price = e.activePayload[0].payload.close; 
        const timestamp = e.activePayload[0].payload.time;
        const trueIndex = data.findIndex(d => d.time === timestamp);

        const newMarker: ExamMarker = {
            id: Math.random().toString(),
            type: activeTool as any,
            price,
            timeIndex: trueIndex,
            timestamp
        };

        setMarkers(prev => [...prev, newMarker]);
        setActiveTool('NONE');
    };

    const executeTrade = () => {
        const sl = parseFloat(stopLossPrice);
        if (isNaN(sl)) return;

        const currentPrice = data[playbackIndex].close;
        const newTrade: Trade = {
            id: Math.random().toString(),
            type: pendingTradeType,
            entryPrice: currentPrice,
            timestamp: data[playbackIndex].time,
            score: 0,
            stopLoss: sl,
            pnl: 0,
            timeframe: selectedTimeframe
        };
        setTrades([newTrade]); 
        setShowTradeModal(false);
    };

    const closeTrade = () => {
        const currentPrice = data[playbackIndex].close;
        setTrades(prev => prev.map(t => {
            if (t.exitPrice) return t;
            const pnl = t.type === 'LONG' 
                ? (currentPrice - t.entryPrice) * 100
                : (t.entryPrice - currentPrice) * 100;
            setBalance(b => b + pnl);
            return { ...t, exitPrice: currentPrice, pnl };
        }));
    };

    const submitExam = () => {
        setIsPlaying(false);
        setFinished(true);
        if (trades.some(t => !t.exitPrice)) closeTrade();
        const examResult = gradeExam(markers, trades, groundTruth, balance, INITIAL_BALANCE);
        setResult(examResult);
    };

    const currentCandle = data[playbackIndex];

    if (!currentCandle) return <div className="p-10 text-center">Loading Exam Environment...</div>;

    if (result) {
        return (
            <div className="max-w-3xl mx-auto p-6 animate-in fade-in zoom-in">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className={`p-8 text-center ${result.passed ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        {result.passed ? <CheckCircle size={64} className="mx-auto text-emerald-600 mb-4"/> : <AlertOctagon size={64} className="mx-auto text-rose-600 mb-4"/>}
                        <h1 className={`text-3xl font-bold mb-2 ${result.passed ? 'text-emerald-900' : 'text-rose-900'}`}>{result.passed ? "CERTIFIED" : "EXAM FAILED"}</h1>
                        <p className="text-slate-600 font-medium">Score: {result.score}/100</p>
                    </div>
                    
                    <div className="p-8 space-y-6">
                         <div className="grid grid-cols-3 gap-4 text-center">
                             <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                 <div className="text-xs font-bold text-slate-400 uppercase">Range</div>
                                 <div className="text-xl font-bold text-slate-800">{result.metrics.rangeAccuracy}%</div>
                             </div>
                             <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                 <div className="text-xs font-bold text-slate-400 uppercase">Timing</div>
                                 <div className="text-xl font-bold text-slate-800">{result.metrics.timing}%</div>
                             </div>
                             <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                 <div className="text-xs font-bold text-slate-400 uppercase">Risk (Pot)</div>
                                 <div className="text-xl font-bold text-slate-800">{result.metrics.riskManagement}%</div>
                             </div>
                         </div>

                         <div>
                             <h3 className="font-bold text-slate-900 mb-3">Mentor Feedback</h3>
                             <ul className="space-y-2">
                                 {result.feedback.map((fb, i) => (
                                     <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                         <span className="mt-1">•</span> {fb}
                                     </li>
                                 ))}
                             </ul>
                         </div>

                         <button 
                            onClick={result.passed ? onPass : onFail}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2"
                         >
                             {result.passed ? "Accept Certification" : "Return to Vault (Retake)"} <ArrowRight />
                         </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
             {/* Exam Header */}
             <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-20">
                 <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 text-rose-600 font-bold">
                         <div className={`w-3 h-3 rounded-full bg-rose-500 ${isPlaying ? 'animate-pulse' : ''}`}></div>
                         LIVE EXAM
                     </div>
                     <div className="h-6 w-px bg-slate-200"></div>
                     
                     {/* Timeframe Selector for Multi-Timeframe Tasks */}
                     <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                         {TIMEFRAMES.map(tf => (
                             <button
                                key={tf}
                                onClick={() => setSelectedTimeframe(tf)}
                                className={`px-3 py-1 text-xs font-bold rounded transition-all
                                    ${selectedTimeframe === tf 
                                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                                        : 'text-slate-500 hover:text-slate-700'
                                    }
                                `}
                             >
                                 {tf}
                             </button>
                         ))}
                     </div>

                     <div className="h-6 w-px bg-slate-200"></div>
                     <div className="font-mono text-slate-500">{currentCandle.time}</div>
                     {viewOffset > 0 && (
                         <button onClick={resetView} className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 transition-colors">
                             <RotateCcw size={10} /> Re-sync
                         </button>
                     )}
                 </div>
                 
                 <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">The Pot</div>
                        <div className={`font-mono font-bold ${balance >= INITIAL_BALANCE ? 'text-emerald-600' : 'text-rose-600'}`}>${balance.toFixed(2)}</div>
                    </div>
                    <button 
                        onClick={submitExam}
                        className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded hover:bg-slate-800"
                    >
                        Submit Journal
                    </button>
                 </div>
             </div>

             {/* Main Workspace */}
             <div className="flex-1 flex overflow-hidden">
                 {/* Toolbar */}
                 <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-4 z-20">
                     <button 
                        onClick={() => setActiveTool('NONE')}
                        className={`p-3 rounded-lg transition-all ${activeTool === 'NONE' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                        title="Cursor / Drag"
                     >
                         <Hand size={20} />
                     </button>
                     <div className="w-8 h-px bg-slate-200 my-2"></div>
                     <button 
                        onClick={() => setActiveTool('RANGE_HIGH')}
                        className={`p-3 rounded-lg transition-all ${activeTool === 'RANGE_HIGH' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                        title="Mark Range High"
                     >
                         <TrendingUp size={20} />
                     </button>
                     <button 
                        onClick={() => setActiveTool('RANGE_LOW')}
                        className={`p-3 rounded-lg transition-all ${activeTool === 'RANGE_LOW' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                        title="Mark Range Low"
                     >
                         <TrendingDown size={20} />
                     </button>
                     <button 
                        onClick={() => setActiveTool('PURGE_FLAG')}
                        className={`p-3 rounded-lg transition-all ${activeTool === 'PURGE_FLAG' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                        title="Flag Purge"
                     >
                         <Flag size={20} />
                     </button>
                 </div>

                 {/* Chart Area */}
                 <div className="flex-1 relative bg-white flex flex-col">
                      {/* Chart Controls Overlay */}
                      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur border border-slate-200 p-2 rounded-lg shadow-sm flex flex-col gap-2 w-40">
                          <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                    <span>Width</span>
                                    <span>{visibleCandleCount}</span>
                                </div>
                                <input 
                                    type="range" min="10" max="100" 
                                    value={visibleCandleCount} 
                                    onChange={(e) => setVisibleCandleCount(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                />
                          </div>
                          <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                    <span>Height</span>
                                    <span>{priceScale.toFixed(1)}x</span>
                                </div>
                                <input 
                                    type="range" min="0.5" max="3.0" step="0.1"
                                    value={priceScale} 
                                    onChange={(e) => setPriceScale(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                />
                          </div>
                          <button onClick={resetView} className="mt-1 text-[10px] text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 py-1 border border-slate-100 rounded hover:bg-slate-50">
                              <RotateCcw size={10} /> Reset View
                          </button>
                      </div>

                      {!isPlaying && !finished && (
                          <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center pointer-events-none">
                              <div className="bg-white p-6 rounded-xl text-center max-w-md pointer-events-auto">
                                  <h3 className="text-xl font-bold mb-2">Simulation Paused</h3>
                                  <p className="text-slate-500 mb-4">Exam scenario loading. Get ready.</p>
                                  <div className="animate-spin w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full mx-auto"></div>
                              </div>
                          </div>
                      )}

                      {activeTool !== 'NONE' && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-bounce pointer-events-none">
                              <MousePointer2 size={16} /> Click Chart to Place Marker
                          </div>
                      )}

                      <div 
                        ref={chartContainerRef}
                        className={`flex-1 relative w-full h-full ${activeTool === 'NONE' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
                        onMouseDown={handleChartMouseDown}
                        onMouseMove={handleChartMouseMove}
                        onMouseUp={handleChartMouseUp}
                        onMouseLeave={handleChartMouseUp}
                        onWheel={handleChartWheel}
                      >
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart 
                                data={visibleData} 
                                onClick={handleChartClick}
                                margin={{ top: 20, right: 50, left: 0, bottom: 20 }}
                            >
                                <XAxis dataKey="time" hide />
                                <YAxis domain={yDomain} orientation="right" tick={{fontSize: 11}} stroke="#cbd5e1" width={40} />
                                
                                {markers.map(m => (
                                    <ReferenceLine 
                                        key={m.id} 
                                        y={m.price} 
                                        stroke={m.type === 'RANGE_HIGH' ? '#ef4444' : m.type === 'RANGE_LOW' ? '#10b981' : '#f59e0b'} 
                                        strokeDasharray="3 3" 
                                        label={{ value: m.type.replace('_', ' '), position: 'insideRight', fill: m.type === 'RANGE_HIGH' ? '#ef4444' : '#10b981', fontSize: 10 }}
                                    />
                                ))}

                                {trades.map(t => (
                                    <ReferenceLine 
                                        key={t.id} 
                                        y={t.entryPrice} 
                                        stroke="#3b82f6" 
                                        strokeWidth={2}
                                        label={{ value: `${t.type} ENTRY`, position: 'left', fill: '#3b82f6', fontSize: 10 }}
                                    />
                                ))}
                                {trades.map(t => t.stopLoss && (
                                    <ReferenceLine 
                                        key={`sl-${t.id}`} 
                                        y={t.stopLoss} 
                                        stroke="#f43f5e" 
                                        strokeDasharray="2 2"
                                        label={{ value: `STOP LOSS`, position: 'left', fill: '#f43f5e', fontSize: 10 }}
                                    />
                                ))}

                                <Bar dataKey="amplitude" shape={<CandleStickShape />} isAnimationActive={false} />
                            </ComposedChart>
                          </ResponsiveContainer>
                      </div>
                 </div>

                 {/* Right Panel: Task List & Entry */}
                 <div className="w-72 bg-slate-50 border-l border-slate-200 flex flex-col z-20">
                     <div className="p-4 border-b border-slate-100 bg-white">
                         <h3 className="font-bold text-slate-800 flex items-center gap-2">
                             <AlertOctagon size={16} /> Mission Objectives
                         </h3>
                     </div>
                     <div className="p-4 space-y-4 flex-1 overflow-auto">
                         <Card className="p-3 bg-white text-sm text-slate-600">
                             1. Select correct Timeframe Alignment.
                         </Card>
                         <Card className="p-3 bg-white text-sm text-slate-600">
                             2. Mark the Range (High/Low).
                         </Card>
                         <Card className="p-3 bg-white text-sm text-slate-600">
                             3. Flag the Turtle Soup (Purge).
                         </Card>
                         <Card className="p-3 bg-white text-sm text-slate-600">
                             4. Execute with Pot Protection (SL).
                         </Card>
                         
                         <div className="mt-8 pt-8 border-t border-slate-200">
                             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Execution Panel</div>
                             {trades.length === 0 ? (
                                 <div className="grid grid-cols-2 gap-2">
                                     <button 
                                        onClick={() => { setPendingTradeType('LONG'); setShowTradeModal(true); }}
                                        className="py-3 bg-emerald-500 text-white rounded font-bold hover:bg-emerald-600 transition-colors"
                                     >
                                         LONG
                                     </button>
                                     <button 
                                        onClick={() => { setPendingTradeType('SHORT'); setShowTradeModal(true); }}
                                        className="py-3 bg-rose-500 text-white rounded font-bold hover:bg-rose-600 transition-colors"
                                     >
                                         SHORT
                                     </button>
                                 </div>
                             ) : (
                                 <div className="bg-white p-4 rounded border border-slate-200 text-center">
                                     <div className="text-sm font-bold text-slate-500 mb-2">Trade Active</div>
                                     <div className={`text-xl font-mono font-bold mb-3 ${trades[0].pnl! >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                         {trades[0].pnl! >= 0 ? '+' : ''}{trades[0].pnl!.toFixed(2)}
                                     </div>
                                     <button 
                                        onClick={closeTrade}
                                        className="w-full py-2 bg-slate-200 text-slate-700 font-bold rounded hover:bg-slate-300"
                                     >
                                         Close Position
                                     </button>
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
             </div>

             {/* Trade Entry Modal */}
             {showTradeModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                     <div className="bg-white p-6 rounded-xl shadow-2xl w-80">
                         <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                             <ShieldAlert className="text-rose-500" /> Pot Protection
                         </h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Price</label>
                                 <div className="text-xl font-mono font-bold text-slate-800">{currentCandle.close.toFixed(2)}</div>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stop Loss Level</label>
                                 <input 
                                    type="number" 
                                    value={stopLossPrice} 
                                    onChange={(e) => setStopLossPrice(e.target.value)}
                                    className="w-full p-3 bg-slate-100 rounded border border-slate-200 font-mono text-lg focus:ring-2 focus:ring-slate-900 outline-none"
                                    placeholder="0.00"
                                    autoFocus
                                 />
                                 <p className="text-xs text-rose-500 mt-2">
                                     * Entering without a Stop Loss results in immediate failure.
                                 </p>
                             </div>
                             <div className="flex gap-2 pt-2">
                                 <button onClick={() => setShowTradeModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded">Cancel</button>
                                 <button onClick={executeTrade} className="flex-1 py-3 bg-slate-900 text-white font-bold rounded hover:bg-slate-800">Confirm</button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};
