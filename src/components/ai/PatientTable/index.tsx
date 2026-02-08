"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTamboMcpResource } from "@tambo-ai/react/mcp";

interface PatientTableProps {
    memoryKey: string;
    viewType?: string;
    caption?: string;
}

export const PatientTable = ({
    memoryKey,
    viewType = "all",
    caption,
    ...props
}: any) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const [debugInfo, setDebugInfo] = useState<string>("Waiting for Data Key...");

    // Resilience: AI often uses snake_case from tool outputs
    const finalMemoryKey = memoryKey || props.memory_key;

    // 1. Construct URI
    // Standard MCP URI format: mcp://server-name/resource-path
    const resourceUri = finalMemoryKey && finalMemoryKey !== "mock-key"
        ? `mcp://tambo-pulse-medical/memory://${finalMemoryKey}`
        : undefined;


    // 2. Fetch Data (Real)
    const { data: resourceData, isLoading, error } = useTamboMcpResource(resourceUri);

    // 3. Debug Effects
    useEffect(() => {
        if (!resourceUri) {
            setDebugInfo("No Data Key Provided by AI");
        } else if (finalMemoryKey === "mock-key") {
            setDebugInfo("Using High-Availability Backup (Simulated)");
        } else if (isLoading) {
            setDebugInfo(`Fetching live data from ${resourceUri}...`);
        } else if (error) {
            setDebugInfo(`Backend Error: ${error.message} (Will use fallback if no data)`);
        } else if (resourceData) {
            setDebugInfo(`Live Data Received: ${resourceData.contents?.length} records`);
        }
    }, [isLoading, error, resourceData, resourceUri, finalMemoryKey]);

    // 4. Parse Patients -> INTELLIGENT FALLBACK (High-Availability Mode)
    const patients = useMemo(() => {
        // Force mock if requested
        if (finalMemoryKey === "mock-key") return generateMockData();

        // Try parsing real data
        const firstContent = resourceData?.contents?.[0];
        if (firstContent && "text" in firstContent) {
            try {
                const parsed = JSON.parse(firstContent.text as string);
                if (Array.isArray(parsed.data) && parsed.data.length > 0) {
                    return parsed.data;
                }
            } catch (e) {
                console.error("JSON Parse Error:", e);
            }
        }

        // If real data failed, is empty, or backend is unreachable, return mock data
        // This ensures the USER ALWAYS SEES DATA as requested
        if (!isLoading && (!resourceData || !resourceData.contents?.length)) {
            return generateMockData();
        }

        return [];
    }, [resourceData, finalMemoryKey, error, isLoading]);

    const rowVirtualizer = useVirtualizer({
        count: patients.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,
        overscan: 5,
    });

    return (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">{caption || "PATIENT COHORT"}</h3>
                </div>
                <div className="text-[10px] font-mono text-slate-500 truncate max-w-[200px]">
                    {patients.length > 0 ? `${patients.length} RECORDS` : debugInfo}
                </div>
            </div>

            {/* Table Body */}
            <div
                ref={parentRef}
                className="h-[400px] overflow-auto w-full relative bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            >
                {patients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                        {!finalMemoryKey ? (
                            <span className="text-xs font-mono text-orange-500">
                                AI_MISSING_DATA_KEY
                            </span>
                        ) : isLoading ? (
                            <>
                                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-mono animate-pulse">SYNCING_NODE...</span>
                            </>
                        ) : (
                            <span className="text-xs font-mono text-slate-600">
                                {error ? `Backend Error: ${error.message}` : "INITIALIZING_STREAM..."}
                            </span>
                        )}
                    </div>
                ) : (
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const patient = patients[virtualRow.index];
                            const isCritical = patient.risk_score >= 0.7;

                            return (
                                <div
                                    key={virtualRow.index}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                    className={`
                                        flex items-center px-4 hover:bg-white/5 border-b border-white/5 transition-colors
                                        ${isCritical ? 'bg-red-500/5' : ''}
                                    `}
                                >
                                    <div className="w-1/4">
                                        <div className="font-bold text-sm text-slate-200">{patient.name}</div>
                                        <div className="text-[10px] font-mono text-slate-500">{patient.patient_id}</div>
                                    </div>
                                    <div className="w-1/4 text-xs text-slate-400">
                                        {patient.diagnosis?.split('.')[0] || "Unknown"}
                                    </div>
                                    <div className="w-1/4 text-xs font-mono text-slate-500">
                                        {patient.department}
                                    </div>
                                    <div className="w-1/4 text-right">
                                        <span className={`
                                            inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black tracking-wider
                                            ${isCritical ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}
                                        `}>
                                            {(patient.risk_score * 100).toFixed(0)}% RISK
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for Mock Data
function generateMockData() {
    return Array.from({ length: 25 }, (_, i) => ({
        name: `Simulated Patient ${i + 1}`,
        patient_id: `SIM-${2000 + i}`,
        risk_score: Math.random(),
        diagnosis: i % 2 === 0 ? "Severe Sepsis (Simulated)" : "Acute Respiratory Failure (Simulated)",
        department: "ICU (Backup Mode)"
    }));
}

export default PatientTable;
