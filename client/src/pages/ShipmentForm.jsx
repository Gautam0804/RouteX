import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    Package,
    Save,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";


// =====================================================
// COMPONENT
// =====================================================

function ShipmentForm() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [loadingCustomers, setLoadingCustomers] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [customers, setCustomers] = useState([]);

    const [formData, setFormData] = useState({
        trackingNumber: "",
        customerId: "",

        originAddress: "",
        originCity: "",

        destinationAddress: "",
        destinationCity: "",

        packageDescription: "",
        packageCount: "1",
        weightKg: "",

        priority: "normal",

        estimatedDeliveryAt: "",
        deliveryNotes: "",
    });


    // =================================================
    // LOAD CUSTOMERS
    // =================================================

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setLoadingCustomers(true);
                setError("");

                const response = await api.get("/customers");

                console.log(
                    "Customers response:",
                    response.data
                );

                const responseData = response.data;

                let customerList = [];

                if (Array.isArray(responseData)) {
                    customerList = responseData;
                } else if (
                    Array.isArray(responseData?.data)
                ) {
                    customerList = responseData.data;
                } else if (
                    Array.isArray(
                        responseData?.data?.customers
                    )
                ) {
                    customerList =
                        responseData.data.customers;
                } else if (
                    Array.isArray(
                        responseData?.customers
                    )
                ) {
                    customerList =
                        responseData.customers;
                }

                setCustomers(customerList);

            } catch (err) {
                console.error(
                    "Load customers error:",
                    err
                );

                setCustomers([]);

                setError(
                    err?.response?.data?.message ||
                    "Failed to load customers"
                );
            } finally {
                setLoadingCustomers(false);
            }
        };

        loadCustomers();
    }, []);


    // =================================================
    // HANDLE INPUT
    // =================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };


    // =================================================
    // VALIDATION
    // =================================================

    const validateForm = () => {
        if (!formData.customerId) {
            return "Please select a customer";
        }

        if (!formData.originAddress.trim()) {
            return "Origin address is required";
        }

        if (!formData.originCity.trim()) {
            return "Origin city is required";
        }

        if (!formData.destinationAddress.trim()) {
            return "Destination address is required";
        }

        if (!formData.destinationCity.trim()) {
            return "Destination city is required";
        }

        if (!formData.packageDescription.trim()) {
            return "Package description is required";
        }

        if (!formData.packageCount) {
            return "Package count is required";
        }

        const packageCount =
            Number(formData.packageCount);

        if (
            !Number.isInteger(packageCount) ||
            packageCount <= 0
        ) {
            return "Package count must be a positive whole number";
        }

        if (formData.weightKg === "") {
            return "Weight is required";
        }

        const weight =
            Number(formData.weightKg);

        if (
            !Number.isFinite(weight) ||
            weight <= 0
        ) {
            return "Weight must be greater than zero";
        }

        if (
            formData.trackingNumber.trim() &&
            formData.trackingNumber.trim().length < 3
        ) {
            return "Tracking number must contain at least 3 characters";
        }

        return "";
    };


    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                trackingNumber:
                    formData.trackingNumber.trim() ||
                    undefined,

                customerId:
                    Number(formData.customerId),

                originAddress:
                    formData.originAddress.trim(),

                originCity:
                    formData.originCity.trim(),

                destinationAddress:
                    formData.destinationAddress.trim(),

                destinationCity:
                    formData.destinationCity.trim(),

                packageDescription:
                    formData.packageDescription.trim(),

                packageCount:
                    Number(formData.packageCount),

                weightKg:
                    Number(formData.weightKg),

                priority:
                    formData.priority,

                estimatedDeliveryAt:
                    formData.estimatedDeliveryAt ||
                    undefined,

                deliveryNotes:
                    formData.deliveryNotes.trim() ||
                    undefined,
            };

            console.log(
                "Creating shipment:",
                payload
            );

            const response = await api.post(
                "/shipments",
                payload
            );

            console.log(
                "Create shipment response:",
                response.data
            );

            if (!response.data?.success) {
                setError(
                    response.data?.message ||
                    "Failed to create shipment"
                );

                return;
            }

            setSuccess(
                "Shipment created successfully"
            );

            setTimeout(() => {
                navigate("/shipments");
            }, 800);

        } catch (err) {
            console.error(
                "Create shipment error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create shipment"
            );
        } finally {
            setLoading(false);
        }
    };


    // =================================================
    // CUSTOMER DISPLAY HELPERS
    // =================================================

    const getCustomerId = (customer) => {
        return (
            customer.id ||
            customer.customer_id
        );
    };

    const getCustomerName = (customer) => {
        return (
            customer.company_name ||
            customer.companyName ||
            customer.name ||
            customer.customer_name ||
            `Customer #${getCustomerId(customer)}`
        );
    };

    const getCustomerContact = (customer) => {
        return (
            customer.contact_person ||
            customer.contactPerson ||
            customer.email ||
            customer.phone ||
            ""
        );
    };


    // =================================================
    // RENDER
    // =================================================

    return (
        <div className="shipment-form-page">

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .shipment-form-page {
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

                .shipment-form-container {
                    width: 100%;
                    max-width: 950px;
                    margin: 0 auto;
                }

                .header-card,
                .form-card {
                    background: #0b1828;
                    border: 1px solid #1b3048;
                    border-radius: 14px;
                }

                .header-card {
                    padding: 20px;
                    margin-bottom: 14px;
                }

                .back-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    border: none;
                    background: transparent;
                    color: #71859e;
                    font-size: 11px;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 18px;
                }

                .back-button:hover {
                    color: #dbe7f4;
                }

                .title-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .title-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #102744;
                    border: 1px solid #1e3a5f;
                    color: #60a5fa;
                    flex-shrink: 0;
                }

                .eyebrow {
                    margin: 0 0 4px;
                    color: #60a5fa;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.16em;
                }

                .page-title {
                    margin: 0;
                    color: #f8fafc;
                    font-size: 22px;
                    font-weight: 700;
                }

                .page-description {
                    margin: 5px 0 0;
                    color: #71859e;
                    font-size: 12px;
                }

                .alert {
                    border-radius: 10px;
                    padding: 12px 14px;
                    margin-bottom: 14px;
                    font-size: 12px;
                }

                .alert.error {
                    color: #fca5a5;
                    background: #35151a;
                    border: 1px solid #65232d;
                }

                .alert.success {
                    color: #86efac;
                    background: #0b3020;
                    border: 1px solid #17623c;
                }

                .form-card {
                    padding: 20px;
                }

                .section {
                    padding-bottom: 22px;
                    margin-bottom: 22px;
                    border-bottom: 1px solid #172b41;
                }

                .section:last-of-type {
                    border-bottom: none;
                    margin-bottom: 0;
                }

                .section-title {
                    margin: 0;
                    color: #f1f5f9;
                    font-size: 14px;
                    font-weight: 700;
                }

                .section-description {
                    margin: 4px 0 0;
                    color: #687d96;
                    font-size: 11px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                    gap: 16px;
                    margin-top: 18px;
                }

                .field.full {
                    grid-column: 1 / -1;
                }

                .field label {
                    display: block;
                    margin-bottom: 7px;
                    color: #9aabbd;
                    font-size: 11px;
                    font-weight: 600;
                }

                .required {
                    color: #60a5fa;
                }

                .input,
                .select,
                .textarea {
                    width: 100%;
                    border: 1px solid #263a52;
                    border-radius: 8px;
                    background: #071321;
                    color: #e5edf7;
                    outline: none;
                    font-family: inherit;
                    font-size: 12px;
                }

                .input,
                .select {
                    height: 40px;
                    padding: 0 11px;
                }

                .textarea {
                    min-height: 90px;
                    padding: 10px 11px;
                    resize: vertical;
                }

                .input::placeholder,
                .textarea::placeholder {
                    color: #53677e;
                }

                .input:focus,
                .select:focus,
                .textarea:focus {
                    border-color: #3b82f6;
                    box-shadow:
                        0 0 0 2px
                        rgba(59, 130, 246, 0.08);
                }

                .input:disabled,
                .select:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .help-text {
                    margin: 5px 0 0;
                    color: #52667e;
                    font-size: 10px;
                }

                .actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    padding-top: 20px;
                }

                .button {
                    min-height: 38px;
                    padding: 0 15px;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .button.cancel {
                    border: 1px solid #293e57;
                    background: #091524;
                    color: #9aabbd;
                }

                .button.cancel:hover {
                    background: #12243a;
                    color: #e5edf7;
                }

                .button.submit {
                    border: 1px solid #2563eb;
                    background: #2563eb;
                    color: white;
                }

                .button.submit:hover {
                    background: #1d4ed8;
                }

                .button:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .loading-text {
                    color: #71859e;
                    font-size: 11px;
                    padding: 10px 0;
                }

                @media (max-width: 700px) {
                    .shipment-form-page {
                        padding: 14px;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .field.full {
                        grid-column: auto;
                    }

                    .actions {
                        flex-direction: column-reverse;
                    }

                    .button {
                        width: 100%;
                    }
                }

            `}</style>


            <div className="shipment-form-container">

                {/* =========================================
                    HEADER
                ========================================= */}

                <section className="header-card">

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            navigate("/shipments")
                        }
                    >
                        <ArrowLeft size={14} />
                        Back to Shipments
                    </button>


                    <div className="title-row">

                        <div className="title-icon">
                            <Package size={20} />
                        </div>

                        <div>

                            <p className="eyebrow">
                                ROUTEX / SHIPMENTS
                            </p>

                            <h1 className="page-title">
                                Create Shipment
                            </h1>

                            <p className="page-description">
                                Create a new shipment for fleet operations.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (
                    <div className="alert error">
                        {error}
                    </div>
                )}


                {/* =========================================
                    SUCCESS
                ========================================= */}

                {success && (
                    <div className="alert success">
                        {success}
                    </div>
                )}


                {/* =========================================
                    FORM
                ========================================= */}

                <form
                    className="form-card"
                    onSubmit={handleSubmit}
                >

                    {/* =====================================
                        SHIPMENT INFORMATION
                    ===================================== */}

                    <section className="section">

                        <h2 className="section-title">
                            Shipment Information
                        </h2>

                        <p className="section-description">
                            Enter the basic shipment information.
                        </p>


                        <div className="form-grid">

                            {/* TRACKING NUMBER */}

                            <div className="field">

                                <label>
                                    Tracking Number
                                </label>

                                <input
                                    className="input"
                                    type="text"
                                    name="trackingNumber"
                                    value={
                                        formData.trackingNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="RTX-10001"
                                    disabled={loading}
                                />

                                <p className="help-text">
                                    Leave empty if you want to
                                    generate it later.
                                </p>

                            </div>


                            {/* CUSTOMER */}

                            <div className="field">

                                <label>
                                    Customer{" "}
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <select
                                    className="select"
                                    name="customerId"
                                    value={
                                        formData.customerId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loading ||
                                        loadingCustomers
                                    }
                                >

                                    <option value="">
                                        {loadingCustomers
                                            ? "Loading customers..."
                                            : "Select customer"}
                                    </option>

                                    {customers.map(
                                        (customer) => {

                                            const id =
                                                getCustomerId(
                                                    customer
                                                );

                                            return (
                                                <option
                                                    key={id}
                                                    value={id}
                                                >
                                                    {getCustomerName(
                                                        customer
                                                    )}
                                                    {getCustomerContact(
                                                        customer
                                                    )
                                                        ? ` — ${getCustomerContact(
                                                              customer
                                                          )}`
                                                        : ""}
                                                </option>
                                            );
                                        }
                                    )}

                                </select>

                                {!loadingCustomers &&
                                    customers.length === 0 && (
                                        <p className="help-text">
                                            No customers available.
                                        </p>
                                    )}

                            </div>


                            {/* PRIORITY */}

                            <div className="field">

                                <label>
                                    Priority
                                </label>

                                <select
                                    className="select"
                                    name="priority"
                                    value={
                                        formData.priority
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                >

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

                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        ROUTE INFORMATION
                    ===================================== */}

                    <section className="section">

                        <h2 className="section-title">
                            Route Information
                        </h2>

                        <p className="section-description">
                            Enter the shipment pickup and destination.
                        </p>


                        <div className="form-grid">

                            {/* ORIGIN ADDRESS */}

                            <div className="field">

                                <label>
                                    Origin Address{" "}
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    className="input"
                                    type="text"
                                    name="originAddress"
                                    value={
                                        formData.originAddress
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Warehouse, Sector 18"
                                    disabled={loading}
                                />

                            </div>


                            {/* ORIGIN CITY */}

                            <div className="field">

                                <label>
                                    Origin City{" "}
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    className="input"
                                    type="text"
                                    name="originCity"
                                    value={
                                        formData.originCity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="New Delhi"
                                    disabled={loading}
                                />

                            </div>


                            {/* DESTINATION ADDRESS */}

                            <div className="field">

                                <label>
                                    Destination Address{" "}
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    className="input"
                                    type="text"
                                    name="destinationAddress"
                                    value={
                                        formData.destinationAddress
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Distribution Center"
                                    disabled={loading}
                                />

                            </div>


                            {/* DESTINATION CITY */}

                            <div className="field">

                                <label>
                                    Destination City{" "}
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    className="input"
                                    type="text"
                                    name="destinationCity"
                                    value={
                                        formData.destinationCity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Mumbai"
                                    disabled={loading}
                                />

                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        PACKAGE INFORMATION
                    ===================================== */}

                    <section className="section">

                        <h2 className="section-title">
                            Package Information
                        </h2>

                        <p className="section-description">
                            Enter package size and weight.
                        </p>


                        <div className="form-grid">

                            {/* DESCRIPTION */}

                            <div className="field full">

                                <label>
                                    Package Description{" "}
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    className="input"
                                    type="text"
                                    name="packageDescription"
                                    value={
                                        formData.packageDescription
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Electronics, machinery parts, documents..."
                                    disabled={loading}
                                />

                            </div>


                            {/* PACKAGE COUNT */}

                            <div className="field">

                                <label>
                                    Package Count{" "}
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    className="input"
                                    type="number"
                                    name="packageCount"
                                    value={
                                        formData.packageCount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                    step="1"
                                    disabled={loading}
                                />

                            </div>


                            {/* WEIGHT */}

                            <div className="field">

                                <label>
                                    Weight (kg){" "}
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    className="input"
                                    type="number"
                                    name="weightKg"
                                    value={
                                        formData.weightKg
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0.01"
                                    step="0.01"
                                    placeholder="10.50"
                                    disabled={loading}
                                />

                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        DELIVERY INFORMATION
                    ===================================== */}

                    <section className="section">

                        <h2 className="section-title">
                            Delivery Information
                        </h2>

                        <p className="section-description">
                            Optional delivery planning details.
                        </p>


                        <div className="form-grid">

                            {/* ESTIMATED DELIVERY */}

                            <div className="field">

                                <label>
                                    Estimated Delivery
                                </label>

                                <input
                                    className="input"
                                    type="datetime-local"
                                    name="estimatedDeliveryAt"
                                    value={
                                        formData.estimatedDeliveryAt
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={loading}
                                />

                            </div>


                            {/* NOTES */}

                            <div className="field">

                                <label>
                                    Delivery Notes
                                </label>

                                <textarea
                                    className="textarea"
                                    name="deliveryNotes"
                                    value={
                                        formData.deliveryNotes
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Special handling or delivery instructions..."
                                    disabled={loading}
                                />

                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        ACTIONS
                    ===================================== */}

                    <div className="actions">

                        <button
                            type="button"
                            className="button cancel"
                            onClick={() =>
                                navigate("/shipments")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="button submit"
                            disabled={
                                loading ||
                                loadingCustomers
                            }
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    Create Shipment
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default ShipmentForm;