import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Truck,
    Pencil,
    Trash2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    X,
    ChevronLeft,
    ChevronRight,
    Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getVehicles,
    deleteVehicle,
} from "../api/api";

function Vehicles() {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [vehicles, setVehicles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [deletingId, setDeletingId] = useState(null);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [fuelFilter, setFuelFilter] = useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    // =====================================================
    // LOAD VEHICLES
    // =====================================================

    const loadVehicles = async (page = pagination.page) => {
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

            if (statusFilter) {
                params.status = statusFilter;
            }

            if (fuelFilter) {
                params.fuelType = fuelFilter;
            }

            const response = await getVehicles(params);

            console.log("GET /vehicles:", response);

            const data = Array.isArray(response?.data)
                ? response.data
                : [];

            setVehicles(data);

            if (response?.pagination) {
                setPagination({
                    page: Number(response.pagination.page) || page,
                    limit:
                        Number(response.pagination.limit) ||
                        pagination.limit,
                    total: Number(response.pagination.total) || 0,
                    totalPages:
                        Number(response.pagination.totalPages) || 1,
                });
            }
        } catch (err) {
            console.error("Vehicle loading error:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load vehicles"
            );

            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadVehicles(1);
    }, [statusFilter, fuelFilter]);

    // =====================================================
    // SEARCH
    // =====================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            loadVehicles(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // =====================================================
    // VEHICLE ID
    // =====================================================

    const getVehicleId = (vehicle) => {
        return vehicle?.id;
    };

    // =====================================================
    // DEACTIVATE VEHICLE
    // =====================================================

    const handleDelete = async (id) => {
        if (!id) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to deactivate this vehicle?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");
            setSuccess("");

            await deleteVehicle(id);

            setSuccess(
                "Vehicle deactivated successfully."
            );

            await loadVehicles(pagination.page);
        } catch (err) {
            console.error(
                "Vehicle deactivation error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to deactivate vehicle"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleCreate = () => {
        navigate("/vehicles/new");
    };

    const handleEdit = (vehicle) => {
        const id = getVehicleId(vehicle);

        if (!id) {
            return;
        }

        navigate(`/vehicles/${id}/edit`);
    };

    // =====================================================
    // STATUS HELPERS
    // =====================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "available":
                return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

            case "in_transit":
                return "border-blue-500/20 bg-blue-500/10 text-blue-400";

            case "maintenance":
                return "border-amber-500/20 bg-amber-500/10 text-amber-400";

            case "inactive":
                return "border-red-500/20 bg-red-500/10 text-red-400";

            default:
                return "border-slate-700 bg-slate-800 text-slate-400";
        }
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    // =====================================================
    // SUMMARY COUNTS
    // =====================================================

    const totalVehicles = pagination.total;

    const availableVehicles = vehicles.filter(
        (vehicle) =>
            vehicle.status === "available"
    ).length;

    const inTransitVehicles = vehicles.filter(
        (vehicle) =>
            vehicle.status === "in_transit"
    ).length;

    // =====================================================
    // PAGINATION
    // =====================================================

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > pagination.totalPages ||
            loading
        ) {
            return;
        }

        loadVehicles(page);
    };

    // =====================================================
    // CLEAR MESSAGES
    // =====================================================

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

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

                    {/* TITLE */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">

                            <Truck
                                size={18}
                                className="text-blue-400"
                            />

                        </div>

                        <div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                                ROUTEX / FLEET
                            </p>

                            <h1 className="mt-1 text-2xl font-semibold text-white">
                                Vehicles
                            </h1>

                            <p className="mt-1 text-xs text-slate-500">
                                Manage and monitor your fleet vehicles.
                            </p>

                        </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-col gap-2 sm:flex-row">

                        <button
                            type="button"
                            onClick={() =>
                                loadVehicles(pagination.page)
                            }
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
                            onClick={handleCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                        >

                            <Plus size={15} />

                            Add Vehicle

                        </button>

                    </div>

                </div>

            </section>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                    <div className="flex items-start gap-2">

                        <AlertCircle
                            size={15}
                            className="mt-0.5 shrink-0 text-red-400"
                        />

                        <p className="text-xs text-red-400">
                            {error}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={clearMessages}
                        className="text-red-400 hover:text-red-300"
                    >
                        <X size={14} />
                    </button>

                </div>

            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">

                    <div className="flex items-start gap-2">

                        <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-emerald-400"
                        />

                        <p className="text-xs text-emerald-400">
                            {success}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={clearMessages}
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        <X size={14} />
                    </button>

                </div>

            )}

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* TOTAL */}

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        Total Vehicles
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-white">
                        {loading ? "—" : totalVehicles}
                    </p>

                </div>

                {/* AVAILABLE */}

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        Available
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-emerald-400">
                        {loading
                            ? "—"
                            : availableVehicles}
                    </p>

                </div>

                {/* IN TRANSIT */}

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        In Transit
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-blue-400">
                        {loading
                            ? "—"
                            : inTransitVehicles}
                    </p>

                </div>

            </div>

            {/* =================================================
                VEHICLES SECTION
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="border-b border-slate-800 px-5 py-4">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                        <div>

                            <h2 className="text-sm font-semibold text-white">
                                Fleet Vehicles
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                View and manage registered vehicles.
                            </p>

                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">

                            {/* SEARCH */}

                            <div className="relative w-full sm:w-64">

                                <Search
                                    size={15}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search vehicles..."
                                    className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                                />

                            </div>

                            {/* STATUS */}

                            <div className="relative">

                                <Filter
                                    size={13}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                    className="appearance-none rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-8 pr-8 text-xs text-slate-400 outline-none focus:border-blue-500"
                                >

                                    <option value="">
                                        All Status
                                    </option>

                                    <option value="available">
                                        Available
                                    </option>

                                    <option value="in_transit">
                                        In Transit
                                    </option>

                                    <option value="maintenance">
                                        Maintenance
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                            {/* FUEL */}

                            <select
                                value={fuelFilter}
                                onChange={(e) =>
                                    setFuelFilter(
                                        e.target.value
                                    )
                                }
                                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-400 outline-none focus:border-blue-500"
                            >

                                <option value="">
                                    All Fuel
                                </option>

                                <option value="diesel">
                                    Diesel
                                </option>

                                <option value="petrol">
                                    Petrol
                                </option>

                                <option value="cng">
                                    CNG
                                </option>

                                <option value="electric">
                                    Electric
                                </option>

                                <option value="hybrid">
                                    Hybrid
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="py-16 text-center">

                        <RefreshCw
                            size={20}
                            className="mx-auto animate-spin text-blue-400"
                        />

                        <p className="mt-3 text-xs text-slate-500">
                            Loading vehicles...
                        </p>

                    </div>

                ) : vehicles.length === 0 ? (

                    /* =================================================
                        EMPTY
                    ================================================= */

                    <div className="px-5 py-16 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">

                            <Truck
                                size={20}
                                className="text-slate-600"
                            />

                        </div>

                        <h3 className="mt-4 text-sm font-medium text-white">
                            {search ||
                            statusFilter ||
                            fuelFilter
                                ? "No vehicles found"
                                : "No vehicles registered"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">

                            {search ||
                            statusFilter ||
                            fuelFilter
                                ? "Try changing your search or filters."
                                : "Add your first vehicle to start managing your fleet."}

                        </p>

                        {!search &&
                            !statusFilter &&
                            !fuelFilter && (

                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                                >

                                    <Plus size={14} />

                                    Add Vehicle

                                </button>

                            )}

                    </div>

                ) : (

                    /* =================================================
                        TABLE
                    ================================================= */

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1050px] text-left">

                            <thead>

                                <tr className="border-b border-slate-800 bg-slate-950/50">

                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        ID
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Vehicle
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Registration
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Model
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Capacity
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Fuel
                                    </th>

                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {vehicles.map((vehicle) => {

                                    const id =
                                        getVehicleId(vehicle);

                                    return (

                                        <tr
                                            key={id}
                                            className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                                        >

                                            {/* ID */}

                                            <td className="px-5 py-4">

                                                <span className="text-xs text-slate-500">
                                                    #{id}
                                                </span>

                                            </td>

                                            {/* VEHICLE */}

                                            <td className="px-5 py-4">

                                                <div>

                                                    <p className="text-xs font-semibold text-white">
                                                        {vehicle.vehicleNumber ||
                                                            "—"}
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-slate-600">
                                                        {vehicle.manufacturer ||
                                                            "Unknown manufacturer"}
                                                    </p>

                                                </div>

                                            </td>

                                            {/* REGISTRATION */}

                                            <td className="px-5 py-4">

                                                <span className="text-xs text-slate-400">
                                                    {vehicle.registrationNumber ||
                                                        "—"}
                                                </span>

                                            </td>

                                            {/* TYPE */}

                                            <td className="px-5 py-4">

                                                <span className="text-xs text-slate-400">
                                                    {vehicle.vehicleType ||
                                                        "—"}
                                                </span>

                                            </td>

                                            {/* MODEL */}

                                            <td className="px-5 py-4">

                                                <div>

                                                    <p className="text-xs text-slate-400">
                                                        {vehicle.model ||
                                                            "—"}
                                                    </p>

                                                    {vehicle.manufactureYear && (
                                                        <p className="mt-1 text-[10px] text-slate-600">
                                                            {vehicle.manufactureYear}
                                                        </p>
                                                    )}

                                                </div>

                                            </td>

                                            {/* CAPACITY */}

                                            <td className="px-5 py-4">

                                                <span className="text-xs text-slate-400">

                                                    {vehicle.capacityKg !==
                                                        null &&
                                                    vehicle.capacityKg !==
                                                        undefined
                                                        ? `${vehicle.capacityKg} kg`
                                                        : "—"}

                                                </span>

                                            </td>

                                            {/* FUEL */}

                                            <td className="px-5 py-4">

                                                <span className="text-xs capitalize text-slate-400">
                                                    {vehicle.fuelType ||
                                                        "—"}
                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                                                        vehicle.status
                                                    )}`}
                                                >

                                                    {formatStatus(
                                                        vehicle.status
                                                    )}

                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                vehicle
                                                            )
                                                        }
                                                        disabled={
                                                            vehicle.status ===
                                                            "in_transit"
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-medium text-slate-400 transition hover:border-blue-500/30 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >

                                                        <Pencil
                                                            size={13}
                                                        />

                                                        Edit

                                                    </button>

                                                    {/* DEACTIVATE */}

                                                    {vehicle.status !==
                                                        "inactive" && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                    id ||
                                                                vehicle.status ===
                                                                    "in_transit"
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2 text-[10px] font-medium text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >

                                                            {deletingId ===
                                                            id ? (

                                                                <RefreshCw
                                                                    size={
                                                                        13
                                                                    }
                                                                    className="animate-spin"
                                                                />

                                                            ) : (

                                                                <Trash2
                                                                    size={
                                                                        13
                                                                    }
                                                                />

                                                            )}

                                                            {deletingId ===
                                                            id
                                                                ? "Deactivating..."
                                                                : "Deactivate"}

                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    vehicles.length > 0 &&
                    pagination.totalPages > 1 && (

                        <div className="flex flex-col gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-xs text-slate-500">

                                Page{" "}
                                <span className="font-medium text-slate-300">
                                    {pagination.page}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-slate-300">
                                    {pagination.totalPages}
                                </span>

                                {" • "}

                                {pagination.total} vehicles

                            </p>

                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            pagination.page - 1
                                        )
                                    }
                                    disabled={
                                        pagination.page <= 1 ||
                                        loading
                                    }
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-medium text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronLeft size={13} />

                                    Previous

                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goToPage(
                                            pagination.page + 1
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

                                    <ChevronRight size={13} />

                                </button>

                            </div>

                        </div>

                    )}

            </section>

        </div>
    );
}

export default Vehicles;