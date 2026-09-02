import { useEffect, useState } from "react";

import {
    ArrowLeft,
    ClipboardList,
    Truck,
    User,
    Package,
    Save,
    Loader2,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    createAssignment,
    getShipments,
    getVehicles,
    getDrivers,
} from "../services/api";


function AssignmentForm() {
    const navigate = useNavigate();

    const [shipments, setShipments] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [shipmentId, setShipmentId] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [driverId, setDriverId] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD AVAILABLE RESOURCES
    // =====================================================

    const loadResources = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                shipmentResponse,
                vehicleResponse,
                driverResponse,
            ] = await Promise.all([
                getShipments("?status=pending&limit=100"),
                getVehicles("?status=available&limit=100"),
                getDrivers("?status=available&limit=100"),
            ]);


            // =================================================
            // NORMALIZE SHIPMENT RESPONSE
            // =================================================

            const shipmentData =
                Array.isArray(shipmentResponse)
                    ? shipmentResponse
                    : Array.isArray(shipmentResponse?.data)
                        ? shipmentResponse.data
                        : [];


            // =================================================
            // NORMALIZE VEHICLE RESPONSE
            // =================================================

            const vehicleData =
                Array.isArray(vehicleResponse)
                    ? vehicleResponse
                    : Array.isArray(vehicleResponse?.data)
                        ? vehicleResponse.data
                        : [];


            // =================================================
            // NORMALIZE DRIVER RESPONSE
            // =================================================

            const driverData =
                Array.isArray(driverResponse)
                    ? driverResponse
                    : Array.isArray(driverResponse?.data)
                        ? driverResponse.data
                        : [];


            setShipments(shipmentData);
            setVehicles(vehicleData);
            setDrivers(driverData);


            // =================================================
            // CLEAR INVALID SHIPMENT SELECTION
            // =================================================

            if (
                shipmentId &&
                !shipmentData.some(
                    (item) =>
                        String(item.id) ===
                        String(shipmentId)
                )
            ) {
                setShipmentId("");
            }


            // =================================================
            // CLEAR INVALID VEHICLE SELECTION
            // =================================================

            if (
                vehicleId &&
                !vehicleData.some(
                    (item) =>
                        String(item.id) ===
                        String(vehicleId)
                )
            ) {
                setVehicleId("");
            }


            // =================================================
            // CLEAR INVALID DRIVER SELECTION
            // =================================================

            if (
                driverId &&
                !driverData.some(
                    (item) =>
                        String(item.id) ===
                        String(driverId)
                )
            ) {
                setDriverId("");
            }

        } catch (err) {
            console.error(
                "Assignment resource error:",
                err
            );

            setError(
                err?.message ||
                "Failed to load available resources."
            );

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadResources();
    }, []);


    // =====================================================
    // SUBMIT ASSIGNMENT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");


        // =================================================
        // VALIDATION
        // =================================================

        if (!shipmentId) {
            setError("Please select a shipment.");
            return;
        }

        if (!vehicleId) {
            setError("Please select a vehicle.");
            return;
        }

        if (!driverId) {
            setError("Please select a driver.");
            return;
        }


        try {
            setSubmitting(true);


            // =================================================
            // CREATE ASSIGNMENT
            // =================================================

            const response = await createAssignment({
                shipmentId: Number(shipmentId),
                vehicleId: Number(vehicleId),
                driverId: Number(driverId),
            });


            // =================================================
            // CHECK RESPONSE
            // =================================================

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Failed to create assignment."
                );
            }


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                "Assignment created successfully."
            );


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {
                navigate("/assignments");
            }, 700);

        } catch (err) {
            console.error(
                "Create assignment error:",
                err
            );

            setError(
                err?.message ||
                "Failed to create assignment."
            );

        } finally {
            setSubmitting(false);
        }
    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {
        return (
            <div className="assignment-page">
                <style>{styles}</style>

                <div className="loading-screen">
                    <Loader2
                        size={20}
                        className="spin"
                    />

                    Loading available resources...
                </div>
            </div>
        );
    }


    // =====================================================
    // MAIN RENDER
    // =====================================================

    return (
        <div className="assignment-page">
            <style>{styles}</style>

            <div className="assignment-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="page-header">

                    <div>

                        <button
                            type="button"
                            className="back-button"
                            onClick={() =>
                                navigate("/assignments")
                            }
                        >
                            <ArrowLeft size={14} />
                            Back to Assignments
                        </button>


                        <div className="title-block">

                            <div className="eyebrow">
                                <ClipboardList size={13} />
                                ROUTEX / ASSIGNMENTS
                            </div>

                            <h1>
                                Create Assignment
                            </h1>

                            <p>
                                Assign a vehicle and driver to a pending shipment.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="refresh-button"
                        onClick={loadResources}
                        disabled={loading || submitting}
                    >
                        <RefreshCw size={14} />
                        Refresh
                    </button>

                </div>


                {/* =================================================
                    ERROR ALERT
                ================================================= */}

                {error && (
                    <div className="alert error">
                        <AlertCircle size={16} />

                        <span>
                            {error}
                        </span>
                    </div>
                )}


                {/* =================================================
                    SUCCESS ALERT
                ================================================= */}

                {success && (
                    <div className="alert success">
                        <span>
                            {success}
                        </span>
                    </div>
                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="form-card"
                >

                    {/* =================================================
                        SHIPMENT
                    ================================================= */}

                    <section className="form-section">

                        <div className="section-header">

                            <div className="section-icon">
                                <Package size={16} />
                            </div>

                            <div>
                                <h2>
                                    Shipment
                                </h2>

                                <p>
                                    Select a pending shipment
                                </p>
                            </div>

                        </div>


                        <label className="field">

                            <span>
                                Shipment *
                            </span>

                            <select
                                value={shipmentId}
                                onChange={(event) =>
                                    setShipmentId(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    submitting ||
                                    shipments.length === 0
                                }
                            >

                                <option value="">
                                    {shipments.length === 0
                                        ? "No pending shipments available"
                                        : "Select shipment"}
                                </option>


                                {shipments.map(
                                    (shipment) => (
                                        <option
                                            key={shipment.id}
                                            value={shipment.id}
                                        >

                                            {shipment.tracking_number
                                                ? `${shipment.tracking_number} — `
                                                : `Shipment #${shipment.id} — `}

                                            {shipment.origin_city ||
                                                shipment.origin_address ||
                                                "Origin"}

                                            {" → "}

                                            {shipment.destination_city ||
                                                shipment.destination_address ||
                                                "Destination"}

                                        </option>
                                    )
                                )}

                            </select>

                        </label>

                    </section>


                    {/* =================================================
                        VEHICLE
                    ================================================= */}

                    <section className="form-section">

                        <div className="section-header">

                            <div className="section-icon">
                                <Truck size={16} />
                            </div>

                            <div>

                                <h2>
                                    Vehicle
                                </h2>

                                <p>
                                    Select an available vehicle
                                </p>

                            </div>

                        </div>


                        <label className="field">

                            <span>
                                Vehicle *
                            </span>


                            <select
                                value={vehicleId}
                                onChange={(event) =>
                                    setVehicleId(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    submitting ||
                                    vehicles.length === 0
                                }
                            >

                                <option value="">
                                    {vehicles.length === 0
                                        ? "No available vehicles"
                                        : "Select vehicle"}
                                </option>


                                {vehicles.map(
                                    (vehicle) => (
                                        <option
                                            key={vehicle.id}
                                            value={vehicle.id}
                                        >

                                            {vehicle.vehicle_number ||
                                                vehicle.vehicleNumber ||
                                                `Vehicle #${vehicle.id}`}

                                            {" — "}

                                            {vehicle.registration_number ||
                                                vehicle.registrationNumber ||
                                                "No registration"}

                                            {" — "}

                                            {vehicle.vehicle_type ||
                                                vehicle.vehicleType ||
                                                "Vehicle"}

                                        </option>
                                    )
                                )}

                            </select>

                        </label>

                    </section>


                    {/* =================================================
                        DRIVER
                    ================================================= */}

                    <section className="form-section">

                        <div className="section-header">

                            <div className="section-icon">
                                <User size={16} />
                            </div>

                            <div>

                                <h2>
                                    Driver
                                </h2>

                                <p>
                                    Select an available driver
                                </p>

                            </div>

                        </div>


                        <label className="field">

                            <span>
                                Driver *
                            </span>


                            <select
                                value={driverId}
                                onChange={(event) =>
                                    setDriverId(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    submitting ||
                                    drivers.length === 0
                                }
                            >

                                <option value="">
                                    {drivers.length === 0
                                        ? "No available drivers"
                                        : "Select driver"}
                                </option>


                                {drivers.map(
                                    (driver) => {

                                        const firstName =
                                            driver.first_name ||
                                            driver.firstName ||
                                            "";

                                        const lastName =
                                            driver.last_name ||
                                            driver.lastName ||
                                            "";

                                        const name =
                                            `${firstName} ${lastName}`.trim() ||
                                            driver.name ||
                                            "Driver";


                                        return (
                                            <option
                                                key={driver.id}
                                                value={driver.id}
                                            >

                                                {name}

                                                {" — "}

                                                {driver.employee_code ||
                                                    driver.employeeCode ||
                                                    "No employee code"}

                                                {driver.phone
                                                    ? ` — ${driver.phone}`
                                                    : ""}

                                            </option>
                                        );
                                    }
                                )}

                            </select>

                        </label>

                    </section>


                    {/* =================================================
                        AVAILABILITY SUMMARY
                    ================================================= */}

                    <div className="availability-grid">

                        <div className="availability-card">

                            <Package size={15} />

                            <div>
                                <strong>
                                    {shipments.length}
                                </strong>

                                <span>
                                    Pending shipments
                                </span>
                            </div>

                        </div>


                        <div className="availability-card">

                            <Truck size={15} />

                            <div>
                                <strong>
                                    {vehicles.length}
                                </strong>

                                <span>
                                    Available vehicles
                                </span>
                            </div>

                        </div>


                        <div className="availability-card">

                            <User size={15} />

                            <div>
                                <strong>
                                    {drivers.length}
                                </strong>

                                <span>
                                    Available drivers
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/assignments")
                            }
                            disabled={submitting}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="submit-button"
                            disabled={
                                submitting ||
                                shipments.length === 0 ||
                                vehicles.length === 0 ||
                                drivers.length === 0
                            }
                        >

                            {submitting ? (
                                <>
                                    <Loader2
                                        size={14}
                                        className="spin"
                                    />

                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save size={14} />

                                    Create Assignment
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

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

    .assignment-page {
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

    .assignment-container {
        max-width: 900px;
        margin: 0 auto;
    }

    .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 18px;
    }

    .back-button,
    .refresh-button {
        height: 34px;
        padding: 0 11px;
        border-radius: 8px;
        border: 1px solid #263a52;
        background: #0d1a2b;
        color: #94a3b8;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 600;
    }

    .back-button:hover,
    .refresh-button:hover {
        background: #13243a;
        color: #dbe7f4;
    }

    .title-block {
        margin-top: 17px;
    }

    .eyebrow {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #60a5fa;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: .13em;
    }

    .title-block h1 {
        margin: 5px 0 0;
        color: #f8fafc;
        font-size: 23px;
        font-weight: 700;
    }

    .title-block p {
        margin: 5px 0 0;
        color: #71859e;
        font-size: 11px;
    }

    .form-card {
        background: #0b1828;
        border: 1px solid #1b3048;
        border-radius: 13px;
        overflow: hidden;
    }

    .form-section {
        padding: 20px;
        border-bottom: 1px solid #172b42;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
    }

    .section-icon {
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

    .section-header h2 {
        margin: 0;
        color: #f1f5f9;
        font-size: 13px;
        font-weight: 700;
    }

    .section-header p {
        margin: 3px 0 0;
        color: #647890;
        font-size: 10px;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 7px;
    }

    .field > span {
        color: #9aacc0;
        font-size: 10px;
        font-weight: 600;
    }

    .field select {
        width: 100%;
        height: 40px;
        padding: 0 11px;
        border: 1px solid #29415e;
        border-radius: 8px;
        outline: none;
        background: #071321;
        color: #dbe7f4;
        font-size: 11px;
    }

    .field select:focus {
        border-color: #3b82f6;
    }

    .field select:disabled {
        opacity: .55;
        cursor: not-allowed;
    }

    .availability-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 16px 20px;
        background: #091524;
        border-bottom: 1px solid #172b42;
    }

    .availability-card {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 11px;
        border: 1px solid #1b3048;
        border-radius: 9px;
        background: #0b1828;
        color: #60a5fa;
    }

    .availability-card > div {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .availability-card strong {
        color: #f1f5f9;
        font-size: 14px;
    }

    .availability-card span {
        color: #71859e;
        font-size: 9px;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 16px 20px;
        background: #091524;
    }

    .cancel-button,
    .submit-button {
        height: 36px;
        padding: 0 14px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 600;
    }

    .cancel-button {
        border: 1px solid #293e57;
        background: #0d1c2e;
        color: #aebdce;
    }

    .cancel-button:hover {
        background: #162b44;
    }

    .submit-button {
        border: 1px solid #2563eb;
        background: #2563eb;
        color: white;
    }

    .submit-button:hover {
        background: #1d4ed8;
    }

    .submit-button:disabled,
    .cancel-button:disabled,
    .refresh-button:disabled {
        opacity: .5;
        cursor: not-allowed;
    }

    .alert {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 11px 13px;
        margin-bottom: 12px;
        border-radius: 9px;
        font-size: 11px;
    }

    .alert.error {
        color: #fca5a5;
        background: #2b1118;
        border: 1px solid #5a202a;
    }

    .alert.success {
        color: #86efac;
        background: #0b2a19;
        border: 1px solid #176337;
    }

    .loading-screen {
        min-height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #71859e;
        font-size: 12px;
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

    @media (max-width: 650px) {

        .assignment-page {
            padding: 14px;
        }

        .page-header {
            flex-direction: column;
        }

        .refresh-button {
            width: 100%;
            justify-content: center;
        }

        .availability-grid {
            grid-template-columns: 1fr;
        }

        .form-actions {
            flex-direction: column-reverse;
        }

        .cancel-button,
        .submit-button {
            width: 100%;
        }
    }
`;


export default AssignmentForm;