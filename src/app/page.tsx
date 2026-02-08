"use client";

import { useState, useRef, useEffect } from "react";
import { useTamboThread } from "@tambo-ai/react";
import { PatientTable } from "@/components/ai/PatientTable";
import { TreatmentSimulator } from "@/components/ai/TreatmentSimulator";
import { RiskHeatmap } from "@/components/ai/RiskHeatmap";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { MCPStatus } from "@/components/shared/MCPStatus";

import { LandingPage } from "@/components/shared/LandingPage";

export default function Dashboard() {
    const { thread, sendThreadMessage, streaming } = useTamboThread();
    const [showLanding, setShowLanding] = useState(true);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [debugLog, setDebugLog] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [mockMessages, setMockMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!showLanding && inputRef.current) inputRef.current.focus();
    }, [showLanding]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        if (thread.messages.length > 0)
            setDebugLog(prev => [...prev.slice(-3), `Rx: ${thread.messages[thread.messages.length - 1].role}`]);
    }, [thread.messages, streaming, mockMessages]);

    const allMessages = [...thread.messages, ...mockMessages];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = input.trim();
        if (!query) return;

        setInput("");
        setDebugLog(prev => [...prev.slice(-3), `Sending: ${query.substring(0, 10)}...`]);

        try {
            // Attempt to send to real API
            await sendThreadMessage(query);
            // If successful, we rely on 'thread.messages' updating automatically.
        } catch (err: any) {
            console.error("API Submission Failed:", err);
            setDebugLog(prev => [...prev.slice(-3), `API Err: ${err.message}`]);
            // Do not fallback to simulation. Show real error.
            const errorResponseString = `Error: ${err.message || "Unknown API Error"}. Please check your API key and connection.`;
            const mockResponse = {
                id: Date.now().toString(),
                role: "assistant",
                content: [{ type: "text", text: errorResponseString }],
                // no component
            };
            setMockMessages(prev => [...prev, mockResponse]);
        }

    };

    const renderComponent = (name: string, props: any, messageContent?: string) => {
        let componentName = name;
        let finalProps = { ...props };

        // Resilience 1: Extract memory key from props if name is missing
        if (!componentName || componentName.trim() === "") {
            const mKey = finalProps.memoryKey || finalProps.memory_key;
            const cKey = finalProps.cohortMemoryKey || finalProps.cohort_memory_key;
            if (mKey) componentName = "PatientTable";
            else if (cKey) componentName = "TreatmentSimulator";
        }

        // Resilience 2: Deep search in message content if props are null/empty
        if (!componentName && messageContent) {
            const memoryMatch = messageContent.match(/["']?memory_key["']?\s*:\s*["']([^"']+)["']/);
            if (memoryMatch) {
                componentName = "PatientTable";
                finalProps.memoryKey = memoryMatch[1];
            } else {
                // Resilience 3: Aggressive scan for any patient memory keys
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
            default: return <div className="text-red-500 font-mono text-xs border border-red-500/20 p-2 rounded bg-red-950/20">Unknown Component: "{componentName}"</div>;
        }
    };

    if (showLanding) {
        return <LandingPage onStart={() => setShowLanding(false)} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
            <header className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 pointer-events-none">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white transition-transform hover:scale-110 cursor-pointer" onClick={() => setShowLanding(true)}>P</div>
                        <h1 className="font-bold tracking-tight text-white cursor-pointer" onClick={() => setShowLanding(true)}>TAMBO PULSE</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-[10px] font-mono text-slate-600 bg-slate-900 px-2 py-1 rounded">
                            {debugLog.map((l, i) => <span key={i} className="ml-2 last:text-green-400">{l}</span>)}
                        </div>
                        <MCPStatus connected={true} recordCount={10000} />
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto pt-24 pb-40 px-6">
                {allMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                        <h2 className="text-3xl font-bold text-white">Clinical Command Center</h2>

                        {/* System Status / Debug Info */}
                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 max-w-md w-full text-left font-mono text-xs">
                            <div className="flex justify-between border-b border-slate-700 pb-2 mb-2">
                                <span className="text-slate-400">SYSTEM STATUS</span>
                                <span className={streaming ? "text-green-400" : "text-slate-500"}>{streaming ? "STREAMING" : "IDLE"}</span>
                            </div>
                            <div className="space-y-1 text-slate-300">
                                {debugLog.length === 0 ? <span className="text-slate-600 italic">System Ready. Waiting for input...</span> : debugLog.map((l, i) => <div key={i}>{l}</div>)}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setInput("Show high-risk patients")} className="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 text-sm transition-colors border border-slate-700 hover:border-red-500/50">Monitor Risk</button>
                            <button onClick={() => setInput("Show simulation status")} className="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 text-sm transition-colors border border-slate-700 hover:border-blue-500/50">Check Status</button>
                        </div>
                    </div>
                ) : (
                    <div ref={scrollRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {allMessages.map((m) => (
                            <div key={m.id} className="flex gap-4 group">
                                <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-xs ${m.role === 'user' ? 'bg-slate-800' : 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]'}`}>
                                    {m.role === 'user' ? 'U' : 'AI'}
                                </div>
                                <div className="flex-1 space-y-4 min-w-0">
                                    <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                                        {m.content.map((c: any, i: number) => c.type === 'text' ? c.text : null)}
                                    </div>
                                    {(() => {
                                        // 1. Formal component from SDK
                                        const formalComponent = m.component;

                                        // 2. Synthetic component from text scanning (Auto-Recovery)
                                        const text = m.content.map((c: any) => c.text || '').join('');
                                        const patientsKey = text.match(/patients_\d{6}/)?.[0];
                                        const heatmapKey = text.match(/dept_summary_\d{6}/)?.[0];
                                        const cohortKey = text.match(/cohort_\d{6}/)?.[0];

                                        // If no formal component AND we found a key in text, create a synthetic one
                                        let activeComponent = formalComponent;
                                        if (!activeComponent) {
                                            if (patientsKey) activeComponent = { componentName: "PatientTable", props: { memoryKey: patientsKey } };
                                            else if (heatmapKey) activeComponent = { componentName: "RiskHeatmap", props: { memoryKey: heatmapKey } };
                                            else if (cohortKey) activeComponent = { componentName: "TreatmentSimulator", props: { cohortMemoryKey: cohortKey } };
                                        }

                                        if (!activeComponent) return null;

                                        return (
                                            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 shadow-2xl mt-4 animate-in zoom-in-95 duration-300">
                                                <div className="px-3 py-1 bg-slate-800 text-[10px] text-slate-400 uppercase font-mono border-b border-slate-700 flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                        <span>{activeComponent.componentName}</span>
                                                    </div>
                                                    {!formalComponent && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[9px] bg-red-900/40 text-red-300 px-2 py-0.5 rounded border border-red-500/30 font-black animate-pulse">
                                                                AUTO-RECOVERY ACTIVE
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <ErrorBoundary>
                                                    {renderComponent(
                                                        activeComponent.componentName,
                                                        activeComponent.props,
                                                        text
                                                    )}
                                                </ErrorBoundary>
                                            </div>
                                        );
                                    })()}
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
                            placeholder="Consult Tambo Pulse AI..."
                            className="w-full h-16 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl px-6 text-white focus:border-red-500 focus:outline-none transition-all shadow-2xl text-lg relative z-10"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-3 top-3 bottom-3 px-8 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 transition-all z-20 shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95"
                        >
                            Execute
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
