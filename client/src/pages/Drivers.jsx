import { useEffect, useState } from "react";
import {
    Plus,
    RefreshCw,
    Search,
    Pencil,
    Trash2,
    Users,
    AlertCircle,
    CheckCircle2,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getDrivers,
    deleteDriver,
} from "../api/api";

function Drivers() {
    const navigate = useNavigate();

    const [drivers, setDrivers] = useState([]);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [deletingId, setDeletingId] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    // =====================================================
    // LOAD DRIVERS
    // =====================================================

    const loadDrivers = async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page,
                limit: pagination.limit,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (status) {
                params.status = status;
            }

            const response = await getDrivers(params);

            console.log("GET /drivers:", response);

            const data = Array.isArray(response?.data)
                ? response.data
                : [];

            setDrivers(data);

            if (response?.pagination) {
                setPagination({
                    page:
                        Number(response.pagination.page) ||
                        page,

                    limit:
                        Number(response.pagination.limit) ||
                        pagination.limit,

                    total:
                        Number(response.pagination.total) ||
                        0,

                    totalPages:
                        Number(
                            response.pagination.totalPages
                        ) || 1,
                });
            }
        } catch (err) {
            console.error(
                "Load drivers error:",
                err
            );

            setDrivers([]);

            setError(
                err.response?.data?.message ||
                    "Failed to load drivers"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD WHEN STATUS CHANGES
    // =====================================================

    useEffect(() => {
        loadDrivers(1);
    }, [status]);

    // =====================================================
    // SEARCH WITH DEBOUNCE
    // =====================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDrivers(1);
        }, 400);

        return () => {
            clearTimeout(timer);
        };
    }, [search]);

    // =====================================================
    // DEACTIVATE DRIVER
    // =====================================================

    const handleDelete = async (id) => {
        if (!id) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to deactivate this driver?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");
            setSuccess("");

            await deleteDriver(id);

            setSuccess(
                "Driver deactivated successfully."
            );

            await loadDrivers(pagination.page);
        } catch (err) {
            console.error(
                "Deactivate driver error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to deactivate driver"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (value) => {
        switch (value) {
            case "available":
                return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

            case "on_trip":
                return "border-blue-500/20 bg-blue-500/10 text-blue-400";

            case "off_duty":
                return "border-amber-500/20 bg-amber-500/10 text-amber-400";

            case "inactive":
                return "border-red-500/20 bg-red-500/10 text-red-400";

            default:
                return "border-slate-700 bg-slate-800 text-slate-400";
        }
    };

    // =====================================================
    // FORMAT STATUS
    // =====================================================

    const formatStatus = (value) => {
        if (!value) {
            return "Unknown";
        }

        return String(value)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "N/A";
        }

        return parsed.toLocaleDateString();
    };

    // =====================================================
    // PAGINATION
    // =====================================================

    const goToPage = (page) => {
        if (
            loading ||
            page < 1 ||
            page > pagination.totalPages
        ) {
            return;
        }

        loadDrivers(page);
    };

    // =====================================================
    // SUMMARY
    // =====================================================

    const availableCount = drivers.filter(
        (driver) =>
            driver.status === "available"
    ).length;

    const onTripCount = drivers.filter(
        (driver) =>
            driver.status === "on_trip"
    ).length;

    const offDutyCount = drivers.filter(
        (driver) =>
            driver.status === "off_duty"
    ).length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="space-y-5">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">

                                <Users size={15} />

                            </span>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                                ROUTEX / FLEET
                            </p>

                        </div>

                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                            Drivers
                        </h1>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Manage drivers, availability,
                            licenses and performance.
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                        <button
                            type="button"
                            onClick={() =>
                                loadDrivers(
                                    pagination.page
                                )
                            }
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
                            onClick={() =>
                                navigate(
                                    "/drivers/new"
                                )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                        >

                            <Plus size={14} />

                            Add Driver

                        </button>

                    </div>

                </div>

            </section>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        Total Drivers
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-white">
                        {loading
                            ? "—"
                            : pagination.total}
                    </p>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        Available
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-emerald-400">
                        {loading
                            ? "—"
                            : availableCount}
                    </p>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        On Trip
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-blue-400">
                        {loading
                            ? "—"
                            : onTripCount}
                    </p>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        Off Duty
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-amber-400">
                        {loading
                            ? "—"
                            : offDutyCount}
                    </p>

                </div>

            </div>

            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">

                    <div className="flex items-center gap-2">

                        <CheckCircle2
                            size={15}
                            className="text-emerald-400"
                        />

                        <p className="text-xs text-emerald-400">
                            {success}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                        className="text-emerald-400 hover:text-emerald-300"
                    >

                        <X size={14} />

                    </button>

                </div>

            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                    <div className="flex items-center gap-2">

                        <AlertCircle
                            size={15}
                            className="text-red-400"
                        />

                        <p className="text-xs text-red-400">
                            {error}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                        className="text-red-400 hover:text-red-300"
                    >

                        <X size={14} />

                    </button>

                </div>

            )}

            {/* =================================================
                FILTERS
            ================================================= */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                    {/* SEARCH */}

                    <div className="relative md:col-span-2">

                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search employee, name, phone, email or license..."
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                        />

                    </div>

                    {/* STATUS */}

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value
                            )
                        }
                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-slate-300 outline-none focus:border-blue-500"
                    >

                        <option value="">
                            All Statuses
                        </option>

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

            </section>

            {/* =================================================
                TABLE
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1050px]">

                        <thead>

                            <tr className="border-b border-slate-800 bg-slate-950/40">

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Driver
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Contact
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    License
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Experience
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Rating
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Deliveries
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {/* LOADING */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="px-5 py-14 text-center"
                                    >

                                        <RefreshCw
                                            size={20}
                                            className="mx-auto animate-spin text-blue-400"
                                        />

                                        <p className="mt-3 text-xs text-slate-500">
                                            Loading drivers...
                                        </p>

                                    </td>

                                </tr>

                            ) : drivers.length === 0 ? (

                                /* EMPTY */

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="px-5 py-14 text-center"
                                    >

                                        <Users
                                            size={24}
                                            className="mx-auto text-slate-700"
                                        />

                                        <p className="mt-3 text-xs text-slate-500">
                                            No drivers found.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                drivers.map((driver) => {

                                    const driverId =
                                        driver.id;

                                    const fullName =
                                        `${driver.first_name || ""} ${
                                            driver.last_name || ""
                                        }`.trim();

                                    return (

                                        <tr
                                            key={driverId}
                                            className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                                        >

                                            {/* DRIVER */}

                                            <td className="px-5 py-4">

                                                <div>

                                                    <p className="text-xs font-semibold text-white">

                                                        {fullName ||
                                                            "Unnamed Driver"}

                                                    </p>

                                                    <p className="mt-1 text-[10px] text-slate-600">

                                                        {driver.employee_code ||
                                                            "No employee code"}

                                                    </p>

                                                </div>

                                            </td>

                                            {/* CONTACT */}

                                            <td className="px-5 py-4">

                                                <p className="text-xs text-slate-300">
                                                    {driver.phone ||
                                                        "No phone"}
                                                </p>

                                                <p className="mt-1 text-[10px] text-slate-600">
                                                    {driver.email ||
                                                        "No email"}
                                                </p>

                                            </td>

                                            {/* LICENSE */}

                                            <td className="px-5 py-4">

                                                <p className="text-xs text-slate-300">

                                                    {driver.license_number ||
                                                        "N/A"}

                                                </p>

                                                <p className="mt-1 text-[10px] text-slate-600">

                                                    Exp:{" "}

                                                    {formatDate(
                                                        driver.license_expiry_date
                                                    )}

                                                </p>

                                            </td>

                                            {/* EXPERIENCE */}

                                            <td className="px-5 py-4">

                                                <span className="text-xs text-slate-300">

                                                    {driver.experience_years ??
                                                        0}{" "}
                                                    years

                                                </span>

                                            </td>

                                            {/* RATING */}

                                            <td className="px-5 py-4">

                                                <span className="text-xs text-slate-300">

                                                    {driver.rating !==
                                                    null &&
                                                    driver.rating !==
                                                        undefined
                                                        ? Number(
                                                              driver.rating
                                                          ).toFixed(
                                                              1
                                                          )
                                                        : "0.0"}

                                                </span>

                                            </td>

                                            {/* DELIVERIES */}

                                            <td className="px-5 py-4">

                                                <span className="text-xs text-slate-300">

                                                    {driver.total_deliveries ??
                                                        0}

                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                                                        driver.status
                                                    )}`}
                                                >

                                                    {formatStatus(
                                                        driver.status
                                                    )}

                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        title="Edit driver"
                                                        onClick={() =>
                                                            navigate(
                                                                `/drivers/${driverId}/edit`
                                                            )
                                                        }
                                                        disabled={
                                                            driver.status ===
                                                            "on_trip"
                                                        }
                                                        className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-500 transition hover:border-blue-500/30 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >

                                                        <Pencil
                                                            size={14}
                                                        />

                                                    </button>

                                                    {/* DEACTIVATE */}

                                                    {driver.status !==
                                                        "inactive" && (

                                                        <button
                                                            type="button"
                                                            title="Deactivate driver"
                                                            disabled={
                                                                deletingId ===
                                                                    driverId ||
                                                                driver.status ===
                                                                    "on_trip"
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    driverId
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-500/10 bg-red-500/5 p-2 text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >

                                                            {deletingId ===
                                                            driverId ? (

                                                                <RefreshCw
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="animate-spin"
                                                                />

                                                            ) : (

                                                                <Trash2
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                            )}

                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    );
                                })

                            )}

                        </tbody>

                    </table>

                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    drivers.length > 0 &&
                    pagination.totalPages > 1 && (

                        <div className="flex flex-col gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-xs text-slate-500">

                                Page{" "}

                                <span className="font-medium text-slate-300">
                                    {pagination.page}
                                </span>

                                {" of "}

                                <span className="font-medium text-slate-300">
                                    {pagination.totalPages}
                                </span>

                                {" • "}

                                {pagination.total} drivers

                            </p>

                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            pagination.page -
                                                1
                                        )
                                    }
                                    disabled={
                                        pagination.page <=
                                            1 ||
                                        loading
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-medium text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronLeft
                                        size={13}
                                    />

                                    Previous

                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            pagination.page +
                                                1
                                        )
                                    }
                                    disabled={
                                        pagination.page >=
                                            pagination.totalPages ||
                                        loading
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-medium text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    Next

                                    <ChevronRight
                                        size={13}
                                    />

                                </button>

                            </div>

                        </div>

                    )}

            </section>

        </div>
    );
}

export default Drivers;