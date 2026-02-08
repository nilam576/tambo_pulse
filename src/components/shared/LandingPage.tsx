"use client";

import React from 'react';

interface HeroProps {
    onStart: () => void;
}

export const LandingPage: React.FC<HeroProps> = ({ onStart }) => {
    return (
        <div className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center px-6">
            {/* Background Cinematic Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-red-900/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-[25%] -right-[10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            </div>

            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="relative z-10 max-w-5xl w-full text-center space-y-12">
                {/* Logo/Brand */}
                <div className="flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-500/50">
                        <span className="text-4xl font-black text-white">P</span>
                    </div>
                    <h2 className="text-sm font-black tracking-[0.5em] text-red-500 uppercase">Advanced Medical Protocol</h2>
                </div>

                {/* Main Heading */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
                        TAMBO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">PULSE</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        The next generation of clinical operations. Real-time patient monitoring,
                        predictive risk analysis, and resource optimization powered by Generative UI.
                    </p>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-in fade-in slide-in-from-bottom-14 duration-1000 delay-400">
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-red-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Real-time Analytics</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Instantly monitor 10,000+ patient vitals with 60fps virtualized rendering.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-blue-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Generative UI</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Dynamic interface construction based on clinical intent and medical urgency.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Resource Simulator</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Optimize bed allocation and staffing levels with predictive impact modeling.</p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-600">
                    <button
                        onClick={onStart}
                        className="group relative px-12 py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        <span className="relative z-10 text-lg uppercase tracking-widest">Initalize Command Center</span>
                    </button>
                    <p className="mt-6 text-[10px] font-mono text-slate-600 uppercase tracking-widest">Secure access granted for authorized personnel only</p>
                </div>
            </div>

            {/* Footer Decoration */}
            <div className="absolute bottom-12 w-full max-w-7xl px-6 flex justify-between items-center text-[10px] font-mono text-slate-700 uppercase tracking-widest border-t border-slate-900/50 pt-8">
                <div className="flex gap-8">
                    <span>Version: 4.0.2_OS</span>
                    <span>Node: Active</span>
                </div>
                <div>
                    <span>© 2026 Tambo Medical Systems</span>
                </div>
            </div>
        </div>
    );
};
