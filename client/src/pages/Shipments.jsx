import React, { useCallback, useEffect, useState } from "react";
import {
    Plus,
    RefreshCw,
    Package,
    Eye,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getShipments } from "../api/api";


// =====================================================
// STATUS CONFIG
// =====================================================

const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        className: "pending",
    },
    assigned: {
        label: "Assigned",
        className: "assigned",
    },
    picked_up: {
        label: "Picked Up",
        className: "picked",
    },
    in_transit: {
        label: "In Transit",
        className: "transit",
    },
    out_for_delivery: {
        label: "Out for Delivery",
        className: "delivery",
    },
    delivered: {
        label: "Delivered",
        className: "delivered",
    },
    delayed: {
        label: "Delayed",
        className: "delayed",
    },
    cancelled: {
        label: "Cancelled",
        className: "cancelled",
    },
};


// =====================================================
// PRIORITY CONFIG
// =====================================================

const PRIORITY_CONFIG = {
    low: "Low",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
};


// =====================================================
// COMPONENT
// =====================================================

function Shipments() {

    const navigate = useNavigate();


    const [shipments, setShipments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    const [priority, setPriority] = useState("all");


    const [page, setPage] = useState(1);

    const limit = 10;


    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });


    // =====================================================
    // LOAD SHIPMENTS
    // =====================================================

    const loadShipments = useCallback(async () => {

        try {

            setLoading(true);
            setError("");


            const response = await getShipments({
                search: search.trim(),
                status,
                priority,
                page,
                limit,
            });


            if (!response?.success) {

                setShipments([]);

                setPagination({
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                });

                setError(
                    response?.message ||
                    "Failed to load shipments"
                );

                return;
            }


            const shipmentData =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            setShipments(shipmentData);


            setPagination(
                response.pagination || {
                    page,
                    limit,
                    total: shipmentData.length,
                    totalPages: 1,
                }
            );

        } catch (err) {

            console.error(
                "Shipment loading error:",
                err
            );


            setShipments([]);


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load shipments"
            );

        } finally {

            setLoading(false);

        }

    }, [
        search,
        status,
        priority,
        page,
    ]);


    // =====================================================
    // LOAD WHEN FILTER / PAGE CHANGES
    // =====================================================

    useEffect(() => {

        const timer = setTimeout(() => {

            loadShipments();

        }, search.trim() ? 400 : 0);


        return () => clearTimeout(timer);

    }, [
        loadShipments,
        search,
    ]);


    // =====================================================
    // STATUS TEXT
    // =====================================================

    const getStatusInfo = (value) => {

        return (
            STATUS_CONFIG[value] || {
                label: value || "Unknown",
                className: "unknown",
            }
        );

    };


    // =====================================================
    // PRIORITY TEXT
    // =====================================================

    const getPriorityText = (value) => {

        return (
            PRIORITY_CONFIG[value] ||
            value ||
            "Normal"
        );

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "—";
        }


        const date = new Date(value);


        if (Number.isNaN(date.getTime())) {
            return "—";
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // =====================================================
    // SUMMARY
    // =====================================================

    const pendingCount = shipments.filter(
        (shipment) =>
            shipment.status === "pending"
    ).length;


    const transitCount = shipments.filter(
        (shipment) =>
            shipment.status === "in_transit"
    ).length;


    const deliveredCount = shipments.filter(
        (shipment) =>
            shipment.status === "delivered"
    ).length;


    // =====================================================
    // PAGINATION
    // =====================================================

    const goToPreviousPage = () => {

        if (page > 1) {

            setPage(
                (current) => current - 1
            );

        }

    };


    const goToNextPage = () => {

        if (
            page <
            pagination.totalPages
        ) {

            setPage(
                (current) => current + 1
            );

        }

    };


    const resetFilters = () => {

        setSearch("");
        setStatus("all");
        setPriority("all");
        setPage(1);

    };


    const getPaginationText = () => {

        if (pagination.total === 0) {

            return "Showing 0 shipments";

        }


        const start =
            (page - 1) * limit + 1;


        const end = Math.min(
            page * limit,
            pagination.total
        );


        return `Showing ${start} to ${end} of ${pagination.total} shipments`;

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="shipments-page">

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .shipments-page {
                    min-height: 100vh;
                    background: #07111f;
                    color: #e5edf7;
                    padding: 24px;
                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                .shipments-container {
                    max-width: 1500px;
                    margin: 0 auto;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 22px;
                }

                .page-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .title-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #102744;
                    border: 1px solid #1e3a5f;
                    color: #60a5fa;
                }

                .page-title h1 {
                    margin: 0;
                    font-size: 22px;
                    font-weight: 700;
                    color: #f8fafc;
                }

                .page-title p {
                    margin: 4px 0 0;
                    color: #7f93ad;
                    font-size: 12px;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .header-btn {
                    height: 38px;
                    padding: 0 13px;
                    border-radius: 9px;
                    border: 1px solid #263a52;
                    background: #0d1a2b;
                    color: #cbd5e1;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                }

                .header-btn:hover {
                    background: #13243a;
                }

                .header-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .header-btn.primary {
                    border-color: #2563eb;
                    background: #2563eb;
                    color: white;
                }

                .header-btn.primary:hover {
                    background: #1d4ed8;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(4, minmax(0, 1fr));
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .summary-card {
                    background: #0b1828;
                    border: 1px solid #1b3048;
                    border-radius: 12px;
                    padding: 16px;
                }

                .summary-label {
                    color: #7f93ad;
                    font-size: 11px;
                    margin-bottom: 8px;
                }

                .summary-value {
                    color: #f8fafc;
                    font-size: 24px;
                    font-weight: 700;
                }

                .filters-card {
                    background: #0b1828;
                    border: 1px solid #1b3048;
                    border-radius: 12px;
                    padding: 12px;
                    margin-bottom: 16px;
                }

                .filters {
                    display: grid;
                    grid-template-columns:
                        minmax(240px, 1fr)
                        170px
                        170px
                        auto;
                    gap: 10px;
                }

                .search-box {
                    position: relative;
                }

                .search-box svg {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #61758e;
                }

                .filter-input,
                .filter-select {
                    width: 100%;
                    height: 38px;
                    border-radius: 8px;
                    border: 1px solid #263a52;
                    background: #071321;
                    color: #dbe7f4;
                    outline: none;
                    font-size: 12px;
                }

                .filter-input {
                    padding: 0 12px 0 36px;
                }

                .filter-select {
                    padding: 0 10px;
                }

                .filter-input:focus,
                .filter-select:focus {
                    border-color: #3b82f6;
                }

                .table-card {
                    background: #0b1828;
                    border: 1px solid #1b3048;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .table-wrapper {
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 1050px;
                }

                th {
                    padding: 13px 15px;
                    text-align: left;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #71859e;
                    background: #091524;
                    border-bottom: 1px solid #1b3048;
                }

                td {
                    padding: 14px 15px;
                    border-bottom: 1px solid #14283f;
                    color: #c8d4e2;
                    font-size: 12px;
                    vertical-align: middle;
                }

                tr:last-child td {
                    border-bottom: none;
                }

                tbody tr:hover {
                    background: #0d1d30;
                }

                .shipment-id {
                    color: #60a5fa;
                    font-weight: 700;
                }

                .tracking-number {
                    color: #f1f5f9;
                    font-weight: 600;
                }

                .customer-name {
                    color: #dbe7f4;
                    font-weight: 600;
                    max-width: 180px;
                }

                .location {
                    color: #a9b8c9;
                    max-width: 170px;
                }

                .priority {
                    font-size: 11px;
                    font-weight: 600;
                }

                .priority.urgent {
                    color: #f87171;
                }

                .priority.high {
                    color: #fb923c;
                }

                .priority.normal {
                    color: #94a3b8;
                }

                .priority.low {
                    color: #60a5fa;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 5px 9px;
                    border-radius: 999px;
                    font-size: 10px;
                    font-weight: 700;
                    white-space: nowrap;
                    border: 1px solid transparent;
                }

                .status-badge.pending {
                    color: #fbbf24;
                    background: #3b2d08;
                    border-color: #66500b;
                }

                .status-badge.assigned {
                    color: #60a5fa;
                    background: #102c4b;
                    border-color: #194b7d;
                }

                .status-badge.picked {
                    color: #a78bfa;
                    background: #24164a;
                    border-color: #4c2e91;
                }

                .status-badge.transit {
                    color: #38bdf8;
                    background: #082d42;
                    border-color: #075579;
                }

                .status-badge.delivery {
                    color: #2dd4bf;
                    background: #07352f;
                    border-color: #0c665b;
                }

                .status-badge.delivered {
                    color: #4ade80;
                    background: #09351e;
                    border-color: #176b3b;
                }

                .status-badge.delayed {
                    color: #fb923c;
                    background: #3b1f0b;
                    border-color: #704019;
                }

                .status-badge.cancelled {
                    color: #f87171;
                    background: #3b1116;
                    border-color: #6e2029;
                }

                .status-badge.unknown {
                    color: #94a3b8;
                    background: #172235;
                    border-color: #334155;
                }

                .action-btn {
                    height: 30px;
                    padding: 0 10px;
                    border-radius: 7px;
                    border: 1px solid #29415e;
                    background: #102137;
                    color: #93c5fd;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 600;
                }

                .action-btn:hover {
                    background: #17304d;
                }

                .empty-state,
                .loading-state,
                .error-state {
                    padding: 60px 20px;
                    text-align: center;
                    color: #71859e;
                    font-size: 13px;
                }

                .error-state {
                    color: #fca5a5;
                }

                .error-message {
                    margin-bottom: 14px;
                }

                .retry-btn {
                    height: 34px;
                    padding: 0 12px;
                    border: 1px solid #334d6b;
                    background: #102137;
                    color: #cbd5e1;
                    border-radius: 7px;
                    cursor: pointer;
                }

                .retry-btn:hover {
                    background: #17304d;
                }

                .pagination {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    padding: 12px 15px;
                    border-top: 1px solid #1b3048;
                    background: #091524;
                }

                .pagination-info {
                    color: #71859e;
                    font-size: 11px;
                }

                .pagination-actions {
                    display: flex;
                    gap: 7px;
                    align-items: center;
                }

                .page-btn {
                    height: 32px;
                    min-width: 32px;
                    padding: 0 9px;
                    border-radius: 7px;
                    border: 1px solid #293e57;
                    background: #0d1c2e;
                    color: #aebdce;
                    cursor: pointer;
                    font-size: 11px;
                }

                .page-btn:hover:not(:disabled) {
                    background: #162b44;
                }

                .page-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .page-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 32px;
                    height: 32px;
                    color: #93c5fd;
                    font-size: 11px;
                    font-weight: 700;
                }

                @media (max-width: 900px) {

                    .summary-grid {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }

                    .filters {
                        grid-template-columns:
                            1fr 1fr;
                    }

                }

                @media (max-width: 600px) {

                    .shipments-page {
                        padding: 14px;
                    }

                    .page-header {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .header-actions {
                        width: 100%;
                    }

                    .header-btn {
                        flex: 1;
                        justify-content: center;
                    }

                    .summary-grid {
                        grid-template-columns:
                            1fr 1fr;
                    }

                    .filters {
                        grid-template-columns: 1fr;
                    }

                    .pagination {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                }

            `}</style>


            <div className="shipments-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="page-header">

                    <div className="page-title">

                        <div className="title-icon">
                            <Package size={21} />
                        </div>


                        <div>

                            <h1>
                                Shipments
                            </h1>

                            <p>
                                Manage and monitor fleet shipments
                            </p>

                        </div>

                    </div>


                    <div className="header-actions">

                        <button
                            type="button"
                            className="header-btn"
                            onClick={loadShipments}
                            disabled={loading}
                        >

                            <RefreshCw
                                size={14}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>


                        <button
                            type="button"
                            className="header-btn primary"
                            onClick={() =>
                                navigate("/shipments/new")
                            }
                        >

                            <Plus size={14} />

                            New Shipment

                        </button>

                    </div>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="summary-grid">

                    <div className="summary-card">

                        <div className="summary-label">
                            Total Shipments
                        </div>

                        <div className="summary-value">
                            {pagination.total}
                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-label">
                            Pending
                        </div>

                        <div className="summary-value">
                            {pendingCount}
                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-label">
                            In Transit
                        </div>

                        <div className="summary-value">
                            {transitCount}
                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-label">
                            Delivered
                        </div>

                        <div className="summary-value">
                            {deliveredCount}
                        </div>

                    </div>

                </div>


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div className="filters-card">

                    <div className="filters">

                        <div className="search-box">

                            <Search size={15} />

                            <input
                                type="text"
                                className="filter-input"
                                placeholder="Search tracking, city or customer..."
                                value={search}
                                onChange={(event) => {

                                    setSearch(
                                        event.target.value
                                    );

                                    setPage(1);

                                }}
                            />

                        </div>


                        <select
                            className="filter-select"
                            value={status}
                            onChange={(event) => {

                                setStatus(
                                    event.target.value
                                );

                                setPage(1);

                            }}
                        >

                            <option value="all">
                                All Status
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="assigned">
                                Assigned
                            </option>

                            <option value="picked_up">
                                Picked Up
                            </option>

                            <option value="in_transit">
                                In Transit
                            </option>

                            <option value="out_for_delivery">
                                Out for Delivery
                            </option>

                            <option value="delivered">
                                Delivered
                            </option>

                            <option value="delayed">
                                Delayed
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                        </select>


                        <select
                            className="filter-select"
                            value={priority}
                            onChange={(event) => {

                                setPriority(
                                    event.target.value
                                );

                                setPage(1);

                            }}
                        >

                            <option value="all">
                                All Priority
                            </option>

                            <option value="low">
                                Low
                            </option>

                            <option value="normal">
                                Normal
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="urgent">
                                Urgent
                            </option>

                        </select>


                        <button
                            type="button"
                            className="header-btn"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="table-card">

                    {loading ? (

                        <div className="loading-state">
                            Loading shipments...
                        </div>

                    ) : error ? (

                        <div className="error-state">

                            <div className="error-message">
                                {error}
                            </div>

                            <button
                                type="button"
                                className="retry-btn"
                                onClick={loadShipments}
                            >
                                Try Again
                            </button>

                        </div>

                    ) : shipments.length === 0 ? (

                        <div className="empty-state">
                            No shipments found.
                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Tracking
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Origin
                                        </th>

                                        <th>
                                            Destination
                                        </th>

                                        <th>
                                            Priority
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {shipments.map(
                                        (shipment) => {

                                            const id =
                                                shipment.id;


                                            const statusInfo =
                                                getStatusInfo(
                                                    shipment.status
                                                );


                                            return (

                                                <tr
                                                    key={id}
                                                >

                                                    <td>

                                                        <span className="shipment-id">
                                                            #{id}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span className="tracking-number">

                                                            {
                                                                shipment.tracking_number ||
                                                                "—"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="customer-name">

                                                            {
                                                                shipment.customer_name ||
                                                                shipment.company_name ||
                                                                "—"
                                                            }

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="location">

                                                            {
                                                                shipment.origin_city ||
                                                                shipment.origin_address ||
                                                                "—"
                                                            }

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="location">

                                                            {
                                                                shipment.destination_city ||
                                                                shipment.destination_address ||
                                                                "—"
                                                            }

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`priority ${
                                                                shipment.priority ||
                                                                "normal"
                                                            }`}
                                                        >

                                                            {
                                                                getPriorityText(
                                                                    shipment.priority
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`status-badge ${statusInfo.className}`}
                                                        >

                                                            {
                                                                statusInfo.label
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {
                                                            formatDate(
                                                                shipment.created_at
                                                            )
                                                        }

                                                    </td>


                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="action-btn"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/shipments/${id}`
                                                                )
                                                            }
                                                        >

                                                            <Eye
                                                                size={13}
                                                            />

                                                            View

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


                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {!loading &&
                        !error &&
                        pagination.total > 0 && (

                            <div className="pagination">

                                <div className="pagination-info">
                                    {getPaginationText()}
                                </div>


                                <div className="pagination-actions">

                                    <button
                                        type="button"
                                        className="page-btn"
                                        onClick={
                                            goToPreviousPage
                                        }
                                        disabled={
                                            page <= 1
                                        }
                                    >
                                        Previous
                                    </button>


                                    <div className="page-number">
                                        {page}
                                    </div>


                                    <button
                                        type="button"
                                        className="page-btn"
                                        onClick={
                                            goToNextPage
                                        }
                                        disabled={
                                            pagination.totalPages === 0 ||
                                            page >=
                                            pagination.totalPages
                                        }
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>

                        )}

                </div>

            </div>

        </div>

    );

}


export default Shipments;