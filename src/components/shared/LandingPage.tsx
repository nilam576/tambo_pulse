"use client";

import React, { useEffect, useRef } from 'react';
import { TamboLogo } from './TamboLogo';

interface HeroProps {
    onStart: () => void;
}

export const LandingPage: React.FC<HeroProps> = ({ onStart }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    // Avant-garde animated background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Neural network nodes
        const nodes: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
        const nodeCount = 50;
        const connectionDistance = 150;

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }

        let frameCount = 0;
        const animate = () => {
            frameCount++;
            // Render every 2nd frame for performance
            if (frameCount % 2 === 0) {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Update and draw nodes
                nodes.forEach((node, i) => {
                    node.x += node.vx;
                    node.y += node.vy;

                    // Bounce off edges
                    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                    // Draw node
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(220, 38, 38, 0.6)';
                    ctx.fill();

                    // Draw connections
                    nodes.slice(i + 1).forEach((other) => {
                        const dx = node.x - other.x;
                        const dy = node.y - other.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < connectionDistance) {
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(other.x, other.y);
                            ctx.strokeStyle = `rgba(220, 38, 38, ${0.2 * (1 - dist / connectionDistance)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    });
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-slate-950 overflow-hidden">
            {/* Animated Neural Network Background */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 z-0"
                style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)' }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {/* Radial gradients for depth */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[200px]" />
            </div>

            {/* Geometric Pattern Overlay - Avant-garde */}
            <div className="absolute inset-0 z-[2] pointer-events-none opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
                        </pattern>
                        <pattern id="diagonal" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 0 100 L 100 0" fill="none" stroke="rgba(220,38,38,0.05)" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#diagonal)" />
                </svg>
            </div>

            {/* Scan Line Effect */}
            <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
                <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-[scan_8s_linear_infinite]" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
                <div className="max-w-6xl w-full">
                    
                    {/* Header with Logo */}
                    <div className="flex justify-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <TamboLogo size="lg" showText={true} animated={true} />
                    </div>

                    {/* Main Hero Section - Avant-garde Typography */}
                    <div className="text-center mb-20">
                        {/* Pre-title */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold tracking-[0.3em] text-red-400 uppercase">Next-Gen Clinical Intelligence</span>
                        </div>

                        {/* Main Title - Avant-garde Style */}
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                            <span className="block text-white">CLINICAL</span>
                            <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent">
                                COMMAND
                            </span>
                            <span className="block text-slate-600">CENTER</span>
                        </h1>

                        {/* Subtitle with artistic spacing */}
                        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            Real-time patient monitoring powered by Generative UI.
                            <br className="hidden md:block" />
                            <span className="text-slate-500">Predictive risk analysis. Resource optimization.</span>
                        </p>
                    </div>

                    {/* Avant-garde Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-slate-800 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ),
                                title: "Real-time Analytics",
                                desc: "10,000+ patient vitals",
                                color: "red"
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ),
                                title: "Generative UI",
                                desc: "Dynamic interface construction",
                                color: "blue"
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ),
                                title: "Resource Optimizer",
                                desc: "Predictive impact modeling",
                                color: "emerald"
                            }
                        ].map((feature, index) => (
                            <div 
                                key={index} 
                                className="p-8 bg-slate-950/80 hover:bg-slate-900/80 transition-all duration-500 group"
                            >
                                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-${feature.color}-500`}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-white mb-2 uppercase tracking-wider text-sm">{feature.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="flex flex-col items-center mt-20 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-700">
                        <button
                            onClick={onStart}
                            className="group relative px-16 py-6 overflow-hidden rounded-full transition-all duration-500"
                        >
                            {/* Button background with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-white/20 to-red-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-full blur-xl bg-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <span className="relative z-10 text-lg font-black text-white uppercase tracking-[0.2em]">
                                Initialize System
                            </span>
                        </button>
                        
                        <div className="mt-8 flex items-center gap-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                            <span className="w-8 h-px bg-slate-700" />
                            <span>Authorized Personnel Only</span>
                            <span className="w-8 h-px bg-slate-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-800/50 pt-6">
                    <div className="flex items-center gap-6 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                        <span>v4.0.2_OS</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-green-500">● System Active</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span>HealthData.gov Connected</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
                        © 2026 Tambo Medical Systems
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
