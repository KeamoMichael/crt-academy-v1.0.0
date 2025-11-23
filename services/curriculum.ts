
import { Level } from "../types";

export const CURRICULUM: Level[] = [
  {
    id: "L1",
    title: "Level 1: The Architect",
    difficulty: "BEGINNER",
    description: "You cannot build without a blueprint. Master the foundations of Structure and Time.",
    allowedTimeframes: ['1H', '4H', '1D'],
    criteria: { minXPMultiplier: 0.6 }, 
    modules: [
      {
        id: "M1",
        title: "Philosophy & Psychology",
        description: "The 'Protect The Pot' mindset.",
        lessons: [
          {
            id: "l1-m1-1",
            title: "Protect The Pot",
            description: "The core rule of survival.",
            durationMin: 5,
            content: "In this business, you are a risk manager first, a trader second.\n\n**The Pot** is your lifeblood. Every time you enter the market, you expose The Pot to fire. If you burn it, you are out of business.\n\nYour #1 job is not to make money. It is to ensure you can come back tomorrow.",
            quiz: {
              id: "q1",
              question: "What is your primary job as a trader?",
              options: ["To catch 100 pip moves", "To predict the future", "To protect your capital (The Pot)", "To trade every day"],
              correctIndex: 2,
              explanation: "Capital preservation is the only thing that keeps you in the game."
            }
          },
          {
            id: "l1-m1-2",
            title: "Fractal Anatomy",
            description: "Seeing the trend inside the candle.",
            durationMin: 15,
            content: "A candle is not a solid block. It is a container of time.\n\n- A **Wick** on the Daily is a **Reversal** on the 15-minute.\n- A **Body** on the Daily is a **Trend** on the 15-minute.\n\nUse the Fractal Peeler below to understand this relationship.",
            componentId: "PEELER"
          }
        ]
      },
      {
        id: "M2",
        title: "Time > Price",
        description: "The Algorithm runs on a schedule.",
        lessons: [
          {
            id: "l1-m2-1",
            title: "The Killzones",
            description: "The three windows of opportunity.",
            durationMin: 10,
            content: "Price can move at any time, but it only moves with **intent** during specific windows. We call these Killzones.\n\n1. **London Open (2-5 AM NY)**: The Manipulation. Often creates the High or Low of the day.\n2. **NY AM (9-11 AM NY)**: The Trend. Often continues London or reverses it.\n3. **NY PM (1:30-4 PM NY)**: The Close. Rebalancing.\n\nEverything else is noise.",
            componentId: "TIME_SLIDER",
            quiz: {
              id: "q2",
              question: "If you trade at 6:00 PM NY time, what are you likely trading?",
              options: ["A high probability setup", "Algorithmic Noise / Dead Zone", "The London Open", "A news event"],
              correctIndex: 1,
              explanation: "6 PM is the Asian open/dead zone crossover. Liquidity is thin and moves are often fake."
            }
          }
        ]
      }
    ],
    exam: {
      id: "exam-l1",
      title: "Level 1 Exit Exam",
      description: "Prove you understand Time and Risk.",
      passThreshold: 75,
      questions: [
        {
          id: "ex1-1",
          question: "When does the London Open Killzone begin (NY Time)?",
          options: ["1:00 AM", "2:00 AM", "3:00 AM", "12:00 PM"],
          correctIndex: 1,
          explanation: "London Open starts at 2:00 AM NY."
        },
        {
          id: "ex1-2",
          question: "What is a Daily Wick on a lower timeframe?",
          options: ["A gap", "Consolidation", "A Reversal / Trend Change", "Nothing"],
          correctIndex: 2,
          explanation: "Wicks are where price went, failed, and reversed."
        },
        {
          id: "ex1-3",
          question: "Which mindset protects 'The Pot'?",
          options: ["Aggressive compounding", "Risking 10% per trade", "Survival first, growth second", "Trading every session"],
          correctIndex: 2,
          explanation: "Survival is the prerequisite for success."
        }
      ]
    }
  },
  {
    id: "L2",
    title: "Level 2: The Range",
    difficulty: "INTERMEDIATE",
    description: "Every candle is a range. Buy Discount, Sell Premium.",
    allowedTimeframes: ['1H', '4H', '1D', '1W'],
    criteria: { minXPMultiplier: 0.7 },
    modules: [
      {
        id: "M3",
        title: "Range Mechanics",
        description: "Premium, Discount, and Equilibrium (EQ).",
        lessons: [
          {
            id: "l2-m3-1",
            title: "The PD Array",
            description: "Defining the playing field.",
            durationMin: 15,
            content: "We never chase price. We wait for price to come to us.\n\n- **Premium (Top 50%)**: We only look for SELLS.\n- **Discount (Bottom 50%)**: We only look for BUYS.\n- **Equilibrium (EQ)**: The fair value. Price magnets here before expanding.\n\nUse the tool below to visualize where you should be active.",
            componentId: "RANGE_CALC",
            quiz: {
              id: "q3",
              question: "Price is in the bottom 25% of the daily range. You see a bearish pattern. Do you sell?",
              options: ["Yes, follow the momentum", "No, we do not sell in Discount", "Yes, if news is bad", "Maybe, if volume is high"],
              correctIndex: 1,
              explanation: "Selling in deep Discount is low probability. The rubber band is already stretched. We wait for a bounce or a break."
            }
          }
        ]
      },
      {
        id: "M2.4b",
        title: "Valid vs. Invalid CRT",
        description: "Classification of Structures.",
        lessons: [
          {
            id: "l2-m24b-1",
            title: "Valid CRT Rules",
            description: "Identifying a tradeable structure.",
            durationMin: 15,
            content: "**Valid CRT Requirements**:\n\n1. Defined range boundaries.\n2. Time-aligned purge (Killzone).\n3. Order-flow consistency with HTF bias.\n4. No prior purge before target swing.\n5. Displacement confirmation after purge.\n\nIf these are not met, the setup is INVALID.",
            componentId: "CRT_CLASSIFIER"
          },
          {
            id: "l2-m24b-2",
            title: "Red Flags",
            description: "When to stay out.",
            durationMin: 10,
            content: "A CRT becomes invalid if:\n- The purge occurs outside a Killzone.\n- There are multiple overlapping purges (Messy).\n- Sequence breaks (TSQ interruption).\n- HTF bias contradicts the CRT direction.",
            quiz: {
              id: "q-inv-1",
              question: "You see a perfect purge on the 15m chart, but it is 6:30 PM. Is it valid?",
              options: ["Yes, price action is king", "No, Time contradicts Price", "Yes, if the daily is bullish", "Maybe"],
              correctIndex: 1,
              explanation: "Outside of a Killzone, price is often algorithmic noise. Invalid."
            }
          }
        ]
      },
      {
        id: "M2.4c",
        title: "Types of CRT",
        description: "Variations of the Setup.",
        lessons: [
          {
            id: "l2-m24c-1",
            title: "The 6 Variations",
            description: "From Classic to Compression.",
            durationMin: 20,
            content: "Not all Turtle Soups look the same. Learn the 6 variations:\n\n1. **Classic HTF Range**: The standard sweep.\n2. **Compression CRT**: Slow grind up followed by a snap.\n3. **Stop-Run Reversal**: Aggressive V-shape.\n4. **Post-Imbalance**: Sweep after filling an FVG.\n5. **Trend Continuation**: Sweeping internal lows to go higher.\n6. **Micro CRT**: LTF refinement.",
            componentId: "CRT_VARIATIONS"
          }
        ]
      }
    ],
    exam: {
      id: "exam-l2",
      title: "Level 2 Exit Exam",
      description: "Validate your understanding of Price location and Validity.",
      passThreshold: 100,
      questions: [
        {
          id: "ex2-1",
          question: "Where is the highest probability zone for SELLING?",
          options: ["At the Low of the day", "In Premium (Above 50%)", "At Equilibrium", "In Discount"],
          correctIndex: 1,
          explanation: "Premium is expensive. We sell expensive."
        },
        {
          id: "ex2-3",
          question: "What makes a CRT Invalid immediately?",
          options: ["Low volume", "Occurring outside a Killzone", "Candle color", "Trendline break"],
          correctIndex: 1,
          explanation: "Time > Price. If the time is wrong, the setup is wrong."
        }
      ]
    }
  },
  {
    id: "L3",
    title: "Level 3: The Sequence",
    difficulty: "ADVANCED",
    description: "Understanding how candles link together (TSQ) and Multi-Timeframe Alignment.",
    allowedTimeframes: ['15m', '1H', '4H', '1D', '1W'],
    criteria: { minXPMultiplier: 0.75 },
    modules: [
      {
        id: "M2.7",
        title: "Multi-Timeframe Models",
        description: "Aligning the fractal nature.",
        lessons: [
          {
            id: "l3-m27-1",
            title: "The 5 Alignment Models",
            description: "Top-down Analysis.",
            durationMin: 25,
            content: "You must align two timeframes to trade.\n\n**Model #1: 1M → 1D**: Daily Bias + Monthly macro.\n**Model #2: 1W → 4H**: Weekly Range + 4H Sequence.\n**Model #3: 1D → 1H**: Daily Range + 1H Killzone (Most Common).\n**Model #4: 4H → 15M**: Intraday Precision.\n**Model #5: 1H → 5M**: Pure Execution.\n\nRule: Micro is always enslaved to Macro.",
            componentId: "ALIGNMENT_MODEL"
          }
        ]
      },
      {
        id: "M4",
        title: "TSQ: The Sequence",
        description: "The rhythm of the market.",
        lessons: [
          {
            id: "l3-m4-1",
            title: "The 4-Step Waltz",
            description: "Open, High, Low, Close mechanics.",
            durationMin: 20,
            content: "Every liquidity run follows a Sequence (TSQ).\n\n1. **Accumulation**: Price builds energy (usually Asian Range).\n2. **Manipulation**: The fake move (Judas Swing) to trap traders.\n3. **Distribution**: The real move towards the target.\n4. **Continuation/Reversal**: The aftermath.\n\nIf you can identify which step you are in, you know what comes next.",
            componentId: "TSQ_VISUALIZER"
          }
        ]
      },
      {
        id: "M3.5",
        title: "LTF Execution Engine",
        description: "Precision Entry Models.",
        lessons: [
          {
            id: "l3-m35-1",
            title: "Micro Purge, Macro Purpose",
            description: "Refining the entry.",
            durationMin: 15,
            content: "Use the lower timeframe to spot the **Micro Purge**.\n\nWait for the 1H to sweep liquidity. Then drop to the 5M. Do you see a structural shift or a micro sweep inside the 1H wick? That is your trigger.\n\n**The 3-Candle Entry**: Trigger (Sweep), Confirmation (Close), Safety (Next Open).",
            componentId: "LTF_EXECUTION"
          }
        ]
      }
    ],
    exam: {
      id: "exam-l3",
      title: "Level 3 Exit Exam",
      description: "Connect Alignment and Sequence.",
      passThreshold: 100,
      questions: [
        {
          id: "ex3-1",
          question: "What comes after Manipulation?",
          options: ["Accumulation", "Distribution", "Consolidation", "The Close"],
          correctIndex: 1,
          explanation: "Manipulation traps traders to fuel Distribution."
        },
        {
          id: "ex3-3",
          question: "In the 1D → 1H Model, what is the 1H chart used for?",
          options: ["Setting the bias", "Killzone Timing & Execution", "Long term investing", "Checking the news"],
          correctIndex: 1,
          explanation: "Daily sets the Bias/Range. 1H sets the Time/Entry."
        }
      ]
    }
  },
  {
    id: "L4",
    title: "Level 4: The Hunter",
    difficulty: "ADVANCED",
    description: "The Turtle Soup (TS) Setup. The Liquidity Purge.",
    allowedTimeframes: ['5m', '15m', '1H', '4H', '1D'],
    criteria: { minXPMultiplier: 0.8 },
    modules: [
      {
        id: "M6",
        title: "Turtle Soup Mechanics",
        description: "Catching the fake-out.",
        lessons: [
          {
            id: "l4-m6-1",
            title: "The Purge (Sweep)",
            description: "Identifying the liquidity run.",
            durationMin: 20,
            content: "A **Turtle Soup** is when price runs an old High or Low, grabs the liquidity (stops), and then RECLAIMS the range.\n\nStep 1: Identify an old High/Low.\nStep 2: Wait for price to pierce it (The Sweep).\nStep 3: DO NOT ENTER yet.\nStep 4: Wait for the candle to CLOSE back inside the range (The Reclaim).",
            componentId: "TS_ANIMATION"
          },
          {
            id: "l4-m6-2",
            title: "The Entry & Stop",
            description: "Precision execution.",
            durationMin: 10,
            content: "Entry: On the close of the Reclaim candle, or a retest of its open.\nStop Loss: Just beyond the swing point created by the Sweep.\nTarget: The opposing liquidity (the other side of the range).",
            quiz: {
              id: "q4",
              question: "Price sweeps a high but closes ABOVE it. Is this a Turtle Soup?",
              options: ["Yes, it swept liquidity", "No, that is a Breakout", "Yes, wait for the next candle", "No, volume is too low"],
              correctIndex: 1,
              explanation: "If price closes OUTSIDE the range, it is a Breakout (or Continuation). A Turtle Soup MUST close back inside (Reclaim)."
            }
          }
        ]
      }
    ],
    exam: {
      id: "exam-l4",
      title: "Level 4 Exit Exam",
      description: "The final test before the Simulator.",
      passThreshold: 100,
      questions: [
        {
          id: "ex4-1",
          question: "What confirms a Turtle Soup?",
          options: ["The sweep of the high", "High volume", "The Reclaim (Close back inside)", "Crossing the moving average"],
          correctIndex: 2,
          explanation: "The Reclaim proves the sweep was a trap, not a breakout."
        },
        {
          id: "ex4-2",
          question: "Where is your Stop Loss on a Long Turtle Soup?",
          options: ["Below the sweep low", "Below the previous day low", "10 pips fixed", "At the entry price"],
          correctIndex: 0,
          explanation: "If price takes the sweep low, the setup is invalid."
        }
      ]
    }
  },
  {
    id: "L5",
    title: "Level 5: Mastery",
    difficulty: "MASTERY",
    description: "The Exam. Prove your skill in the Simulator.",
    allowedTimeframes: ['1m', '3m', '5m', '15m', '30m', '1H', '2H', '4H', '1D', '1W', '1M'],
    criteria: { minXPMultiplier: 1 },
    modules: [
      {
        id: "M7",
        title: "The Gauntlet",
        description: "Simulated execution testing.",
        lessons: [
          {
            id: "l5-m7-1",
            title: "Final Certification",
            description: "Execute 5 valid setups in the Simulator.",
            content: "You have the knowledge. Now you need the instinct.\n\n**Mission**:\n1. Go to the **Simulator** tab.\n2. Identify 5 valid **Turtle Soup** setups inside a **Killzone**.\n3. Execute them with proper stops.\n4. End with a positive PnL.\n\nGood luck. Protect The Pot.",
            durationMin: 60,
          }
        ]
      }
    ]
  }
];