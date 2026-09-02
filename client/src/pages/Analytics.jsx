import {
    TrendingUp,
    Package,
    Clock3,
    Truck,
    Users,
    Route,
    CalendarDays,
    Download,
    CheckCircle2,
    AlertTriangle,
    Gauge,
    BarChart3,
} from "lucide-react";

import Card from "../components/common/Card";

function Analytics() {

    /*
    |--------------------------------------------------------------------------
    | Export
    |--------------------------------------------------------------------------
    */

    const handleExport = () => {
        const report = `
ROUTEX ANALYTICS REPORT
=======================

Report Type: Analytics
Period: Last 30 days

Status:
Live analytics data is not currently available.

The Analytics module is currently frontend-only.
Live shipment, fleet, driver, route and performance
metrics require an analytics backend.

Generated:
${new Date().toLocaleString()}
        `.trim();

        const blob = new Blob(
            [report],
            {
                type: "text/plain",
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "routex-analytics-report.txt";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };


    return (

        <div className="space-y-5">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                                <TrendingUp size={15} />

                            </span>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                                ROUTEX / INTELLIGENCE
                            </p>

                        </div>


                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Analytics
                        </h1>


                        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                            Analyze shipment performance, fleet utilization,
                            delivery efficiency and operational trends.
                        </p>

                    </div>


                    <div className="flex flex-wrap items-center gap-2">

                        {/* DATE */}

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-400"
                        >

                            <CalendarDays size={13} />

                            Last 30 days

                        </button>


                        {/* EXPORT */}

                        <button
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >

                            <Download size={14} />

                            Export Report

                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                DATA STATUS
            ====================================================== */}

            <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">

                <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">

                        <AlertTriangle size={16} />

                    </div>


                    <div>

                        <p className="text-xs font-semibold text-amber-400">
                            Analytics data unavailable
                        </p>

                        <p className="mt-1 max-w-3xl text-[10px] leading-5 text-slate-500">
                            The Analytics page is currently frontend-only.
                            Live shipment, fleet, driver, route and performance
                            metrics are not connected to a backend reporting
                            service yet.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                KPI METRICS
            ====================================================== */}

            <section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <Metric
                        icon={Package}
                        title="Shipment Growth"
                        value="—"
                        description="Live data unavailable"
                    />

                    <Metric
                        icon={CheckCircle2}
                        title="On-Time Delivery"
                        value="—"
                        description="Live data unavailable"
                    />

                    <Metric
                        icon={Truck}
                        title="Fleet Utilization"
                        value="—"
                        description="Live data unavailable"
                    />

                    <Metric
                        icon={Clock3}
                        title="Avg. Delivery Time"
                        value="—"
                        description="Live data unavailable"
                    />

                </div>

            </section>


            {/* =====================================================
                PERFORMANCE CHART + SUMMARY
            ====================================================== */}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

                {/* CHART */}

                <div className="xl:col-span-2">

                    <Card
                        title="Shipment Performance"
                        description="Monthly shipment volume and completed deliveries"
                    >

                        <EmptyChart />

                    </Card>

                </div>


                {/* PERFORMANCE SUMMARY */}

                <Card
                    title="Performance Summary"
                    description="Current operational health"
                >

                    <div className="mt-5 space-y-5">

                        <ProgressMetric
                            label="On-Time Delivery"
                            value="—"
                            progress={0}
                        />

                        <ProgressMetric
                            label="Fleet Utilization"
                            value="—"
                            progress={0}
                        />

                        <ProgressMetric
                            label="Driver Efficiency"
                            value="—"
                            progress={0}
                        />

                        <ProgressMetric
                            label="Route Efficiency"
                            value="—"
                            progress={0}
                        />

                    </div>


                    <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-3">

                        <div className="flex gap-3">

                            <Gauge
                                size={15}
                                className="mt-0.5 text-slate-500"
                            />

                            <div>

                                <p className="text-[10px] font-semibold text-slate-400">
                                    Waiting for analytics data
                                </p>

                                <p className="mt-1 text-[9px] leading-4 text-slate-600">
                                    Performance indicators will appear here
                                    when live analytics data is available.
                                </p>

                            </div>

                        </div>

                    </div>

                </Card>

            </section>


            {/* =====================================================
                SHIPMENT BREAKDOWN
            ====================================================== */}

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                {/* SHIPMENT BREAKDOWN */}

                <Card
                    title="Shipment Breakdown"
                    description="Current shipment distribution"
                >

                    <EmptyState
                        icon={Package}
                        title="No shipment analytics"
                        description="Shipment status distribution will appear when live data is connected."
                    />

                </Card>


                {/* TOP ROUTES */}

                <Card
                    title="Top Performing Routes"
                    description="Highest shipment volume"
                >

                    <EmptyState
                        icon={Route}
                        title="No route analytics"
                        description="Route performance data will appear when live analytics are available."
                    />

                </Card>


                {/* DRIVER PERFORMANCE */}

                <Card
                    title="Driver Performance"
                    description="Top drivers this month"
                >

                    <EmptyState
                        icon={Users}
                        title="No driver analytics"
                        description="Driver performance data will appear when live analytics are available."
                    />

                </Card>

            </section>


            {/* =====================================================
                OPERATIONAL INSIGHTS
            ====================================================== */}

            <section>

                <Card
                    title="Operational Insights"
                    description="Important trends detected across the fleet"
                >

                    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-6 text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                            <BarChart3 size={17} />

                        </div>


                        <p className="mt-3 text-xs font-semibold text-slate-400">
                            No insights available
                        </p>


                        <p className="mx-auto mt-1 max-w-md text-[9px] leading-4 text-slate-600">
                            Operational insights will be generated from real
                            shipment, vehicle, driver and route data once
                            the analytics backend is connected.
                        </p>

                    </div>

                </Card>

            </section>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer className="border-t border-slate-800 pt-5">

                <div className="flex flex-col gap-2 text-[10px] sm:flex-row sm:justify-between">

                    <p className="text-slate-600">
                        RouteX Analytics Engine
                    </p>


                    <p className="flex items-center gap-2 text-amber-500">

                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                        Waiting for analytics data

                    </p>

                </div>

            </footer>

        </div>
    );
}


/* =============================================================
   METRIC
============================================================= */

function Metric({
    icon: Icon,
    title,
    value,
    description,
}) {

    return (

        <div className="group rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-slate-700">

            <div className="flex items-start justify-between">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                    <Icon size={17} />

                </div>

            </div>


            <p className="mt-4 text-[10px] uppercase tracking-wider text-slate-600">
                {title}
            </p>


            <p className="mt-1 text-2xl font-semibold text-slate-500">
                {value}
            </p>


            <p className="mt-2 text-[9px] text-slate-600">
                {description}
            </p>

        </div>

    );
}


/* =============================================================
   EMPTY CHART
============================================================= */

function EmptyChart() {

    return (

        <div className="flex h-[300px] flex-col items-center justify-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-600">

                <BarChart3 size={21} />

            </div>


            <p className="mt-4 text-xs font-medium text-slate-400">
                No analytics data
            </p>


            <p className="mt-1 max-w-xs text-center text-[9px] leading-4 text-slate-600">
                Shipment performance charts will appear here
                when historical analytics data is available.
            </p>

        </div>

    );
}


/* =============================================================
   PROGRESS METRIC
============================================================= */

function ProgressMetric({
    label,
    value,
    progress,
}) {

    return (

        <div>

            <div className="flex items-center justify-between">

                <span className="text-[10px] text-slate-400">
                    {label}
                </span>


                <span className="text-[10px] font-semibold text-slate-500">
                    {value}
                </span>

            </div>


            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">

                <div
                    className="h-full rounded-full bg-slate-700"
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

        </div>

    );
}


/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyState({
    icon: Icon,
    title,
    description,
}) {

    return (

        <div className="flex min-h-[190px] flex-col items-center justify-center text-center">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-600">

                <Icon size={17} />

            </div>


            <p className="mt-3 text-xs font-medium text-slate-400">
                {title}
            </p>


            <p className="mt-1 max-w-xs text-[9px] leading-4 text-slate-600">
                {description}
            </p>

        </div>

    );
}


export default Analytics;