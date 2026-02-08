import { TamboConfig } from "@/providers/TamboConfig";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
    title: "Tambo Pulse",
    description: "Medical AI Control System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased bg-slate-950 text-slate-100" suppressHydrationWarning>
                <TamboConfig>{children}</TamboConfig>
            </body>
        </html>
    );
}
