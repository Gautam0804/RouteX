import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
    getLiveTracking,
    getTracking,
    getLatestTracking,
} from "../services/api";

function Tracking() {
    const navigate = useNavigate();
    const { assignmentId: pathAssignmentId } = useParams();
    const [searchParams] = useSearchParams();

    const assignmentId =
        pathAssignmentId ||
        searchParams.get("assignmentId") ||
        "";

    const [liveTracking, setLiveTracking] = useState([]);
    const [history, setHistory] = useState([]);
    const [latest, setLatest] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // ============================================================
    // HELPERS
    // ============================================================

    const getArrayData = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        return [];
    };

    const getObjectData = (response) => {
        if (!response) {
            return null;
        }

        if (
            response?.data &&
            !Array.isArray(response.data)
        ) {
            return response.data;
        }

        return response;
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const formatDate = (value) => {
        if (!value) {
            return "N/A";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "N/A";
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTime = (value) => {
        if (!value) {
            return "No data";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "No data";
        }

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status) => {
        if (status === "in_progress") {
            return {
                background: "rgba(34,197,94,.12)",
                color: "#4ade80",
                border: "1px solid rgba(34,197,94,.25)",
            };
        }

        if (status === "accepted") {
            return {
                background: "rgba(59,130,246,.12)",
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,.25)",
            };
        }

        if (status === "assigned") {
            return {
                background: "rgba(245,158,11,.12)",
                color: "#fbbf24",
                border: "1px solid rgba(245,158,11,.25)",
            };
        }

        if (status === "completed") {
            return {
                background: "rgba(148,163,184,.12)",
                color: "#cbd5e1",
                border: "1px solid rgba(148,163,184,.25)",
            };
        }

        return {
            background: "rgba(100,116,139,.12)",
            color: "#94a3b8",
            border: "1px solid rgba(100,116,139,.25)",
        };
    };

    const getLocationText = (item) => {
        if (!item) {
            return "Location unavailable";
        }

        return (
            item.address ||
            item.location ||
            "Location unavailable"
        );
    };

    const getRecordedAt = (item) => {
        return (
            item?.recorded_at ||
            item?.updated_at ||
            item?.created_at ||
            null
        );
    };

    // ============================================================
    // LIVE TRACKING
    // ============================================================

    const loadLiveTracking = useCallback(async () => {
        try {
            const response = await getLiveTracking();

            const data = getArrayData(response);

            setLiveTracking(data);
        } catch (err) {
            console.error(
                "Live tracking error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load live tracking."
            );
        }
    }, []);

    // ============================================================
    // ASSIGNMENT TRACKING
    // ============================================================

    const loadAssignmentTracking =
        useCallback(async () => {
            if (!assignmentId) {
                setHistory([]);
                setLatest(null);
                return;
            }

            try {
                const response =
                    await getTracking(
                        assignmentId
                    );

                const data =
                    getArrayData(response);

                setHistory(data);

                if (data.length > 0) {
                    setLatest(data[0]);
                }
            } catch (err) {
                console.error(
                    "Tracking history error:",
                    err
                );

                setHistory([]);
            }

            try {
                const response =
                    await getLatestTracking(
                        assignmentId
                    );

                const data =
                    getObjectData(response);

                if (data) {
                    setLatest(data);
                }
            } catch (err) {
                // No tracking row yet is not a page error.
                setLatest((current) => current);
            }
        }, [assignmentId]);

    // ============================================================
    // LOAD EVERYTHING
    // ============================================================

    const loadData = useCallback(async () => {
        setError("");

        await Promise.all([
            loadLiveTracking(),
            loadAssignmentTracking(),
        ]);
    }, [
        loadLiveTracking,
        loadAssignmentTracking,
    ]);

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        let active = true;

        const run = async () => {
            setLoading(true);

            await loadData();

            if (active) {
                setLoading(false);
            }
        };

        run();

        return () => {
            active = false;
        };
    }, [loadData]);

    // ============================================================
    // AUTO REFRESH
    // ============================================================

    useEffect(() => {
        const timer = setInterval(() => {
            loadLiveTracking();

            if (assignmentId) {
                loadAssignmentTracking();
            }
        }, 15000);

        return () => {
            clearInterval(timer);
        };
    }, [
        assignmentId,
        loadLiveTracking,
        loadAssignmentTracking,
    ]);

    // ============================================================
    // REFRESH BUTTON
    // ============================================================

    const handleRefresh = async () => {
        if (refreshing) {
            return;
        }

        setRefreshing(true);

        try {
            await loadData();
        } finally {
            setRefreshing(false);
        }
    };

    // ============================================================
    // SELECTED VEHICLE
    // ============================================================

    const selectedVehicle = useMemo(() => {
        if (!assignmentId) {
            return null;
        }

        return (
            liveTracking.find(
                (item) =>
                    String(item.assignment_id) ===
                    String(assignmentId)
            ) || null
        );
    }, [
        liveTracking,
        assignmentId,
    ]);

    // ============================================================
    // KPI DATA
    // ============================================================

    const activeAssignments =
        liveTracking.length;

    const trackingPoints = assignmentId
        ? history.length
        : liveTracking.reduce(
              (total, item) =>
                  total +
                  Number(
                      item.tracking_count || 0
                  ),
              0
          );

    const averageSpeed =
        liveTracking.length > 0
            ? Math.round(
                  liveTracking.reduce(
                      (total, item) =>
                          total +
                          Number(
                              item.speed_kmh || 0
                          ),
                      0
                  ) /
                      liveTracking.length
              )
            : Number(
                  latest?.speed_kmh || 0
              );

    const lastUpdated =
        latest?.recorded_at ||
        selectedVehicle?.recorded_at ||
        selectedVehicle?.updated_at ||
        null;

    // ============================================================
    // LOADING SCREEN
    // ============================================================

    if (loading) {
        return (
            <div style={styles.loadingPage}>
                <div style={styles.loadingBox}>
                    <div style={styles.loadingSpinner}>
                        ↻
                    </div>

                    <div>
                        <div style={styles.loadingTitle}>
                            Loading Live Tracking
                        </div>

                        <div style={styles.loadingText}>
                            Connecting to fleet telemetry...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // MAIN
    // ============================================================

    return (
        <div style={styles.page}>
            {/* ====================================================
                HEADER
            ==================================================== */}

            <div style={styles.header}>
                <div>
                    <div style={styles.breadcrumb}>
                        ROUTEX
                        <span>/</span>
                        TRACKING
                    </div>

                    <div style={styles.titleRow}>
                        <h1 style={styles.title}>
                            Live Tracking
                        </h1>

                        <span style={styles.liveBadge}>
                            <span style={styles.liveDot} />
                            LIVE
                        </span>
                    </div>

                    <p style={styles.subtitle}>
                        Monitor active vehicles and assignment
                        locations in real time.
                    </p>
                </div>

                <div style={styles.headerActions}>
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/assignments")
                        }
                        style={styles.secondaryButton}
                    >
                        ← Assignments
                    </button>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        style={{
                            ...styles.primaryButton,
                            opacity: refreshing
                                ? 0.65
                                : 1,
                        }}
                    >
                        {refreshing
                            ? "Refreshing..."
                            : "↻ Refresh"}
                    </button>
                </div>
            </div>

            {/* ====================================================
                ERROR
            ==================================================== */}

            {error && (
                <div style={styles.errorBox}>
                    <strong>Tracking error:</strong>
                    <span>{error}</span>
                </div>
            )}

            {/* ====================================================
                KPI CARDS
            ==================================================== */}

            <div style={styles.kpiGrid}>
                <KpiCard
                    icon="🚚"
                    label="Active Assignments"
                    value={activeAssignments}
                    description="Currently monitored"
                    iconClass="blue"
                />

                <KpiCard
                    icon="📍"
                    label="Tracking Points"
                    value={trackingPoints}
                    description="Recorded locations"
                    iconClass="purple"
                />

                <KpiCard
                    icon="⚡"
                    label="Average Speed"
                    value={averageSpeed}
                    unit="km/h"
                    description="Across active vehicles"
                    iconClass="green"
                />

                <KpiCard
                    icon="◷"
                    label="Last Updated"
                    value={formatTime(lastUpdated)}
                    description={
                        lastUpdated
                            ? formatDate(lastUpdated)
                            : "Waiting for telemetry"
                    }
                    iconClass="orange"
                    small
                />
            </div>

            {/* ====================================================
                MAIN CONTENT
            ==================================================== */}

            <div style={styles.mainGrid}>
                {/* =================================================
                    LIVE VEHICLES
                ================================================= */}

                <section style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <div>
                            <div style={styles.panelTitleRow}>
                                <span style={styles.panelIcon}>
                                    🚚
                                </span>

                                <h2 style={styles.panelTitle}>
                                    Live Vehicles
                                </h2>
                            </div>

                            <p style={styles.panelSubtitle}>
                                Currently active assignments
                            </p>
                        </div>

                        <span style={styles.countBadge}>
                            {liveTracking.length} active
                        </span>
                    </div>

                    {liveTracking.length === 0 ? (
                        <EmptyState
                            icon="🚚"
                            title="No active vehicles"
                            text="Vehicles will appear here when they have an active assignment."
                        />
                    ) : (
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>
                                            Assignment
                                        </th>

                                        <th style={styles.th}>
                                            Shipment
                                        </th>

                                        <th style={styles.th}>
                                            Driver
                                        </th>

                                        <th style={styles.th}>
                                            Vehicle
                                        </th>

                                        <th style={styles.th}>
                                            Status
                                        </th>

                                        <th style={styles.th}>
                                            Location
                                        </th>

                                        <th style={styles.th}>
                                            Speed
                                        </th>

                                        <th style={styles.th}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {liveTracking.map(
                                        (item) => {
                                            const driverName =
                                                [
                                                    item.driver_first_name,
                                                    item.driver_last_name,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ") ||
                                                "N/A";

                                            const statusStyle =
                                                getStatusStyle(
                                                    item.assignment_status
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        item.assignment_id
                                                    }
                                                    style={
                                                        styles.tableRow
                                                    }
                                                >
                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <strong
                                                            style={
                                                                styles.assignmentId
                                                            }
                                                        >
                                                            #
                                                            {
                                                                item.assignment_id
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <div
                                                            style={
                                                                styles.primaryText
                                                            }
                                                        >
                                                            {item.tracking_number ||
                                                                "N/A"}
                                                        </div>

                                                        <div
                                                            style={
                                                                styles.mutedText
                                                            }
                                                        >
                                                            Shipment
                                                        </div>
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <div
                                                            style={
                                                                styles.primaryText
                                                            }
                                                        >
                                                            {
                                                                driverName
                                                            }
                                                        </div>

                                                        <div
                                                            style={
                                                                styles.mutedText
                                                            }
                                                        >
                                                            {item.driver_phone ||
                                                                "Driver"}
                                                        </div>
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <div
                                                            style={
                                                                styles.primaryText
                                                            }
                                                        >
                                                            {item.vehicle_number ||
                                                                "N/A"}
                                                        </div>

                                                        <div
                                                            style={
                                                                styles.mutedText
                                                            }
                                                        >
                                                            {item.vehicle_type ||
                                                                "Vehicle"}
                                                        </div>
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <span
                                                            style={{
                                                                ...styles.statusBadge,
                                                                ...statusStyle,
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    ...styles.statusDot,
                                                                    background:
                                                                        statusStyle.color,
                                                                }}
                                                            />

                                                            {formatStatus(
                                                                item.assignment_status
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <div
                                                            style={
                                                                styles.locationMain
                                                            }
                                                        >
                                                            📍

                                                            {item.latitude !=
                                                                null &&
                                                            item.longitude !=
                                                                null
                                                                ? `${Number(
                                                                      item.latitude
                                                                  ).toFixed(
                                                                      4
                                                                  )}, ${Number(
                                                                      item.longitude
                                                                  ).toFixed(
                                                                      4
                                                                  )}`
                                                                : "No coordinates"}
                                                        </div>

                                                        <div
                                                            style={
                                                                styles.mutedText
                                                            }
                                                        >
                                                            {getLocationText(
                                                                item
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <strong
                                                            style={
                                                                styles.speed
                                                            }
                                                        >
                                                            {item.speed_kmh ??
                                                                0}

                                                            <span
                                                                style={
                                                                    styles.speedUnit
                                                                }
                                                            >
                                                                km/h
                                                            </span>
                                                        </strong>
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/tracking/${item.assignment_id}`
                                                                )
                                                            }
                                                            style={
                                                                styles.trackButton
                                                            }
                                                        >
                                                            Track
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* =================================================
                    MAP
                ================================================= */}

                <section style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <div>
                            <div style={styles.panelTitleRow}>
                                <span style={styles.panelIcon}>
                                    🗺
                                </span>

                                <h2 style={styles.panelTitle}>
                                    Fleet Map
                                </h2>
                            </div>

                            <p style={styles.panelSubtitle}>
                                Current vehicle positions
                            </p>
                        </div>

                        {selectedVehicle &&
                            selectedVehicle.latitude !=
                                null &&
                            selectedVehicle.longitude !=
                                null && (
                                <button
                                    type="button"
                                    style={
                                        styles.mapButton
                                    }
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps?q=${selectedVehicle.latitude},${selectedVehicle.longitude}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    📍 Maps
                                </button>
                            )}
                    </div>

                    <div style={styles.map}>
                        <div style={styles.mapGrid} />

                        <div style={styles.mapRiver} />

                        <div style={styles.roadOne} />
                        <div style={styles.roadTwo} />
                        <div style={styles.roadThree} />
                        <div style={styles.roadFour} />

                        <div style={styles.cityDelhi}>
                            NEW DELHI
                        </div>

                        <div style={styles.cityNoida}>
                            NOIDA
                        </div>

                        <div style={styles.cityGurgaon}>
                            GURUGRAM
                        </div>

                        <div style={styles.cityGhaziabad}>
                            GHAZIABAD
                        </div>

                        {liveTracking.map(
                            (item, index) => {
                                const positions = [
                                    {
                                        left: "51%",
                                        top: "35%",
                                    },
                                    {
                                        left: "68%",
                                        top: "55%",
                                    },
                                    {
                                        left: "34%",
                                        top: "60%",
                                    },
                                    {
                                        left: "74%",
                                        top: "29%",
                                    },
                                    {
                                        left: "25%",
                                        top: "42%",
                                    },
                                ];

                                const position =
                                    positions[
                                        index %
                                            positions.length
                                    ];

                                const selected =
                                    String(
                                        item.assignment_id
                                    ) ===
                                    String(
                                        assignmentId
                                    );

                                return (
                                    <button
                                        type="button"
                                        key={
                                            item.assignment_id
                                        }
                                        title={`Assignment #${item.assignment_id}`}
                                        onClick={() =>
                                            navigate(
                                                `/tracking/${item.assignment_id}`
                                            )
                                        }
                                        style={{
                                            ...styles.marker,
                                            ...position,
                                            ...(selected
                                                ? styles.selectedMarker
                                                : {}),
                                        }}
                                    >
                                        🚚
                                    </button>
                                );
                            }
                        )}

                        {liveTracking.length === 0 && (
                            <div style={styles.mapEmpty}>
                                <div style={styles.mapEmptyIcon}>
                                    📍
                                </div>

                                <strong>
                                    No live vehicles
                                </strong>

                                <span>
                                    Active vehicle locations
                                    will appear here.
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={styles.mapLegend}>
                        <Legend
                            color="#22c55e"
                            text="In Progress"
                        />

                        <Legend
                            color="#3b82f6"
                            text="Accepted"
                        />

                        <Legend
                            color="#f59e0b"
                            text="Assigned"
                        />
                    </div>
                </section>
            </div>

            {/* ====================================================
                SELECTED ASSIGNMENT
            ==================================================== */}

            {assignmentId && (
                <section style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <div>
                            <div style={styles.panelTitleRow}>
                                <span style={styles.panelIcon}>
                                    📡
                                </span>

                                <h2 style={styles.panelTitle}>
                                    Assignment #
                                    {assignmentId}
                                </h2>
                            </div>

                            <p style={styles.panelSubtitle}>
                                Latest vehicle telemetry
                            </p>
                        </div>

                        {latest && (
                            <span
                                style={
                                    styles.updatedBadge
                                }
                            >
                                <span
                                    style={
                                        styles.updatedDot
                                    }
                                />

                                Updated{" "}
                                {formatTime(
                                    getRecordedAt(
                                        latest
                                    )
                                )}
                            </span>
                        )}
                    </div>

                    {!latest ? (
                        <EmptyState
                            icon="📍"
                            title="No tracking location"
                            text="No location has been recorded for this assignment yet."
                        />
                    ) : (
                        <div style={styles.telemetryGrid}>
                            <TelemetryCard
                                icon="📍"
                                label="Current Location"
                                value={
                                    latest.address ||
                                    "Location available"
                                }
                            />

                            <TelemetryCard
                                icon="🌐"
                                label="Coordinates"
                                value={`${latest.latitude}, ${latest.longitude}`}
                            />

                            <TelemetryCard
                                icon="⚡"
                                label="Current Speed"
                                value={`${latest.speed_kmh ?? 0} km/h`}
                            />

                            <TelemetryCard
                                icon="🧭"
                                label="Heading"
                                value={`${latest.heading ?? "N/A"}°`}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* ====================================================
                HISTORY
            ==================================================== */}

            {assignmentId && (
                <section style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <div>
                            <div style={styles.panelTitleRow}>
                                <span style={styles.panelIcon}>
                                    🕘
                                </span>

                                <h2 style={styles.panelTitle}>
                                    Tracking History
                                </h2>
                            </div>

                            <p style={styles.panelSubtitle}>
                                Recorded location updates
                            </p>
                        </div>

                        <span style={styles.countBadge}>
                            {history.length} points
                        </span>
                    </div>

                    {history.length === 0 ? (
                        <EmptyState
                            icon="🕘"
                            title="No tracking history"
                            text="Location updates will appear here as the vehicle moves."
                        />
                    ) : (
                        <div style={styles.historyList}>
                            {history.map(
                                (item, index) => (
                                    <div
                                        key={
                                            item.id ||
                                            `${item.recorded_at}-${index}`
                                        }
                                        style={
                                            styles.historyItem
                                        }
                                    >
                                        <div
                                            style={
                                                styles.timeline
                                            }
                                        >
                                            <div
                                                style={
                                                    styles.timelineDot
                                                }
                                            />

                                            {index <
                                                history.length -
                                                    1 && (
                                                <div
                                                    style={
                                                        styles.timelineLine
                                                    }
                                                />
                                            )}
                                        </div>

                                        <div
                                            style={
                                                styles.historyContent
                                            }
                                        >
                                            <div
                                                style={
                                                    styles.historyTop
                                                }
                                            >
                                                <div>
                                                    <strong
                                                        style={
                                                            styles.historyTitle
                                                        }
                                                    >
                                                        {item.address ||
                                                            "Tracking Point"}
                                                    </strong>

                                                    <div
                                                        style={
                                                            styles.mutedText
                                                        }
                                                    >
                                                        {formatDate(
                                                            item.recorded_at
                                                        )}
                                                    </div>
                                                </div>

                                                <span
                                                    style={
                                                        styles.historySpeed
                                                    }
                                                >
                                                    {item.speed_kmh ??
                                                        0}{" "}
                                                    km/h
                                                </span>
                                            </div>

                                            <div
                                                style={
                                                    styles.historyDetails
                                                }
                                            >
                                                <span>
                                                    📍{" "}
                                                    {
                                                        item.latitude
                                                    }
                                                    ,{" "}
                                                    {
                                                        item.longitude
                                                    }
                                                </span>

                                                <span>
                                                    🧭 Heading{" "}
                                                    {
                                                        item.heading ??
                                                            "N/A"
                                                    }
                                                    °
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* ====================================================
                RESPONSIVE CSS
            ==================================================== */}

            <style>
                {`
                    @keyframes routexSpin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                    button {
                        transition:
                            background .15s ease,
                            border-color .15s ease,
                            transform .15s ease,
                            filter .15s ease;
                    }

                    button:hover:not(:disabled) {
                        filter: brightness(1.08);
                    }

                    button:active:not(:disabled) {
                        transform: translateY(1px);
                    }

                    @media (max-width: 1200px) {
                        .tracking-main-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    @media (max-width: 800px) {
                        .tracking-kpi-grid {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr)) !important;
                        }
                    }

                    @media (max-width: 560px) {
                        .tracking-kpi-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>
        </div>
    );
}

// ================================================================
// KPI CARD
// ================================================================

function KpiCard({
    icon,
    label,
    value,
    unit,
    description,
    iconClass,
    small = false,
}) {
    let background =
        "rgba(59,130,246,.12)";
    let color = "#60a5fa";

    if (iconClass === "purple") {
        background =
            "rgba(168,85,247,.12)";
        color = "#c084fc";
    }

    if (iconClass === "green") {
        background =
            "rgba(34,197,94,.12)";
        color = "#4ade80";
    }

    if (iconClass === "orange") {
        background =
            "rgba(245,158,11,.12)";
        color = "#fbbf24";
    }

    return (
        <div style={styles.kpiCard}>
            <div
                style={{
                    ...styles.kpiIcon,
                    background,
                    color,
                }}
            >
                {icon}
            </div>

            <div style={styles.kpiContent}>
                <div style={styles.kpiLabel}>
                    {label}
                </div>

                <div
                    style={
                        small
                            ? styles.kpiSmallValue
                            : styles.kpiValue
                    }
                >
                    {value}

                    {unit && (
                        <span
                            style={
                                styles.kpiUnit
                            }
                        >
                            {unit}
                        </span>
                    )}
                </div>

                <div
                    style={
                        styles.kpiDescription
                    }
                >
                    {description}
                </div>
            </div>
        </div>
    );
}

// ================================================================
// TELEMETRY CARD
// ================================================================

function TelemetryCard({
    icon,
    label,
    value,
}) {
    return (
        <div style={styles.telemetryCard}>
            <div style={styles.telemetryIcon}>
                {icon}
            </div>

            <div style={styles.telemetryContent}>
                <div
                    style={
                        styles.telemetryLabel
                    }
                >
                    {label}
                </div>

                <div
                    style={
                        styles.telemetryValue
                    }
                >
                    {value}
                </div>
            </div>
        </div>
    );
}

// ================================================================
// EMPTY STATE
// ================================================================

function EmptyState({
    icon,
    title,
    text,
}) {
    return (
        <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
                {icon}
            </div>

            <h3 style={styles.emptyTitle}>
                {title}
            </h3>

            <p style={styles.emptyText}>
                {text}
            </p>
        </div>
    );
}

// ================================================================
// LEGEND
// ================================================================

function Legend({ color, text }) {
    return (
        <div style={styles.legendItem}>
            <span
                style={{
                    ...styles.legendDot,
                    background: color,
                }}
            />

            {text}
        </div>
    );
}

// ================================================================
// STYLES
// ================================================================

const styles = {
    page: {
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "28px",
        background:
            "linear-gradient(145deg,#070d1c 0%,#0b1424 55%,#08101c 100%)",
        color: "#e5e7eb",
        fontFamily:
            "Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    },

    loadingPage: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#070d1c",
    },

    loadingBox: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "22px 26px",
        borderRadius: "14px",
        border: "1px solid #26364d",
        background: "#111c2e",
    },

    loadingSpinner: {
        width: "34px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "#172840",
        color: "#60a5fa",
        fontSize: "24px",
        animation:
            "routexSpin 1s linear infinite",
    },

    loadingTitle: {
        color: "#e2e8f0",
        fontSize: "14px",
        fontWeight: 750,
    },

    loadingText: {
        marginTop: "4px",
        color: "#64748b",
        fontSize: "11px",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "20px",
        marginBottom: "22px",
    },

    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px",
        color: "#53657d",
        fontSize: "9px",
        fontWeight: 800,
        letterSpacing: "1.2px",
    },

    titleRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    title: {
        margin: 0,
        color: "#f1f5f9",
        fontSize: "28px",
        fontWeight: 800,
        letterSpacing: "-.5px",
    },

    liveBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 9px",
        borderRadius: "999px",
        background:
            "rgba(34,197,94,.08)",
        border:
            "1px solid rgba(34,197,94,.2)",
        color: "#4ade80",
        fontSize: "9px",
        fontWeight: 800,
        letterSpacing: ".6px",
    },

    liveDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#22c55e",
        boxShadow:
            "0 0 0 3px rgba(34,197,94,.1)",
    },

    subtitle: {
        margin: "6px 0 0",
        color: "#64748b",
        fontSize: "12px",
    },

    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
    },

    primaryButton: {
        border: "none",
        borderRadius: "8px",
        padding: "10px 15px",
        background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
        color: "#fff",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: 700,
    },

    secondaryButton: {
        border:
            "1px solid rgba(71,85,105,.7)",
        borderRadius: "8px",
        padding: "9px 14px",
        background: "#111d30",
        color: "#cbd5e1",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: 650,
    },

    errorBox: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        marginBottom: "17px",
        padding: "11px 14px",
        borderRadius: "9px",
        border:
            "1px solid rgba(239,68,68,.25)",
        background:
            "rgba(127,29,29,.16)",
        color: "#fca5a5",
        fontSize: "11px",
    },

    kpiGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4,minmax(0,1fr))",
        gap: "13px",
        marginBottom: "17px",
    },

    kpiCard: {
        minHeight: "105px",
        display: "flex",
        alignItems: "center",
        gap: "13px",
        padding: "17px",
        boxSizing: "border-box",
        borderRadius: "12px",
        border:
            "1px solid rgba(51,65,85,.65)",
        background:
            "linear-gradient(145deg,#17243a,#101d30)",
        boxShadow:
            "0 10px 30px rgba(0,0,0,.12)",
    },

    kpiIcon: {
        width: "43px",
        height: "43px",
        minWidth: "43px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "11px",
        fontSize: "19px",
    },

    kpiContent: {
        minWidth: 0,
    },

    kpiLabel: {
        marginBottom: "4px",
        color: "#748399",
        fontSize: "10px",
        fontWeight: 600,
    },

    kpiValue: {
        color: "#f8fafc",
        fontSize: "25px",
        lineHeight: 1.1,
        fontWeight: 800,
    },

    kpiSmallValue: {
        color: "#f8fafc",
        fontSize: "16px",
        lineHeight: 1.25,
        fontWeight: 800,
    },

    kpiUnit: {
        marginLeft: "4px",
        color: "#64748b",
        fontSize: "10px",
        fontWeight: 500,
    },

    kpiDescription: {
        marginTop: "5px",
        color: "#52627a",
        fontSize: "9px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    mainGrid: {
        display: "grid",
        gridTemplateColumns:
            "minmax(0,1.65fr) minmax(370px,.85fr)",
        gap: "17px",
        marginBottom: "17px",
    },

    panel: {
        overflow: "hidden",
        marginBottom: "17px",
        borderRadius: "13px",
        border:
            "1px solid rgba(51,65,85,.62)",
        background:
            "linear-gradient(145deg,#131f31,#0d192a)",
        boxShadow:
            "0 12px 35px rgba(0,0,0,.1)",
    },

    panelHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "15px",
        padding: "17px 19px",
        borderBottom:
            "1px solid rgba(51,65,85,.5)",
    },

    panelTitleRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    panelIcon: {
        fontSize: "16px",
    },

    panelTitle: {
        margin: 0,
        color: "#e5edf8",
        fontSize: "14px",
        fontWeight: 750,
    },

    panelSubtitle: {
        margin: "5px 0 0",
        color: "#617187",
        fontSize: "10px",
    },

    countBadge: {
        padding: "6px 9px",
        borderRadius: "7px",
        background: "#16243a",
        border:
            "1px solid rgba(71,85,105,.45)",
        color: "#8fa0b5",
        fontSize: "9px",
        fontWeight: 700,
        whiteSpace: "nowrap",
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto",
    },

    table: {
        width: "100%",
        minWidth: "950px",
        borderCollapse: "collapse",
    },

    th: {
        padding: "10px 12px",
        textAlign: "left",
        color: "#5e7088",
        fontSize: "8px",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: ".7px",
        borderBottom:
            "1px solid rgba(51,65,85,.5)",
        whiteSpace: "nowrap",
    },

    tableRow: {
        transition:
            "background .15s ease",
    },

    td: {
        padding: "12px",
        borderBottom:
            "1px solid rgba(51,65,85,.35)",
        verticalAlign: "middle",
        fontSize: "10px",
    },

    assignmentId: {
        color: "#60a5fa",
        fontSize: "11px",
    },

    primaryText: {
        color: "#d9e2ee",
        fontSize: "10px",
        fontWeight: 650,
    },

    mutedText: {
        marginTop: "3px",
        color: "#56677d",
        fontSize: "8px",
    },

    locationMain: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        color: "#cbd5e1",
        fontWeight: 650,
        whiteSpace: "nowrap",
    },

    speed: {
        color: "#4ade80",
        fontSize: "11px",
    },

    speedUnit: {
        marginLeft: "3px",
        color: "#64748b",
        fontSize: "8px",
        fontWeight: 500,
    },

    statusBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 8px",
        borderRadius: "999px",
        fontSize: "8px",
        fontWeight: 750,
        whiteSpace: "nowrap",
    },

    statusDot: {
        width: "5px",
        height: "5px",
        borderRadius: "50%",
    },

    trackButton: {
        border: "none",
        borderRadius: "6px",
        padding: "7px 11px",
        background:
            "rgba(37,99,235,.14)",
        border:
            "1px solid rgba(59,130,246,.25)",
        color: "#60a5fa",
        cursor: "pointer",
        fontSize: "9px",
        fontWeight: 700,
    },

    mapButton: {
        border:
            "1px solid rgba(71,85,105,.6)",
        borderRadius: "7px",
        padding: "6px 9px",
        background: "#111d30",
        color: "#94a3b8",
        cursor: "pointer",
        fontSize: "9px",
        fontWeight: 650,
    },

    map: {
        position: "relative",
        height: "360px",
        margin: "14px",
        overflow: "hidden",
        borderRadius: "10px",
        border:
            "1px solid rgba(100,116,139,.25)",
        background:
            "linear-gradient(145deg,#dbe6cd,#cbd7bd 52%,#d8dfcc)",
    },

    mapGrid: {
        position: "absolute",
        inset: 0,
        backgroundImage:
            "linear-gradient(rgba(71,85,105,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(71,85,105,.12) 1px,transparent 1px)",
        backgroundSize: "30px 30px",
    },

    mapRiver: {
        position: "absolute",
        left: "-8%",
        top: "-20%",
        width: "28%",
        height: "150%",
        borderRadius: "50%",
        background:
            "rgba(106,170,195,.22)",
        transform: "rotate(-15deg)",
    },

    roadOne: {
        position: "absolute",
        width: "125%",
        height: "5px",
        left: "-12%",
        top: "45%",
        background:
            "rgba(255,255,255,.9)",
        transform: "rotate(-12deg)",
    },

    roadTwo: {
        position: "absolute",
        width: "115%",
        height: "4px",
        left: "-6%",
        top: "65%",
        background:
            "rgba(255,255,255,.85)",
        transform: "rotate(8deg)",
    },

    roadThree: {
        position: "absolute",
        width: "90%",
        height: "4px",
        left: "12%",
        top: "38%",
        background:
            "rgba(255,255,255,.88)",
        transform: "rotate(56deg)",
    },

    roadFour: {
        position: "absolute",
        width: "85%",
        height: "3px",
        left: "20%",
        top: "20%",
        background:
            "rgba(255,255,255,.78)",
        transform: "rotate(-37deg)",
    },

    cityDelhi: {
        position: "absolute",
        left: "47%",
        top: "28%",
        color: "#475569",
        fontSize: "11px",
        fontWeight: 850,
        letterSpacing: ".5px",
    },

    cityNoida: {
        position: "absolute",
        left: "66%",
        top: "55%",
        color: "#64748b",
        fontSize: "9px",
        fontWeight: 750,
    },

    cityGurgaon: {
        position: "absolute",
        left: "28%",
        top: "59%",
        color: "#64748b",
        fontSize: "9px",
        fontWeight: 750,
    },

    cityGhaziabad: {
        position: "absolute",
        left: "72%",
        top: "34%",
        color: "#64748b",
        fontSize: "8px",
        fontWeight: 700,
    },

    marker: {
        position: "absolute",
        width: "35px",
        height: "35px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border:
            "3px solid rgba(255,255,255,.95)",
        borderRadius: "50%",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        zIndex: 10,
        fontSize: "15px",
        boxShadow:
            "0 7px 18px rgba(15,23,42,.35)",
    },

    selectedMarker: {
        background: "#16a34a",
        boxShadow:
            "0 0 0 6px rgba(34,197,94,.18),0 8px 22px rgba(15,23,42,.35)",
    },

    mapEmpty: {
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        color: "#64748b",
        fontSize: "10px",
        zIndex: 5,
    },

    mapEmptyIcon: {
        fontSize: "26px",
        marginBottom: "4px",
    },

    mapLegend: {
        display: "flex",
        alignItems: "center",
        gap: "17px",
        padding:
            "0 17px 15px",
        color: "#718198",
        fontSize: "9px",
    },

    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },

    legendDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
    },

    updatedBadge: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 9px",
        borderRadius: "7px",
        background:
            "rgba(34,197,94,.07)",
        border:
            "1px solid rgba(34,197,94,.17)",
        color: "#4ade80",
        fontSize: "9px",
        fontWeight: 650,
    },

    updatedDot: {
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: "#22c55e",
    },

    telemetryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4,minmax(0,1fr))",
        gap: "10px",
        padding: "16px",
    },

    telemetryCard: {
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        minHeight: "78px",
        padding: "13px",
        boxSizing: "border-box",
        borderRadius: "9px",
        background: "#0b1627",
        border:
            "1px solid rgba(51,65,85,.52)",
    },

    telemetryIcon: {
        width: "32px",
        height: "32px",
        minWidth: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        background: "#142239",
        fontSize: "15px",
    },

    telemetryContent: {
        minWidth: 0,
    },

    telemetryLabel: {
        marginBottom: "5px",
        color: "#607189",
        fontSize: "8px",
        fontWeight: 750,
        textTransform: "uppercase",
        letterSpacing: ".6px",
    },

    telemetryValue: {
        color: "#dce6f2",
        fontSize: "10px",
        fontWeight: 650,
        lineHeight: 1.45,
        wordBreak: "break-word",
    },

    emptyState: {
        minHeight: "165px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
        textAlign: "center",
        boxSizing: "border-box",
    },

    emptyIcon: {
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px",
        borderRadius: "14px",
        background: "#101d31",
        fontSize: "23px",
    },

    emptyTitle: {
        margin: 0,
        color: "#94a3b8",
        fontSize: "13px",
        fontWeight: 700,
    },

    emptyText: {
        maxWidth: "420px",
        margin: "6px 0 0",
        color: "#52627a",
        fontSize: "10px",
        lineHeight: 1.5,
    },

    historyList: {
        padding: "16px 19px",
    },

    historyItem: {
        display: "flex",
        gap: "12px",
        minHeight: "75px",
    },

    timeline: {
        width: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    timelineDot: {
        width: "8px",
        height: "8px",
        minHeight: "8px",
        borderRadius: "50%",
        background: "#3b82f6",
        border:
            "2px solid #0d192b",
        boxShadow:
            "0 0 0 2px rgba(59,130,246,.2)",
        zIndex: 2,
    },

    timelineLine: {
        width: "1px",
        flex: 1,
        marginTop: "-1px",
        background: "#27374d",
    },

    historyContent: {
        flex: 1,
        paddingBottom: "16px",
    },

    historyTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
    },

    historyTitle: {
        color: "#d9e2ee",
        fontSize: "10px",
        fontWeight: 700,
    },

    historySpeed: {
        color: "#4ade80",
        fontSize: "9px",
        fontWeight: 750,
        whiteSpace: "nowrap",
    },

    historyDetails: {
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        marginTop: "8px",
        color: "#607189",
        fontSize: "9px",
    },
};

export default Tracking;