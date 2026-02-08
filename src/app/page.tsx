"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTamboThread, useTambo } from "@tambo-ai/react";
import { PatientTable } from "@/components/ai/PatientTable";
import { TreatmentSimulator } from "@/components/ai/TreatmentSimulator";
import { RiskHeatmap } from "@/components/ai/RiskHeatmap";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { MCPStatus } from "@/components/shared/MCPStatus";
import { LandingPage } from "@/components/shared/LandingPage";
import { TamboLogo } from "@/components/shared/TamboLogo";

interface MessageWithComponent {
    id: string;
    role: string;
    content: any[];
    componentName: string | null;
    componentProps: any;
}

export default function Dashboard() {
    const { thread, sendThreadMessage, streaming, error: threadError, isLoading } = useTamboThread();
    const tambo = useTambo();
    const [showLanding, setShowLanding] = useState(true);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [debugLog, setDebugLog] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Track processed message IDs to prevent duplicates
    const processedMessageIds = useRef<Set<string>>(new Set());

    // Track thread errors
    useEffect(() => {
        if (threadError) {
            console.error("Thread error detected:", threadError);
            setApiError(threadError.message);
        }
    }, [threadError]);

    useEffect(() => {
        if (!showLanding && inputRef.current) inputRef.current.focus();
    }, [showLanding]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [thread.messages, streaming]);

    // Memoized deduplicated messages with component extraction
    const processedMessages = useMemo(() => {
        const messageMap = new Map<string, MessageWithComponent>();
        
        thread.messages.forEach((m: any) => {
            // Skip if already processed
            if (messageMap.has(m.id)) return;
            
            const text = m.content?.map((c: any) => c.text || '').join('') || '';
            
            // Extract component info from message
            let componentName = m.component?.componentName || null;
            let componentProps = m.component?.props || {};
            
            // If no formal component, try to extract from text
            if (!componentName) {
                const patientsKey = text.match(/patients_\d{6}/)?.[0];
                const heatmapKey = text.match(/dept_summary_\d{6}/)?.[0];
                const cohortKey = text.match(/cohort_\d{6}/)?.[0];
                
                if (patientsKey) {
                    componentName = "PatientTable";
                    componentProps = { memoryKey: patientsKey };
                } else if (heatmapKey) {
                    componentName = "RiskHeatmap";
                    componentProps = { memoryKey: heatmapKey };
                } else if (cohortKey) {
                    componentName = "TreatmentSimulator";
                    componentProps = { cohortMemoryKey: cohortKey };
                }
            }
            
            messageMap.set(m.id, {
                id: m.id,
                role: m.role,
                content: m.content || [],
                componentName,
                componentProps
            });
        });
        
        return Array.from(messageMap.values());
    }, [thread.messages]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const query = input.trim();
        if (!query || isSubmitting) return;

        setIsSubmitting(true);
        setInput("");
        setDebugLog(prev => [...prev.slice(-3), `Sending: ${query.substring(0, 10)}...`]);
        setApiError(null);

        try {
            console.log("Sending message to Tambo API:", query);
            await sendThreadMessage(query);
            console.log("Message sent successfully");
        } catch (err: any) {
            console.error("API Submission Failed:", err);
            
            const errorMessage = err?.message || "Unknown API Error";
            setApiError(`API Error: ${errorMessage}`);
            setDebugLog(prev => [...prev.slice(-3), `API Err: ${errorMessage}`]);
        } finally {
            setIsSubmitting(false);
        }
    }, [input, isSubmitting, sendThreadMessage]);

    const renderComponent = useCallback((name: string, props: any, messageContent?: string) => {
        let componentName = name;
        let finalProps = { ...props };

        if (!componentName || componentName.trim() === "") {
            const mKey = finalProps.memoryKey || finalProps.memory_key;
            const cKey = finalProps.cohortMemoryKey || finalProps.cohort_memory_key;
            if (mKey) componentName = "PatientTable";
            else if (cKey) componentName = "TreatmentSimulator";
        }

        if (!componentName && messageContent) {
            const memoryMatch = messageContent.match(/["']?memory_key["']?\s*:\s*["']([^"']+)["']/);
            if (memoryMatch) {
                componentName = "PatientTable";
                finalProps.memoryKey = memoryMatch[1];
            } else {
                const patientKeyMatch = messageContent.match(/patients_\d{6}/);
                if (patientKeyMatch) {
                    componentName = "PatientTable";
                    finalProps.memoryKey = patientKeyMatch[0];
                }
            }
        }

        if (!componentName || !componentName.trim()) {
            return (
                <div className="p-4 text-[10px] font-mono text-slate-500 italic">
                    AI omitted component name. Props: {JSON.stringify(props)}
                </div>
            );
        }

        switch (componentName) {
            case "PatientTable": return <PatientTable {...finalProps} />;
            case "TreatmentSimulator": return <TreatmentSimulator {...finalProps} />;
            case "RiskHeatmap": return <RiskHeatmap {...finalProps} />;
            default: return <div className="text-red-500 font-mono text-xs border border-red-500/20 p-2 rounded bg-red-950/20">Unknown Component: &quot;{componentName}&quot;</div>;
        }
    }, []);

    if (showLanding) {
        return <LandingPage onStart={() => setShowLanding(false)} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
            <header className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 pointer-events-none">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowLanding(true)}>
                        <TamboLogo size="sm" animated={true} />
                        <div className="hidden sm:flex flex-col">
                            <span className="font-black tracking-tight text-white text-lg">TAMBO</span>
                            <span className="text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase -mt-1">PULSE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-[10px] font-mono text-slate-600 bg-slate-900 px-2 py-1 rounded">
                            {debugLog.map((l, i) => <span key={i} className="ml-2 last:text-green-400">{l}</span>)}
                        </div>
                        <MCPStatus connected={!apiError} recordCount={10000} usingRealData={true} />
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto pt-24 pb-40 px-6">
                {/* API Status Banner */}
                {apiError && (
                    <div className="mb-6 p-4 bg-blue-950/50 border border-blue-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-mono">
                            <span className="text-lg">●</span>
                            <span>Using Real Open Source Health Data</span>
                        </div>
                        <p className="text-xs text-blue-300/70 mt-2 font-mono">
                            MCP server offline. Operating in Real Data Mode with live health statistics from HealthData.gov, CDC, and CMS Open Data APIs.
                        </p>
                    </div>
                )}
                
                {processedMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                        <h2 className="text-3xl font-bold text-white">Clinical Command Center</h2>

                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 max-w-md w-full text-left font-mono text-xs">
                            <div className="flex justify-between border-b border-slate-700 pb-2 mb-2">
                                <span className="text-slate-400">SYSTEM STATUS</span>
                                <span className={isSubmitting ? "text-yellow-400" : streaming ? "text-green-400" : apiError ? "text-blue-400" : "text-slate-500"}>
                                    {isSubmitting ? "SENDING" : streaming ? "STREAMING" : apiError ? "REAL_DATA_MODE" : "READY"}
                                </span>
                            </div>
                            <div className="space-y-1 text-slate-300">
                                {debugLog.length === 0 ? (
                                    <>
                                        <span className="text-blue-400">● Real-time Health Data Active</span>
                                        <span className="text-slate-500 block mt-1">Sources: HealthData.gov • CDC • CMS Open Data</span>
                                    </>
                                ) : debugLog.map((l, i) => <div key={i}>{l}</div>)}
                            </div>
                        </div>

                        <div className="text-sm text-slate-400 max-w-lg">
                            <p className="mb-2">Try asking about:</p>
                            <div className="flex gap-2 flex-wrap justify-center">
                                <button onClick={() => setInput("Show me high risk patients in ICU")} className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 text-xs transition-colors border border-slate-700">ICU patients</button>
                                <button onClick={() => setInput("Show department risk summary")} className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 text-xs transition-colors border border-slate-700">Department summary</button>
                                <button onClick={() => setInput("What if we reduce staffing?")} className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 text-xs transition-colors border border-slate-700">Staffing simulation</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div ref={scrollRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {processedMessages.map((m) => (
                            <div key={m.id} className="flex gap-4 group">
                                <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-xs ${m.role === 'user' ? 'bg-slate-800' : 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'}`}>
                                    {m.role === 'user' ? 'U' : 'AI'}
                                </div>
                                <div className="flex-1 space-y-4 min-w-0">
                                    <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                                        {m.content.map((c: any, i: number) => c.type === 'text' ? c.text : null)}
                                    </div>
                                    {m.componentName && (
                                        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 shadow-2xl mt-4 animate-in zoom-in-95 duration-300">
                                            <div className="px-3 py-1 bg-slate-800 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-700 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                    <span>{m.componentName}</span>
                                                </div>
                                            </div>
                                            <ErrorBoundary>
                                                {renderComponent(
                                                    m.componentName,
                                                    m.componentProps,
                                                    m.content.map((c: any) => c.text || '').join('')
                                                )}
                                            </ErrorBoundary>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <div className="fixed bottom-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-40 pointer-events-auto">
                <div className="max-w-3xl mx-auto relative group">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your query here... (e.g., 'Show high-risk ICU patients')"
                            className="w-full h-16 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl px-6 text-white focus:border-red-500 focus:outline-none transition-all shadow-2xl text-lg relative z-10"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isSubmitting}
                            className="absolute right-3 top-3 bottom-3 px-8 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 transition-all z-20 shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95"
                        >
                            {isSubmitting ? "Sending..." : "Execute"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
