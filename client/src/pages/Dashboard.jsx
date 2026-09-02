import {
    Plus,
    Download,
    RefreshCw,
    Clock3,
    Activity,
    CheckCircle2,
    Loader2,
    AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Dashboard components
import StatCard from "../components/dashboard/StatCard";
import LiveTracking from "../components/dashboard/LiveTracking";
import ShipmentStatus from "../components/dashboard/ShipmentStatus";
import ShipmentChart from "../components/dashboard/ShipmentChart";
import AIInsights from "../components/dashboard/AIInsights";
import VehicleStatus from "../components/dashboard/VehicleStatus";
import DriverPerformance from "../components/dashboard/DriverPerformance";
import TopRoutes from "../components/dashboard/TopRoutes";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import RecentShipments from "../components/dashboard/RecentShipments";

// API
import {
    getDashboardOverview,
    getRecentShipments,
} from "../services/api";


function Dashboard() {

    const navigate = useNavigate();

    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const [dashboard, setDashboard] = useState(null);

    const [recentShipments, setRecentShipments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [lastUpdated, setLastUpdated] =
        useState(null);


    // -----------------------------------------------------
    // FETCH DASHBOARD DATA
    // -----------------------------------------------------

    const fetchDashboard = async (showRefresh = false) => {

        try {

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");


            // -------------------------------------------------
            // DASHBOARD OVERVIEW
            // -------------------------------------------------

            const overviewResponse =
                await getDashboardOverview();


            if (!overviewResponse?.success) {

                throw new Error(
                    overviewResponse?.message ||
                    "Failed to load dashboard overview"
                );

            }


            setDashboard(
                overviewResponse.data || {}
            );


            // -------------------------------------------------
            // RECENT SHIPMENTS
            // -------------------------------------------------

            const shipmentResponse =
                await getRecentShipments();


            if (shipmentResponse?.success) {

                setRecentShipments(
                    Array.isArray(
                        shipmentResponse.data
                    )
                        ? shipmentResponse.data
                        : []
                );

            } else {

                setRecentShipments([]);

            }


            setLastUpdated(
                new Date()
            );


        } catch (err) {

            console.error(
                "Dashboard error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load dashboard data"
            );


        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    // -----------------------------------------------------
    // INITIAL LOAD
    // -----------------------------------------------------

    useEffect(() => {

        fetchDashboard();

    }, []);


    // -----------------------------------------------------
    // REFRESH
    // -----------------------------------------------------

    const handleRefresh = () => {

        fetchDashboard(true);

    };


    // -----------------------------------------------------
    // EXPORT DASHBOARD
    // -----------------------------------------------------

    const handleExport = () => {

        const shipments =
            dashboard?.shipments || {};

        const vehicles =
            dashboard?.vehicles || {};

        const drivers =
            dashboard?.drivers || {};

        const alerts =
            dashboard?.alerts || {};


        const report = `
ROUTEX FLEET OPERATIONS
Fleet Overview Report

Generated:
${new Date().toLocaleString()}

========================================

SHIPMENTS

Total Shipments:
${shipments.total || 0}

Pending:
${shipments.pending || 0}

Assigned:
${shipments.assigned || 0}

Picked Up:
${shipments.pickedUp || 0}

In Transit:
${shipments.inTransit || 0}

Out For Delivery:
${shipments.outForDelivery || 0}

Delivered:
${shipments.delivered || 0}

Delayed:
${shipments.delayed || 0}

Cancelled:
${shipments.cancelled || 0}

========================================

VEHICLES

Total Vehicles:
${vehicles.total || 0}

Available:
${vehicles.available || 0}

In Transit:
${vehicles.inTransit || 0}

Maintenance:
${vehicles.maintenance || 0}

Inactive:
${vehicles.inactive || 0}

========================================

DRIVERS

Total Drivers:
${drivers.total || 0}

Available:
${drivers.available || 0}

On Trip:
${drivers.onTrip || 0}

Off Duty:
${drivers.offDuty || 0}

Inactive:
${drivers.inactive || 0}

========================================

ALERTS

Total Alerts:
${alerts.total || 0}

Open:
${alerts.open || 0}

Acknowledged:
${alerts.acknowledged || 0}

Resolved:
${alerts.resolved || 0}

Critical:
${alerts.critical || 0}

========================================

SYSTEM STATUS

API:
Online

Database:
Healthy

System:
Operational

========================================
        `.trim();


        const blob = new Blob(
            [report],
            {
                type: "text/plain",
            }
        );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "routex-fleet-report.txt";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    };


    // -----------------------------------------------------
    // DATA
    // -----------------------------------------------------

    const shipments =
        dashboard?.shipments || {};

    const vehicles =
        dashboard?.vehicles || {};

    const drivers =
        dashboard?.drivers || {};

    const alerts =
        dashboard?.alerts || {};


    // -----------------------------------------------------
    // KPI STATS
    // -----------------------------------------------------

    const stats = [

        {
            title: "Total Shipments",
            value: shipments.total || 0,
            icon: "package",
        },

        {
            title: "In Transit",
            value: shipments.inTransit || 0,
            icon: "truck",
        },

        {
            title: "Delivered",
            value: shipments.delivered || 0,
            icon: "check",
        },

        {
            title: "Delayed",
            value: shipments.delayed || 0,
            icon: "clock",
        },

        {
            title: "Active Vehicles",
            value: vehicles.inTransit || 0,
            icon: "vehicle",
        },

        {
            title: "Active Drivers",
            value: drivers.onTrip || 0,
            icon: "users",
        },

    ];


    // -----------------------------------------------------
    // SHIPMENT STATUS DATA
    // -----------------------------------------------------

    const shipmentStatusData = [

        {
            status: "delivered",
            count:
                Number(
                    shipments.delivered
                ) || 0,
            percentage: 0,
        },

        {
            status: "in_transit",
            count:
                Number(
                    shipments.inTransit
                ) || 0,
            percentage: 0,
        },

        {
            status: "delayed",
            count:
                Number(
                    shipments.delayed
                ) || 0,
            percentage: 0,
        },

        {
            status: "cancelled",
            count:
                Number(
                    shipments.cancelled
                ) || 0,
            percentage: 0,
        },

    ];


    // -----------------------------------------------------
    // TOTAL STATUS COUNT
    // -----------------------------------------------------

    const shipmentStatusTotal =
        shipmentStatusData.reduce(
            (total, item) =>
                total + item.count,
            0
        );


    // -----------------------------------------------------
    // CALCULATE PERCENTAGES
    // -----------------------------------------------------

    const finalShipmentStatusData =
        shipmentStatusData.map(
            (item) => ({

                ...item,

                percentage:
                    shipmentStatusTotal > 0
                        ? Math.round(
                            (
                                item.count /
                                shipmentStatusTotal
                            ) * 100
                        )
                        : 0,

            })
        );


    // -----------------------------------------------------
    // LOADING
    // -----------------------------------------------------

    if (
        loading &&
        !dashboard
    ) {

        return (

            <div className="flex min-h-[500px] items-center justify-center">

                <div className="flex flex-col items-center gap-3">

                    <Loader2
                        size={28}
                        className="animate-spin text-blue-500"
                    />

                    <p className="text-xs text-slate-500">
                        Loading RouteX dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // -----------------------------------------------------
    // FULL ERROR SCREEN
    // -----------------------------------------------------

    if (
        error &&
        !dashboard
    ) {

        return (

            <div className="space-y-5">

                <section className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8">

                    <div className="flex flex-col items-center justify-center text-center">

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">

                            <AlertCircle size={24} />

                        </div>


                        <h2 className="text-lg font-semibold text-white">
                            Unable to load dashboard
                        </h2>


                        <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
                            {error}
                        </p>


                        <button
                            onClick={() =>
                                fetchDashboard()
                            }
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                        >

                            <RefreshCw size={14} />

                            Try Again

                        </button>

                    </div>

                </section>

            </div>

        );

    }


    // -----------------------------------------------------
    // MAIN DASHBOARD
    // -----------------------------------------------------

    return (

        <div className="space-y-5">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


                    {/* TITLE */}

                    <div>

                        <div className="flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                                <Activity size={15} />

                            </span>


                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                                ROUTEX / OPERATIONS
                            </p>

                        </div>


                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Fleet Overview
                        </h1>


                        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                            Monitor shipments, vehicles, drivers and
                            transportation operations in real time.
                        </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex flex-wrap items-center gap-2">


                        {/* LAST UPDATED */}

                        <div className="mr-1 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5">

                            <Clock3
                                size={13}
                                className="text-slate-600"
                            />

                            <div>

                                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                                    Last updated
                                </p>


                                <p className="text-[10px] text-slate-400">

                                    {refreshing
                                        ? "Refreshing..."
                                        : lastUpdated
                                            ? lastUpdated.toLocaleTimeString()
                                            : "Just now"}

                                </p>

                            </div>

                        </div>


                        {/* REFRESH */}

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            title="Refresh dashboard"
                            className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-slate-500 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <RefreshCw
                                size={14}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                        </button>


                        {/* EXPORT */}

                        <button
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                        >

                            <Download size={14} />

                            Export

                        </button>


                        {/* NEW SHIPMENT */}

                        <button
                            onClick={() =>
                                navigate(
                                    "/shipments/new"
                                )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                        >

                            <Plus size={14} />

                            New Shipment

                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                ERROR BANNER
            ====================================================== */}

            {error && (

                <section className="flex items-center justify-between gap-4 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3">

                    <div className="flex items-center gap-3">

                        <AlertCircle
                            size={16}
                            className="shrink-0 text-red-400"
                        />

                        <p className="text-xs text-red-300">
                            {error}
                        </p>

                    </div>


                    <button
                        onClick={handleRefresh}
                        className="shrink-0 text-[10px] font-semibold text-red-400 hover:text-red-300"
                    >
                        Retry
                    </button>

                </section>

            )}


            {/* =====================================================
                KPI CARDS
            ====================================================== */}

            <section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">

                    {stats.map(
                        (stat) => (

                            <StatCard
                                key={stat.title}
                                stat={stat}
                            />

                        )
                    )}

                </div>

            </section>


            {/* =====================================================
                OPERATION SUMMARY
            ====================================================== */}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">


                {/* SHIPMENT CHART */}

                <div className="xl:col-span-2">

                    <ShipmentChart
                        data={[]}
                        totalShipments={
                            shipments.total || 0
                        }
                        trend="12.5%"
                    />

                </div>


                {/* SHIPMENT STATUS */}

                <ShipmentStatus
                    statusData={
                        finalShipmentStatusData
                    }
                    period="Today"
                />

            </section>


            {/* =====================================================
                LIVE OPERATIONS
            ====================================================== */}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

                <div className="xl:col-span-2">

                    <LiveTracking />

                </div>


                <AIInsights />

            </section>


            {/* =====================================================
                FLEET + DRIVER PERFORMANCE
            ====================================================== */}

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

               <VehicleStatus vehicleData={vehicles} />

                <DriverPerformance driverData={drivers.data || drivers.topDrivers || []} />

                <TopRoutes />

            </section>


            {/* =====================================================
                ALERTS
            ====================================================== */}

            <section>

                <AlertsPanel />

            </section>


            {/* =====================================================
                RECENT SHIPMENTS
            ====================================================== */}

            <section>

                <RecentShipments
                    shipments={
                        recentShipments
                    }
                />

            </section>


            {/* =====================================================
                SYSTEM FOOTER
            ====================================================== */}

            <footer className="border-t border-slate-800 pt-5">

                <div className="flex flex-col gap-3 text-[10px] sm:flex-row sm:items-center sm:justify-between">


                    {/* SYSTEM */}

                    <div className="flex items-center gap-2">

                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">

                            <CheckCircle2 size={13} />

                        </span>


                        <span className="text-slate-500">
                            RouteX operational systems
                        </span>

                    </div>


                    {/* STATUS */}

                    <div className="flex items-center gap-4 text-slate-600">

                        <span>
                            API Online
                        </span>

                        <span>
                            Database Healthy
                        </span>

                        <span className="flex items-center gap-1.5 text-emerald-500">

                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                            Operational

                        </span>

                    </div>

                </div>

            </footer>

        </div>

    );

}


export default Dashboard;