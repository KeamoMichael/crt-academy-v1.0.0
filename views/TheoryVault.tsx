
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { BookOpen, Box, ChevronRight, ArrowLeft, CheckCircle2, Lock, Play, TrendingUp, BarChart2, Heart, Trophy, ShieldAlert, Calculator, Divide, Plus, Equal, AlertOctagon, XCircle, Calendar, Clock, MousePointer2, ZoomIn, ArrowRight } from 'lucide-react';
import { FractalPeeler } from './FractalPeeler';
import { CURRICULUM } from '../services/curriculum';
import { LessonPlayer } from '../components/LessonPlayer';
import { WEEKLY_PROFILES, XP_PER_LESSON } from '../constants';
import { Lesson, Level } from '../types';

// --- INTERACTIVE VISUALIZERS ---

const ValidCRTVisualizer = () => {
    const [checks, setChecks] = useState({
        range: false,
        killzone: false,
        flow: false,
        nopurge: false,
        displacement: false
    });

    const isValid = Object.values(checks).every(Boolean);

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-sm">
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Validation Checklist</h4>
                <div className="space-y-3">
                    {[
                        { k: 'range', l: 'Defined Range Boundaries' },
                        { k: 'killzone', l: 'Time-Aligned (Killzone)' },
                        { k: 'flow', l: 'Order Flow Match (Bias)' },
                        { k: 'nopurge', l: 'No Prior Purge' },
                        { k: 'displacement', l: 'Displacement Confirmation' }
                    ].map(({k, l}) => (
                        <button 
                            key={k}
                            onClick={() => setChecks(prev => ({...prev, [k]: !prev[k as keyof typeof checks]}))}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all text-left
                                ${checks[k as keyof typeof checks] ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'}
                            `}
                        >
                            {checks[k as keyof typeof checks] ? <CheckCircle2 size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300"></div>}
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`w-full max-w-xs p-8 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-500
                ${isValid ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-xl' : 'border-slate-200 bg-slate-50 grayscale opacity-80'}
            `}>
                {isValid ? (
                    <>
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 animate-bounce">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-800">VALID CRT</h3>
                        <p className="text-emerald-600 text-sm mt-2">Execute with Pot Protection.</p>
                    </>
                ) : (
                    <>
                         <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-4">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-400">INVALID</h3>
                        <p className="text-slate-400 text-sm mt-2">Do not trade.</p>
                    </>
                )}
            </div>
        </div>
    );
};

const VariationsVisualizer = () => {
    const [activeTab, setActiveTab] = useState(0);
    const variations = [
        { name: "Classic", desc: "Standard Sweep & Reclaim", path: "M 10 80 L 50 80 L 50 20 L 70 10 L 90 20 L 90 80 L 130 80" },
        { name: "Compression", desc: "Slow Grind -> Snap", path: "M 10 90 L 30 80 L 50 75 L 70 72 L 90 20 L 90 100" },
        { name: "Stop-Run", desc: "V-Shape Reversal", path: "M 10 80 L 50 20 L 90 80" },
        { name: "Post-Imbalance", desc: "Fill FVG -> Sweep", path: "M 10 50 L 50 50 L 50 20 L 70 10 L 90 60" },
        { name: "Continuation", desc: "Sweep Internal Low -> Go High", path: "M 10 80 L 40 20 L 60 40 L 70 30 L 100 10" },
        { name: "Micro", desc: "LTF Structure inside HTF Wick", path: "M 20 20 L 80 20 L 50 90 L 20 20" } // Abstract
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {variations.map((v, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTab(i)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors
                            ${activeTab === i ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                        `}
                    >
                        {v.name}
                    </button>
                ))}
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center h-64 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 
                 <svg viewBox="0 0 140 100" className="w-full max-w-md h-full stroke-slate-900 fill-none stroke-2" preserveAspectRatio="none">
                      <path d={variations[activeTab].path} strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-500" />
                      {/* Simple liquidity line for context */}
                      <line x1="0" y1="20" x2="140" y2="20" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1" opacity="0.5" />
                 </svg>
                 
                 <div className="absolute bottom-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium shadow-sm">
                     {variations[activeTab].desc}
                 </div>
            </div>
        </div>
    );
};

const AlignmentModelVisualizer = () => {
    const [selected, setSelected] = useState<number | null>(null);
    const models = [
        { id: 1, pair: "1M → 1D", use: "Macro Bias", color: "bg-blue-50 border-blue-200 text-blue-700" },
        { id: 2, pair: "1W → 4H", use: "Swing Sequence", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
        { id: 3, pair: "1D → 1H", use: "Day Trading (Standard)", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
        { id: 4, pair: "4H → 15M", use: "Intraday Precision", color: "bg-amber-50 border-amber-200 text-amber-700" },
        { id: 5, pair: "1H → 5M", use: "Scalping / Entry", color: "bg-rose-50 border-rose-200 text-rose-700" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
                {models.map((m, i) => (
                    <button
                        key={m.id}
                        onClick={() => setSelected(i)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group
                            ${selected === i ? m.color + ' ring-1 ring-offset-2' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                        `}
                    >
                        <div>
                            <div className="font-mono font-bold text-lg">{m.pair}</div>
                            <div className="text-xs opacity-80 font-medium uppercase tracking-wide">{m.use}</div>
                        </div>
                        {selected === i && <CheckCircle2 size={20} />}
                    </button>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center text-center min-h-[300px]">
                {selected !== null ? (
                    <div className="space-y-6 animate-in zoom-in duration-300">
                        <div className="flex items-center justify-center gap-8">
                            <div className="space-y-2">
                                <div className="w-20 h-32 bg-slate-200 rounded flex items-center justify-center text-slate-500 font-bold text-xs relative">
                                    HTF
                                    <div className="absolute top-0 left-0 w-full h-1/3 bg-rose-200/50 border-b border-rose-300"></div>
                                </div>
                                <div className="text-xs font-bold uppercase text-slate-400">Bias / Range</div>
                            </div>
                            <ArrowRight className="text-slate-300" />
                            <div className="space-y-2">
                                <div className="w-20 h-32 bg-white border border-slate-200 rounded p-1 grid grid-cols-4 gap-0.5 content-start">
                                    {Array.from({length: 12}).map((_, idx) => (
                                        <div key={idx} className={`w-full h-4 rounded-sm ${idx === 2 ? 'bg-rose-500' : 'bg-slate-100'}`}></div>
                                    ))}
                                </div>
                                <div className="text-xs font-bold uppercase text-slate-400">Entry / Timing</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">{models[selected].pair}</h4>
                            <p className="text-slate-500 text-sm mt-1">
                                Use the <span className="font-bold text-slate-800">{models[selected].pair.split(' → ')[0]}</span> to find the key level.<br/>
                                Drop to the <span className="font-bold text-slate-800">{models[selected].pair.split(' → ')[1]}</span> to find the Killzone entry.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-400">
                        <MousePointer2 size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Select a model to visualize alignment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const LTFExecutionVisualizer = () => {
    const [step, setStep] = useState(0);
    
    return (
        <div className="space-y-6">
             <div className="h-64 bg-white border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                 {/* Reference Line (Liquidity) */}
                 <div className="absolute top-[30%] left-10 right-10 h-0.5 bg-rose-400 border-dashed flex justify-end items-center px-2">
                     <span className="text-[10px] font-bold text-rose-500 bg-white px-1">LIQUIDITY</span>
                 </div>

                 <div className="flex items-end gap-4 h-40">
                     {/* Candle 1: Setup */}
                     <div className="w-12 bg-slate-800 h-24 rounded-sm relative opacity-50">
                         <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-0.5 h-32 bg-slate-800"></div>
                     </div>
                     
                     {/* Candle 2: The Sweep (Trigger) */}
                     <div className={`w-12 transition-all duration-500 relative group
                        ${step >= 1 ? 'bg-emerald-500' : 'bg-white border-2 border-slate-200'}
                     `} style={{ height: step >= 1 ? '110px' : '0px' }}>
                          {step >= 1 && (
                              <>
                                <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-0.5 h-[150%] bg-slate-800 -z-10"></div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase whitespace-nowrap">1. Sweep</div>
                              </>
                          )}
                     </div>

                     {/* Candle 3: The Reclaim (Confirmation) */}
                     <div className={`w-12 transition-all duration-500 relative
                        ${step >= 2 ? 'bg-emerald-600' : 'bg-transparent'}
                     `} style={{ height: step >= 2 ? '90px' : '0px' }}>
                         {step >= 2 && (
                             <>
                                <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0.5 h-[110%] bg-slate-800 -z-10"></div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase whitespace-nowrap">2. Close</div>
                             </>
                         )}
                     </div>

                     {/* Candle 4: Entry (Safety) */}
                     <div className={`w-12 transition-all duration-500 relative
                        ${step >= 3 ? 'bg-slate-200' : 'bg-transparent'}
                     `} style={{ height: step >= 3 ? '20px' : '0px' }}>
                         {step >= 3 && (
                             <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full">
                                 <div className="bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-lg text-center mb-1">ENTRY</div>
                                 <div className="w-0.5 h-4 bg-slate-900 mx-auto"></div>
                             </div>
                         )}
                     </div>
                 </div>
             </div>

             <div className="flex justify-center gap-2">
                 {[0, 1, 2, 3].map(s => (
                     <button 
                        key={s} 
                        onClick={() => setStep(s)}
                        className={`w-3 h-3 rounded-full transition-all ${step >= s ? 'bg-emerald-500' : 'bg-slate-200'}`}
                     />
                 ))}
             </div>

             <div className="text-center text-sm text-slate-600 font-medium min-h-[3rem]">
                 {step === 0 && "Waiting for price to approach the level..."}
                 {step === 1 && "Step 1: The Sweep. Price pierces the level but rejects."}
                 {step === 2 && "Step 2: The Close. Candle closes BACK INSIDE the range."}
                 {step === 3 && "Step 3: The Entry. Enter on the open of the next candle."}
             </div>

             <button 
                onClick={() => setStep(prev => (prev + 1) % 4)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
             >
                 {step === 3 ? "Replay Sequence" : "Next Step"}
             </button>
        </div>
    );
};

// --- EXISTING VISUALIZERS ---
const TimeLessonInteractive = () => {
    const [hour, setHour] = useState(14);
    const getZone = (h: number) => {
        if (h >= 2 && h < 5) return { name: 'London Open', desc: 'Manipulation Phase', color: 'text-emerald-600', bg: 'bg-emerald-100' };
        if (h >= 9 && h < 12) return { name: 'NY AM', desc: 'Trend/Expansion Phase', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (h >= 13 && h < 16) return { name: 'NY PM', desc: 'Reversal/Close Phase', color: 'text-indigo-600', bg: 'bg-indigo-100' };
        if (h >= 20 || h === 0) return { name: 'Asian Range', desc: 'Accumulation (Do Not Trade)', color: 'text-slate-500', bg: 'bg-slate-200' };
        return { name: 'Dead Zone', desc: 'Low Probability', color: 'text-slate-400', bg: 'bg-slate-100' };
    };
    const zone = getZone(hour);
    return (
        <div className="flex flex-col items-center space-y-8">
            <div className={`w-full p-8 rounded-xl text-center transition-all duration-300 border-2 border-transparent ${zone.bg}`}>
                <h3 className={`text-3xl font-bold ${zone.color} mb-2`}>{zone.name}</h3>
                <p className="text-slate-600 font-medium">{zone.desc}</p>
                <div className="mt-6 text-5xl font-mono font-bold text-slate-900 tracking-tighter">{hour}:00</div>
            </div>
            <div className="w-full px-4">
                <input 
                    type="range" min="0" max="23" value={hour} onChange={(e) => setHour(parseInt(e.target.value))}
                    className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 hover:accent-emerald-500 transition-all"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:00</span>
                </div>
            </div>
        </div>
    );
};

const RangeLessonInteractive = () => {
    const [price, setPrice] = useState(130);
    const isPremium = price > 100;
    const isDeepDiscount = price < 50;
    return (
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center p-4">
             <div className="relative h-64 w-24 bg-white rounded border-2 border-slate-800 shadow-xl">
                 <div className="absolute top-1/2 w-full h-0.5 bg-slate-900 border-dashed flex items-center">
                    <span className="absolute -left-8 text-xs font-bold text-slate-900">EQ</span>
                 </div>
                 <div 
                    className="absolute w-full h-1 bg-indigo-600 transition-all duration-100 flex items-center"
                    style={{ bottom: `${(price/200)*100}%` }}
                 >
                     <div className="w-full h-1 bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                     <span className="absolute -right-12 font-mono text-xs font-bold text-indigo-600">{price}</span>
                 </div>
                 <div className="absolute top-0 w-full h-1/2 bg-rose-50/80 flex items-center justify-center backdrop-blur-[1px]"><span className="text-xs font-bold text-rose-400 rotate-90 tracking-widest">PREMIUM</span></div>
                 <div className="absolute bottom-0 w-full h-1/2 bg-emerald-50/80 flex items-center justify-center backdrop-blur-[1px]"><span className="text-xs font-bold text-emerald-400 rotate-90 tracking-widest">DISCOUNT</span></div>
             </div>
             <div className="flex flex-col gap-6 w-full max-w-xs">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase">Market Price</label>
                    <input type="range" min="0" max="200" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                <div className={`p-6 rounded-xl border text-center transition-colors duration-300 shadow-sm ${isPremium ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                    <div className="text-xs font-bold uppercase mb-1 opacity-70">Current Zone</div>
                    <div className="text-2xl font-bold mb-2">{isPremium ? 'PREMIUM' : 'DISCOUNT'}</div>
                    <div className="text-sm font-medium">{isPremium ? "Look for SELLS. Do not buy expensive." : isDeepDiscount ? "DEEP DISCOUNT. High probability BUYS." : "Look for BUYS. Price is cheap."}</div>
                </div>
             </div>
        </div>
    );
};

const SequenceVisualizer = () => {
    const [step, setStep] = useState(0);
    const steps = [
        { title: "1. Accumulation", desc: "Asian Range. Orders are building up.", pos: 20 },
        { title: "2. Manipulation", desc: "The Judas Swing. Trapping traders.", pos: 5 },
        { title: "3. Distribution", desc: "The True Move. Expansion.", pos: 80 },
        { title: "4. Continuation", desc: "Holding higher prices.", pos: 70 }
    ];
    return (
        <div className="space-y-8">
            <div className="h-64 bg-white border border-slate-200 rounded-xl relative overflow-hidden p-8">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <svg className="w-full h-full overflow-visible">
                    <polyline 
                        points={`0,80 ${step >= 1 ? '100,80' : '50,80'} ${step >= 2 ? '150,120' : step >= 1 ? '100,80' : '50,80'} ${step >= 3 ? '300,20' : step >= 2 ? '150,120' : step >= 1 ? '100,80' : '50,80'} ${step >= 4 ? '400,40' : step >= 3 ? '300,20' : step >= 2 ? '150,120' : step >= 1 ? '100,80' : '50,80'}`}
                        fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700 ease-out"
                    />
                </svg>
                <div className="absolute top-4 right-4 text-right">
                    <h4 className="text-xl font-bold text-slate-900">{steps[Math.max(0, step-1)]?.title || "Start The Sequence"}</h4>
                    <p className="text-slate-500 text-sm">{steps[Math.max(0, step-1)]?.desc || "Click Next to begin"}</p>
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={() => setStep(0)} className="px-4 py-2 text-slate-500 hover:text-slate-900 font-medium">Reset</button>
                <button onClick={() => setStep(s => Math.min(4, s + 1))} disabled={step >= 4} className="px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">Next Phase <ChevronRight size={16} /></button>
            </div>
        </div>
    );
}

const WeeklyProfileVisualizer = () => {
    const [activeDay, setActiveDay] = useState(0);
    const profile = WEEKLY_PROFILES[activeDay];
    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 md:w-1/3">
                {WEEKLY_PROFILES.map((p, idx) => (
                    <button key={p.day} onClick={() => setActiveDay(idx)} className={`p-4 rounded-lg text-left transition-all flex items-center justify-between group ${activeDay === idx ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <span className="font-bold">{p.day}</span>
                        {activeDay === idx && <CheckCircle2 size={16} className="text-emerald-400" />}
                    </button>
                ))}
            </div>
            <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${profile.bias === 'Bullish' ? 'bg-emerald-100 text-emerald-600' : profile.bias === 'Bearish' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                        {profile.bias === 'Bullish' ? <TrendingUp /> : profile.bias === 'Bearish' ? <TrendingUp className="rotate-180" /> : <BarChart2 />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{profile.day} Profile</h3>
                        <p className="text-slate-500 text-sm">Bias: <span className="font-bold">{profile.bias}</span></p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Market Focus</h4>
                        <p className="text-slate-800 font-medium text-lg">{profile.focus}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TurtleSoupInteractive = () => {
    const [step, setStep] = useState(0);
    return (
        <div className="text-center space-y-6">
            <div className="h-48 bg-white border border-slate-200 rounded-xl relative flex items-end justify-center p-4 gap-2 overflow-hidden">
                <div className="absolute top-[30%] left-0 w-full h-0.5 bg-slate-300 border-dashed"></div>
                <div className="absolute top-[25%] right-2 text-xs text-slate-400 font-mono">OLD HIGH (LIQUIDITY)</div>
                <div className="w-10 bg-emerald-400 h-1/2 rounded-sm opacity-40"></div>
                <div className="w-10 bg-emerald-400 h-2/3 rounded-sm opacity-60"></div>
                <div className="w-10 relative h-3/4 transition-all duration-500">
                    <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-slate-800 transition-all duration-500 ${step >= 1 ? '-top-8 h-[120%]' : 'top-0 h-full'}`}></div>
                    <div className={`absolute bottom-0 w-full rounded-sm transition-all duration-500 ${step === 1 ? 'bg-emerald-500 h-full' : step === 2 ? 'bg-rose-500 h-[90%]' : 'bg-emerald-400 h-[95%]'}`}></div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-3">
                <div className="flex gap-2">
                    <button onClick={() => setStep(0)} className={`w-3 h-3 rounded-full ${step === 0 ? 'bg-slate-900' : 'bg-slate-300'}`} />
                    <button onClick={() => setStep(1)} className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-slate-900' : 'bg-slate-300'}`} />
                    <button onClick={() => setStep(2)} className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-slate-900' : 'bg-slate-300'}`} />
                </div>
                <button onClick={() => setStep(s => (s + 1) % 3)} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                    {step === 2 ? "Replay Setup" : "Next Step"}
                </button>
            </div>
        </div>
    );
};

// --- LEVEL GATE COMPONENT ---

const LevelGate = ({ level, completedCount, totalLessons, isExamPassed, onAttemptExam, activeExamId }: any) => {
    const isLessonsComplete = completedCount >= totalLessons;
    const isLocked = !isLessonsComplete;
    
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-6 relative">
             <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                     <Calculator size={18} className="text-slate-400" />
                     <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Mastery Equation</span>
                 </div>
                 <div className="text-xs font-mono text-slate-400">Standardized Progression Metric</div>
             </div>
             
             <div className="p-6">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                     
                     {/* CRITERIA 1: KNOWLEDGE */}
                     <div className={`flex-1 p-4 rounded-xl border transition-all w-full ${isLessonsComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                         <div className="text-xs font-bold text-slate-400 uppercase mb-2">Knowledge Base</div>
                         <div className="text-3xl font-bold text-slate-900 mb-1">
                             {Math.round((completedCount / totalLessons) * 100)}%
                         </div>
                         <div className="text-xs font-medium text-slate-500">
                             {completedCount} of {totalLessons} Lessons
                         </div>
                     </div>

                     <Plus className="text-slate-300 hidden md:block" />

                     {/* CRITERIA 2: EXECUTION */}
                     <div className={`flex-1 p-4 rounded-xl border transition-all w-full ${isExamPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                         <div className="text-xs font-bold text-slate-400 uppercase mb-2">Execution</div>
                         <div className="text-3xl font-bold text-slate-900 mb-1">
                             {isExamPassed ? "PASS" : "PENDING"}
                         </div>
                         <div className="text-xs font-medium text-slate-500">
                             Level Exit Exam
                         </div>
                     </div>

                     <Equal className="text-slate-300 hidden md:block" />

                     {/* RESULT: STATUS */}
                     <div className="flex-1 flex flex-col items-center justify-center">
                         {isExamPassed ? (
                             <div className="flex flex-col items-center text-emerald-600 animate-in zoom-in duration-300">
                                 <CheckCircle2 size={40} className="mb-2" />
                                 <span className="font-bold">LEVEL COMPLETE</span>
                             </div>
                         ) : (
                            <button 
                                onClick={onAttemptExam}
                                disabled={isLocked}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                                    ${isLocked 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }
                                `}
                            >
                                {isLocked ? <Lock size={18} /> : <ShieldAlert size={18} className="text-emerald-400" />}
                                {activeExamId === level.exam?.id ? "Resume Exam" : "Start Exit Exam"}
                            </button>
                         )}
                     </div>
                 </div>

                 {isLocked && (
                     <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400 bg-slate-50 py-2 rounded border border-dashed border-slate-200">
                         <AlertOctagon size={12} />
                         <span>Complete all lessons (100% Knowledge) to unlock the Exit Exam.</span>
                     </div>
                 )}
             </div>
        </div>
    );
}

// --- MAIN COMPONENT ---

interface TheoryVaultProps {
    completedLessons: string[];
    onLessonComplete: (id: string, score: number) => void;
    onExamComplete: (examId: string) => void;
    onExamFail: (levelId: string) => void;
    onHeartLoss: () => void;
    startFinalExam?: () => void; // New Prop
    hearts: number;
    userLevel: number;
    examsPassed: string[];
    userXP: number;
}

export const TheoryVault: React.FC<TheoryVaultProps> = ({ 
    completedLessons = [], 
    onLessonComplete, 
    onExamComplete,
    onExamFail,
    onHeartLoss, 
    startFinalExam,
    hearts, 
    userLevel,
    examsPassed = [],
    userXP
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<string>('L1');

  const activeLesson = CURRICULUM
    .flatMap(l => l.modules)
    .flatMap(m => m.lessons)
    .find(l => l.id === activeLessonId);

  const activeExamLevel = CURRICULUM.find(l => l.exam?.id === activeExamId);
  const activeExam = activeExamLevel?.exam;

  const handleAttemptExam = (level: Level) => {
      if (level.id === 'L5' && startFinalExam) {
          // Special routing for Level 5 Mastery Exam
          startFinalExam();
      } else {
          setActiveExamId(level.exam!.id);
      }
  };

  const renderInteractive = (type: string) => {
      switch(type) {
          case 'PEELER': return <FractalPeeler onBack={() => {}} />; 
          case 'TIME_SLIDER': return <TimeLessonInteractive />;
          case 'RANGE_CALC': return <RangeLessonInteractive />;
          case 'TS_ANIMATION': return <TurtleSoupInteractive />;
          case 'TSQ_VISUALIZER': return <SequenceVisualizer />;
          case 'WEEKLY_PROFILE': return <WeeklyProfileVisualizer />;
          case 'CRT_CLASSIFIER': return <ValidCRTVisualizer />;
          case 'CRT_VARIATIONS': return <VariationsVisualizer />;
          case 'ALIGNMENT_MODEL': return <AlignmentModelVisualizer />;
          case 'LTF_EXECUTION': return <LTFExecutionVisualizer />;
          default: return <div className="p-8 text-center text-slate-400 border border-dashed rounded-xl">Interactive module loading...</div>;
      }
  };

  // RENDER: EXAM MODE
  if (activeExam) {
      // Convert Exam to Lesson format for the player
      const examAsLesson: Lesson = {
          id: activeExam.id,
          title: activeExam.title,
          description: activeExam.description,
          content: "This is a Certification Exam.\n\n**Rules:**\n- No Hints.\n- Judgment is final.\n- Any mistake results in failure.",
          durationMin: 15,
          questions: activeExam.questions
      };

      return (
          <div className="max-w-4xl mx-auto">
              <button onClick={() => setActiveExamId(null)} className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
                  <ArrowLeft size={16} /> Abort Exam
              </button>
              <div className="bg-white border border-slate-200 p-6 rounded-xl mb-6 flex items-center justify-between shadow-sm">
                  <div>
                      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><ShieldAlert className="text-rose-500" /> {activeExam.title}</h2>
                      <p className="text-slate-500">Prove your mastery.</p>
                  </div>
              </div>
              <LessonPlayer 
                lesson={examAsLesson} 
                onComplete={(score) => {
                    if (score === 100) {
                        onExamComplete(activeExam.id);
                    } else {
                         onExamFail(activeExamLevel!.id);
                    }
                    setActiveExamId(null);
                }}
                onHeartLoss={onHeartLoss}
                hearts={hearts}
              />
          </div>
      );
  }

  // RENDER: LESSON MODE
  if (activeLesson) {
      return (
          <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => setActiveLessonId(null)}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                  <ArrowLeft size={16} /> Return to Vault
              </button>
              <LessonPlayer 
                lesson={activeLesson} 
                onComplete={(score) => {
                    if (score === 100) {
                        onLessonComplete(activeLesson.id, score);
                    }
                    setActiveLessonId(null);
                }}
                onHeartLoss={onHeartLoss}
                hearts={hearts}
                renderInteractive={renderInteractive}
              />
          </div>
      );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
        {hearts === 0 && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-rose-800">
                    <Heart className="text-rose-500 fill-rose-500 animate-pulse" />
                    <div>
                        <div className="font-bold">You are out of Hearts</div>
                        <div className="text-sm">Practice in the Simulator to restore them.</div>
                    </div>
                </div>
                <button className="bg-rose-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-rose-600 transition-colors">
                    Go to Gym
                </button>
            </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">The Vault</h2>
                <p className="text-slate-500">Master Candle Range Theory step-by-step.</p>
            </div>
        </div>

        <div className="space-y-6">
            {CURRICULUM.map((level, lvlIdx) => {
                // LOGIC: LEVEL GATING
                const prevLevel = CURRICULUM[lvlIdx - 1];
                // A level is accessible if the previous level's EXAM is passed (if it exists) or no prev level
                const isPrevExamPassed = prevLevel ? (prevLevel.exam ? examsPassed.includes(prevLevel.exam.id) : true) : true;
                const isAccessible = lvlIdx === 0 || isPrevExamPassed;
                const isExpanded = expandedLevel === level.id;
                const isExamPassed = level.exam ? examsPassed.includes(level.exam.id) : false;

                // Stats for this level
                const levelLessons = level.modules.flatMap(m => m.lessons);
                const completedCount = levelLessons.filter(l => completedLessons.includes(l.id)).length;

                return (
                    <div key={level.id} className={`bg-white rounded-2xl border transition-all overflow-hidden ${!isAccessible ? 'border-slate-100 opacity-60 grayscale' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
                        <div 
                            onClick={() => isAccessible && setExpandedLevel(isExpanded ? '' : level.id)}
                            className={`p-6 flex items-center justify-between cursor-pointer ${!isAccessible ? 'bg-slate-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm transition-colors
                                    ${!isAccessible ? 'bg-slate-200 text-slate-400' : 'bg-white border border-slate-200 text-slate-900'}
                                `}>
                                    {!isAccessible ? <Lock size={20} /> : lvlIdx + 1}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-bold text-lg ${!isAccessible ? 'text-slate-400' : 'text-slate-900'}`}>{level.title}</h3>
                                        {isExamPassed && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1"><Trophy size={10}/> Mastered</span>}
                                    </div>
                                    <p className="text-sm text-slate-500">{level.description}</p>
                                </div>
                            </div>
                            {isAccessible && (
                                <div className={`p-2 rounded-full bg-slate-100 transition-transform duration-300 ${isExpanded ? 'rotate-90 bg-slate-200' : ''}`}>
                                    <ChevronRight size={20} className="text-slate-600" />
                                </div>
                            )}
                        </div>

                        {isExpanded && isAccessible && (
                            <div className="border-t border-slate-100 bg-slate-50/30">
                                {level.modules.map(module => (
                                    <div key={module.id} className="p-6 border-b border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Box size={14} /> {module.title}
                                        </h4>
                                        <div className="grid gap-3">
                                            {module.lessons.map(lesson => {
                                                const isCompleted = completedLessons.includes(lesson.id);
                                                const lessonIdx = module.lessons.findIndex(l => l.id === lesson.id);
                                                const prevLessonInModule = module.lessons[lessonIdx - 1];
                                                // Linear progression: Must complete prev lesson in module
                                                const isLockedLinear = prevLessonInModule && !completedLessons.includes(prevLessonInModule.id);
                                                const canPlay = isCompleted || !isLockedLinear;

                                                return (
                                                    <button 
                                                        key={lesson.id}
                                                        onClick={() => canPlay && hearts > 0 ? setActiveLessonId(lesson.id) : null}
                                                        disabled={!canPlay || hearts === 0}
                                                        className={`w-full group flex items-center justify-between p-4 rounded-xl border transition-all relative overflow-hidden text-left
                                                            ${isCompleted 
                                                                ? 'bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50' 
                                                                : !canPlay 
                                                                    ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'
                                                                    : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-md cursor-pointer'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-4 z-10">
                                                            {isCompleted 
                                                                ? <CheckCircle2 className="text-emerald-500 shrink-0" size={22} />
                                                                : <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${canPlay ? 'border-slate-300 group-hover:border-slate-500' : 'border-slate-200'}`}></div>
                                                            }
                                                            <div>
                                                                <div className={`font-bold transition-colors ${isCompleted ? 'text-emerald-900' : 'text-slate-800 group-hover:text-slate-900'}`}>{lesson.title}</div>
                                                                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                                    <span className="flex items-center gap-1"><Play size={10} /> {lesson.durationMin} min</span>
                                                                    {lesson.componentId && <span className="bg-indigo-50 text-indigo-600 px-1.5 rounded font-medium border border-indigo-100">Interactive</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isCompleted && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
                                                        {!canPlay && !isCompleted && <Lock size={16} className="text-slate-300 mr-2" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Standardized Level Gate */}
                                {level.exam && (
                                    <div className="p-6">
                                        <LevelGate 
                                            level={level}
                                            completedCount={completedCount}
                                            totalLessons={levelLessons.length}
                                            isExamPassed={isExamPassed}
                                            onAttemptExam={() => handleAttemptExam(level)}
                                            activeExamId={activeExamId}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
};