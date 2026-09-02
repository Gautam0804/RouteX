import {
    ArrowUpRight,
    ArrowDownRight,
    Package,
    Truck,
    Users,
    CheckCircle2,
    IndianRupee,
} from "lucide-react";

const icons = {
    "Total Shipments": Package,
    "In Transit": Truck,
    "Delivered": CheckCircle2,
    "Active Vehicles": Truck,
    "Active Drivers": Users,
    Revenue: IndianRupee,
};

function StatCard({ stat }) {
    const Icon = icons[stat?.title] || Package;

    const positive = stat?.trend !== "down";

    const change = stat?.change ?? "0%";

    return (
        <div className="group rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">

            {/* TOP */}
            <div className="flex items-start justify-between">

                {/* Icon */}
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Icon size={16} />
                </div>

                {/* Trend */}
                <div
                    className={`flex items-center gap-0.5 text-[10px] font-medium ${
                        positive
                            ? "text-emerald-400"
                            : "text-red-400"
                    }`}
                >
                    {positive ? (
                        <ArrowUpRight size={12} />
                    ) : (
                        <ArrowDownRight size={12} />
                    )}

                    {change}
                </div>
            </div>

            {/* VALUE */}
            <div className="mt-4">

                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                    {stat?.title || "Unknown"}
                </p>

                <div className="mt-1 flex items-end justify-between">

                    <h2 className="text-xl font-semibold tracking-tight text-white">
                        {stat?.value ?? 0}
                    </h2>

                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-3 flex items-center gap-1.5 border-t border-slate-800 pt-3">

                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                        positive
                            ? "bg-emerald-500"
                            : "bg-red-500"
                    }`}
                />

                <span className="text-[9px] text-slate-600">
                    vs previous period
                </span>

            </div>
        </div>
    );
}

export default StatCard;