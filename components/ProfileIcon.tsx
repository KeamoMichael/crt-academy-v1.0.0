import React from 'react';
import { isBuiltInIcon, extractIconId, getIconById } from '../src/utils/profileIcons';

interface ProfileIconProps {
    iconUrl: string | null;
    username?: string | null;
    email?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-32 h-32 text-4xl'
};

export const ProfileIcon: React.FC<ProfileIconProps> = ({ 
    iconUrl, 
    username, 
    email, 
    size = 'md',
    className = '' 
}) => {
    const sizeClass = sizeClasses[size];
    const displayInitial = username ? username.charAt(0).toUpperCase() : email?.charAt(0).toUpperCase() || '?';

    const renderIcon = () => {
        if (isBuiltInIcon(iconUrl)) {
            const iconId = extractIconId(iconUrl);
            const icon = iconId ? getIconById(iconId) : null;
            if (icon) {
                return (
                    <div className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center ${className}`}>
                        {icon.component}
                    </div>
                );
            }
        }
        
        if (iconUrl && !isBuiltInIcon(iconUrl)) {
            return (
                <img
                    src={iconUrl}
                    alt="Profile"
                    className={`${sizeClass} rounded-full object-cover ${className}`}
                />
            );
        }

        // Default fallback
        return (
            <div className={`${sizeClass} rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ${className}`}>
                <span className="font-bold text-white">
                    {displayInitial}
                </span>
            </div>
        );
    };

    return renderIcon();
};

