import React, { useMemo, useRef, useEffect } from 'react';
import { Candle, Timeframe } from '../../types';

interface CandleChartProps {
    candles: Candle[];
    timeframe: Timeframe;
    width?: number;
    height?: number;
    showGrid?: boolean;
    showVolume?: boolean;
    onCandleHover?: (candle: Candle | null, index: number) => void;
    className?: string;
}

// TradingView-style candlestick rendering
export const CandleChart: React.FC<CandleChartProps> = ({
    candles,
    timeframe,
    width = 800,
    height = 400,
    showGrid = true,
    showVolume = false,
    onCandleHover,
    className = ''
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    // Calculate price range
    const priceRange = useMemo(() => {
        if (candles.length === 0) return { min: 0, max: 100 };
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        const padding = (max - min) * 0.1; // 10% padding
        return { min: min - padding, max: max + padding };
    }, [candles]);

    const priceScale = (price: number) => {
        const range = priceRange.max - priceRange.min;
        return ((price - priceRange.min) / range) * height;
    };

    // Candle width based on chart width and candle count
    const candleWidth = Math.max(2, Math.min(20, (width / candles.length) * 0.8));
    const candleSpacing = width / candles.length;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid
        if (showGrid) {
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 0.5;
            // Horizontal grid lines (price levels)
            for (let i = 0; i <= 5; i++) {
                const y = (height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            // Vertical grid lines (time divisions)
            for (let i = 0; i <= 10; i++) {
                const x = (width / 10) * i;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        }

        // Draw candles
        candles.forEach((candle, index) => {
            const x = index * candleSpacing + candleSpacing / 2;
            const openY = height - priceScale(candle.open);
            const closeY = height - priceScale(candle.close);
            const highY = height - priceScale(candle.high);
            const lowY = height - priceScale(candle.low);

            const isBullish = candle.close >= candle.open;
            const bodyTop = Math.min(openY, closeY);
            const bodyBottom = Math.max(openY, closeY);
            const bodyHeight = Math.max(1, bodyBottom - bodyTop);

            // Draw wick (shadow)
            ctx.strokeStyle = isBullish ? '#10b981' : '#1e293b';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, highY);
            ctx.lineTo(x, lowY);
            ctx.stroke();

            // Draw body
            ctx.fillStyle = isBullish ? '#10b981' : '#1e293b';
            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

            // Draw body outline for better definition
            ctx.strokeStyle = isBullish ? '#059669' : '#0f172a';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

            // Highlight hovered candle
            if (hoveredIndex === index) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.strokeRect(x - candleWidth / 2 - 2, highY - 2, candleWidth + 4, lowY - highY + 4);
            }
        });
    }, [candles, priceRange, width, height, showGrid, hoveredIndex, candleWidth, candleSpacing]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const index = Math.floor(x / candleSpacing);

        if (index >= 0 && index < candles.length) {
            setHoveredIndex(index);
            if (onCandleHover) {
                onCandleHover(candles[index], index);
            }
        } else {
            setHoveredIndex(null);
            if (onCandleHover) {
                onCandleHover(null, -1);
            }
        }
    };

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                    setHoveredIndex(null);
                    if (onCandleHover) onCandleHover(null, -1);
                }}
                className="cursor-crosshair"
            />
            {hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < candles.length && (
                <div className="absolute top-2 left-2 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg font-mono">
                    O: {candles[hoveredIndex].open.toFixed(2)} | 
                    H: {candles[hoveredIndex].high.toFixed(2)} | 
                    L: {candles[hoveredIndex].low.toFixed(2)} | 
                    C: {candles[hoveredIndex].close.toFixed(2)}
                </div>
            )}
        </div>
    );
};

