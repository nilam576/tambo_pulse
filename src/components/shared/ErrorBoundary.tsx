"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-950/20 border border-red-500/30 rounded-2xl text-center">
                    <h2 className="text-red-500 font-bold mb-2 uppercase tracking-widest text-sm">Component Failure</h2>
                    <p className="text-slate-400 text-xs mb-4">A critical error occurred while rendering this interface module.</p>
                    <button
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-colors uppercase tracking-widest"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Re-initialize Module
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
