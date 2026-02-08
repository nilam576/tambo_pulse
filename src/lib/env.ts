import { z } from "zod";

const envSchema = z.object({
    TAMBO_API_KEY: z.string().min(1, "TAMBO_API_KEY is required"),
    MCP_SERVER_URL: z.string().url().default("http://127.0.0.1:8000"),
    NEXT_PUBLIC_APP_NAME: z.string().default("Tambo Pulse"),
});

export const env = envSchema.parse({
    TAMBO_API_KEY: process.env.NEXT_PUBLIC_TAMBO_API_KEY || "AIzaSyDGQhZKP_GesfG58IH1pJtCqqwXjfEsNO0",
    MCP_SERVER_URL: process.env.MCP_SERVER_URL || "http://127.0.0.1:8000",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Tambo Pulse",
});
