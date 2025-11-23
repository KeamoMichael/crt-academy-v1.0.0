import React from 'react';

// Built-in profile icon options - Creative trading/finance themed avatars
export interface ProfileIconOption {
    id: string;
    name: string;
    component: React.ReactNode;
    category: 'trading' | 'finance' | 'abstract' | 'geometric';
}

// Generate SVG-based profile icons with unique gradient IDs
let gradientCounter = 0;
const generateIconSVG = (content: string, color1: string, color2: string, textColor: string = 'white') => {
    const gradientId = `grad-${gradientCounter++}`;
    const colorMap: Record<string, string> = {
        'emerald': '#10b981',
        'slate': '#475569',
        'blue': '#3b82f6',
        'indigo': '#6366f1',
        'purple': '#8b5cf6',
        'orange': '#f97316',
        'amber': '#f59e0b',
        'yellow': '#eab308',
        'red': '#ef4444'
    };
    
    const stop1 = colorMap[color1] || '#10b981';
    const stop2 = colorMap[color2] || '#059669';
    
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={stop1} stopOpacity="1" />
                    <stop offset="100%" stopColor={stop2} stopOpacity="1" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
            <text x="50" y="50" fontSize="40" fill={textColor} textAnchor="middle" dominantBaseline="central" fontWeight="bold">
                {content}
            </text>
        </svg>
    );
};

export const BUILT_IN_PROFILE_ICONS: ProfileIconOption[] = [
    // Trading themed
    {
        id: 'bull',
        name: 'Bull Market',
        category: 'trading',
        component: generateIconSVG('🐂', 'emerald', 'emerald', 'white')
    },
    {
        id: 'bear',
        name: 'Bear Market',
        category: 'trading',
        component: generateIconSVG('🐻', 'slate', 'slate', 'white')
    },
    {
        id: 'chart',
        name: 'Chart Master',
        category: 'trading',
        component: generateIconSVG('📈', 'blue', 'blue', 'white')
    },
    {
        id: 'trend',
        name: 'Trend Trader',
        category: 'trading',
        component: generateIconSVG('📊', 'indigo', 'indigo', 'white')
    },
    {
        id: 'diamond',
        name: 'Diamond Hands',
        category: 'trading',
        component: generateIconSVG('💎', 'purple', 'purple', 'white')
    },
    {
        id: 'rocket',
        name: 'Rocket',
        category: 'trading',
        component: generateIconSVG('🚀', 'orange', 'orange', 'white')
    },
    // Finance themed
    {
        id: 'money',
        name: 'Money Bag',
        category: 'finance',
        component: generateIconSVG('💰', 'amber', 'amber', 'white')
    },
    {
        id: 'coin',
        name: 'Gold Coin',
        category: 'finance',
        component: generateIconSVG('🪙', 'yellow', 'yellow', 'white')
    },
    {
        id: 'bank',
        name: 'Bank',
        category: 'finance',
        component: generateIconSVG('🏦', 'emerald', 'emerald', 'white')
    },
    {
        id: 'credit',
        name: 'Credit Card',
        category: 'finance',
        component: generateIconSVG('💳', 'blue', 'blue', 'white')
    },
    // Abstract/Geometric
    {
        id: 'star',
        name: 'Star',
        category: 'abstract',
        component: generateIconSVG('⭐', 'amber', 'amber', 'white')
    },
    {
        id: 'fire',
        name: 'Fire',
        category: 'abstract',
        component: generateIconSVG('🔥', 'red', 'red', 'white')
    },
    {
        id: 'lightning',
        name: 'Lightning',
        category: 'abstract',
        component: generateIconSVG('⚡', 'yellow', 'yellow', 'white')
    },
    {
        id: 'crown',
        name: 'Crown',
        category: 'abstract',
        component: generateIconSVG('👑', 'amber', 'amber', 'white')
    },
    {
        id: 'trophy',
        name: 'Trophy',
        category: 'abstract',
        component: generateIconSVG('🏆', 'amber', 'amber', 'white')
    },
    {
        id: 'target',
        name: 'Target',
        category: 'geometric',
        component: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="50" fill="url(#targetGrad)" />
                <defs>
                    <linearGradient id="targetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="3" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="3" />
                <circle cx="50" cy="50" r="5" fill="white" />
            </svg>
        )
    },
    {
        id: 'shield',
        name: 'Shield',
        category: 'geometric',
        component: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <path d="M50 10 L20 20 L20 50 Q20 70 50 85 Q80 70 80 50 L80 20 Z" fill="url(#shieldGrad)" />
            </svg>
        )
    },
    {
        id: 'hexagon',
        name: 'Hexagon',
        category: 'geometric',
        component: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                    <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="url(#hexGrad)" />
            </svg>
        )
    },
    {
        id: 'circle',
        name: 'Circle',
        category: 'geometric',
        component: (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                    <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#db2777', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#circleGrad)" />
            </svg>
        )
    }
];

// Helper to get icon by ID
export const getIconById = (id: string): ProfileIconOption | undefined => {
    return BUILT_IN_PROFILE_ICONS.find(icon => icon.id === id);
};

// Helper to get icon URL (for built-in icons, we'll use a data URL or identifier)
export const getIconUrl = (iconId: string): string => {
    return `builtin:${iconId}`;
};

// Check if an icon URL is a built-in icon
export const isBuiltInIcon = (iconUrl: string | null): boolean => {
    return iconUrl?.startsWith('builtin:') ?? false;
};

// Extract icon ID from URL
export const extractIconId = (iconUrl: string): string | null => {
    if (iconUrl?.startsWith('builtin:')) {
        return iconUrl.replace('builtin:', '');
    }
    return null;
};

