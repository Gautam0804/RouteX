import React, { useEffect, useMemo, useState } from "react";

import {
    Plus,
    RefreshCw,
    Check,
    Play,
    CheckCircle2,
    XCircle,
    ClipboardList,
    Truck,
    User,
    Package,
    Clock,
    Phone,
    Navigation,
    AlertCircle,
    Search,
    Filter,
    ChevronRight,
    MapPin,
    Activity,
    Timer,
    Route,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    getAssignments,
    updateAssignmentStatus,
} from "../services/api";


/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG = {
    assigned: {
        label: "Assigned",
        color: "#60a5fa",
        background: "#172554",
    },

    accepted: {
        label: "Accepted",
        color: "#c084fc",
        background: "#2e1065",
    },

    in_progress: {
        label: "In Progress",
        color: "#38bdf8",
        background: "#082f49",
    },

    completed: {
        label: "Completed",
        color: "#4ade80",
        background: "#052e1b",
    },

    cancelled: {
        label: "Cancelled",
        color: "#f87171",
        background: "#3f0d18",
    },
};


/* =========================================================
   HELPERS
========================================================= */

function getAssignmentId(assignment) {
    return assignment?.id || assignment?.assignment_id;
}


function getStatus(assignment) {
    return assignment?.status || "assigned";
}


function formatStatus(status) {
    return String(status || "assigned")
        .replace("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}


function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}


function formatTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}


function getRelativeTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    const diff = Date.now() - date.getTime();

    if (diff < 60 * 1000) {
        return "Just now";
    }

    if (diff < 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 1000))}m ago`;
    }

    if (diff < 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    }

    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
    const config =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.assigned;

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 9px",
                borderRadius: "999px",
                background: config.background,
                color: config.color,
                fontSize: "9px",
                fontWeight: 700,
                whiteSpace: "nowrap",
            }}
        >
            <span
                style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: config.color,
                    boxShadow:
                        status === "in_progress"
                            ? `0 0 8px ${config.color}`
                            : "none",
                }}
            />

            {config.label}
        </span>
    );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
    label,
    value,
    icon: Icon,
    color,
    percentage,
}) {
    return (
        <div
            style={{
                ...styles.summaryCard,
                borderColor: `${color}22`,
            }}
        >
            <div style={styles.summaryTop}>
                <div
                    style={{
                        ...styles.summaryIcon,
                        color,
                        background: `${color}12`,
                    }}
                >
                    <Icon size={16} />
                </div>

                {percentage !== undefined && (
                    <span
                        style={{
                            fontSize: "9px",
                            color: "#64748b",
                        }}
                    >
                        {percentage}%
                    </span>
                )}
            </div>

            <div style={styles.summaryValue}>
                {value}
            </div>

            <div style={styles.summaryLabel}>
                {label}
            </div>
        </div>
    );
}


/* =========================================================
   ASSIGNMENT CARD
========================================================= */

function AssignmentCard({
    assignment,
    onStatusChange,
    updatingId,
}) {
    const navigate = useNavigate();

    const id = getAssignmentId(assignment);

    const status = getStatus(assignment);

    const statusConfig =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.assigned;

    const vehicle =
        assignment?.registration_number ||
        assignment?.vehicle_registration ||
        assignment?.vehicle_number ||
        "Unassigned";

    const driver =
        assignment?.driver_name ||
        "Unassigned";

    const driverPhone =
        assignment?.driver_phone ||
        assignment?.phone ||
        null;

    const shipmentNumber =
        assignment?.tracking_number ||
        assignment?.shipment_number ||
        assignment?.shipment_id ||
        "—";

    const origin =
        assignment?.origin_city ||
        assignment?.origin_address ||
        "Origin unavailable";

    const destination =
        assignment?.destination_city ||
        assignment?.destination_address ||
        "Destination unavailable";

    const createdAt =
        assignment?.created_at ||
        assignment?.createdAt;

    const isUpdating =
        updatingId === id;


    /* NEXT ACTION */

    const getNextAction = () => {
        switch (status) {
            case "assigned":
                return {
                    label: "Accept",
                    icon: <Check size={14} />,
                    nextStatus: "accepted",
                };

            case "accepted":
                return {
                    label: "Start Trip",
                    icon: <Play size={14} />,
                    nextStatus: "in_progress",
                };

            case "in_progress":
                return {
                    label: "Complete",
                    icon: <CheckCircle2 size={14} />,
                    nextStatus: "completed",
                };

            default:
                return null;
        }
    };


    const nextAction = getNextAction();


    return (
        <div
            style={{
                ...styles.card,
                borderColor:
                    status === "in_progress"
                        ? "#164e63"
                        : "#1e2c42",
            }}
        >

            {/* TOP ACCENT */}

            <div
                style={{
                    ...styles.cardAccent,
                    background: statusConfig.color,
                }}
            />


            {/* HEADER */}

            <div style={styles.cardHeader}>

                <div style={{ minWidth: 0 }}>

                    <div style={styles.assignmentNumber}>
                        Assignment #{id}
                    </div>

                    <div style={styles.shipmentNumber}>
                        <Package size={12} />

                        <span>
                            {shipmentNumber}
                        </span>
                    </div>

                </div>

                <StatusBadge status={status} />

            </div>


            {/* ROUTE */}

            <div style={styles.routeBox}>

                <div style={styles.routeRow}>

                    <div
                        style={{
                            ...styles.routeIndicator,
                            background: "#60a5fa",
                        }}
                    />

                    <div style={styles.routeContent}>

                        <span style={styles.routeLabel}>
                            PICKUP
                        </span>

                        <span style={styles.routeValue}>
                            {origin}
                        </span>

                    </div>

                </div>


                <div style={styles.routeConnector}>
                    <div style={styles.connectorLine} />

                    <Route
                        size={12}
                        color="#475569"
                    />

                    <div style={styles.connectorLine} />
                </div>


                <div style={styles.routeRow}>

                    <div
                        style={{
                            ...styles.routeIndicator,
                            background: "#22c55e",
                        }}
                    />

                    <div style={styles.routeContent}>

                        <span style={styles.routeLabel}>
                            DELIVERY
                        </span>

                        <span style={styles.routeValue}>
                            {destination}
                        </span>

                    </div>

                </div>

            </div>


            {/* DETAILS */}

            <div style={styles.detailsGrid}>

                <div style={styles.detailItem}>

                    <div style={styles.detailIcon}>
                        <Truck size={14} />
                    </div>

                    <div>
                        <div style={styles.detailLabel}>
                            VEHICLE
                        </div>

                        <div style={styles.detailValue}>
                            {vehicle}
                        </div>
                    </div>

                </div>


                <div style={styles.detailItem}>

                    <div style={styles.detailIcon}>
                        <User size={14} />
                    </div>

                    <div>
                        <div style={styles.detailLabel}>
                            DRIVER
                        </div>

                        <div style={styles.detailValue}>
                            {driver}
                        </div>
                    </div>

                </div>


                <div style={styles.detailItem}>

                    <div style={styles.detailIcon}>
                        <Clock size={14} />
                    </div>

                    <div>
                        <div style={styles.detailLabel}>
                            CREATED
                        </div>

                        <div style={styles.detailValue}>
                            {formatDate(createdAt)}
                        </div>
                    </div>

                </div>


                <div style={styles.detailItem}>

                    <div style={styles.detailIcon}>
                        <Activity size={14} />
                    </div>

                    <div>
                        <div style={styles.detailLabel}>
                            LAST UPDATE
                        </div>

                        <div style={styles.detailValue}>
                            {getRelativeTime(
                                assignment?.updated_at ||
                                assignment?.updatedAt ||
                                createdAt
                            )}
                        </div>
                    </div>

                </div>

            </div>


            {/* DRIVER CONTACT */}

            {driverPhone && (
                <div style={styles.contactRow}>

                    <Phone size={12} />

                    <span>
                        {driverPhone}
                    </span>

                    <span style={styles.contactDivider}>
                        •
                    </span>

                    <span>
                        Driver contact
                    </span>

                </div>
            )}


            {/* ACTIONS */}

            <div style={styles.actions}>

                <button
                    type="button"
                    style={styles.trackButton}
                    onClick={() =>
                        navigate(
                            `/tracking?assignmentId=${encodeURIComponent(
                                id
                            )}`
                        )
                    }
                >
                    <Navigation size={13} />
                    Track
                </button>


                {nextAction && (
                    <button
                        type="button"
                        disabled={isUpdating}
                        style={{
                            ...styles.primaryButton,
                            opacity: isUpdating ? 0.6 : 1,
                        }}
                        onClick={() =>
                            onStatusChange(
                                id,
                                nextAction.nextStatus
                            )
                        }
                    >
                        {isUpdating ? (
                            <RefreshCw
                                size={13}
                                className="spin"
                            />
                        ) : (
                            nextAction.icon
                        )}

                        {isUpdating
                            ? "Updating..."
                            : nextAction.label}
                    </button>
                )}


                {(status === "assigned" ||
                    status === "accepted" ||
                    status === "in_progress") && (
                    <button
                        type="button"
                        disabled={isUpdating}
                        style={{
                            ...styles.cancelButton,
                            opacity: isUpdating ? 0.5 : 1,
                        }}
                        onClick={() => {
                            const confirmed =
                                window.confirm(
                                    "Are you sure you want to cancel this assignment?"
                                );

                            if (confirmed) {
                                onStatusChange(
                                    id,
                                    "cancelled"
                                );
                            }
                        }}
                    >
                        <XCircle size={13} />
                        Cancel
                    </button>
                )}

            </div>

        </div>
    );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Assignments() {

    const navigate = useNavigate();


    const [assignments, setAssignments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updatingId, setUpdatingId] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");


    /* =====================================================
       LOAD
    ===================================================== */

    const loadAssignments = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAssignments();

            let list = [];

            if (Array.isArray(response)) {

                list = response;

            } else if (
                Array.isArray(response?.data)
            ) {

                list = response.data;

            } else if (
                Array.isArray(
                    response?.data?.data
                )
            ) {

                list =
                    response.data.data;

            } else if (
                Array.isArray(
                    response?.assignments
                )
            ) {

                list =
                    response.assignments;
            }

            setAssignments(list);

        } catch (err) {

            console.error(
                "Load assignments error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load assignments."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadAssignments();
    }, []);


    /* =====================================================
       STATUS UPDATE
    ===================================================== */

    const handleStatusChange = async (
        id,
        status
    ) => {

        try {

            setUpdatingId(id);
            setError("");

            await updateAssignmentStatus(
                id,
                status
            );

            await loadAssignments();

        } catch (err) {

            console.error(
                "Update assignment status error:",
                err
            );

            setError(
                err?.message ||
                "Unable to update assignment status."
            );

        } finally {

            setUpdatingId(null);
        }
    };


    /* =====================================================
       COUNTS
    ===================================================== */

    const counts = useMemo(() => {

        const total =
            assignments.length;

        const assigned =
            assignments.filter(
                (a) =>
                    a.status === "assigned"
            ).length;

        const accepted =
            assignments.filter(
                (a) =>
                    a.status === "accepted"
            ).length;

        const inProgress =
            assignments.filter(
                (a) =>
                    a.status === "in_progress"
            ).length;

        const completed =
            assignments.filter(
                (a) =>
                    a.status === "completed"
            ).length;

        const cancelled =
            assignments.filter(
                (a) =>
                    a.status === "cancelled"
            ).length;

        return {
            total,
            assigned,
            accepted,
            inProgress,
            completed,
            cancelled,
        };

    }, [assignments]);


    /* =====================================================
       FILTER
    ===================================================== */

    const filteredAssignments =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            return assignments.filter(
                (assignment) => {

                    const status =
                        assignment?.status ||
                        "";

                    if (
                        statusFilter !== "all" &&
                        status !== statusFilter
                    ) {
                        return false;
                    }

                    if (!query) {
                        return true;
                    }

                    const searchable = [
                        assignment?.id,
                        assignment?.assignment_id,
                        assignment?.tracking_number,
                        assignment?.shipment_number,
                        assignment?.vehicle_number,
                        assignment?.registration_number,
                        assignment?.driver_name,
                        assignment?.origin_city,
                        assignment?.destination_city,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return searchable.includes(
                        query
                    );
                }
            );

        }, [
            assignments,
            search,
            statusFilter,
        ]);


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div style={styles.page}>

            {/* HEADER */}

            <div style={styles.header}>

                <div>

                    <div style={styles.titleRow}>

                        <div style={styles.titleIcon}>
                            <ClipboardList
                                size={19}
                            />
                        </div>

                        <div>
                            <h1 style={styles.title}>
                                Assignments
                            </h1>

                            <p style={styles.subtitle}>
                                Manage fleet dispatch,
                                drivers and active trips
                            </p>
                        </div>

                    </div>

                </div>


                <div style={styles.headerActions}>

                    <button
                        style={{
                            ...styles.refreshButton,
                            opacity: loading
                                ? 0.5
                                : 1,
                        }}
                        onClick={
                            loadAssignments
                        }
                        disabled={loading}
                    >
                        <RefreshCw
                            size={14}
                            className={
                                loading
                                    ? "spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>


                    <button
                        style={styles.addButton}
                        onClick={() =>
                            navigate(
                                "/assignments/new"
                            )
                        }
                    >
                        <Plus size={15} />
                        New Assignment
                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div style={styles.errorBox}>

                    <AlertCircle size={16} />

                    <span>
                        {error}
                    </span>

                    <button
                        style={styles.errorRetry}
                        onClick={
                            loadAssignments
                        }
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* SUMMARY */}

            <div style={styles.summaryGrid}>

                <SummaryCard
                    label="Total Assignments"
                    value={counts.total}
                    icon={ClipboardList}
                    color="#60a5fa"
                    percentage={100}
                />

                <SummaryCard
                    label="Assigned"
                    value={counts.assigned}
                    icon={Package}
                    color="#60a5fa"
                    percentage={
                        counts.total
                            ? Math.round(
                                (counts.assigned /
                                    counts.total) *
                                    100
                            )
                            : 0
                    }
                />

                <SummaryCard
                    label="Accepted"
                    value={counts.accepted}
                    icon={Check}
                    color="#c084fc"
                    percentage={
                        counts.total
                            ? Math.round(
                                (counts.accepted /
                                    counts.total) *
                                    100
                            )
                            : 0
                    }
                />

                <SummaryCard
                    label="In Progress"
                    value={counts.inProgress}
                    icon={Activity}
                    color="#38bdf8"
                    percentage={
                        counts.total
                            ? Math.round(
                                (counts.inProgress /
                                    counts.total) *
                                    100
                            )
                            : 0
                    }
                />

                <SummaryCard
                    label="Completed"
                    value={counts.completed}
                    icon={CheckCircle2}
                    color="#4ade80"
                    percentage={
                        counts.total
                            ? Math.round(
                                (counts.completed /
                                    counts.total) *
                                    100
                            )
                            : 0
                    }
                />

            </div>


            {/* TOOLBAR */}

            <div style={styles.toolbar}>

                <div style={styles.searchBox}>

                    <Search
                        size={15}
                        color="#64748b"
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search assignment, shipment, vehicle or driver..."
                        style={styles.searchInput}
                    />

                    {search && (
                        <button
                            style={styles.clearButton}
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>
                    )}

                </div>


                <div style={styles.filterArea}>

                    <Filter
                        size={14}
                        color="#64748b"
                    />

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                        style={styles.select}
                    >
                        <option value="all">
                            All Statuses
                        </option>

                        <option value="assigned">
                            Assigned
                        </option>

                        <option value="accepted">
                            Accepted
                        </option>

                        <option value="in_progress">
                            In Progress
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>

                </div>

            </div>


            {/* RESULT COUNT */}

            {!loading && (
                <div style={styles.resultInfo}>

                    <span>
                        Showing{" "}
                        <strong>
                            {filteredAssignments.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {assignments.length}
                        </strong>{" "}
                        assignments
                    </span>

                    {(search ||
                        statusFilter !== "all") && (
                        <button
                            style={styles.resetFilter}
                            onClick={() => {
                                setSearch("");
                                setStatusFilter(
                                    "all"
                                );
                            }}
                        >
                            Clear filters
                        </button>
                    )}

                </div>
            )}


            {/* LOADING */}

            {loading && (
                <div style={styles.loadingGrid}>

                    {[1, 2, 3, 4].map(
                        (item) => (
                            <div
                                key={item}
                                style={
                                    styles.skeletonCard
                                }
                            >
                                <div
                                    style={
                                        styles.skeletonLine
                                    }
                                />

                                <div
                                    style={{
                                        ...styles.skeletonLine,
                                        width: "60%",
                                    }}
                                />

                                <div
                                    style={{
                                        ...styles.skeletonBlock,
                                    }}
                                />

                                <div
                                    style={{
                                        ...styles.skeletonLine,
                                        width: "80%",
                                    }}
                                />

                                <div
                                    style={{
                                        ...styles.skeletonLine,
                                        width: "50%",
                                    }}
                                />
                            </div>
                        )
                    )}

                </div>
            )}


            {/* EMPTY */}

            {!loading &&
                filteredAssignments.length === 0 && (

                    <div style={styles.empty}>

                        <div style={styles.emptyIcon}>
                            {assignments.length ===
                            0 ? (
                                <ClipboardList
                                    size={32}
                                />
                            ) : (
                                <Search
                                    size={32}
                                />
                            )}
                        </div>

                        <h2 style={styles.emptyTitle}>
                            {assignments.length === 0
                                ? "No assignments yet"
                                : "No matching assignments"}
                        </h2>

                        <p style={styles.emptyText}>
                            {assignments.length === 0
                                ? "Create an assignment to start managing your fleet operations."
                                : "Try changing your search or status filter."}
                        </p>

                        {assignments.length ===
                            0 && (
                            <button
                                style={
                                    styles.addButton
                                }
                                onClick={() =>
                                    navigate(
                                        "/assignments/new"
                                    )
                                }
                            >
                                <Plus size={15} />
                                Create Assignment
                            </button>
                        )}

                    </div>
                )}


            {/* CARDS */}

            {!loading &&
                filteredAssignments.length >
                    0 && (

                    <div style={styles.list}>

                        {filteredAssignments.map(
                            (assignment) => {

                                const id =
                                    getAssignmentId(
                                        assignment
                                    );

                                return (
                                    <AssignmentCard
                                        key={id}
                                        assignment={
                                            assignment
                                        }
                                        onStatusChange={
                                            handleStatusChange
                                        }
                                        updatingId={
                                            updatingId
                                        }
                                    />
                                );
                            }
                        )}

                    </div>
                )}


            {/* STYLE */}

            <style>
                {`
                    * {
                        box-sizing: border-box;
                    }

                    button,
                    input,
                    select {
                        font-family: inherit;
                    }

                    button {
                        transition:
                            opacity .15s ease,
                            transform .15s ease,
                            border-color .15s ease,
                            background .15s ease;
                    }

                    button:hover:not(:disabled) {
                        opacity: .9;
                    }

                    button:active:not(:disabled) {
                        transform: translateY(1px);
                    }

                    input::placeholder {
                        color: #475569;
                    }

                    select option {
                        background: #07111f;
                        color: #e2e8f0;
                    }

                    .spin {
                        animation: routex-spin 1s linear infinite;
                    }

                    @keyframes routex-spin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @media (max-width: 1100px) {
                        .routex-assignment-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    @media (max-width: 800px) {
                        .routex-summary-grid {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                    }

                    @media (max-width: 600px) {
                        .routex-page {
                            padding: 20px 15px 40px !important;
                        }

                        .routex-header {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                        }

                        .routex-header-actions {
                            width: 100%;
                        }

                        .routex-header-actions button {
                            flex: 1;
                        }

                        .routex-summary-grid {
                            grid-template-columns: 1fr 1fr !important;
                        }

                        .routex-toolbar {
                            flex-direction: column !important;
                        }

                        .routex-search {
                            width: 100% !important;
                        }
                    }
                `}
            </style>

        </div>
    );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {

    page: {
        minHeight: "100vh",
        background: "#020817",
        color: "#e5edf7",
        padding: "28px 32px 50px",
        fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    },


    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
        gap: "20px",
    },


    titleRow: {
        display: "flex",
        alignItems: "center",
        gap: "11px",
    },


    titleIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2563eb18",
        border: "1px solid #2563eb30",
        color: "#60a5fa",
    },


    title: {
        margin: 0,
        fontSize: "23px",
        fontWeight: 700,
        color: "#f8fafc",
        letterSpacing: "-0.3px",
    },


    subtitle: {
        margin: "4px 0 0",
        color: "#64748b",
        fontSize: "11px",
    },


    headerActions: {
        display: "flex",
        gap: "9px",
    },


    refreshButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        padding: "9px 13px",
        borderRadius: "8px",
        border: "1px solid #26344a",
        background: "#091322",
        color: "#94a3b8",
        cursor: "pointer",
        fontSize: "10px",
        fontWeight: 600,
    },


    addButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        padding: "9px 14px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        fontSize: "10px",
        fontWeight: 600,
        boxShadow:
            "0 4px 15px rgba(37,99,235,.18)",
    },


    errorBox: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        background: "#160a16",
        border: "1px solid #57233a",
        color: "#fca5a5",
        padding: "11px 14px",
        borderRadius: "9px",
        marginBottom: "16px",
        fontSize: "11px",
    },


    errorRetry: {
        marginLeft: "auto",
        border: "1px solid #57233a",
        background: "transparent",
        color: "#fca5a5",
        borderRadius: "5px",
        padding: "5px 9px",
        fontSize: "9px",
        cursor: "pointer",
    },


    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(5, minmax(0, 1fr))",
        gap: "11px",
        marginBottom: "18px",
    },


    summaryCard: {
        background: "#07111f",
        border: "1px solid",
        borderRadius: "11px",
        padding: "14px",
    },


    summaryTop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },


    summaryIcon: {
        width: "30px",
        height: "30px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },


    summaryValue: {
        marginTop: "12px",
        fontSize: "22px",
        fontWeight: 700,
        color: "#f8fafc",
    },


    summaryLabel: {
        marginTop: "3px",
        color: "#64748b",
        fontSize: "9px",
        textTransform: "uppercase",
        letterSpacing: ".6px",
        fontWeight: 600,
    },


    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "10px",
    },


    searchBox: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        height: "38px",
        flex: 1,
        maxWidth: "500px",
        padding: "0 12px",
        background: "#07111f",
        border: "1px solid #1e2c42",
        borderRadius: "8px",
    },


    searchInput: {
        width: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        color: "#cbd5e1",
        fontSize: "10px",
    },


    clearButton: {
        border: "none",
        background: "transparent",
        color: "#64748b",
        cursor: "pointer",
        fontSize: "18px",
        lineHeight: 1,
    },


    filterArea: {
        height: "38px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 10px",
        borderRadius: "8px",
        border: "1px solid #1e2c42",
        background: "#07111f",
    },


    select: {
        border: "none",
        outline: "none",
        background: "transparent",
        color: "#94a3b8",
        fontSize: "10px",
        cursor: "pointer",
    },


    resultInfo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
        color: "#475569",
        fontSize: "9px",
    },


    resetFilter: {
        border: "none",
        background: "transparent",
        color: "#60a5fa",
        cursor: "pointer",
        fontSize: "9px",
    },


    list: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
        gap: "14px",
    },


    card: {
        position: "relative",
        overflow: "hidden",
        background: "#07111f",
        border: "1px solid #1e2c42",
        borderRadius: "13px",
        padding: "17px",
        transition:
            "border-color .2s ease, transform .2s ease",
    },


    cardAccent: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "2px",
    },


    cardHeader: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "15px",
    },


    assignmentNumber: {
        fontSize: "13px",
        fontWeight: 700,
        color: "#f1f5f9",
    },


    shipmentNumber: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginTop: "5px",
        color: "#64748b",
        fontSize: "9px",
    },


    routeBox: {
        padding: "13px",
        background: "#050d19",
        border: "1px solid #18263a",
        borderRadius: "9px",
        marginBottom: "15px",
    },


    routeRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },


    routeIndicator: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        flexShrink: 0,
        boxShadow: "0 0 0 3px rgba(255,255,255,.025)",
    },


    routeContent: {
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
    },


    routeLabel: {
        fontSize: "7px",
        fontWeight: 700,
        letterSpacing: ".8px",
        color: "#475569",
    },


    routeValue: {
        marginTop: "3px",
        fontSize: "10px",
        color: "#cbd5e1",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },


    routeConnector: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        marginLeft: "3px",
        height: "18px",
    },


    connectorLine: {
        height: "1px",
        width: "22px",
        background: "#26344a",
    },


    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "13px",
        marginBottom: "13px",
    },


    detailItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minWidth: 0,
    },


    detailIcon: {
        width: "28px",
        height: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "7px",
        background: "#0b1728",
        color: "#60a5fa",
        flexShrink: 0,
    },


    detailLabel: {
        color: "#475569",
        fontSize: "7px",
        letterSpacing: ".7px",
        marginBottom: "3px",
        fontWeight: 600,
    },


    detailValue: {
        color: "#cbd5e1",
        fontSize: "10px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },


    contactRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "#64748b",
        background: "#050d19",
        borderRadius: "6px",
        padding: "7px 9px",
        fontSize: "8px",
        marginBottom: "13px",
    },


    contactDivider: {
        color: "#334155",
    },


    actions: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        borderTop: "1px solid #172235",
        paddingTop: "12px",
    },


    trackButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "8px 11px",
        borderRadius: "7px",
        border: "1px solid #2563eb55",
        background: "#0b1d3d",
        color: "#60a5fa",
        cursor: "pointer",
        fontSize: "9px",
        fontWeight: 600,
    },


    primaryButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "8px 12px",
        border: "none",
        borderRadius: "7px",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        fontSize: "9px",
        fontWeight: 600,
    },


    cancelButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "8px 11px",
        border: "1px solid #57233a",
        borderRadius: "7px",
        background: "#160a16",
        color: "#f87171",
        cursor: "pointer",
        fontSize: "9px",
        fontWeight: 600,
    },


    loadingGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
        gap: "14px",
    },


    skeletonCard: {
        height: "310px",
        padding: "18px",
        borderRadius: "13px",
        border: "1px solid #162337",
        background: "#07111f",
    },


    skeletonLine: {
        height: "10px",
        width: "40%",
        borderRadius: "5px",
        background: "#101d2e",
        marginBottom: "12px",
    },


    skeletonBlock: {
        height: "95px",
        borderRadius: "9px",
        background: "#0a1625",
        margin: "20px 0",
    },


    empty: {
        minHeight: "330px",
        border: "1px solid #1e2c42",
        borderRadius: "13px",
        background: "#07111f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "30px",
    },


    emptyIcon: {
        width: "62px",
        height: "62px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        background: "#0b1728",
        color: "#475569",
        marginBottom: "14px",
    },


    emptyTitle: {
        margin: 0,
        fontSize: "14px",
        color: "#cbd5e1",
    },


    emptyText: {
        maxWidth: "350px",
        margin:
            "7px 0 18px",
        color: "#475569",
        fontSize: "10px",
        lineHeight: 1.6,
    },
};