import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Save,
    UserRound,
    Loader2,
} from "lucide-react";

import {
    createDriver,
    getDriver,
    updateDriver,
} from "../services/api";

import {
    useNavigate,
    useParams,
} from "react-router-dom";


function DriverForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);


    const [form, setForm] = useState({
        employeeCode: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        licenseNumber: "",
        licenseExpiryDate: "",
        experienceYears: "",
        status: "available",
    });


    const [loading, setLoading] =
        useState(isEditMode);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // LOAD DRIVER FOR EDIT
    // ==========================================

    useEffect(() => {

        if (!isEditMode) {
            return;
        }


        const loadDriver = async () => {

            try {

                setLoading(true);
                setError("");


                const result =
                    await getDriver(id);


                const driver =
                    result.data;


                setForm({

                    employeeCode:
                        driver.employeeCode || "",

                    firstName:
                        driver.firstName || "",

                    lastName:
                        driver.lastName || "",

                    phone:
                        driver.phone || "",

                    email:
                        driver.email || "",

                    licenseNumber:
                        driver.licenseNumber || "",

                    licenseExpiryDate:
                        driver.licenseExpiryDate
                            ? driver.licenseExpiryDate
                                .split("T")[0]
                            : "",

                    experienceYears:
                        driver.experienceYears ?? "",

                    status:
                        driver.status || "available",

                });

            } catch (error) {

                console.error(error);

                setError(
                    error.message ||
                    "Failed to load driver"
                );

            } finally {

                setLoading(false);

            }

        };


        loadDriver();

    }, [id, isEditMode]);


    // ==========================================
    // INPUT CHANGE
    // ==========================================

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


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");
        setSuccess("");


        // Basic frontend validation

        if (
            !form.employeeCode.trim() ||
            !form.firstName.trim() ||
            !form.lastName.trim() ||
            !form.phone.trim() ||
            !form.licenseNumber.trim() ||
            !form.licenseExpiryDate
        ) {

            setError(
                "Please fill all required fields."
            );

            return;

        }


        try {

            setSaving(true);


            const payload = {

                employeeCode:
                    form.employeeCode.trim(),

                firstName:
                    form.firstName.trim(),

                lastName:
                    form.lastName.trim(),

                phone:
                    form.phone.trim(),

                email:
                    form.email.trim()
                        ? form.email.trim()
                        : null,

                licenseNumber:
                    form.licenseNumber.trim(),

                licenseExpiryDate:
                    form.licenseExpiryDate,

                experienceYears:
                    Number(
                        form.experienceYears || 0
                    ),

                status:
                    form.status,

            };


            if (isEditMode) {

                await updateDriver(
                    id,
                    payload
                );

                setSuccess(
                    "Driver updated successfully."
                );

            } else {

                await createDriver(
                    payload
                );

                setSuccess(
                    "Driver created successfully."
                );

            }


            // Return to drivers list

            setTimeout(() => {

                navigate("/drivers");

            }, 700);

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Failed to save driver"
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING EDIT DRIVER
    // ==========================================

    if (loading) {

        return (

            <div className="flex min-h-[400px] items-center justify-center">

                <div className="flex items-center gap-3 text-xs text-slate-500">

                    <Loader2
                        size={16}
                        className="animate-spin"
                    />

                    Loading driver...

                </div>

            </div>

        );

    }


    return (

        <div className="mx-auto max-w-4xl space-y-6">


            {/* HEADER */}

            <div className="flex items-center gap-4">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/drivers")
                    }
                    className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                >

                    <ArrowLeft size={16} />

                </button>


                <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Operations / Drivers
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold text-white">

                        {isEditMode
                            ? "Edit Driver"
                            : "Add Driver"}

                    </h1>

                    <p className="mt-1 text-xs text-slate-500">

                        {isEditMode
                            ? "Update driver information and status."
                            : "Add a new driver to your fleet."}

                    </p>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-xs text-red-400">

                    {error}

                </div>

            )}


            {/* SUCCESS */}

            {success && (

                <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-400">

                    {success}

                </div>

            )}


            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
            >


                {/* SECTION HEADER */}

                <div className="border-b border-slate-800 px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">

                            <UserRound
                                size={17}
                                className="text-blue-400"
                            />

                        </div>

                        <div>

                            <h2 className="text-sm font-semibold text-white">
                                Driver Information
                            </h2>

                            <p className="mt-1 text-[10px] text-slate-600">
                                Enter the driver's basic information.
                            </p>

                        </div>

                    </div>

                </div>


                {/* FIELDS */}

                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">


                    <Input
                        label="Employee Code"
                        name="employeeCode"
                        value={form.employeeCode}
                        onChange={handleChange}
                        placeholder="DRV-001"
                        required
                    />


                    <Input
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91-9876543210"
                        required
                    />


                    <Input
                        label="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Rahul"
                        required
                    />


                    <Input
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Sharma"
                        required
                    />


                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="rahul@routex.com"
                    />


                    <Input
                        label="License Number"
                        name="licenseNumber"
                        value={form.licenseNumber}
                        onChange={handleChange}
                        placeholder="DL-142025001"
                        required
                    />


                    <Input
                        label="License Expiry Date"
                        name="licenseExpiryDate"
                        type="date"
                        value={form.licenseExpiryDate}
                        onChange={handleChange}
                        required
                    />


                    <Input
                        label="Experience (Years)"
                        name="experienceYears"
                        type="number"
                        min="0"
                        step="0.1"
                        value={form.experienceYears}
                        onChange={handleChange}
                        placeholder="5.5"
                    />


                    {/* STATUS */}

                    <div className="md:col-span-2">

                        <label className="text-[10px] font-medium text-slate-500">

                            Status

                        </label>


                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none transition focus:border-blue-500"
                        >

                            <option value="available">
                                Available
                            </option>

                            <option value="on_trip">
                                On Trip
                            </option>

                            <option value="off_duty">
                                Off Duty
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>

                </div>


                {/* FOOTER */}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-800 bg-slate-950/40 px-6 py-4 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/drivers")
                        }
                        className="rounded-lg border border-slate-800 px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {saving ? (

                            <Loader2
                                size={14}
                                className="animate-spin"
                            />

                        ) : (

                            <Save size={14} />

                        )}


                        {saving
                            ? "Saving..."
                            : isEditMode
                            ? "Update Driver"
                            : "Create Driver"}

                    </button>

                </div>

            </form>

        </div>

    );

}


// ==========================================
// INPUT COMPONENT
// ==========================================

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

            <label className="text-[10px] font-medium text-slate-500">

                {label}

                {required && (
                    <span className="ml-1 text-red-400">
                        *
                    </span>
                )}

            </label>


            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                step={step}
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500"
            />

        </div>

    );

}


export default DriverForm;