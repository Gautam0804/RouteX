import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Package,
    MapPin,
    Building2,
    Calendar,
    Weight,
    Truck,
    User,
    Navigation,
    RefreshCw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getShipmentById,
    getAssignments,
} from "../api/api";


function ShipmentDetails() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [shipment, setShipment] = useState(null);
    const [assignment, setAssignment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD SHIPMENT
    // =====================================================

    const loadShipment = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getShipmentById(id);


            if (!response?.success) {

                setError(
                    response?.message ||
                    "Unable to load shipment."
                );

                return;
            }


            setShipment(response.data);


            // =============================================
            // LOAD ASSIGNMENT
            // =============================================

            try {

                const assignmentResponse =
                    await getAssignments({
                        shipmentId: id,
                    });


                if (
                    assignmentResponse?.success &&
                    Array.isArray(
                        assignmentResponse.data
                    )
                ) {

                    setAssignment(
                        assignmentResponse.data[0] ||
                        null
                    );

                }

            } catch (assignmentError) {

                console.warn(
                    "Assignment loading skipped:",
                    assignmentError
                );

                setAssignment(null);

            }

        } catch (err) {

            console.error(
                "Shipment details error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load shipment."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (id) {
            loadShipment();
        }

    }, [id]);


    // =====================================================
    // HELPERS
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


    const formatDateTime = (value) => {

        if (!value) {
            return "—";
        }


        const date = new Date(value);


        if (Number.isNaN(date.getTime())) {
            return "—";
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    const getStatusClass = (status) => {

        const classes = {
            pending: "pending",
            assigned: "assigned",
            picked_up: "picked",
            in_transit: "transit",
            out_for_delivery: "delivery",
            delivered: "delivered",
            delayed: "delayed",
            cancelled: "cancelled",
        };

        return classes[status] || "unknown";

    };


    const getStatusLabel = (status) => {

        const labels = {
            pending: "Pending",
            assigned: "Assigned",
            picked_up: "Picked Up",
            in_transit: "In Transit",
            out_for_delivery: "Out for Delivery",
            delivered: "Delivered",
            delayed: "Delayed",
            cancelled: "Cancelled",
        };

        return (
            labels[status] ||
            status ||
            "Unknown"
        );

    };


    const getPriorityClass = (priority) => {

        return (
            priority ||
            "normal"
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="shipment-details-page">

                <style>{styles}</style>

                <div className="loading-state">

                    <RefreshCw
                        size={18}
                        className="spin"
                    />

                    <span>
                        Loading shipment...
                    </span>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !shipment) {

        return (

            <div className="shipment-details-page">

                <style>{styles}</style>

                <div className="details-container">

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            navigate("/shipments")
                        }
                    >

                        <ArrowLeft size={15} />

                        Back to Shipments

                    </button>


                    <div className="error-card">

                        <Package size={28} />

                        <h2>
                            Unable to load shipment
                        </h2>

                        <p>
                            {error ||
                                "Shipment not found."}
                        </p>


                        <button
                            type="button"
                            className="primary-button"
                            onClick={loadShipment}
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // DATA
    // =====================================================

    const status =
        shipment.status || "pending";


    const priority =
        shipment.priority || "normal";


    const customerName =
        shipment.customer_name ||
        shipment.company_name ||
        shipment.customer?.company_name ||
        "—";


    const customerCode =
        shipment.customer_code ||
        shipment.customer?.customer_code ||
        "—";


    const origin =
        shipment.origin_address ||
        shipment.origin_city ||
        "—";


    const destination =
        shipment.destination_address ||
        shipment.destination_city ||
        "—";


    const driverName =
        assignment?.driver_name ||
        assignment?.driver?.name ||
        "—";


    const driverPhone =
        assignment?.driver_phone ||
        assignment?.driver?.phone ||
        "—";


    const vehicleNumber =
        assignment?.vehicle_number ||
        assignment?.registration_number ||
        assignment?.vehicle?.vehicle_number ||
        "—";


    const vehicleType =
        assignment?.vehicle_type ||
        assignment?.vehicle?.vehicle_type ||
        "—";


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="shipment-details-page">

            <style>{styles}</style>


            <div className="details-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="page-header">

                    <div className="header-left">

                        <button
                            type="button"
                            className="back-button"
                            onClick={() =>
                                navigate("/shipments")
                            }
                        >

                            <ArrowLeft size={15} />

                            Back

                        </button>


                        <div className="title-block">

                            <div className="eyebrow">

                                <Package size={13} />

                                ROUTEX / SHIPMENTS

                            </div>


                            <h1>
                                Shipment #{shipment.id}
                            </h1>


                            <p>
                                {shipment.tracking_number ||
                                    "No tracking number"}
                            </p>

                        </div>

                    </div>


                    <div className="header-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={loadShipment}
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


                        {assignment && (

                            <button
                                type="button"
                                className="primary-button"
                                onClick={() =>
                                    navigate(
                                        `/tracking/${assignment.id}`
                                    )
                                }
                            >

                                <Navigation size={14} />

                                Track

                            </button>

                        )}

                    </div>

                </div>


                {/* =================================================
                    STATUS BAR
                ================================================= */}

                <section className="status-card">

                    <div>

                        <span className="muted-label">
                            CURRENT STATUS
                        </span>


                        <span
                            className={`status-badge ${getStatusClass(status)}`}
                        >
                            {getStatusLabel(status)}
                        </span>

                    </div>


                    <div>

                        <span className="muted-label">
                            PRIORITY
                        </span>


                        <span
                            className={`priority ${getPriorityClass(priority)}`}
                        >
                            {priority
                                .charAt(0)
                                .toUpperCase() +
                                priority.slice(1)}
                        </span>

                    </div>


                    <div>

                        <span className="muted-label">
                            CREATED
                        </span>


                        <span className="status-value">
                            {formatDate(
                                shipment.created_at
                            )}
                        </span>

                    </div>

                </section>


                {/* =================================================
                    MAIN GRID
                ================================================= */}

                <div className="main-grid">

                    {/* =================================================
                        CUSTOMER
                    ================================================= */}

                    <section className="card">

                        <div className="card-header">

                            <div className="card-icon">
                                <Building2 size={16} />
                            </div>

                            <div>

                                <h2>
                                    Customer
                                </h2>

                                <p>
                                    Customer information
                                </p>

                            </div>

                        </div>


                        <div className="info-list">

                            <InfoRow
                                label="Company"
                                value={customerName}
                            />

                            <InfoRow
                                label="Customer Code"
                                value={customerCode}
                            />

                            <InfoRow
                                label="Contact Person"
                                value={
                                    shipment.contact_person ||
                                    "—"
                                }
                            />

                            <InfoRow
                                label="Phone"
                                value={
                                    shipment.customer_phone ||
                                    shipment.phone ||
                                    "—"
                                }
                            />

                            <InfoRow
                                label="Email"
                                value={
                                    shipment.customer_email ||
                                    shipment.email ||
                                    "—"
                                }
                            />

                        </div>

                    </section>


                    {/* =================================================
                        ROUTE
                    ================================================= */}

                    <section className="card">

                        <div className="card-header">

                            <div className="card-icon">
                                <MapPin size={16} />
                            </div>

                            <div>

                                <h2>
                                    Route
                                </h2>

                                <p>
                                    Shipment movement
                                </p>

                            </div>

                        </div>


                        <div className="route">

                            <div className="route-point">

                                <span className="route-dot origin-dot" />

                                <div>

                                    <span className="muted-label">
                                        ORIGIN
                                    </span>

                                    <strong>
                                        {origin}
                                    </strong>

                                    {shipment.origin_city && (
                                        <small>
                                            {shipment.origin_city}
                                        </small>
                                    )}

                                </div>

                            </div>


                            <div className="route-line" />


                            <div className="route-point">

                                <span className="route-dot destination-dot" />

                                <div>

                                    <span className="muted-label">
                                        DESTINATION
                                    </span>

                                    <strong>
                                        {destination}
                                    </strong>

                                    {shipment.destination_city && (
                                        <small>
                                            {shipment.destination_city}
                                        </small>
                                    )}

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        PACKAGE
                    ================================================= */}

                    <section className="card">

                        <div className="card-header">

                            <div className="card-icon">
                                <Weight size={16} />
                            </div>

                            <div>

                                <h2>
                                    Package
                                </h2>

                                <p>
                                    Shipment contents
                                </p>

                            </div>

                        </div>


                        <div className="info-list">

                            <InfoRow
                                label="Description"
                                value={
                                    shipment.package_description ||
                                    "—"
                                }
                            />

                            <InfoRow
                                label="Package Count"
                                value={
                                    shipment.package_count ??
                                    "—"
                                }
                            />

                            <InfoRow
                                label="Weight"
                                value={
                                    shipment.weight_kg != null
                                        ? `${shipment.weight_kg} kg`
                                        : "—"
                                }
                            />

                            <InfoRow
                                label="Delivery Notes"
                                value={
                                    shipment.delivery_notes ||
                                    "—"
                                }
                            />

                        </div>

                    </section>


                    {/* =================================================
                        DATES
                    ================================================= */}

                    <section className="card">

                        <div className="card-header">

                            <div className="card-icon">
                                <Calendar size={16} />
                            </div>

                            <div>

                                <h2>
                                    Timeline
                                </h2>

                                <p>
                                    Shipment dates
                                </p>

                            </div>

                        </div>


                        <div className="info-list">

                            <InfoRow
                                label="Created"
                                value={formatDateTime(
                                    shipment.created_at
                                )}
                            />

                            <InfoRow
                                label="Estimated Delivery"
                                value={formatDateTime(
                                    shipment.estimated_delivery_at
                                )}
                            />

                            <InfoRow
                                label="Actual Delivery"
                                value={formatDateTime(
                                    shipment.actual_delivery_at
                                )}
                            />

                            <InfoRow
                                label="Last Updated"
                                value={formatDateTime(
                                    shipment.updated_at
                                )}
                            />

                        </div>

                    </section>

                </div>


                {/* =================================================
                    ASSIGNMENT
                ================================================= */}

                <section className="card assignment-card">

                    <div className="card-header">

                        <div className="card-icon">
                            <Truck size={16} />
                        </div>

                        <div>

                            <h2>
                                Assignment
                            </h2>

                            <p>
                                Vehicle and driver assigned to this shipment
                            </p>

                        </div>

                    </div>


                    {assignment ? (

                        <div className="assignment-grid">

                            <div className="assignment-item">

                                <User
                                    size={17}
                                    className="assignment-icon"
                                />

                                <div>

                                    <span className="muted-label">
                                        DRIVER
                                    </span>

                                    <strong>
                                        {driverName}
                                    </strong>

                                    <small>
                                        {driverPhone}
                                    </small>

                                </div>

                            </div>


                            <div className="assignment-item">

                                <Truck
                                    size={17}
                                    className="assignment-icon"
                                />

                                <div>

                                    <span className="muted-label">
                                        VEHICLE
                                    </span>

                                    <strong>
                                        {vehicleNumber}
                                    </strong>

                                    <small>
                                        {vehicleType}
                                    </small>

                                </div>

                            </div>


                            <div className="assignment-item">

                                <Package
                                    size={17}
                                    className="assignment-icon"
                                />

                                <div>

                                    <span className="muted-label">
                                        ASSIGNMENT STATUS
                                    </span>

                                    <strong>
                                        {getStatusLabel(
                                            assignment.status
                                        )}
                                    </strong>

                                </div>

                            </div>


                            <div className="assignment-action">

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            `/tracking/${assignment.id}`
                                        )
                                    }
                                >

                                    <Navigation size={14} />

                                    Open Tracking

                                </button>

                            </div>

                        </div>

                    ) : (

                        <div className="no-assignment">

                            <Truck size={22} />

                            <div>

                                <strong>
                                    No vehicle assigned
                                </strong>

                                <p>
                                    This shipment has not been assigned to a driver and vehicle yet.
                                </p>

                            </div>


                            {status === "pending" && (

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            "/assignments/new"
                                        )
                                    }
                                >
                                    Create Assignment
                                </button>

                            )}

                        </div>

                    )}

                </section>

            </div>

        </div>

    );

}


// =====================================================
// INFO ROW
// =====================================================

function InfoRow({
    label,
    value,
}) {

    return (

        <div className="info-row">

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>

    );

}


// =====================================================
// STYLES
// =====================================================

const styles = `

    * {
        box-sizing: border-box;
    }

    .shipment-details-page {
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

    .details-container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 18px;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .title-block h1 {
        margin: 4px 0 0;
        color: #f8fafc;
        font-size: 23px;
        font-weight: 700;
    }

    .title-block p {
        margin: 4px 0 0;
        color: #71859e;
        font-size: 12px;
    }

    .eyebrow {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #60a5fa;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .14em;
    }

    .header-actions {
        display: flex;
        gap: 8px;
    }

    button {
        font-family: inherit;
    }

    .back-button,
    .secondary-button,
    .primary-button {
        height: 36px;
        padding: 0 12px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 600;
    }

    .back-button {
        border: 1px solid #263a52;
        background: #0d1a2b;
        color: #94a3b8;
    }

    .back-button:hover {
        color: white;
        background: #13243a;
    }

    .secondary-button {
        border: 1px solid #263a52;
        background: #0d1a2b;
        color: #cbd5e1;
    }

    .secondary-button:hover {
        background: #13243a;
    }

    .primary-button {
        border: 1px solid #2563eb;
        background: #2563eb;
        color: white;
    }

    .primary-button:hover {
        background: #1d4ed8;
    }

    button:disabled {
        opacity: .5;
        cursor: not-allowed;
    }

    .status-card {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 14px;
        margin-bottom: 14px;
        background: #0b1828;
        border: 1px solid #1b3048;
        border-radius: 12px;
    }

    .status-card > div {
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 4px 8px;
    }

    .muted-label {
        color: #71859e;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
    }

    .status-value {
        color: #dbe7f4;
        font-size: 12px;
        font-weight: 600;
    }

    .status-badge {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        padding: 5px 9px;
        border-radius: 999px;
        border: 1px solid transparent;
        font-size: 10px;
        font-weight: 700;
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

    .priority {
        font-size: 12px;
        font-weight: 700;
    }

    .priority.low {
        color: #60a5fa;
    }

    .priority.normal {
        color: #94a3b8;
    }

    .priority.high {
        color: #fb923c;
    }

    .priority.urgent {
        color: #f87171;
    }

    .main-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
    }

    .card {
        background: #0b1828;
        border: 1px solid #1b3048;
        border-radius: 12px;
        padding: 18px;
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 18px;
    }

    .card-icon {
        width: 34px;
        height: 34px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #102744;
        border: 1px solid #1e3a5f;
        color: #60a5fa;
    }

    .card-header h2 {
        margin: 0;
        color: #f8fafc;
        font-size: 13px;
        font-weight: 700;
    }

    .card-header p {
        margin: 3px 0 0;
        color: #647890;
        font-size: 10px;
    }

    .info-list {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .info-row {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 10px 0;
        border-bottom: 1px solid #14283f;
    }

    .info-row:last-child {
        border-bottom: none;
    }

    .info-row > span {
        color: #71859e;
        font-size: 11px;
    }

    .info-row > strong {
        max-width: 60%;
        text-align: right;
        color: #dbe7f4;
        font-size: 11px;
        font-weight: 600;
        word-break: break-word;
    }

    .route {
        padding: 4px 5px;
    }

    .route-point {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .route-point > div {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .route-point strong {
        color: #e2e8f0;
        font-size: 12px;
    }

    .route-point small {
        color: #71859e;
        font-size: 10px;
    }

    .route-dot {
        width: 10px;
        height: 10px;
        margin-top: 2px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .origin-dot {
        background: #60a5fa;
        box-shadow: 0 0 0 4px #102c4b;
    }

    .destination-dot {
        background: #4ade80;
        box-shadow: 0 0 0 4px #12351f;
    }

    .route-line {
        width: 1px;
        height: 38px;
        margin: 3px 0 3px 4px;
        background: #29415e;
    }

    .assignment-card {
        margin-top: 14px;
    }

    .assignment-grid {
        display: grid;
        grid-template-columns:
            repeat(4, minmax(0, 1fr));
        gap: 12px;
        align-items: center;
    }

    .assignment-item {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        padding: 12px;
        border: 1px solid #162c43;
        background: #091625;
        border-radius: 9px;
    }

    .assignment-icon {
        color: #60a5fa;
        flex-shrink: 0;
    }

    .assignment-item > div {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    .assignment-item strong {
        color: #dbe7f4;
        font-size: 11px;
    }

    .assignment-item small {
        color: #71859e;
        font-size: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .assignment-action {
        display: flex;
        justify-content: flex-end;
    }

    .no-assignment {
        display: flex;
        align-items: center;
        gap: 13px;
        padding: 14px;
        border: 1px dashed #263e59;
        background: #091625;
        border-radius: 9px;
        color: #647890;
    }

    .no-assignment > div {
        flex: 1;
    }

    .no-assignment strong {
        display: block;
        margin-bottom: 4px;
        color: #cbd5e1;
        font-size: 12px;
    }

    .no-assignment p {
        margin: 0;
        color: #647890;
        font-size: 10px;
    }

    .loading-state {
        min-height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #71859e;
        font-size: 12px;
    }

    .error-card {
        margin-top: 40px;
        padding: 40px;
        text-align: center;
        background: #0b1828;
        border: 1px solid #1b3048;
        border-radius: 12px;
        color: #71859e;
    }

    .error-card svg {
        margin: 0 auto 12px;
        color: #f87171;
    }

    .error-card h2 {
        margin: 0 0 7px;
        color: #f8fafc;
        font-size: 15px;
    }

    .error-card p {
        margin: 0 0 18px;
        font-size: 11px;
    }

    .spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 900px) {

        .main-grid {
            grid-template-columns: 1fr;
        }

        .assignment-grid {
            grid-template-columns: repeat(2, 1fr);
        }

    }

    @media (max-width: 650px) {

        .shipment-details-page {
            padding: 14px;
        }

        .page-header {
            align-items: flex-start;
            flex-direction: column;
        }

        .header-left {
            align-items: flex-start;
        }

        .header-actions {
            width: 100%;
        }

        .header-actions button {
            flex: 1;
        }

        .status-card {
            grid-template-columns: 1fr;
        }

        .assignment-grid {
            grid-template-columns: 1fr;
        }

        .no-assignment {
            align-items: flex-start;
            flex-wrap: wrap;
        }

    }

`;


export default ShipmentDetails;