import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Candle, Timeframe } from '../../types';
import { CandleChart } from './CandleChart';
import { Play, Pause, RotateCcw, FastForward, SkipForward } from 'lucide-react';

interface BarReplayProps {
    candles: Candle[];
    timeframe: Timeframe;
    speed?: number; // candles per second
    allowRewind?: boolean;
    onCandleReached?: (index: number, candle: Candle) => void;
    onComplete?: () => void;
    initialIndex?: number;
    className?: string;
}

// Bar-replay engine for curriculum demonstrations
export const BarReplay: React.FC<BarReplayProps> = ({
    candles,
    timeframe,
    speed = 2,
    allowRewind = true,
    onCandleReached,
    onComplete,
    initialIndex = 0,
    className = ''
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(speed);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Visible candles (show last 50 candles up to current)
    const visibleCandles = useMemo(() => {
        const start = Math.max(0, currentIndex - 49);
        return candles.slice(start, currentIndex + 1);
    }, [candles, currentIndex]);

    // Playback control
    useEffect(() => {
        if (isPlaying && currentIndex < candles.length - 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    const next = prev + 1;
                    if (next >= candles.length) {
                        setIsPlaying(false);
                        if (onComplete) onComplete();
                        return prev;
                    }
                    if (onCandleReached) {
                        onCandleReached(next, candles[next]);
                    }
                    return next;
                });
            }, 1000 / playbackSpeed);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, currentIndex, candles.length, playbackSpeed, onCandleReached, onComplete]);

    const handlePlay = () => {
        if (currentIndex >= candles.length - 1) {
            // Reset if at end
            setCurrentIndex(0);
        }
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentIndex(initialIndex);
    };

    const handleSkipForward = () => {
        setCurrentIndex(prev => Math.min(prev + 10, candles.length - 1));
    };

    const handleSkipBack = () => {
        if (allowRewind) {
            setCurrentIndex(prev => Math.max(prev - 10, 0));
        }
    };

    return (
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
            {/* Controls */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                    <button
                        onClick={isPlaying ? handlePause : handlePlay}
                        className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                        title="Reset"
                    >
                        <RotateCcw size={18} />
                    </button>
                    {allowRewind && (
                        <button
                            onClick={handleSkipBack}
                            className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                            title="Skip Back 10"
                            disabled={currentIndex === 0}
                        >
                            <FastForward size={18} className="rotate-180" />
                        </button>
                    )}
                    <button
                        onClick={handleSkipForward}
                        className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                        title="Skip Forward 10"
                        disabled={currentIndex >= candles.length - 1}
                    >
                        <SkipForward size={18} />
                    </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold">Speed:</label>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.5"
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                            className="w-24 accent-emerald-600"
                        />
                        <span className="text-xs font-mono w-8">{playbackSpeed.toFixed(1)}x</span>
                    </div>
                    <div className="text-xs font-mono">
                        {currentIndex + 1} / {candles.length}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="p-4">
                <CandleChart
                    candles={visibleCandles}
                    timeframe={timeframe}
                    width={800}
                    height={400}
                    showGrid={true}
                />
            </div>

            {/* Progress Bar */}
            <div className="px-4 pb-4">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / candles.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

