"use client";

import { useMemo, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTamboMcpResource } from "@tambo-ai/react/mcp";
import { getDepartmentSummary, storeInMemory } from "@/lib/healthData";

interface ChartDataItem {
    department: string;
    avg_risk: number;
    total_patients: number;
    high_risk_count: number;
}

export const RiskHeatmap = ({
    memoryKey,
    groupBy = "department",
    title = "Risk Distribution",
}) => {
    const [realDataLoaded, setRealDataLoaded] = useState(false);
    const [realChartData, setRealChartData] = useState<ChartDataItem[]>([]);
    const [isLoadingReal, setIsLoadingReal] = useState(false);

    // Standard MCP URI format
    const resourceUri = memoryKey ? `mcp://tambo-pulse-medical/memory://${memoryKey}` : undefined;
    const { data: resourceData, isLoading, error } = useTamboMcpResource(resourceUri);

    // Load real data when MCP fails
    useEffect(() => {
        const loadRealData = async () => {
            // Check if MCP has data first
            const firstContent = resourceData?.contents?.[0];
            let mcpHasData = false;
            
            if (firstContent && "text" in firstContent) {
                try {
                    const parsed = JSON.parse(firstContent.text);
                    if (parsed.data && parsed.data.length > 0) {
                        mcpHasData = true;
                    }
                } catch (e) {
                    // MCP data invalid
                }
            }
            
            // If MCP has no data, load real open source health data
            if (!mcpHasData && !realDataLoaded && !isLoadingReal) {
                setIsLoadingReal(true);
                
                try {
                    const { summary, memoryKey: newKey } = await getDepartmentSummary();
                    
                    // Transform to chart format
                    const chartData = summary.map(item => ({
                        department: item.department,
                        avg_risk: Math.round(item.avg_risk * 100), // Convert to percentage
                        total_patients: item.total_patients,
                        high_risk_count: item.high_risk_count,
                    }));
                    
                    // Store in memory for MCP pattern compatibility
                    storeInMemory(newKey, { data: chartData });
                    
                    setRealChartData(chartData);
                    setRealDataLoaded(true);
                } catch (err) {
                    console.error("Failed to load real department data:", err);
                } finally {
                    setIsLoadingReal(false);
                }
            }
        };
        
        loadRealData();
    }, [resourceData, realDataLoaded, isLoadingReal]);

    const chartData = useMemo(() => {
        // Try MCP data first
        const firstContent = resourceData?.contents?.[0];
        if (firstContent && "text" in firstContent) {
            try {
                const parsed = JSON.parse(firstContent.text);
                if (parsed.data && parsed.data.length > 0) {
                    // Ensure data is in correct format
                    return parsed.data.map((item: any) => ({
                        department: item.department,
                        avg_risk: typeof item.avg_risk === 'number' && item.avg_risk <= 1 
                            ? Math.round(item.avg_risk * 100) 
                            : item.avg_risk,
                        total_patients: item.total_patients || 0,
                        high_risk_count: item.high_risk_count || 0,
                    }));
                }
            } catch (e) {
                console.error("Heatmap MCP Parse Error:", e);
            }
        }
        
        // Fall back to real data
        if (realDataLoaded && realChartData.length > 0) {
            return realChartData;
        }

        return [];
    }, [resourceData, realDataLoaded, realChartData]);

    if (isLoading || isLoadingReal) return (
        <div className="h-[300px] flex flex-col items-center justify-center gap-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-slate-500 animate-pulse uppercase tracking-widest">Loading Real Health Data...</span>
            <span className="text-[10px] text-slate-600">HealthData.gov • CDC • CMS</span>
        </div>
    );

    if (error && !realDataLoaded) return (
        <div className="h-[300px] flex flex-col items-center justify-center gap-4 bg-slate-900 border border-red-800 rounded-xl">
            <span className="text-xs font-mono text-red-500">MCP Error: {error.message}</span>
            <span className="text-[10px] text-slate-500">Loading fallback data...</span>
        </div>
    );

    if (chartData.length === 0) return (
        <div className="h-[300px] flex flex-col items-center justify-center gap-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-slate-500">Initializing Data Stream...</span>
        </div>
    );

    return (
        <div style={{ padding: "20px", background: "#0f172a" }}>
            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase" }}>{title}</h3>
                <span className="text-[10px] font-mono text-slate-600">LIVE • REAL HEALTH STATS</span>
            </div>
            <div style={{ height: "300px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis 
                            type="category" 
                            dataKey="department" 
                            stroke="#64748b" 
                            fontSize={12} 
                            width={80} 
                        />
                        <Tooltip
                            contentStyle={{ 
                                background: "#020617", 
                                border: "1px solid #1e293b", 
                                borderRadius: "8px",
                                color: "#e2e8f0"
                            }}
                            itemStyle={{ color: "#ef4444" }}
                            formatter={(value: number, name: string, props: any) => {
                                if (name === 'avg_risk') {
                                    return [`${value}%`, 'Avg Risk'];
                                }
                                return [value, name];
                            }}
                            labelFormatter={(label: string) => {
                                const item = chartData.find(d => d.department === label);
                                return `${label}\n${item?.total_patients || 0} patients`;
                            }}
                        />
                        <Bar 
                            dataKey="avg_risk" 
                            fill="#ef4444" 
                            radius={[0, 4, 4, 0]}
                            name="avg_risk"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748b" }}>
                <span>Risk Score (%)</span>
                <span>Source: Real Health Statistics</span>
            </div>
        </div>
    );
};

export default RiskHeatmap;
