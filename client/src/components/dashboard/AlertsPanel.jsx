import {
    AlertTriangle,
    Clock3,
    CheckCircle2,
    ShieldAlert,
} from "lucide-react";

import Card from "../common/Card";

const icons = {
    high: AlertTriangle,
    medium: Clock3,
    low: CheckCircle2,
    critical: ShieldAlert,
};

function AlertsPanel({ alertData = [] }) {
    const alertList = Array.isArray(alertData)
        ? alertData
        : [];

    const getSeverity = (severity) => {
        return String(severity || "medium").toLowerCase();
    };

    const getIcon = (severity) => {
        const normalizedSeverity = getSeverity(severity);

        return (
            icons[normalizedSeverity] ||
            AlertTriangle
        );
    };

    const getIconClass = (severity) => {
        const normalizedSeverity = getSeverity(severity);

        if (normalizedSeverity === "critical") {
            return "text-red-500";
        }

        if (normalizedSeverity === "high") {
            return "text-red-400";
        }

        if (normalizedSeverity === "medium") {
            return "text-amber-400";
        }

        return "text-emerald-400";
    };

    const getTime = (alert) => {
        if (alert.time) {
            return alert.time;
        }

        const timestamp =
            alert.created_at ||
            alert.createdAt ||
            alert.timestamp;

        if (!timestamp) {
            return "";
        }

        const date = new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString();
    };

    return (
        <Card
            title="Operational Alerts"
            description="Issues requiring attention"
        >
            <div className="space-y-3">

                {alertList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">

                        <CheckCircle2
                            size={24}
                            className="mb-2 text-emerald-400"
                        />

                        <p className="text-xs font-medium text-white">
                            No active alerts
                        </p>

                        <p className="mt-1 text-[9px] text-slate-600">
                            Your fleet is operating normally.
                        </p>

                    </div>
                ) : (
                    alertList.map((alert, index) => {

                        const severity =
                            getSeverity(alert.severity);

                        const Icon =
                            getIcon(severity);

                        const title =
                            alert.title ||
                            alert.message ||
                            alert.alert_title ||
                            "Operational Alert";

                        const description =
                            alert.description ||
                            alert.details ||
                            alert.message ||
                            "Attention may be required.";

                        return (
                            <div
                                key={
                                    alert.id ||
                                    alert.alert_id ||
                                    `${title}-${index}`
                                }
                                className="flex gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3"
                            >

                                <div className="shrink-0 pt-0.5">
                                    <Icon
                                        size={15}
                                        className={getIconClass(
                                            severity
                                        )}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">

                                    <div className="flex items-center gap-2">

                                        <p className="truncate text-[10px] font-semibold text-white">
                                            {title}
                                        </p>

                                        <span
                                            className={`shrink-0 rounded px-1.5 py-0.5 text-[7px] font-semibold uppercase ${
                                                severity === "critical"
                                                    ? "bg-red-500/10 text-red-400"
                                                    : severity === "high"
                                                    ? "bg-red-500/10 text-red-400"
                                                    : severity === "medium"
                                                    ? "bg-amber-500/10 text-amber-400"
                                                    : "bg-emerald-500/10 text-emerald-400"
                                            }`}
                                        >
                                            {severity}
                                        </span>

                                    </div>

                                    <p className="mt-1 text-[9px] leading-4 text-slate-600">
                                        {description}
                                    </p>

                                </div>

                                <span className="whitespace-nowrap text-[8px] text-slate-700">
                                    {getTime(alert)}
                                </span>

                            </div>
                        );
                    })
                )}

            </div>
        </Card>
    );
}

export default AlertsPanel;