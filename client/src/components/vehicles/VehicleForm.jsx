import { useState } from "react";
import {
    ArrowLeft,
    Truck,
    Save,
    Loader2,
} from "lucide-react";

import {
    createVehicle,
    updateVehicle,
} from "../api/vehicleApi";

import { useNavigate } from "react-router-dom";


function VehicleForm({
    vehicle = null,
    onSuccess,
}) {

    const navigate =
        useNavigate();


    const isEdit =
        Boolean(vehicle);


    const [form, setForm] =
        useState({

            vehicleNumber:
                vehicle?.vehicle_number || "",

            registrationNumber:
                vehicle?.registration_number || "",

            vehicleType:
                vehicle?.vehicle_type || "",

            manufacturer:
                vehicle?.manufacturer || "",

            model:
                vehicle?.model || "",

            manufactureYear:
                vehicle?.manufacture_year || "",

            capacityKg:
                vehicle?.capacity_kg || "",

            fuelType:
                vehicle?.fuel_type || "diesel",

            status:
                vehicle?.status || "available",

            currentLatitude:
                vehicle?.current_latitude || "",

            currentLongitude:
                vehicle?.current_longitude || "",

            odometerKm:
                vehicle?.odometer_km || "0",

            lastServiceDate:
                vehicle?.last_service_date
                    ? vehicle.last_service_date.slice(
                        0,
                        10
                    )
                    : "",

        });


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // ==========================================
    // CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setError("");
            setSuccess("");
            setLoading(true);


            try {

                const payload = {

                    vehicleNumber:
                        form.vehicleNumber.trim(),

                    registrationNumber:
                        form.registrationNumber.trim(),

                    vehicleType:
                        form.vehicleType.trim(),

                    manufacturer:
                        form.manufacturer.trim(),

                    model:
                        form.model.trim(),

                    manufactureYear:
                        form.manufactureYear
                            ? Number(
                                form.manufactureYear
                            )
                            : null,

                    capacityKg:
                        form.capacityKg
                            ? Number(
                                form.capacityKg
                            )
                            : null,

                    fuelType:
                        form.fuelType,

                    status:
                        form.status,

                    currentLatitude:
                        form.currentLatitude
                            ? Number(
                                form.currentLatitude
                            )
                            : null,

                    currentLongitude:
                        form.currentLongitude
                            ? Number(
                                form.currentLongitude
                            )
                            : null,

                    odometerKm:
                        form.odometerKm
                            ? Number(
                                form.odometerKm
                            )
                            : 0,

                    lastServiceDate:
                        form.lastServiceDate ||
                        null,

                };


                let response;


                if (isEdit) {

                    response =
                        await updateVehicle(
                            vehicle.id,
                            payload
                        );

                } else {

                    response =
                        await createVehicle(
                            payload
                        );

                }


                setSuccess(
                    response.message ||
                    (
                        isEdit
                            ? "Vehicle updated successfully"
                            : "Vehicle created successfully"
                    )
                );


                if (onSuccess) {

                    onSuccess(
                        response.data
                    );

                }


                setTimeout(
                    () => {

                        navigate(
                            "/vehicles"
                        );

                    },
                    700
                );


            } catch (err) {

                setError(
                    err.message ||
                    "Unable to save vehicle"
                );

            } finally {

                setLoading(false);

            }

        };


    return (

        <div className="mx-auto max-w-5xl space-y-6">


            {/* HEADER */}

            <div className="flex items-start gap-4">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/vehicles"
                        )
                    }
                    className="
                        mt-1
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-800
                        bg-slate-900
                        text-slate-400
                        transition
                        hover:border-slate-700
                        hover:bg-slate-800
                        hover:text-white
                    "
                >

                    <ArrowLeft size={16} />

                </button>


                <div>

                    <p className="text-[10px] uppercase tracking-widest text-blue-400">
                        ROUTEX / FLEET
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold text-white">
                        {isEdit
                            ? "Edit Vehicle"
                            : "Add Vehicle"}
                    </h1>

                    <p className="mt-1 text-xs text-slate-500">
                        {isEdit
                            ? "Update vehicle information and operational status."
                            : "Register a new vehicle in your fleet."}
                    </p>

                </div>

            </div>


            {/* ALERTS */}

            {error && (

                <div className="
                    rounded-lg
                    border
                    border-red-900/60
                    bg-red-950/30
                    px-4
                    py-3
                    text-xs
                    text-red-400
                ">

                    {error}

                </div>

            )}


            {success && (

                <div className="
                    rounded-lg
                    border
                    border-emerald-900/60
                    bg-emerald-950/30
                    px-4
                    py-3
                    text-xs
                    text-emerald-400
                ">

                    {success}

                </div>

            )}


            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >


                {/* BASIC INFORMATION */}

                <Section
                    icon={Truck}
                    title="Vehicle Information"
                    description="Basic identification details"
                >

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
                            placeholder="TRK-1001"
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
                            placeholder="Heavy Truck"
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
                            placeholder="2024"
                        />

                    </div>

                </Section>


                {/* CAPACITY */}

                <Section
                    title="Capacity & Fuel"
                    description="Vehicle operating specifications"
                >

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <Input
                            label="Capacity (kg)"
                            name="capacityKg"
                            type="number"
                            step="0.01"
                            value={
                                form.capacityKg
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="15000"
                        />


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
                                ["diesel", "Diesel"],
                                ["petrol", "Petrol"],
                                ["cng", "CNG"],
                                ["electric", "Electric"],
                                ["hybrid", "Hybrid"],
                            ]}
                        />


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
                                ["available", "Available"],
                                ["in_transit", "In Transit"],
                                ["maintenance", "Maintenance"],
                                ["inactive", "Inactive"],
                            ]}
                        />

                    </div>

                </Section>


                {/* LOCATION */}

                <Section
                    title="Current Location"
                    description="Latest vehicle coordinates"
                >

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <Input
                            label="Latitude"
                            name="currentLatitude"
                            type="number"
                            step="0.0000001"
                            value={
                                form.currentLatitude
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="28.6139000"
                        />


                        <Input
                            label="Longitude"
                            name="currentLongitude"
                            type="number"
                            step="0.0000001"
                            value={
                                form.currentLongitude
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="77.2090000"
                        />


                        <Input
                            label="Odometer (km)"
                            name="odometerKm"
                            type="number"
                            step="0.01"
                            value={
                                form.odometerKm
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="12500"
                        />

                    </div>

                </Section>


                {/* SERVICE */}

                <Section
                    title="Maintenance"
                    description="Vehicle service information"
                >

                    <div className="max-w-sm">

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

                </Section>


                {/* ACTIONS */}

                <div className="
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-slate-800
                    pt-5
                    sm:flex-row
                    sm:justify-end
                ">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/vehicles"
                            )
                        }
                        className="
                            rounded-lg
                            border
                            border-slate-800
                            px-5
                            py-2.5
                            text-xs
                            text-slate-400
                            transition
                            hover:bg-slate-900
                            hover:text-white
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-xs
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-500
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {loading ? (

                            <Loader2
                                size={14}
                                className="animate-spin"
                            />

                        ) : (

                            <Save size={14} />

                        )}

                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Vehicle"
                                : "Create Vehicle"}

                    </button>

                </div>

            </form>

        </div>

    );

}


// ==========================================
// SECTION
// ==========================================

function Section({
    icon: Icon,
    title,
    description,
    children,
}) {

    return (

        <section className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            p-5
        ">

            <div className="mb-5 flex items-start gap-3">

                {Icon && (

                    <div className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-500/10
                    ">

                        <Icon
                            size={16}
                            className="text-blue-400"
                        />

                    </div>

                )}

                <div>

                    <h2 className="text-sm font-semibold text-white">
                        {title}
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-600">
                        {description}
                    </p>

                </div>

            </div>

            {children}

        </section>

    );

}


// ==========================================
// INPUT
// ==========================================

function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
    step,
}) {

    return (

        <div>

            <label className="
                mb-1.5
                block
                text-[10px]
                font-medium
                text-slate-500
            ">

                {label}

                {required && (
                    <span className="ml-1 text-red-400">
                        *
                    </span>
                )}

            </label>


            <input
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                required={required}
                step={step}
                className="
                    w-full
                    rounded-lg
                    border
                    border-slate-800
                    bg-slate-950
                    px-3
                    py-2.5
                    text-xs
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-700
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500/20
                "
            />

        </div>

    );

}


// ==========================================
// SELECT
// ==========================================

function Select({
    label,
    name,
    value,
    onChange,
    options,
}) {

    return (

        <div>

            <label className="
                mb-1.5
                block
                text-[10px]
                font-medium
                text-slate-500
            ">

                {label}

            </label>


            <select
                name={name}
                value={value}
                onChange={onChange}
                className="
                    w-full
                    rounded-lg
                    border
                    border-slate-800
                    bg-slate-950
                    px-3
                    py-2.5
                    text-xs
                    text-white
                    outline-none
                    focus:border-blue-500
                "
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