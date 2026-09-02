function PerformanceChart({ data = [] }) {
    const safeData = Array.isArray(data) ? data : [];

    const maxValue = Math.max(
        ...safeData.map((item) => Number(item?.value) || 0),
        1
    );

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-white">
                    Fleet Performance
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                    Vehicle utilization over time
                </p>
            </div>

            {safeData.length === 0 ? (
                <div className="flex min-h-48 items-center justify-center">
                    <div className="text-center">
                        <p className="text-xs font-medium text-slate-400">
                            No performance data available
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                            Performance data will appear here when available.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {safeData.map((item, index) => {
                        const value = Number(item?.value) || 0;

                        const percentage = Math.min(
                            Math.max((value / maxValue) * 100, 0),
                            100
                        );

                        return (
                            <div key={item?.label || index}>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        {item?.label || "—"}
                                    </span>

                                    <span className="text-xs font-medium text-white">
                                        {value}%
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default PerformanceChart;