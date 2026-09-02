const statusStyles = {
    Delivered:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

    "In Transit":
        "bg-blue-500/10 text-blue-400 border-blue-500/20",

    "Out for Delivery":
        "bg-amber-500/10 text-amber-400 border-amber-500/20",

    Delayed:
        "bg-red-500/10 text-red-400 border-red-500/20",

    Pending:
        "bg-slate-500/10 text-slate-400 border-slate-500/20",

    Active:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

    Inactive:
        "bg-slate-500/10 text-slate-500 border-slate-500/20",

    Maintenance:
        "bg-orange-500/10 text-orange-400 border-orange-500/20",

    Idle:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    "On Route":
        "bg-blue-500/10 text-blue-400 border-blue-500/20",

    "Off Duty":
        "bg-slate-500/10 text-slate-500 border-slate-500/20",

    High:
        "bg-red-500/10 text-red-400 border-red-500/20",

    Medium:
        "bg-orange-500/10 text-orange-400 border-orange-500/20",

    Low:
        "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function Badge({ children, status }) {

    const value = status || children;

    const style =
        statusStyles[value] ||
        "bg-slate-800 text-slate-400 border-slate-700";

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${style}`}
        >
            {value}
        </span>
    );
}

export default Badge;