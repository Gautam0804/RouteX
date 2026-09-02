import {
    AlertTriangle,
    Truck,
    Clock,
    MapPin,
    Eye,
} from "lucide-react";

const alerts = [
    {
        id: "ALT-1001",
        type: "Delayed Shipment",
        description: "Shipment SHP-1042 is running 45 minutes behind schedule.",
        priority: "High",
        vehicle: "VH-204",
        driver: "Rahul Sharma",
        location: "Indore, MP",
        time: "10 min ago",
        status: "Active",
    },
    {
        id: "ALT-1002",
        type: "Vehicle Maintenance",
        description: "Vehicle VH-208 has reached its scheduled service interval.",
        priority: "Medium",
        vehicle: "VH-208",
        driver: "Amit Verma",
        location: "Bhopal, MP",
        time: "25 min ago",
        status: "Active",
    },
    {
        id: "ALT-1003",
        type: "Route Deviation",
        description: "Vehicle VH-115 has deviated from its assigned route.",
        priority: "High",
        vehicle: "VH-115",
        driver: "Vikas Singh",
        location: "Dewas, MP",
        time: "42 min ago",
        status: "Investigating",
    },
    {
        id: "ALT-1004",
        type: "Delivery Completed",
        description: "Shipment SHP-1038 was delivered successfully.",
        priority: "Low",
        vehicle: "VH-301",
        driver: "Mohit Yadav",
        location: "Ujjain, MP",
        time: "1 hour ago",
        status: "Resolved",
    },
    {
        id: "ALT-1005",
        type: "Fuel Warning",
        description: "Vehicle VH-192 fuel level has dropped below 20%.",
        priority: "Medium",
        vehicle: "VH-192",
        driver: "Arjun Patel",
        location: "Ratlam, MP",
        time: "2 hours ago",
        status: "Active",
    },
    {
        id: "ALT-1006",
        type: "Driver Alert",
        description: "Driver has exceeded the recommended driving duration.",
        priority: "High",
        vehicle: "VH-167",
        driver: "Suresh Kumar",
        location: "Dhar, MP",
        time: "3 hours ago",
        status: "Investigating",
    },
];

function PriorityBadge({ priority }) {
    const styles = {
        High: "bg-red-500/10 text-red-400 border-red-500/20",
        Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        Low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    return (
        <span
            className={`rounded-md border px-2 py-1 text-[10px] font-medium ${
                styles[priority]
            }`}
        >
            {priority}
        </span>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Active: "bg-red-500/10 text-red-400",
        Investigating: "bg-amber-500/10 text-amber-400",
        Resolved: "bg-emerald-500/10 text-emerald-400",
    };

    return (
        <span
            className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                styles[status]
            }`}
        >
            {status}
        </span>
    );
}

function AlertTable() {
    const handleViewAlert = (alert) => {
        console.log("Opening alert:", alert);
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
            {/* HEADER */}

            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-sm font-semibold text-white">
                        Fleet Alerts
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Monitor warnings, incidents and operational events.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400">
                        3 Active
                    </span>

                    <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-400">
                        2 Investigating
                    </span>
                </div>
            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                Alert
                            </th>

                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                Vehicle
                            </th>

                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                Driver
                            </th>

                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                Location
                            </th>

                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                Priority
                            </th>

                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                Status
                            </th>

                            <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                Time
                            </th>

                            <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {alerts.map((alert) => (
                            <tr
                                key={alert.id}
                                className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                            >
                                {/* ALERT */}

                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                                            <AlertTriangle size={15} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-white">
                                                {alert.type}
                                            </p>

                                            <p className="mt-1 max-w-[280px] text-[10px] leading-4 text-slate-500">
                                                {alert.description}
                                            </p>

                                            <p className="mt-1 text-[9px] text-slate-700">
                                                {alert.id}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* VEHICLE */}

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Truck
                                            size={14}
                                            className="text-slate-600"
                                        />

                                        <span className="text-xs text-slate-300">
                                            {alert.vehicle}
                                        </span>
                                    </div>
                                </td>

                                {/* DRIVER */}

                                <td className="px-6 py-4">
                                    <span className="text-xs text-slate-300">
                                        {alert.driver}
                                    </span>
                                </td>

                                {/* LOCATION */}

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={13}
                                            className="text-slate-600"
                                        />

                                        <span className="text-xs text-slate-400">
                                            {alert.location}
                                        </span>
                                    </div>
                                </td>

                                {/* PRIORITY */}

                                <td className="px-6 py-4">
                                    <PriorityBadge
                                        priority={alert.priority}
                                    />
                                </td>

                                {/* STATUS */}

                                <td className="px-6 py-4">
                                    <StatusBadge
                                        status={alert.status}
                                    />
                                </td>

                                {/* TIME */}

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Clock
                                            size={13}
                                            className="text-slate-700"
                                        />

                                        <span className="whitespace-nowrap text-[10px] text-slate-500">
                                            {alert.time}
                                        </span>
                                    </div>
                                </td>

                                {/* ACTION */}

                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() =>
                                            handleViewAlert(alert)
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-[10px] font-medium text-slate-400 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                                    >
                                        <Eye size={13} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
                <p className="text-[10px] text-slate-600">
                    Showing {alerts.length} alerts
                </p>

                <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-slate-800 px-3 py-1.5 text-[10px] text-slate-500 hover:text-white">
                        Previous
                    </button>

                    <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] text-white">
                        1
                    </button>

                    <button className="rounded-lg border border-slate-800 px-3 py-1.5 text-[10px] text-slate-500 hover:text-white">
                        2
                    </button>

                    <button className="rounded-lg border border-slate-800 px-3 py-1.5 text-[10px] text-slate-500 hover:text-white">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AlertTable;