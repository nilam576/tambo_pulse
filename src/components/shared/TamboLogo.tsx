"use client";

import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    animated?: boolean;
    className?: string;
}

const sizes = {
    sm: { container: 32, icon: 24 },
    md: { container: 48, icon: 36 },
    lg: { container: 64, icon: 48 },
    xl: { container: 96, icon: 72 }
};

export const TamboLogo: React.FC<LogoProps> = ({ 
    size = 'md', 
    showText = false, 
    animated = true,
    className = ''
}) => {
    const { container, icon } = sizes[size];
    
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div 
                className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-lg ${animated ? 'group' : ''}`}
                style={{ width: container, height: container }}
            >
                {/* Animated pulse ring */}
                {animated && (
                    <div className="absolute inset-0 rounded-xl bg-red-500/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                
                <svg 
                    width={icon} 
                    height={icon} 
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={animated ? 'group-hover:scale-110 transition-transform duration-300' : ''}
                >
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#dc2626" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#f87171" />
                        </linearGradient>
                        <filter id="logoGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Outer ring */}
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        stroke="url(#logoGradient)" 
                        strokeWidth="2" 
                        fill="none"
                        filter="url(#logoGlow)"
                    />
                    
                    {/* ECG Pulse */}
                    <path 
                        d="M 15 50 L 30 50 L 35 35 L 42 65 L 48 25 L 55 75 L 60 50 L 70 50 L 85 50" 
                        stroke="url(#logoGradient)" 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        fill="none"
                        filter="url(#logoGlow)"
                    >
                        {animated && (
                            <animate 
                                attributeName="stroke-dasharray" 
                                values="0,300;300,0" 
                                dur="2s" 
                                repeatCount="indefinite"
                            />
                        )}
                    </path>
                    
                    {/* Center dot */}
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="7" 
                        fill="url(#logoGradient)"
                        filter="url(#logoGlow)"
                    >
                        {animated && (
                            <animate 
                                attributeName="r" 
                                values="7;9;7" 
                                dur="1.5s" 
                                repeatCount="indefinite"
                            />
                        )}
                    </circle>
                </svg>
            </div>
            
            {showText && (
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-white">
                        TAMBO
                    </span>
                    <span className="text-xs font-bold tracking-[0.3em] text-red-500 uppercase">
                        PULSE
                    </span>
                </div>
            )}
        </div>
    );
};

export default TamboLogo;
