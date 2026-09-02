import { useEffect, useMemo, useState } from "react";

import {
    AlertTriangle,
    AlertCircle,
    Info,
    Truck,
    Clock,
    MapPin,
    Eye,
    RefreshCw,
    Check,
    X,
} from "lucide-react";

import {
    getAlerts,
    updateAlertStatus,
} from "../services/api";


function Alerts() {

    // ============================================================
    // STATE
    // ============================================================

    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [filter, setFilter] = useState("All");

    const [selectedAlert, setSelectedAlert] = useState(null);

    const [processingId, setProcessingId] = useState(null);


    // ============================================================
    // LOAD REAL ALERTS FROM BACKEND
    // ============================================================

    const loadAlerts = async (refresh = false) => {

        try {

            setError("");

            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await getAlerts();

            const data =
                Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.alerts)
                        ? response.alerts
                        : [];

            setAlerts(data);

        } catch (err) {

            console.error(
                "Failed to load alerts:",
                err
            );

            setError(
                err?.message ||
                "Failed to load alerts"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    // ============================================================
    // INITIAL LOAD
    // AUTO REFRESH EVERY 30 SECONDS
    // ============================================================

    useEffect(() => {

        loadAlerts();

        const interval = setInterval(() => {
            loadAlerts(true);
        }, 30000);

        return () => {
            clearInterval(interval);
        };

    }, []);


    // ============================================================
    // UPDATE ALERT STATUS
    // ============================================================

    const changeStatus = async (id, status) => {

        try {

            setProcessingId(id);

            setError("");

            // Update database
            await updateAlertStatus(
                id,
                status
            );


            // Immediately update UI
            setAlerts((prev) =>
                prev.map((alert) =>
                    alert.id === id
                        ? {
                              ...alert,
                              status,
                          }
                        : alert
                )
            );


            // Update opened modal
            setSelectedAlert((prev) =>
                prev?.id === id
                    ? {
                          ...prev,
                          status,
                      }
                    : prev
            );


            // Fetch fresh database data
            await loadAlerts(true);

        } catch (err) {

            console.error(
                "Failed to update alert:",
                err
            );

            setError(
                err?.message ||
                "Failed to update alert"
            );

        } finally {

            setProcessingId(null);

        }

    };


    // ============================================================
    // FILTER ALERTS BY SEVERITY
    // ============================================================

    const filteredAlerts = useMemo(() => {

        if (filter === "All") {
            return alerts;
        }

        return alerts.filter(
            (alert) =>
                String(
                    alert?.severity || ""
                ).toLowerCase() ===
                filter.toLowerCase()
        );

    }, [alerts, filter]);


    // ============================================================
    // REAL COUNTS
    // ============================================================

    // ONLY OPEN ALERTS ARE ACTIVE
    const activeCount = alerts.filter(
        (alert) =>
            String(
                alert?.status || ""
            ).toLowerCase() === "open"
    ).length;


    // ACKNOWLEDGED ALERTS
    const acknowledgedCount = alerts.filter(
        (alert) =>
            String(
                alert?.status || ""
            ).toLowerCase() ===
            "acknowledged"
    ).length;


    // RESOLVED ALERTS
    const resolvedCount = alerts.filter(
        (alert) =>
            String(
                alert?.status || ""
            ).toLowerCase() ===
            "resolved"
    ).length;


    // SEVERITY COUNTS

    const criticalCount = alerts.filter(
        (alert) =>
            String(
                alert?.severity || ""
            ).toLowerCase() ===
            "critical"
    ).length;


    const highCount = alerts.filter(
        (alert) =>
            String(
                alert?.severity || ""
            ).toLowerCase() ===
            "high"
    ).length;


    const mediumCount = alerts.filter(
        (alert) =>
            String(
                alert?.severity || ""
            ).toLowerCase() ===
            "medium"
    ).length;


    const lowCount = alerts.filter(
        (alert) =>
            String(
                alert?.severity || ""
            ).toLowerCase() ===
            "low"
    ).length;


    // ============================================================
    // HELPERS
    // ============================================================

    const getSeverity = (alert) => {

        return String(
            alert?.severity || "medium"
        ).toLowerCase();

    };


    const getSeverityIcon = (severity) => {

        if (severity === "critical") {
            return <AlertCircle size={15} />;
        }

        if (severity === "high") {
            return <AlertTriangle size={15} />;
        }

        if (severity === "medium") {
            return <AlertTriangle size={15} />;
        }

        return <Info size={15} />;

    };


    const getSeverityClass = (severity) => {

        switch (severity) {

            case "critical":
                return "bg-red-500/10 text-red-400 border-red-500/20";

            case "high":
                return "bg-orange-500/10 text-orange-400 border-orange-500/20";

            case "medium":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";

            case "low":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";

            default:
                return "bg-slate-800 text-slate-400 border-slate-700";

        }

    };


    const getStatusClass = (status) => {

        switch (
            String(
                status || ""
            ).toLowerCase()
        ) {

            case "open":
                return "bg-red-500/10 text-red-400";

            case "acknowledged":
                return "bg-amber-500/10 text-amber-400";

            case "resolved":
                return "bg-emerald-500/10 text-emerald-400";

            default:
                return "bg-slate-800 text-slate-400";

        }

    };


    const formatStatus = (status) => {

        if (!status) {
            return "Unknown";
        }

        return String(status)
            .replace(/_/g, " ")
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );

    };


    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        const parsed = new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "—";
        }

        return parsed.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );

    };


    const getVehicleName = (alert) => {

        return (
            alert?.registration_number ||
            alert?.vehicle_number ||
            alert?.vehicle_registration ||
            alert?.vehicle_name ||
            "—"
        );

    };


    const getDriverName = (alert) => {

        return (
            alert?.driver_name ||
            alert?.driver ||
            "—"
        );

    };


    const getLocation = (alert) => {

        return (
            alert?.location ||
            alert?.current_location ||
            alert?.destination ||
            "—"
        );

    };


    const getShipment = (alert) => {

        return (
            alert?.tracking_number ||
            alert?.shipment_tracking_number ||
            alert?.shipment_id ||
            "—"
        );

    };


    // ============================================================
    // VIEW ALERT
    // ============================================================

    const handleViewAlert = (alert) => {
        setSelectedAlert(alert);
    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="min-h-full space-y-5">

            {/* ====================================================
                HEADER
            ==================================================== */}

            <div>

                <div className="flex items-center gap-2">

                    <p className="text-[10px] font-medium uppercase tracking-widest text-blue-400">
                        ROUTEX / OPERATIONS
                    </p>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span className="text-[10px] text-slate-600">
                        Alert Center
                    </span>

                </div>


                <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

                    <div>

                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Fleet Alerts
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Monitor warnings, incidents and operational events.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            loadAlerts(true)
                        }
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <RefreshCw
                            size={14}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>

            </div>


            {/* ====================================================
                ERROR
            ==================================================== */}

            {error && (

                <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">

                    <p className="text-xs text-red-400">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            loadAlerts(true)
                        }
                        className="text-[10px] font-medium text-red-300 hover:text-white"
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* ====================================================
                SUMMARY CARDS
            ==================================================== */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

                <SummaryCard
                    label="Active"
                    value={activeCount}
                    icon={
                        <AlertTriangle
                            size={15}
                        />
                    }
                    className="text-red-400"
                />


                <SummaryCard
                    label="Acknowledged"
                    value={acknowledgedCount}
                    icon={
                        <Clock size={15} />
                    }
                    className="text-amber-400"
                />


                <SummaryCard
                    label="Resolved"
                    value={resolvedCount}
                    icon={
                        <Check size={15} />
                    }
                    className="text-emerald-400"
                />


                <SummaryCard
                    label="Critical"
                    value={criticalCount}
                    icon={
                        <AlertCircle
                            size={15}
                        />
                    }
                    className="text-red-400"
                />


                <SummaryCard
                    label="High"
                    value={highCount}
                    icon={
                        <AlertTriangle
                            size={15}
                        />
                    }
                    className="text-orange-400"
                />

            </div>


            {/* ====================================================
                FILTERS
            ==================================================== */}

            <div className="flex flex-wrap items-center gap-2">

                {[
                    "All",
                    "Critical",
                    "High",
                    "Medium",
                    "Low",
                ].map((item) => (

                    <button
                        key={item}
                        type="button"
                        onClick={() =>
                            setFilter(item)
                        }
                        className={`rounded-lg border px-3 py-2 text-[10px] font-medium transition ${
                            filter === item
                                ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                                : "border-slate-800 bg-slate-900 text-slate-500 hover:text-white"
                        }`}
                    >
                        {item}
                    </button>

                ))}

            </div>


            {/* ====================================================
                ALERT LIST
            ==================================================== */}

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-3 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:px-6">

                    <div>

                        <h2 className="text-sm font-semibold text-white">
                            Fleet Alerts
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Showing{" "}
                            {filteredAlerts.length}{" "}
                            of{" "}
                            {alerts.length}{" "}
                            alerts
                        </p>

                    </div>


                    <div className="flex items-center gap-2">

                        <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400">
                            {activeCount} Active
                        </span>


                        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-400">
                            {acknowledgedCount} Acknowledged
                        </span>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="flex min-h-72 items-center justify-center">

                        <div className="flex items-center gap-2 text-xs text-slate-600">

                            <RefreshCw
                                size={15}
                                className="animate-spin"
                            />

                            Loading alerts...

                        </div>

                    </div>

                ) : filteredAlerts.length === 0 ? (

                    /* =================================================
                       EMPTY
                    ================================================= */

                    <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">

                            <Check
                                size={22}
                                className="text-emerald-400"
                            />

                        </div>


                        <p className="mt-4 text-sm font-medium text-slate-300">
                            No alerts found
                        </p>


                        <p className="mt-1 max-w-sm text-[10px] leading-5 text-slate-600">
                            There are no alerts matching the selected filter.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       TABLE
                    ================================================= */

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px] text-left">

                            <thead>

                                <tr className="border-b border-slate-800">

                                    <TableHeader>
                                        Alert
                                    </TableHeader>

                                    <TableHeader>
                                        Vehicle
                                    </TableHeader>

                                    <TableHeader>
                                        Driver
                                    </TableHeader>

                                    <TableHeader>
                                        Location
                                    </TableHeader>

                                    <TableHeader>
                                        Priority
                                    </TableHeader>

                                    <TableHeader>
                                        Status
                                    </TableHeader>

                                    <TableHeader>
                                        Time
                                    </TableHeader>

                                    <TableHeader align="right">
                                        Action
                                    </TableHeader>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredAlerts.map(
                                    (alert) => {

                                        const severity =
                                            getSeverity(
                                                alert
                                            );

                                        const status =
                                            String(
                                                alert?.status ||
                                                ""
                                            ).toLowerCase();

                                        const processing =
                                            processingId ===
                                            alert?.id;


                                        return (

                                            <tr
                                                key={
                                                    alert?.id
                                                }
                                                className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                                            >

                                                {/* ALERT */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-start gap-3">

                                                        <div
                                                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${getSeverityClass(
                                                                severity
                                                            )}`}
                                                        >

                                                            {getSeverityIcon(
                                                                severity
                                                            )}

                                                        </div>


                                                        <div className="min-w-0">

                                                            <p className="text-xs font-medium text-white">
                                                                {alert?.title ||
                                                                    "Operational Alert"}
                                                            </p>


                                                            <p className="mt-1 max-w-[280px] text-[10px] leading-4 text-slate-500">
                                                                {alert?.description ||
                                                                    "No description available."}
                                                            </p>


                                                            <p className="mt-1 text-[9px] text-slate-700">
                                                                Alert #
                                                                {alert?.id ??
                                                                    "—"}
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
                                                            {getVehicleName(
                                                                alert
                                                            )}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* DRIVER */}

                                                <td className="px-6 py-4">

                                                    <span className="text-xs text-slate-300">
                                                        {getDriverName(
                                                            alert
                                                        )}
                                                    </span>

                                                </td>


                                                {/* LOCATION */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <MapPin
                                                            size={13}
                                                            className="text-slate-600"
                                                        />

                                                        <span className="max-w-[180px] truncate text-xs text-slate-400">
                                                            {getLocation(
                                                                alert
                                                            )}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* PRIORITY */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`rounded-md border px-2 py-1 text-[10px] font-medium uppercase ${getSeverityClass(
                                                            severity
                                                        )}`}
                                                    >
                                                        {severity}
                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`rounded-md px-2 py-1 text-[10px] font-medium ${getStatusClass(
                                                            status
                                                        )}`}
                                                    >
                                                        {formatStatus(
                                                            status
                                                        )}
                                                    </span>

                                                </td>


                                                {/* TIME */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <Clock
                                                            size={13}
                                                            className="text-slate-700"
                                                        />

                                                        <span className="whitespace-nowrap text-[10px] text-slate-500">
                                                            {formatDate(
                                                                alert?.created_at ||
                                                                alert?.createdAt
                                                            )}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center justify-end gap-2">

                                                        {/* ACKNOWLEDGE */}

                                                        {status ===
                                                            "open" && (

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    processing
                                                                }
                                                                onClick={() =>
                                                                    changeStatus(
                                                                        alert.id,
                                                                        "acknowledged"
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-2 text-[10px] font-medium text-blue-400 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >

                                                                {processing ? (

                                                                    <RefreshCw
                                                                        size={12}
                                                                        className="animate-spin"
                                                                    />

                                                                ) : (

                                                                    <Check
                                                                        size={12}
                                                                    />

                                                                )}

                                                                Acknowledge

                                                            </button>

                                                        )}


                                                        {/* RESOLVE */}

                                                        {(status ===
                                                            "open" ||
                                                            status ===
                                                                "acknowledged") && (

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    processing
                                                                }
                                                                onClick={() =>
                                                                    changeStatus(
                                                                        alert.id,
                                                                        "resolved"
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-2 text-[10px] font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >

                                                                {processing ? (

                                                                    <RefreshCw
                                                                        size={12}
                                                                        className="animate-spin"
                                                                    />

                                                                ) : (

                                                                    <Check
                                                                        size={12}
                                                                    />

                                                                )}

                                                                Resolve

                                                            </button>

                                                        )}


                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewAlert(
                                                                    alert
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-2 text-[10px] font-medium text-slate-400 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                                                        >

                                                            <Eye
                                                                size={13}
                                                            />

                                                            View

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* =================================================
                    FOOTER
                ================================================= */}

                {!loading && (

                    <div className="flex flex-col gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                        <p className="text-[10px] text-slate-600">

                            Showing{" "}
                            {filteredAlerts.length}{" "}
                            of{" "}
                            {alerts.length}{" "}
                            alerts

                        </p>


                        <div className="flex flex-wrap gap-3">

                            <span className="text-[10px] text-slate-700">
                                Critical:{" "}
                                {criticalCount}
                            </span>

                            <span className="text-[10px] text-slate-700">
                                High:{" "}
                                {highCount}
                            </span>

                            <span className="text-[10px] text-slate-700">
                                Medium:{" "}
                                {mediumCount}
                            </span>

                            <span className="text-[10px] text-slate-700">
                                Low:{" "}
                                {lowCount}
                            </span>

                        </div>

                    </div>

                )}

            </div>


            {/* ====================================================
                VIEW ALERT MODAL
            ==================================================== */}

            {selectedAlert && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setSelectedAlert(null)
                    }
                >

                    <div
                        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between border-b border-slate-800 p-5">

                            <div>

                                <p className="text-[10px] uppercase tracking-widest text-blue-400">
                                    Alert Details
                                </p>

                                <h2 className="mt-2 text-base font-semibold text-white">
                                    {selectedAlert?.title ||
                                        "Operational Alert"}
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedAlert(
                                        null
                                    )
                                }
                                className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                            >

                                <X size={17} />

                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="space-y-4 p-5">

                            {/* DESCRIPTION */}

                            <Detail
                                label="Description"
                                value={
                                    selectedAlert?.description ||
                                    "—"
                                }
                            />


                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <Detail
                                    label="Alert ID"
                                    value={
                                        selectedAlert?.id ??
                                        "—"
                                    }
                                />


                                <Detail
                                    label="Type"
                                    value={
                                        selectedAlert?.type ||
                                        "—"
                                    }
                                />


                                <Detail
                                    label="Severity"
                                    value={
                                        selectedAlert?.severity ||
                                        "—"
                                    }
                                />


                                <Detail
                                    label="Status"
                                    value={formatStatus(
                                        selectedAlert?.status
                                    )}
                                />


                                <Detail
                                    label="Shipment"
                                    value={getShipment(
                                        selectedAlert
                                    )}
                                />


                                <Detail
                                    label="Vehicle"
                                    value={getVehicleName(
                                        selectedAlert
                                    )}
                                />


                                <Detail
                                    label="Driver"
                                    value={getDriverName(
                                        selectedAlert
                                    )}
                                />


                                <Detail
                                    label="Location"
                                    value={getLocation(
                                        selectedAlert
                                    )}
                                />

                            </div>


                            <Detail
                                label="Created"
                                value={formatDate(
                                    selectedAlert?.created_at ||
                                    selectedAlert?.createdAt
                                )}
                            />


                            {/* MODAL ACTIONS */}

                            <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-4">

                                {String(
                                    selectedAlert?.status ||
                                    ""
                                ).toLowerCase() ===
                                    "open" && (

                                    <button
                                        type="button"
                                        disabled={
                                            processingId ===
                                            selectedAlert.id
                                        }
                                        onClick={() =>
                                            changeStatus(
                                                selectedAlert.id,
                                                "acknowledged"
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-[10px] font-medium text-blue-400 hover:bg-blue-500/20 disabled:opacity-50"
                                    >

                                        <Check
                                            size={13}
                                        />

                                        Acknowledge

                                    </button>

                                )}


                                {(String(
                                    selectedAlert?.status ||
                                    ""
                                ).toLowerCase() ===
                                    "open" ||
                                    String(
                                        selectedAlert?.status ||
                                        ""
                                    ).toLowerCase() ===
                                        "acknowledged") && (

                                    <button
                                        type="button"
                                        disabled={
                                            processingId ===
                                            selectedAlert.id
                                        }
                                        onClick={() =>
                                            changeStatus(
                                                selectedAlert.id,
                                                "resolved"
                                            )
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[10px] font-medium text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"
                                    >

                                        <Check
                                            size={13}
                                        />

                                        Resolve

                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


/* ================================================================
   SUMMARY CARD
================================================================ */

function SummaryCard({
    label,
    value,
    icon,
    className = "text-slate-400",
}) {

    return (

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">

            <div className="flex items-center justify-between">

                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 ${className}`}
                >
                    {icon}
                </div>


                <span className="text-xl font-semibold text-white">
                    {value}
                </span>

            </div>


            <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                {label}
            </p>

        </div>

    );

}


/* ================================================================
   TABLE HEADER
================================================================ */

function TableHeader({
    children,
    align = "left",
}) {

    return (

        <th
            className={`px-6 py-3 text-[9px] font-medium uppercase tracking-wider text-slate-600 ${
                align === "right"
                    ? "text-right"
                    : "text-left"
            }`}
        >
            {children}
        </th>

    );

}


/* ================================================================
   DETAIL
================================================================ */

function Detail({
    label,
    value,
}) {

    return (

        <div>

            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
                {label}
            </p>

            <p className="mt-1 break-words text-xs leading-5 text-slate-300">
                {value}
            </p>

        </div>

    );

}


export default Alerts;