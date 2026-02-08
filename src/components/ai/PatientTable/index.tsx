"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTamboMcpResource } from "@tambo-ai/react/mcp";
import { getPatientCohort, PatientRecord, storeInMemory } from "@/lib/healthData";

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
    const [debugInfo, setDebugInfo] = useState<string>("Initializing...");
    const [realDataLoaded, setRealDataLoaded] = useState(false);
    const [realPatients, setRealPatients] = useState<PatientRecord[]>([]);
    const [isLoadingReal, setIsLoadingReal] = useState(false);

    // Resilience: AI often uses snake_case from tool outputs
    const finalMemoryKey = memoryKey || props.memory_key;

    // Construct URI - Standard MCP URI format
    const resourceUri = finalMemoryKey
        ? `mcp://tambo-pulse-medical/memory://${finalMemoryKey}`
        : undefined;

    // Fetch Data from MCP Server
    const { data: resourceData, isLoading, error } = useTamboMcpResource(resourceUri);

    // Load real data when MCP fails or no memory key
    useEffect(() => {
        const loadRealData = async () => {
            // Check if MCP has data first
            const firstContent = resourceData?.contents?.[0];
            let mcpHasData = false;

            if (firstContent && "text" in firstContent) {
                try {
                    const parsed = JSON.parse(firstContent.text as string);
                    if (Array.isArray(parsed.data) && parsed.data.length > 0) {
                        mcpHasData = true;
                    }
                } catch (e) {
                    // MCP data invalid
                }
            }

            // If MCP has no data, load real open source health data
            if (!mcpHasData && !realDataLoaded && !isLoadingReal) {
                setIsLoadingReal(true);
                setDebugInfo("Fetching real open source health data...");

                try {
                    // Parse department filter from memory key or props
                    let department: string | undefined;
                    let riskThreshold: number | undefined;

                    // Try to infer filters from context
                    if (viewType && viewType !== 'all') {
                        department = viewType;
                    }

                    const { patients, memoryKey: newKey } = await getPatientCohort(department, riskThreshold);

                    // Store in memory for MCP pattern compatibility
                    storeInMemory(newKey, {
                        data: patients,
                        count: patients.length,
                        summary: {
                            avg_risk: patients.reduce((sum, p) => sum + p.risk_score, 0) / (patients.length || 1),
                            high_risk_count: patients.filter(p => p.risk_score >= 0.7).length,
                        }
                    });

                    setRealPatients(patients);
                    setRealDataLoaded(true);
                    setDebugInfo(`Loaded ${patients.length} real patient records from open source health statistics`);
                } catch (err) {
                    console.error("Failed to load real health data:", err);
                    setDebugInfo("Error loading health data");
                } finally {
                    setIsLoadingReal(false);
                }
            }
        };

        loadRealData();
    }, [resourceData, realDataLoaded, isLoadingReal, viewType]);

    // Debug Effects
    useEffect(() => {
        if (!finalMemoryKey && !realDataLoaded) {
            setDebugInfo("Loading real health data...");
        } else if (isLoading || isLoadingReal) {
            setDebugInfo(`Fetching data...`);
        } else if (error && !realDataLoaded) {
            setDebugInfo(`MCP Error, loading real data...`);
        } else if (realDataLoaded) {
            setDebugInfo(`Live Data: ${realPatients.length} records (Real Health Stats)`);
        } else if (resourceData) {
            setDebugInfo(`Live Data Received: MCP source`);
        }
    }, [isLoading, error, resourceData, realDataLoaded, realPatients.length, finalMemoryKey, isLoadingReal]);

    // Parse Patients - USE REAL DATA OR MCP DATA
    const patients = useMemo(() => {
        // Try MCP data first
        const firstContent = resourceData?.contents?.[0];
        if (firstContent && "text" in firstContent) {
            try {
                const parsed = JSON.parse(firstContent.text as string);
                if (Array.isArray(parsed.data) && parsed.data.length > 0) {
                    return parsed.data;
                }
            } catch (e) {
                console.error("MCP Parse Error:", e);
            }
        }

        // Fall back to real data
        if (realDataLoaded && realPatients.length > 0) {
            return realPatients;
        }

        return [];
    }, [resourceData, realDataLoaded, realPatients]);

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
                    <div className={`w-2 h-2 rounded-full animate-pulse ${error && !realDataLoaded ? 'bg-red-500' : patients.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">{caption || "PATIENT COHORT"}</h3>
                </div>
                <div className="text-[10px] font-mono text-slate-500 truncate max-w-[300px]">
                    {patients.length > 0 ? `${patients.length} RECORDS • REAL HEALTH DATA` : debugInfo}
                </div>
            </div>

            {/* Table Body */}
            <div
                ref={parentRef}
                className="h-[400px] overflow-auto w-full relative bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            >
                {patients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                        {isLoading || isLoadingReal ? (
                            <>
                                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-mono animate-pulse">LOADING REAL HEALTH DATA...</span>
                                <span className="text-[10px] text-slate-600">HealthData.gov • CDC • CMS Open Data</span>
                            </>
                        ) : error && !realDataLoaded ? (
                            <span className="text-xs font-mono text-red-500">
                                ERROR: {error.message}
                            </span>
                        ) : (
                            <>
                                <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-mono text-slate-600">
                                    INITIALIZING DATA STREAM...
                                </span>
                            </>
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
                                        <div className="flex gap-2 items-center">
                                            <div className="text-[10px] font-mono text-slate-500">{patient.patient_id}</div>
                                            <div className="text-[10px] bg-slate-800 px-1 rounded text-slate-400 font-mono">{patient.department}</div>
                                        </div>
                                    </div>
                                    <div className="w-1/4 text-xs text-slate-400">
                                        {patient.diagnosis?.split('.')[0] || "Unknown"}
                                    </div>
                                    <div className="w-1/4 flex gap-3 text-[10px] font-mono">
                                        <div className="flex flex-col">
                                            <span className="text-slate-600 uppercase">SpO2</span>
                                            <span className={`${(patient.vitals?.spo2 || patient.vitals?.oxygen_saturation) < 90 ? 'text-red-400 animate-pulse font-bold' : 'text-emerald-400'}`}>
                                                {patient.vitals?.spo2 || patient.vitals?.oxygen_saturation || "--"}%
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-600 uppercase">HR</span>
                                            <span className="text-slate-300">{patient.vitals?.heart_rate || "--"} bpm</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-600 uppercase">BP</span>
                                            <span className="text-slate-300">
                                                {patient.vitals?.bp_systolic || patient.vitals?.blood_pressure_systolic || "--"}/
                                                {patient.vitals?.bp_diastolic || patient.vitals?.blood_pressure_diastolic || "--"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-1/8 text-right flex-1">
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
        department: "ICU (Backup Mode)",
        vitals: {
            heart_rate: 70 + Math.floor(Math.random() * 40),
            spo2: 85 + Math.floor(Math.random() * 15),
            bp_systolic: 110 + Math.floor(Math.random() * 40),
            bp_diastolic: 70 + Math.floor(Math.random() * 20)
        }
    }));
}

export default PatientTable;
