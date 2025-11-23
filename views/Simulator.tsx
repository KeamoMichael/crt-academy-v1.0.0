
import React, { useEffect, useMemo, useState } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { Play, Pause, FastForward, Target, RotateCcw, Heart, Activity, Clock, ChevronDown, Layers, Lock, AlertTriangle } from 'lucide-react';
import { generateMockData, generateNextCandle } from '../services/marketData';
import { Candle, Timeframe } from '../types';
import { Card } from '../components/ui/Card';

interface SimulatorProps {
    restoreHeartMode?: boolean;
    onHeartRestored?: () => void;
}

const TIMEFRAMES: Timeframe[] = ['1m', '3m', '5m', '15m', '30m', '1H', '2H', '4H', '1D', '1W', '1M'];

// Custom Shape for Real Candlesticks
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

export const Simulator: React.FC<SimulatorProps> = ({ restoreHeartMode, onHeartRestored }) => {
  const [data, setData] = useState<Candle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Waiting for setup...");
  
  // Timeframe State
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('15m');
  const [allowedTimeframes] = useState<Timeframe[]>(['15m', '1H', '4H', '1D']); // Mock user level permissions

  // Tool State
  const [showTools, setShowTools] = useState(false);

  // Recovery
  const [tradesWon, setTradesWon] = useState(0);

  // Initialization & Timeframe Switch
  useEffect(() => {
    setIsPlaying(false);
    const mock = generateMockData(100, selectedTimeframe);
    setData(mock);
    setCurrentIndex(mock.length - 20);
  }, [selectedTimeframe]);

  // Infinite Data Logic
  useEffect(() => {
      if (data.length > 0 && currentIndex >= data.length - 5) {
          const lastCandle = data[data.length - 1];
          const newBatch: Candle[] = [];
          let current = lastCandle;
          
          for(let i = 0; i < 20; i++) {
              current = generateNextCandle(current, selectedTimeframe);
              newBatch.push(current);
          }
          setData(prev => [...prev, ...newBatch]);
      }
  }, [currentIndex, data, selectedTimeframe]);

  // Playback
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Chart Data
  const visibleData = useMemo(() => {
      const start = Math.max(0, currentIndex - 50);
      const end = currentIndex + 1;
      return data.slice(start, end).map(d => ({
          ...d,
          amplitude: [d.low, d.high], 
          isBullish: d.close > d.open
      }));
  }, [data, currentIndex]);

  const yDomain = useMemo(() => {
      if (visibleData.length === 0) return ['auto', 'auto'];
      const lows = visibleData.map(d => d.low);
      const highs = visibleData.map(d => d.high);
      const min = Math.min(...lows);
      const max = Math.max(...highs);
      const padding = (max - min) * 0.1; 
      return [min - padding, max + padding];
  }, [visibleData]);

  const currentCandle = data[currentIndex] || data[data.length-1];

  const handleTrade = (type: 'LONG' | 'SHORT') => {
      const win = Math.random() > 0.45; 
      
      if (win) {
          setScore(s => s + 50);
          setMessage(`GREAT ${type}! +50 Points. Pot protected.`);
          if (restoreHeartMode) {
              setTradesWon(prev => {
                  const newVal = prev + 1;
                  if (newVal >= 1 && onHeartRestored) {
                      setTimeout(() => onHeartRestored(), 1000);
                  }
                  return newVal;
              });
          }
      } else {
          setScore(s => s - 20);
          setMessage("Stopped out. Market reversed.");
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        {/* Chart Area */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
            
            {/* TradingView Style Toolbar */}
            <div className="h-12 border-b border-slate-200 flex items-center px-4 gap-4 bg-slate-50/50 z-20">
                 <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                     <Target className="text-emerald-600" size={18} />
                     <span>USD/CRT</span>
                 </div>
                 
                 <div className="h-6 w-px bg-slate-200"></div>
                 
                 {/* Timeframe Selector */}
                 <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                     {TIMEFRAMES.map(tf => {
                         const isAllowed = allowedTimeframes.includes(tf);
                         const isActive = selectedTimeframe === tf;
                         return (
                             <button
                                key={tf}
                                onClick={() => isAllowed && setSelectedTimeframe(tf)}
                                className={`px-2 py-1 text-xs font-bold rounded transition-colors flex items-center gap-1
                                    ${isActive ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}
                                    ${!isAllowed ? 'opacity-40 cursor-not-allowed' : ''}
                                `}
                             >
                                 {tf}
                                 {!isAllowed && <Lock size={8} />}
                             </button>
                         )
                     })}
                 </div>

                 <div className="ml-auto flex items-center gap-2">
                    <button 
                        onClick={() => setShowTools(!showTools)}
                        className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${showTools ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                        title="Chart Tools"
                    >
                        <Layers size={18} />
                    </button>
                 </div>
            </div>

            {/* Recovery Banner */}
            {restoreHeartMode && (
                <div className="absolute top-12 left-0 right-0 bg-rose-500 text-white p-1 text-center z-10 font-bold shadow-md flex items-center justify-center gap-2 text-xs">
                    <Heart size={12} fill="currentColor" />
                    RECOVERY MODE: Win a trade to restore a heart!
                </div>
            )}

            {/* Tools Overlay (Simulated Detection) */}
            {showTools && (
                <div className="absolute top-16 left-4 z-10 flex flex-col gap-2">
                    <div className="bg-emerald-50/90 backdrop-blur text-emerald-700 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200 shadow-sm">
                        VALID CRT DETECTED (Type 1)
                    </div>
                    <div className="bg-white/90 backdrop-blur text-slate-600 text-[10px] px-2 py-1 rounded border border-slate-200 shadow-sm">
                        Model: {selectedTimeframe} Alignment
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="flex-1 w-full relative p-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={visibleData}>
                        <XAxis dataKey="time" tick={{fontSize: 10}} interval={4} stroke="#cbd5e1" />
                        <YAxis domain={yDomain} orientation="right" tick={{fontSize: 10}} stroke="#cbd5e1" width={40}/>
                        <Tooltip 
                            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={({ active, payload }) => {
                                if (!active || !payload || !payload.length) return null;
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-xs min-w-[140px]">
                                        <div className="font-bold text-slate-700 mb-2 pb-1 border-b border-slate-100">{d.time}</div>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                            <span className="text-slate-500">Open</span> <span className="font-mono text-right">{d.open.toFixed(2)}</span>
                                            <span className="text-slate-500">High</span> <span className="font-mono text-right">{d.high.toFixed(2)}</span>
                                            <span className="text-slate-500">Low</span> <span className="font-mono text-right">{d.low.toFixed(2)}</span>
                                            <span className="text-slate-500">Close</span> <span className={`font-mono text-right font-bold ${d.isBullish ? 'text-emerald-600' : 'text-rose-600'}`}>{d.close.toFixed(2)}</span>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Bar dataKey="amplitude" shape={<CandleStickShape />} isAnimationActive={false} />
                        <ReferenceLine y={currentCandle?.close} stroke="#94a3b8" strokeDasharray="3 3" opacity={0.5} />
                    </ComposedChart>
                 </ResponsiveContainer>
                 
                 {/* Floating Price Tag */}
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur border border-slate-200 shadow-sm text-slate-800 px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-3 z-10">
                     <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Current Price</span>
                        <span className={`font-bold ${currentCandle?.close > currentCandle?.open ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {currentCandle?.close.toFixed(2)}
                        </span>
                     </div>
                     <div className="h-6 w-px bg-slate-200"></div>
                     <div>
                         <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Time</span>
                         <span>{currentCandle?.time}</span>
                     </div>
                 </div>
            </div>

            {/* Bottom Controls */}
            <div className="h-14 border-t border-slate-200 flex items-center px-4 justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)} 
                        className={`p-2 px-4 rounded-lg transition-colors flex items-center gap-2 font-bold text-xs ${isPlaying ? 'bg-slate-200 text-slate-700' : 'bg-slate-900 text-white'}`}
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                        {isPlaying ? "PAUSE" : "PLAY"}
                    </button>
                    <button onClick={() => {setCurrentIndex(50); setScore(0); setMessage("Reset."); setIsPlaying(false);}} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600" title="Reset">
                        <RotateCcw size={14} />
                    </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    {isPlaying && <span className="flex items-center gap-1 text-emerald-600 animate-pulse font-bold"><Activity size={12}/> SIMULATION ACTIVE</span>}
                </div>
            </div>
        </div>

        {/* Controls Area */}
        <div className="space-y-6">
            <Card title="The Guard" className="h-full flex flex-col border-t-4 border-t-slate-900">
                <div className="flex-1 space-y-6">
                    <div className="text-center py-6 border-b border-slate-100 bg-slate-50/50 -mx-6 mt-[-24px] mb-4">
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Session PnL</div>
                        <div className={`text-5xl font-bold font-mono tracking-tight ${score > 0 ? 'text-emerald-600' : score < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                            {score > 0 ? '+' : ''}{score}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[120px] flex items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-900"></div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Mentor Feedback</h4>
                            <p className="text-slate-700 font-medium text-lg animate-in fade-in slide-in-from-bottom-2">{message}</p>
                        </div>
                    </div>
                    
                    {/* Timeframe Warning Mock */}
                    {selectedTimeframe === '5m' && (
                         <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                             <AlertTriangle size={14} className="shrink-0 mt-0.5"/>
                             <span><strong>Alignment Check:</strong> Ensure you have confirmed the 1H sequence before executing on 5m.</span>
                         </div>
                    )}

                    <div className="mt-auto space-y-3">
                        <div className="text-xs text-center text-slate-400 uppercase tracking-wider font-bold">Execute Setup</div>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleTrade('LONG')}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 flex flex-col items-center"
                            >
                                <span className="text-lg">LONG</span>
                                <span className="text-[10px] opacity-80 font-normal uppercase tracking-wider">Turtle Soup</span>
                            </button>
                            <button 
                                onClick={() => handleTrade('SHORT')}
                                className="bg-rose-500 hover:bg-rose-600 text-white py-5 rounded-xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95 flex flex-col items-center"
                            >
                                <span className="text-lg">SHORT</span>
                                <span className="text-[10px] opacity-80 font-normal uppercase tracking-wider">Turtle Soup</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
  );
};
