import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Save,
    Truck,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    createVehicle,
    getVehicleById,
    updateVehicle,
} from "../services/vehicleService";


function VehicleForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);


    // =====================================================
    // FORM STATE
    // =====================================================

    const [form, setForm] = useState({

        vehicleNumber: "",
        registrationNumber: "",
        vehicleType: "",
        manufacturer: "",
        model: "",
        manufactureYear: "",
        capacityKg: "",
        fuelType: "diesel",
        status: "available",
        currentLatitude: "",
        currentLongitude: "",
        odometerKm: "",
        lastServiceDate: "",

    });


    const [loading, setLoading] =
        useState(isEdit);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD VEHICLE FOR EDIT
    // =====================================================

    useEffect(() => {

        if (!isEdit) {
            return;
        }


        const loadVehicle = async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await getVehicleById(id);


                if (!response.success) {

                    setError(
                        response.message ||
                        "Unable to load vehicle"
                    );

                    return;

                }


                const vehicle =
                    response.data;


                setForm({

                    vehicleNumber:
                        vehicle.vehicle_number ||
                        vehicle.vehicleNumber ||
                        "",

                    registrationNumber:
                        vehicle.registration_number ||
                        vehicle.registrationNumber ||
                        "",

                    vehicleType:
                        vehicle.vehicle_type ||
                        vehicle.vehicleType ||
                        "",

                    manufacturer:
                        vehicle.manufacturer ||
                        "",

                    model:
                        vehicle.model ||
                        "",

                    manufactureYear:
                        vehicle.manufacture_year ||
                        vehicle.manufactureYear ||
                        "",

                    capacityKg:
                        vehicle.capacity_kg ||
                        vehicle.capacityKg ||
                        "",

                    fuelType:
                        vehicle.fuel_type ||
                        vehicle.fuelType ||
                        "diesel",

                    status:
                        vehicle.status ||
                        "available",

                    currentLatitude:
                        vehicle.current_latitude ??
                        vehicle.currentLatitude ??
                        "",

                    currentLongitude:
                        vehicle.current_longitude ??
                        vehicle.currentLongitude ??
                        "",

                    odometerKm:
                        vehicle.odometer_km ??
                        vehicle.odometerKm ??
                        "",

                    lastServiceDate:
                        vehicle.last_service_date
                            ? String(
                                vehicle.last_service_date
                            ).slice(0, 10)
                            : "",

                });

            } catch (err) {

                console.error(
                    "Load vehicle error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load vehicle"
                );

            } finally {

                setLoading(false);

            }

        };


        loadVehicle();

    }, [id, isEdit]);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setForm((previous) => ({

            ...previous,

            [name]: value,

        }));

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // -------------------------------------------------
        // REQUIRED VALIDATION
        // -------------------------------------------------

        if (
            !form.vehicleNumber.trim() ||
            !form.registrationNumber.trim() ||
            !form.vehicleType.trim()
        ) {

            setError(
                "Vehicle number, registration number and vehicle type are required."
            );

            return;

        }


        // -------------------------------------------------
        // CAPACITY VALIDATION
        // -------------------------------------------------

        if (
            form.capacityKg !== "" &&
            Number(form.capacityKg) < 0
        ) {

            setError(
                "Capacity cannot be negative."
            );

            return;

        }


        try {

            setSaving(true);


            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                vehicleNumber:
                    form.vehicleNumber.trim(),

                registrationNumber:
                    form.registrationNumber.trim(),

                vehicleType:
                    form.vehicleType.trim(),

                manufacturer:
                    form.manufacturer.trim() ||
                    null,

                model:
                    form.model.trim() ||
                    null,

                manufactureYear:
                    form.manufactureYear
                        ? Number(
                            form.manufactureYear
                        )
                        : null,

                capacityKg:
                    form.capacityKg !== ""
                        ? Number(
                            form.capacityKg
                        )
                        : null,

                fuelType:
                    form.fuelType,

                status:
                    form.status,

                currentLatitude:
                    form.currentLatitude !== ""
                        ? Number(
                            form.currentLatitude
                        )
                        : null,

                currentLongitude:
                    form.currentLongitude !== ""
                        ? Number(
                            form.currentLongitude
                        )
                        : null,

                odometerKm:
                    form.odometerKm !== ""
                        ? Number(
                            form.odometerKm
                        )
                        : null,

                lastServiceDate:
                    form.lastServiceDate ||
                    null,

            };


            let response;


            if (isEdit) {

                response =
                    await updateVehicle(
                        id,
                        payload
                    );

            } else {

                response =
                    await createVehicle(
                        payload
                    );

            }


            // =================================================
            // API ERROR
            // =================================================

            if (!response.success) {

                setError(
                    response.message ||
                    "Unable to save vehicle"
                );

                return;

            }


            // =================================================
            // SUCCESS
            // =================================================

            navigate(
                "/vehicles",
                {
                    replace: true,
                }
            );

        } catch (err) {

            console.error(
                "Save vehicle error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to save vehicle"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="flex min-h-[400px] items-center justify-center">

                <p className="text-xs text-slate-500">

                    Loading vehicle...

                </p>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="mx-auto max-w-5xl space-y-5">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/vehicles"
                            )
                        }
                        className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-500 transition hover:border-slate-700 hover:text-white"
                    >

                        <ArrowLeft
                            size={16}
                        />

                    </button>


                    <div>

                        <div className="flex items-center gap-2">

                            <Truck
                                size={15}
                                className="text-blue-400"
                            />

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">

                                ROUTEX / FLEET

                            </p>

                        </div>


                        <h1 className="mt-2 text-2xl font-semibold text-white">

                            {isEdit
                                ? "Edit Vehicle"
                                : "New Vehicle"}

                        </h1>


                        <p className="mt-1 text-xs text-slate-500">

                            {isEdit
                                ? "Update vehicle information."
                                : "Add a new vehicle to the fleet."}

                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                    <p className="text-xs text-red-400">

                        {error}

                    </p>

                </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >


                {/* =================================================
                    VEHICLE INFORMATION
                ================================================= */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="mb-5">

                        <h2 className="text-sm font-semibold text-white">

                            Vehicle Information

                        </h2>

                        <p className="mt-1 text-[11px] text-slate-600">

                            Basic identification and vehicle details.

                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                        <Input
                            label="Vehicle Number"
                            name="vehicleNumber"
                            value={
                                form.vehicleNumber
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="TRUCK-001"
                            required
                        />


                        <Input
                            label="Registration Number"
                            name="registrationNumber"
                            value={
                                form.registrationNumber
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="DL01AB1234"
                            required
                        />


                        <Input
                            label="Vehicle Type"
                            name="vehicleType"
                            value={
                                form.vehicleType
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Truck"
                            required
                        />


                        <Input
                            label="Manufacturer"
                            name="manufacturer"
                            value={
                                form.manufacturer
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Tata"
                        />


                        <Input
                            label="Model"
                            name="model"
                            value={
                                form.model
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Prima"
                        />


                        <Input
                            label="Manufacture Year"
                            name="manufactureYear"
                            type="number"
                            value={
                                form.manufactureYear
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="2025"
                            min="1900"
                        />


                        <Input
                            label="Capacity (kg)"
                            name="capacityKg"
                            type="number"
                            value={
                                form.capacityKg
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="5000"
                            min="0"
                        />


                        {/* FUEL TYPE */}

                        <Select
                            label="Fuel Type"
                            name="fuelType"
                            value={
                                form.fuelType
                            }
                            onChange={
                                handleChange
                            }
                            options={[
                                [
                                    "diesel",
                                    "Diesel",
                                ],
                                [
                                    "petrol",
                                    "Petrol",
                                ],
                                [
                                    "cng",
                                    "CNG",
                                ],
                                [
                                    "electric",
                                    "Electric",
                                ],
                                [
                                    "hybrid",
                                    "Hybrid",
                                ],
                            ]}
                        />

                    </div>

                </section>


                {/* =================================================
                    STATUS
                ================================================= */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="mb-5">

                        <h2 className="text-sm font-semibold text-white">

                            Fleet Status

                        </h2>

                        <p className="mt-1 text-[11px] text-slate-600">

                            Current operational state and vehicle telemetry.

                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                        <Select
                            label="Status"
                            name="status"
                            value={
                                form.status
                            }
                            onChange={
                                handleChange
                            }
                            options={[
                                [
                                    "available",
                                    "Available",
                                ],
                                [
                                    "in_transit",
                                    "In Transit",
                                ],
                                [
                                    "maintenance",
                                    "Maintenance",
                                ],
                                [
                                    "inactive",
                                    "Inactive",
                                ],
                            ]}
                        />


                        <Input
                            label="Odometer (km)"
                            name="odometerKm"
                            type="number"
                            value={
                                form.odometerKm
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="25000"
                            min="0"
                        />


                        <Input
                            label="Current Latitude"
                            name="currentLatitude"
                            type="number"
                            step="any"
                            value={
                                form.currentLatitude
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="28.6139"
                        />


                        <Input
                            label="Current Longitude"
                            name="currentLongitude"
                            type="number"
                            step="any"
                            value={
                                form.currentLongitude
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="77.2090"
                        />


                        <Input
                            label="Last Service Date"
                            name="lastServiceDate"
                            type="date"
                            value={
                                form.lastServiceDate
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>

                </section>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <section className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/vehicles"
                            )
                        }
                        className="rounded-lg border border-slate-800 bg-slate-950 px-5 py-3 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-white"
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <Save size={14} />

                        {saving
                            ? "Saving..."
                            : isEdit
                                ? "Update Vehicle"
                                : "Create Vehicle"}

                    </button>

                </section>

            </form>

        </div>

    );

}


// =====================================================
// INPUT
// =====================================================

function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    min,
    step,
}) {

    return (

        <div>

            <label
                htmlFor={name}
                className="mb-2 block text-[11px] font-medium text-slate-400"
            >

                {label}

                {required && (

                    <span className="ml-1 text-red-400">
                        *
                    </span>

                )}

            </label>


            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                step={step}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 transition focus:border-blue-500"
            />

        </div>

    );

}


// =====================================================
// SELECT
// =====================================================

function Select({
    label,
    name,
    value,
    onChange,
    options,
}) {

    return (

        <div>

            <label
                htmlFor={name}
                className="mb-2 block text-[11px] font-medium text-slate-400"
            >

                {label}

            </label>


            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none transition focus:border-blue-500"
            >

                {options.map(
                    ([value, label]) => (

                        <option
                            key={value}
                            value={value}
                        >
                            {label}
                        </option>

                    )
                )}

            </select>

        </div>

    );

}


export default VehicleForm;