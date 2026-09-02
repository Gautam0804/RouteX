import {
    ArrowDownRight,
    ArrowUpRight,
} from "lucide-react";

function MetricCard({
    title,
    value = "—",
    change = "—",
    description = "vs previous period",
    positive = true,
    icon: Icon,
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold text-white">
                        {value}
                    </h3>
                </div>

                {Icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Icon size={17} />
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center gap-2">
                <span
                    className={`flex items-center gap-1 text-[10px] font-medium ${
                        positive
                            ? "text-emerald-400"
                            : "text-red-400"
                    }`}
                >
                    {positive ? (
                        <ArrowUpRight size={13} />
                    ) : (
                        <ArrowDownRight size={13} />
                    )}

                    {change}
                </span>

                <span className="text-[10px] text-slate-600">
                    {description}
                </span>
            </div>
        </div>
    );
}

export default MetricCard;