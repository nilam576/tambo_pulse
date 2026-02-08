interface MCPStatusProps {
    connected: boolean;
    recordCount?: number;
}

export const MCPStatus = ({ connected, recordCount }: MCPStatusProps) => {
    return (
        <div className="flex items-center gap-3">
            <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${connected
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
            >
                <div
                    className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"
                        }`}
                />
                {connected ? "NODE_ACTIVE" : "NODE_OFFLINE"}
            </div>
            {recordCount !== undefined && connected && (
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Buffer: {recordCount.toLocaleString()}
                </div>
            )}
        </div>
    );
};
