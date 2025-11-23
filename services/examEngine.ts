
import { Candle, ExamMarker, ExamResult, Trade } from "../types";

// --- EXAM SCENARIO GENERATOR ---
// Generates a fixed scenario with a guaranteed Turtle Soup setup for grading against ground truth.

export const generateExamScenario = () => {
    const data: Candle[] = [];
    let price = 100.00;
    
    // 1. Accumulation (0-30 candles): Asian Range
    // Range High ~ 102.00, Range Low ~ 98.00
    const groundTruth = {
        rangeHigh: 102.00,
        rangeLow: 98.00,
        purgePrice: 102.50, // The sweep level
        reclaimIndex: 45, // Where the sweep happens
        direction: 'SHORT'
    };

    for (let i = 0; i < 60; i++) {
        const time = new Date();
        time.setHours(20 + Math.floor(i/4), (i%4)*15); // Start 20:00
        const timeStr = `${time.getHours().toString().padStart(2,'0')}:${time.getMinutes().toString().padStart(2,'0')}`;

        let open = price;
        let close = price;
        let high = price;
        let low = price;

        // PHASES
        if (i < 35) {
            // Range Bound
            const noise = (Math.random() - 0.5) * 0.5;
            close = open + noise;
            // Keep loosely within 98-102
            if (close > 101.5) close -= 0.5;
            if (close < 98.5) close += 0.5;
        } else if (i >= 35 && i < 42) {
            // Manipulation (Run High)
            close = open + 0.4; // Strong push up
        } else if (i >= 42 && i < 48) {
            // The Purge & Reclaim
            if (i === 44) {
                 // The Peak Wick
                 high = 103.00; // Clear sweep of 102
                 close = 102.20;
            } else if (i === 45) {
                 // The Reclaim Candle
                 close = 101.50; // Back inside range
            } else {
                 close = open - 0.3; // Drop
            }
        } else {
            // Distribution (Drop)
            close = open - 0.4;
        }

        high = Math.max(open, close) + Math.random() * 0.2;
        low = Math.min(open, close) - Math.random() * 0.2;
        
        // Refine peak
        if (i === 44) high = 103.00;

        data.push({
            time: timeStr,
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2))
        });
        
        price = close;
    }

    return { data, groundTruth };
};


// --- GRADING ENGINE ---

export const gradeExam = (
    markers: ExamMarker[], 
    trades: Trade[], 
    groundTruth: any,
    balance: number,
    initialBalance: number
): ExamResult => {
    const feedback: string[] = [];
    let score = 0;
    const metrics = {
        rangeAccuracy: 0,
        timing: 0,
        riskManagement: 0
    };

    // 1. Grade Range Marking (25%)
    const userHigh = markers.find(m => m.type === 'RANGE_HIGH');
    const userLow = markers.find(m => m.type === 'RANGE_LOW');
    
    if (userHigh && userLow) {
        const highDiff = Math.abs(userHigh.price - groundTruth.rangeHigh);
        const lowDiff = Math.abs(userLow.price - groundTruth.rangeLow);
        const tolerance = 0.50;

        if (highDiff < tolerance && lowDiff < tolerance) {
            metrics.rangeAccuracy = 100;
            feedback.push("✅ Perfect identification of the Liquidity Range.");
        } else if (highDiff < tolerance * 2 || lowDiff < tolerance * 2) {
            metrics.rangeAccuracy = 50;
            feedback.push("⚠️ Range levels were identified, but lacked precision.");
        } else {
            feedback.push("❌ Failed to identify the correct structural range.");
        }
    } else {
        feedback.push("❌ You did not mark the Range High/Low.");
    }

    // 2. Grade Purge/Entry Timing (35%)
    // Did they enter SHORT after the sweep (index 44)?
    const entry = trades[0];
    if (entry) {
        // Ground truth sweep was around index 42-45
        // Valid entry is after index 44 (The Peak) and before index 50
        // We need to find the candle index of the trade timestamp roughly
        // For simplicity in this mocked engine, we assume linear time if we had indices
        // In real app, we'd map trade.timestamp to data index.
        // Let's assume trade happens based on logic flow.
        
        if (entry.type === 'SHORT') {
             metrics.timing = 100;
             feedback.push("✅ Correct direction (SHORT) identified.");
             
             // Check if profit was made
             if (balance > initialBalance) {
                 score += 10; // Bonus for profit
                 feedback.push("✅ Profitable execution.");
             }
        } else {
            feedback.push("❌ Wrong direction. The setup was a Short Turtle Soup.");
        }
    } else {
        feedback.push("❌ No trade was executed.");
    }

    // 3. Grade Pot Protection (40%)
    if (entry && entry.stopLoss) {
        const riskPerShare = Math.abs(entry.entryPrice - entry.stopLoss);
        // Rough calculation, assuming standard lot size logic not fully implemented in Sim
        // We check if SL was logical (Above the high)
        if (entry.type === 'SHORT' && entry.stopLoss >= groundTruth.purgePrice) {
            metrics.riskManagement = 100;
            feedback.push("✅ Stop Loss correctly placed above the Sweep High (Pot Protected).");
        } else {
            metrics.riskManagement = 0;
            feedback.push("❌ Stop Loss was too tight or invalid. You burned the Pot.");
        }
    } else if (entry) {
         feedback.push("❌ You entered without a Stop Loss. Automatic Fail.");
         metrics.riskManagement = 0;
    }

    // CALC FINAL SCORE
    score = (metrics.rangeAccuracy * 0.25) + (metrics.timing * 0.35) + (metrics.riskManagement * 0.40);

    const passed = score >= 75 && metrics.riskManagement > 0;

    return {
        passed,
        score: Math.round(score),
        feedback,
        metrics
    };
};
