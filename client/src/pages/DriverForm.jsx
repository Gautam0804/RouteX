import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Save,
    UserRound,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    createDriver,
    getDriverById,
    updateDriver,
} from "../services/api";


function DriverForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);


    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        employee_code: "",
        phone: "",
        email: "",
        license_number: "",
        license_expiry_date: "",
        experience_years: "",
        rating: "",
        status: "available",
    });


    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEdit);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD DRIVER
    // =====================================================

    useEffect(() => {

        if (!isEdit) {
            return;
        }


        const loadDriver = async () => {

            try {

                setPageLoading(true);
                setError("");


                const response = await getDriverById(id);

                console.log("GET DRIVER RESPONSE:", response);


                const driver =
                    response?.data ||
                    response?.driver ||
                    response;


                if (!driver) {
                    throw new Error("Driver data not found");
                }


                setFormData({

                    first_name:
                        driver.first_name ??
                        driver.firstName ??
                        "",

                    last_name:
                        driver.last_name ??
                        driver.lastName ??
                        "",

                    employee_code:
                        driver.employee_code ??
                        driver.employeeCode ??
                        "",

                    phone:
                        driver.phone ??
                        "",

                    email:
                        driver.email ??
                        "",

                    license_number:
                        driver.license_number ??
                        driver.licenseNumber ??
                        "",

                    license_expiry_date:
                        driver.license_expiry_date
                            ? String(driver.license_expiry_date).slice(0, 10)
                            : driver.licenseExpiryDate
                                ? String(driver.licenseExpiryDate).slice(0, 10)
                                : "",

                    experience_years:
                        driver.experience_years ??
                        driver.experienceYears ??
                        "",

                    rating:
                        driver.rating ??
                        "",

                    status:
                        driver.status ??
                        "available",
                });


            } catch (err) {

                console.error("LOAD DRIVER ERROR:", err);

                setError(
                    err?.message ||
                    "Failed to load driver"
                );

            } finally {

                setPageLoading(false);

            }

        };


        loadDriver();

    }, [id, isEdit]);


    // =====================================================
    // INPUT HANDLER
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);


        try {

            // =================================================
            // BUILD PAYLOAD
            // =================================================

            const payload = {

                first_name:
                    formData.first_name.trim(),

                last_name:
                    formData.last_name.trim(),

                employee_code:
                    formData.employee_code.trim(),

                phone:
                    formData.phone.trim(),

                email:
                    formData.email.trim(),

                license_number:
                    formData.license_number.trim(),

                license_expiry_date:
                    formData.license_expiry_date ||
                    null,

                experience_years:
                    formData.experience_years === ""
                        ? 0
                        : Number(formData.experience_years),

                rating:
                    formData.rating === ""
                        ? 0
                        : Number(formData.rating),

                status:
                    formData.status,
            };


            console.log("DRIVER UPDATE PAYLOAD:", payload);


            // =================================================
            // UPDATE
            // =================================================

            if (isEdit) {

                const response =
                    await updateDriver(
                        id,
                        payload
                    );

                console.log(
                    "UPDATE DRIVER RESPONSE:",
                    response
                );

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                const response =
                    await createDriver(payload);

                console.log(
                    "CREATE DRIVER RESPONSE:",
                    response
                );

            }


            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                isEdit
                    ? "Driver updated successfully."
                    : "Driver created successfully."
            );


            // Redirect after success

            setTimeout(() => {

                navigate(
                    "/drivers",
                    {
                        replace: true,
                    }
                );

            }, 700);


        } catch (err) {

            console.error(
                "SAVE DRIVER ERROR:",
                err
            );


            setError(
                err?.message ||
                "Unable to save driver"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // PAGE LOADING
    // =====================================================

    if (pageLoading) {

        return (

            <div className="flex min-h-[500px] items-center justify-center">

                <p className="text-sm text-slate-500">
                    Loading driver...
                </p>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="mx-auto max-w-3xl space-y-5">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                <button
                    type="button"
                    onClick={() => navigate("/drivers")}
                    className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-white"
                >

                    <ArrowLeft size={14} />

                    Back to Drivers

                </button>


                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">

                        <UserRound size={20} />

                    </div>


                    <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                            ROUTEX / FLEET
                        </p>


                        <h1 className="mt-1 text-2xl font-semibold text-white">

                            {isEdit
                                ? "Edit Driver"
                                : "Add Driver"}

                        </h1>


                        <p className="mt-1 text-xs text-slate-500">

                            {isEdit
                                ? "Update driver information and availability."
                                : "Add a new driver to your fleet."}

                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">

                    <p className="text-xs text-red-400">
                        {error}
                    </p>

                </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">

                    <p className="text-xs text-emerald-400">
                        {success}
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
                    PERSONAL INFORMATION
                ================================================= */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="mb-5">

                        <h2 className="text-sm font-semibold text-white">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-xs text-slate-600">
                            Basic driver information.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                        {/* FIRST NAME */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                First Name
                            </label>

                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="John"
                                required
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                            />

                        </div>


                        {/* LAST NAME */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Doe"
                                required
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                            />

                        </div>


                        {/* EMPLOYEE CODE */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Employee Code
                            </label>

                            <input
                                type="text"
                                name="employee_code"
                                value={formData.employee_code}
                                onChange={handleChange}
                                placeholder="DRV-001"
                                required
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                            />

                        </div>


                        {/* PHONE */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Phone
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                                required
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    LICENSE INFORMATION
                ================================================= */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="mb-5">

                        <h2 className="text-sm font-semibold text-white">
                            License Information
                        </h2>

                        <p className="mt-1 text-xs text-slate-600">
                            Driver license and experience details.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


                        {/* LICENSE NUMBER */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                License Number
                            </label>

                            <input
                                type="text"
                                name="license_number"
                                value={formData.license_number}
                                onChange={handleChange}
                                placeholder="DL-123456789"
                                required
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                            />

                        </div>


                        {/* LICENSE EXPIRY */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                License Expiry
                            </label>

                            <input
                                type="date"
                                name="license_expiry_date"
                                value={formData.license_expiry_date}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none focus:border-blue-500"
                            />

                        </div>


                        {/* EXPERIENCE */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Experience (Years)
                            </label>

                            <input
                                type="number"
                                name="experience_years"
                                value={formData.experience_years}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                placeholder="5"
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                            />

                        </div>


                        {/* RATING */}

                        <div>

                            <label className="mb-2 block text-xs font-medium text-slate-400">
                                Rating
                            </label>

                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                min="0"
                                max="5"
                                step="0.1"
                                placeholder="4.5"
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    STATUS
                ================================================= */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="mb-5">

                        <h2 className="text-sm font-semibold text-white">
                            Driver Status
                        </h2>

                        <p className="mt-1 text-xs text-slate-600">
                            Set the driver's current availability.
                        </p>

                    </div>


                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-slate-300 outline-none focus:border-blue-500"
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

                </section>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() => navigate("/drivers")}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-5 py-3 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:text-white"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <Save size={14} />

                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Driver"
                                : "Create Driver"}

                    </button>

                </div>

            </form>

        </div>

    );

}

export default DriverForm;