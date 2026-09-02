import { useEffect, useState } from "react";
import {
    Plus,
    RefreshCw,
    Search,
    Pencil,
    Trash2,
    Building2,
    X,
    Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getCustomers,
    getCustomerById,
    deleteCustomer,
} from "../api/api";

function Customers() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("active");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    // =====================================================
    // LOAD CUSTOMERS
    // =====================================================

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getCustomers({
                search: search.trim() || undefined,
                status,
                page,
                limit,
            });

            if (!response?.success) {
                throw new Error(
                    response?.message || "Failed to load customers"
                );
            }

            setCustomers(response.data || []);

            setPagination(
                response.pagination || {
                    page,
                    limit,
                    total: response.data?.length || 0,
                    totalPages: 1,
                }
            );
        } catch (err) {
            console.error("Load customers error:", err);

            setCustomers([]);

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Failed to load customers"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD WHEN FILTERS CHANGE
    // =====================================================

    useEffect(() => {
        loadCustomers();
    }, [page, status]);

    // =====================================================
    // SEARCH
    // =====================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            loadCustomers();
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // =====================================================
    // VIEW CUSTOMER
    // =====================================================

    const handleViewCustomer = async (id) => {
        try {
            setDetailsLoading(true);
            setSelectedCustomer(null);

            const response = await getCustomerById(id);

            if (!response?.success) {
                throw new Error(
                    response?.message || "Unable to load customer"
                );
            }

            setSelectedCustomer(response.data);
        } catch (err) {
            console.error("Customer details error:", err);

            alert(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to load customer details"
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    // =====================================================
    // DEACTIVATE CUSTOMER
    // =====================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this customer?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);

            const response = await deleteCustomer(id);

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Unable to deactivate customer"
                );
            }

            await loadCustomers();
        } catch (err) {
            console.error("Delete customer error:", err);

            alert(
                err.response?.data?.message ||
                    err.message ||
                    "Unable to deactivate customer"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // STATUS
    // =====================================================

    const getStatusClass = (customerStatus) => {
        if (customerStatus === "active") {
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
        }

        return "border-slate-700 bg-slate-800 text-slate-400";
    };

    const formatStatus = (customerStatus) => {
        if (!customerStatus) {
            return "Unknown";
        }

        return customerStatus
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // =====================================================
    // SUMMARY
    // =====================================================

    const totalCustomers = pagination.total;

    const activeCustomers = customers.filter(
        (customer) => customer.status === "active"
    ).length;

    const inactiveCustomers = customers.filter(
        (customer) => customer.status === "inactive"
    ).length;

    const totalShipments = customers.reduce(
        (total, customer) =>
            total + Number(customer.shipments || 0),
        0
    );

    // =====================================================
    // PAGINATION
    // =====================================================

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage((current) => current - 1);
        }
    };

    const goToNextPage = () => {
        if (page < pagination.totalPages) {
            setPage((current) => current + 1);
        }
    };

    const getPaginationText = () => {
        if (pagination.total === 0) {
            return "Showing 0 customers";
        }

        const start = (page - 1) * limit + 1;

        const end = Math.min(
            page * limit,
            pagination.total
        );

        return `Showing ${start} to ${end} of ${pagination.total} customers`;
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="space-y-5">

            {/* HEADER */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                <Building2 size={15} />
                            </span>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                                ROUTEX / CRM
                            </p>

                        </div>

                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                            Customers
                        </h1>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Manage customers, contacts and shipment relationships.
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                        <button
                            type="button"
                            onClick={loadCustomers}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-white"
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
                                navigate("/customers/new")
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                        >
                            <Plus size={14} />

                            Add Customer
                        </button>

                    </div>

                </div>

            </section>

            {/* SUMMARY */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                <SummaryCard
                    label="Total Customers"
                    value={totalCustomers}
                />

                <SummaryCard
                    label="Active"
                    value={activeCustomers}
                />

                <SummaryCard
                    label="Inactive"
                    value={inactiveCustomers}
                />

                <SummaryCard
                    label="Shipments"
                    value={totalShipments}
                />

            </section>

            {/* FILTERS */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">

                <div className="flex flex-col gap-3 lg:flex-row">

                    {/* SEARCH */}
                    <div className="relative flex-1">

                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search customer, company, phone, email..."
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-blue-500"
                        />

                    </div>

                    {/* STATUS */}
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-slate-300 outline-none focus:border-blue-500"
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                        <option value="all">
                            All Customers
                        </option>
                    </select>

                </div>

            </section>

            {/* ERROR */}
            {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-xs text-red-400">
                        {error}
                    </p>
                </div>
            )}

            {/* TABLE */}
            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1050px]">

                        <thead>

                            <tr className="border-b border-slate-800">

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Customer
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Contact
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Location
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                    Shipments
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

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="px-5 py-12 text-center text-xs text-slate-500"
                                    >
                                        Loading customers...
                                    </td>

                                </tr>

                            ) : customers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="px-5 py-12 text-center text-xs text-slate-500"
                                    >
                                        No customers found.
                                    </td>

                                </tr>

                            ) : (

                                customers.map((customer) => (

                                    <tr
                                        key={customer.id}
                                        className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                                    >

                                        {/* CUSTOMER */}

                                        <td className="px-5 py-4">

                                            <p className="text-xs font-semibold text-white">
                                                {customer.company_name}
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-600">
                                                {customer.customer_code}
                                            </p>

                                        </td>

                                        {/* CONTACT */}

                                        <td className="px-5 py-4">

                                            <p className="text-xs text-slate-300">
                                                {customer.contact_person}
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-600">
                                                {customer.phone}
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-600">
                                                {customer.email || "No email"}
                                            </p>

                                        </td>

                                        {/* LOCATION */}

                                        <td className="px-5 py-4">

                                            <p className="text-xs text-slate-300">
                                                {customer.city}
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-600">
                                                {customer.state}

                                                {customer.postal_code
                                                    ? ` • ${customer.postal_code}`
                                                    : ""}
                                            </p>

                                        </td>

                                        {/* SHIPMENTS */}

                                        <td className="px-5 py-4">

                                            <span className="text-xs text-slate-300">
                                                {customer.shipments || 0}
                                            </span>

                                        </td>

                                        {/* STATUS */}

                                        <td className="px-5 py-4">

                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                                                    customer.status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    customer.status
                                                )}
                                            </span>

                                        </td>

                                        {/* ACTIONS */}

                                        <td className="px-5 py-4">

                                            <div className="flex justify-end gap-2">

                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    title="View customer"
                                                    onClick={() =>
                                                        handleViewCustomer(
                                                            customer.id
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-500 transition hover:border-slate-700 hover:text-white"
                                                >
                                                    <Eye size={14} />
                                                </button>

                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    title="Edit customer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/customers/${customer.id}/edit`
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-500 transition hover:border-slate-700 hover:text-white"
                                                >
                                                    <Pencil size={14} />
                                                </button>

                                                {/* DEACTIVATE */}

                                                <button
                                                    type="button"
                                                    title="Deactivate customer"
                                                    disabled={
                                                        deletingId ===
                                                        customer.id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            customer.id
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-500/10 bg-red-500/5 p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                <div className="flex flex-col gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-[10px] text-slate-600">
                        {getPaginationText()}
                    </p>

                    <div className="flex gap-2">

                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={goToPreviousPage}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-medium text-slate-400 hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="flex items-center px-2 text-[10px] text-slate-600">
                            Page {page} of {pagination.totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={
                                page >= pagination.totalPages ||
                                loading
                            }
                            onClick={goToNextPage}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-medium text-slate-400 hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                </div>

            </section>

            {/* CUSTOMER DETAILS MODAL */}

            {(selectedCustomer || detailsLoading) && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

                    <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-800 p-5">

                            <div>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                                    Customer Details
                                </p>

                                <h2 className="mt-1 text-lg font-semibold text-white">
                                    {selectedCustomer
                                        ? selectedCustomer.company_name
                                        : "Loading..."}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCustomer(null)
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* BODY */}

                        {detailsLoading ? (

                            <div className="p-10 text-center text-xs text-slate-500">
                                Loading customer details...
                            </div>

                        ) : selectedCustomer ? (

                            <div className="space-y-5 p-5">

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <Detail
                                        label="Customer Code"
                                        value={
                                            selectedCustomer.customer_code
                                        }
                                    />

                                    <Detail
                                        label="Company"
                                        value={
                                            selectedCustomer.company_name
                                        }
                                    />

                                    <Detail
                                        label="Contact Person"
                                        value={
                                            selectedCustomer.contact_person
                                        }
                                    />

                                    <Detail
                                        label="Phone"
                                        value={
                                            selectedCustomer.phone
                                        }
                                    />

                                    <Detail
                                        label="Email"
                                        value={
                                            selectedCustomer.email ||
                                            "Not provided"
                                        }
                                    />

                                    <Detail
                                        label="Address"
                                        value={
                                            selectedCustomer.address_line1
                                        }
                                    />

                                    <Detail
                                        label="City"
                                        value={
                                            selectedCustomer.city
                                        }
                                    />

                                    <Detail
                                        label="State"
                                        value={
                                            selectedCustomer.state
                                        }
                                    />

                                    <Detail
                                        label="Postal Code"
                                        value={
                                            selectedCustomer.postal_code
                                        }
                                    />

                                    <Detail
                                        label="Country"
                                        value={
                                            selectedCustomer.country
                                        }
                                    />

                                    <Detail
                                        label="Status"
                                        value={
                                            formatStatus(
                                                selectedCustomer.status
                                            )
                                        }
                                    />

                                </div>

                                <div className="flex justify-end border-t border-slate-800 pt-4">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedCustomer(null);

                                            navigate(
                                                `/customers/${selectedCustomer.id}/edit`
                                            );
                                        }}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
                                    >
                                        <Pencil size={14} />

                                        Edit Customer
                                    </button>

                                </div>

                            </div>

                        ) : null}

                    </div>

                </div>

            )}

        </div>
    );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                {label}
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
                {value}
            </p>

        </div>
    );
}

// =====================================================
// DETAIL
// =====================================================

function Detail({ label, value }) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">

            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-600">
                {label}
            </p>

            <p className="mt-1 break-words text-xs text-slate-300">
                {value || "—"}
            </p>

        </div>
    );
}

export default Customers;