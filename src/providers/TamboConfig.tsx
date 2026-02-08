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
                    url: "http://127.0.0.1:8000/mcp/sse",
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
