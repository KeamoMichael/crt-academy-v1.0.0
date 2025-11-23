
import { Candle, Timeframe } from "../types";
import { addMinutes, format, addHours, addDays, addWeeks } from "date-fns";

const TIMEFRAME_CONFIG: Record<Timeframe, { minutes: number, volatility: number }> = {
    '1m': { minutes: 1, volatility: 1 },
    '3m': { minutes: 3, volatility: 1.5 },
    '5m': { minutes: 5, volatility: 2 },
    '15m': { minutes: 15, volatility: 4 },
    '30m': { minutes: 30, volatility: 5 },
    '1H': { minutes: 60, volatility: 8 },
    '2H': { minutes: 120, volatility: 10 },
    '4H': { minutes: 240, volatility: 15 },
    '1D': { minutes: 1440, volatility: 40 },
    '1W': { minutes: 10080, volatility: 100 },
    '1M': { minutes: 43200, volatility: 250 },
};

// Generate a single next candle based on the previous one and timeframe
export const generateNextCandle = (prev: Candle, timeframe: Timeframe = '15m'): Candle => {
    const config = TIMEFRAME_CONFIG[timeframe];
    const isLondon = Math.random() > 0.7; 
    const volatility = isLondon ? config.volatility * 1.5 : config.volatility;
    
    const open = prev.close;
    const change = (Math.random() - 0.5) * volatility;
    const close = open + change;
    
    // Create realistic wicks
    const high = Math.max(open, close) + Math.random() * (volatility * 0.4);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.4);
    
    // Calculate next time slot
    const [h, m] = prev.time.includes(':') ? prev.time.split(':').map(Number) : [0,0];
    
    // Simple time increment logic for simulation display
    // For a real app, we'd parse full ISO strings. 
    // Here we just keep "HH:mm" format for intraday and "Day X" for daily
    
    let nextTimeStr = prev.time;
    if (timeframe === '1D' || timeframe === '1W' || timeframe === '1M') {
        // Basic counter for days
        const dayNum = parseInt(prev.time.replace('Day ', '')) || 1;
        nextTimeStr = `Day ${dayNum + 1}`;
    } else {
        const prevDate = new Date();
        prevDate.setHours(h, m, 0, 0);
        const nextDate = addMinutes(prevDate, config.minutes);
        nextTimeStr = format(nextDate, 'HH:mm');
    }

    return {
      time: nextTimeStr,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    };
};

// Helper to generate a fractal candle structure
export const generateMockData = (count: number = 100, timeframe: Timeframe = '15m'): Candle[] => {
  const data: Candle[] = [];
  const config = TIMEFRAME_CONFIG[timeframe];

  // Initial Candle
  let current: Candle = {
      time: timeframe === '1D' ? 'Day 1' : `08:00`,
      open: 1000,
      high: 1000 + config.volatility,
      low: 1000 - config.volatility,
      close: 1000 + (config.volatility * 0.2)
  };
  data.push(current);

  for (let i = 1; i < count; i++) {
    current = generateNextCandle(current, timeframe);
    data.push(current);
  }
  return data;
};

export const generateFractalCandles = (parent: Candle, subCount: number = 4): Candle[] => {
    const subCandles: Candle[] = [];
    const totalRange = parent.high - parent.low;
    const totalBody = parent.close - parent.open;
    
    let prevClose = parent.open;
    
    for (let i = 0; i < subCount; i++) {
        const isLast = i === subCount - 1;
        const progress = (i + 1) / subCount;
        
        const targetTrendClose = parent.open + (totalBody * progress);
        const noise = (Math.random() - 0.5) * (totalRange * 0.2);
        
        const open = prevClose;
        let close = isLast ? parent.close : targetTrendClose + noise;
        
        let high = Math.max(open, close) + Math.abs(noise);
        let low = Math.min(open, close) - Math.abs(noise);

        if (i === 0) high = Math.max(high, parent.high); 
        if (isLast) low = Math.min(low, parent.low); 
        
        high = Math.min(high, parent.high);
        low = Math.max(low, parent.low);
        
        subCandles.push({
            time: `T${i + 1}`,
            open, high, low, close
        });
        prevClose = close;
    }
    return subCandles;
}
