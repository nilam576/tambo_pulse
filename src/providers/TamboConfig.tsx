"use client";

import { ReactNode, useEffect, useState } from "react";
import { TamboProvider, MCPTransport } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import { generativeComponents } from "@/components/ai";

export const TamboConfig = ({ children }: { children: ReactNode }) => {
    const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
    const [configError, setConfigError] = useState<string | null>(null);
    
    useEffect(() => {
        console.log("🔧 TamboConfig initialized");
        console.log("📍 API Key present:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");
        console.log("📍 Components registered:", generativeComponents?.length || 0);
        
        if (!apiKey) {
            setConfigError("Tambo API key not configured");
        }
    }, [apiKey]);

    if (configError) {
        return (
            <div style={{ padding: 40, color: 'red', background: '#1a1a1a', minHeight: '100vh' }}>
                <h1>Configuration Error</h1>
                <p>{configError}</p>
                <p>Please check your .env file and ensure NEXT_PUBLIC_TAMBO_API_KEY is set.</p>
            </div>
        );
    }

    return (
        <TamboProvider
            apiKey={apiKey!}
            components={generativeComponents}
            mcpServers={[
                {
                    name: "tambo-pulse-medical",
                    serverKey: "tambo-pulse-medical",
                    url: "http://127.0.0.1:8000/mcp/sse",
                    transport: MCPTransport.SSE,
                },
            ]}
            onError={(error) => {
                console.error("🔴 TamboProvider Error:", error);
            }}
        >
            <TamboMcpProvider>
                {children}
            </TamboMcpProvider>
        </TamboProvider>
    );
};
