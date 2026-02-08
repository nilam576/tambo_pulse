"use client";

import { useState, useEffect } from "react";
import { useTamboThread, useTamboComponentState } from "@tambo-ai/react";
import { TreatmentSimulatorProps } from "./schema";

export const TreatmentSimulator = ({
    cohortMemoryKey,
    initialStaffing = 1.0,
    initialBeds = 0.8,
    title = "Unit Resource Optimizer",
    showProjections = true,
}: TreatmentSimulatorProps) => {
    // Sync state with Tambo for the state roundtrip
    const [staffing, setStaffing] = useTamboComponentState("staffing", initialStaffing);
    const [beds, setBeds] = useTamboComponentState("beds", initialBeds);

    const [lastUpdate, setLastUpdate] = useState<string | null>(null);
    const { sendThreadMessage, streaming } = useTamboThread();

    // Notify AI when simulation parameters significantly change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (staffing !== initialStaffing || beds !== initialBeds) {
                sendThreadMessage(`[RE-SIMULATE] Parameters changed for cohort ${cohortMemoryKey}: Staffing=${((staffing || 0) * 100).toFixed(0)}%, Beds=${((beds || 0) * 100).toFixed(0)}%. Recalculate patient safety metrics.`);
                setLastUpdate(new Date().toLocaleTimeString());
            }
        }, 1500); // 1.5s debounce for simulation

        return () => clearTimeout(timer);
    }, [staffing, beds, cohortMemoryKey, initialStaffing, initialBeds, sendThreadMessage]);

    const getStatusTheme = (value: number, thresholds: [number, number]) => {
        if (value < thresholds[0]) return { color: "bg-red-600", text: "CRITICAL", shadow: "shadow-red-200" };
        if (value < thresholds[1]) return { color: "bg-amber-500", text: "SUB-OPTIMAL", shadow: "shadow-amber-100" };
        return { color: "bg-emerald-500", text: "OPTIMAL", shadow: "shadow-emerald-200" };
    };

    const staffingStatus = getStatusTheme(staffing || 0, [0.7, 0.9]);
    const bedStatus = getStatusTheme(beds || 0, [0.3, 0.5]);

    // Calculate projected impact (Synthetic logic for UI feedback)
    const multiplier = (1.0 + (1.0 - (staffing || 1)) * 0.6) * (1.0 + (1.0 - (beds || 1)) * 0.4);

    return (
        <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
            {/* Glassmorphism Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping absolute opacity-75"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-500 relative"></div>
                    </div>
                    <h3 className="font-black tracking-tight text-lg uppercase">{title}</h3>
                </div>
                {lastUpdate && (
                    <div className="text-[10px] font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        LAST SYNC: {lastUpdate}
                    </div>
                )}
            </div>

            <div className="p-8 space-y-10">
                {/* Staffing Control */}
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Workforce</span>
                            <p className="text-sm font-bold text-slate-300">Staffing Capacity</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md text-white ${staffingStatus.color} ${staffingStatus.shadow} shadow-sm mr-3`}>
                                {staffingStatus.text}
                            </span>
                            <span className="text-3xl font-black tabular-nums tracking-tighter">
                                {((staffing || 0) * 100).toFixed(0)}<span className="text-sm text-slate-500 ml-0.5">%</span>
                            </span>
                        </div>
                    </div>
                    <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-full transition-all duration-300 ${staffingStatus.color}`}
                            style={{ width: `${(staffing || 0) * 100}%` }}
                        />
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={staffing}
                        onChange={(e) => setStaffing(parseFloat(e.target.value))}
                        className="w-full h-8 opacity-0 absolute mt-[-20px] cursor-pointer z-10"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-3 tracking-tighter">
                        <span>MINIMAL SAFE</span>
                        <span>TARGET LOAD</span>
                        <span>SURGE MODE</span>
                    </div>
                </div>

                {/* Bed Control */}
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Infrastructure Status</span>
                            <p className="text-sm font-bold text-slate-300">Bed Availability</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md text-white ${bedStatus.color} ${bedStatus.shadow} shadow-sm mr-3`}>
                                {bedStatus.text}
                            </span>
                            <span className="text-3xl font-black tabular-nums tracking-tighter">
                                {((beds || 0) * 100).toFixed(0)}<span className="text-sm text-slate-500 ml-0.5">%</span>
                            </span>
                        </div>
                    </div>
                    <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-full transition-all duration-300 ${bedStatus.color}`}
                            style={{ width: `${(beds || 0) * 100}%` }}
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={beds}
                        onChange={(e) => setBeds(parseFloat(e.target.value))}
                        className="w-full h-8 opacity-0 absolute mt-[-20px] cursor-pointer z-10"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-3 tracking-tighter">
                        <span>UNIT SATURATED</span>
                        <span>BALANCED</span>
                        <span>IDLE CAPACITY</span>
                    </div>
                </div>

                {/* Performance Projections */}
                {showProjections && (
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Safety Projections</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-500 uppercase">Risk Index</p>
                                <p className={`text-2xl font-black ${multiplier > 1.2 ? "text-red-500" : "text-emerald-400"}`}>
                                    {multiplier.toFixed(2)}<span className="text-xs ml-0.5 text-slate-400">x</span>
                                </p>
                            </div>
                            <div className="space-y-1 text-center">
                                <p className="text-[9px] font-bold text-slate-500 uppercase">Latency</p>
                                <p className="text-2xl font-black text-slate-100">
                                    {Math.round((multiplier - 1) * 80)}<span className="text-xs ml-0.5 text-slate-400">ms</span>
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[9px] font-bold text-slate-500 uppercase">PX Score</p>
                                <p className="text-2xl font-black text-blue-400">
                                    {Math.max(0, Math.round(100 - (multiplier - 1) * 150))}<span className="text-xs ml-0.5 text-slate-400">%</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Interaction Hint */}
            <div className="px-8 py-4 bg-blue-600/10 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
                        <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse delay-75"></div>
                        <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                        {streaming ? "AI Engine Recalculating..." : "AI Observer Active"}
                    </span>
                </div>
                <div className="text-[9px] text-slate-600 font-mono tracking-tighter">
                    THID: {cohortMemoryKey}
                </div>
            </div>
        </div>
    );
};

export default TreatmentSimulator;
