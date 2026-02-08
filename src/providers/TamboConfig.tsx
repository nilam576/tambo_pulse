"use client";

import { ReactNode } from "react";
import { TamboProvider, MCPTransport } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import { generativeComponents } from "@/components/ai";

export const TamboConfig = ({ children }: { children: ReactNode }) => {
    return (
        <TamboProvider
            apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
            components={generativeComponents}
            mcpServers={[
                {
                    name: "tambo-pulse-medical",
                    serverKey: "pulse",
                    url: (() => {
                        let baseUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || "http://127.0.0.1:8000/mcp/sse";
                        // Safety: If the user provided just the domain, append the path
                        if (baseUrl.startsWith("http") && !baseUrl.endsWith("/mcp/sse")) {
                            baseUrl = baseUrl.replace(/\/$/, "") + "/mcp/sse";
                        }
                        return baseUrl;
                    })(),
                    transport: MCPTransport.SSE,
                },
            ]}
        >
            <TamboMcpProvider>
                {children}
            </TamboMcpProvider>
        </TamboProvider>
    );
};
