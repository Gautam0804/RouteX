import { useMemo, useState } from "react";

import {
    Activity,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Download,
    FileBarChart,
    FileText,
    Package,
    Search,
    Truck,
    Users,
    X,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Report Templates
|--------------------------------------------------------------------------
| These are report definitions, not fake database data.
| Since Reports has no backend, these describe what each report represents.
|--------------------------------------------------------------------------
*/

const reports = [
    {
        id: 1,
        name: "Shipment Performance",
        description:
            "Analyze shipment volume, delivery performance, delays and completion trends.",
        type: "Shipment",
        icon: Package,
        frequency: "Daily",
    },

    {
        id: 2,
        name: "Fleet Utilization",
        description:
            "Review vehicle utilization, mileage, active fleet and operational efficiency.",
        type: "Fleet",
        icon: Truck,
        frequency: "Weekly",
    },

    {
        id: 3,
        name: "Driver Performance",
        description:
            "Track driver activity, deliveries, completion rate and performance metrics.",
        type: "Driver",
        icon: Users,
        frequency: "Weekly",
    },

    {
        id: 4,
        name: "Revenue Analysis",
        description:
            "Monitor transportation revenue, costs, margins and financial performance.",
        type: "Finance",
        icon: BarChart3,
        frequency: "Monthly",
    },

    {
        id: 5,
        name: "Delivery SLA Report",
        description:
            "Measure SLA compliance, late deliveries and service-level performance.",
        type: "Operations",
        icon: Clock3,
        frequency: "Daily",
    },

    {
        id: 6,
        name: "Operational Overview",
        description:
            "Complete operational summary covering shipments, vehicles and drivers.",
        type: "Operations",
        icon: Activity,
        frequency: "Daily",
    },
];

/*
|--------------------------------------------------------------------------
| Reports Component
|--------------------------------------------------------------------------
*/

function Reports() {
    const [dateRange, setDateRange] = useState("This Month");

    const [category, setCategory] = useState("All");

    const [search, setSearch] = useState("");

    const [generated, setGenerated] = useState(null);

    const [generating, setGenerating] = useState(false);

    const [showPreview, setShowPreview] = useState(false);

    const [recentReports, setRecentReports] = useState([]);

    const categories = [
        "All",
        "Shipment",
        "Fleet",
        "Driver",
        "Finance",
        "Operations",
    ];

    /*
    |--------------------------------------------------------------------------
    | Filter reports
    |--------------------------------------------------------------------------
    */

    const filteredReports = useMemo(() => {
        const query = search.trim().toLowerCase();

        return reports.filter((report) => {
            const matchesCategory =
                category === "All" ||
                report.type === category;

            const matchesSearch =
                !query ||
                report.name.toLowerCase().includes(query) ||
                report.description.toLowerCase().includes(query) ||
                report.type.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [category, search]);

    /*
    |--------------------------------------------------------------------------
    | Generate Report
    |--------------------------------------------------------------------------
    |
    | Frontend-only generation.
    | We only store report metadata because there is no backend/database
    | supplying actual operational metrics.
    |
    */

    const generateReport = (report) => {
        setGenerating(true);

        setTimeout(() => {
            const newReport = {
                ...report,
                dateRange,
                generatedAt: new Date().toLocaleString(),
            };

            setGenerated(newReport);

            setRecentReports((previous) => {
                return [
                    newReport,
                    ...previous,
                ].slice(0, 5);
            });

            setGenerating(false);
        }, 700);
    };

    /*
    |--------------------------------------------------------------------------
    | Download Report
    |--------------------------------------------------------------------------
    */

    const downloadReport = (format = "txt") => {
        if (!generated) return;

        const content = `
ROUTEX FLEET OPERATIONS
========================================

${generated.name}

Report Type: ${generated.type}
Frequency: ${generated.frequency}
Date Range: ${generated.dateRange}
Generated: ${generated.generatedAt}

----------------------------------------
REPORT INFORMATION
----------------------------------------

Report: ${generated.name}
Category: ${generated.type}
Frequency: ${generated.frequency}
Date Range: ${generated.dateRange}

----------------------------------------
NOTE
----------------------------------------

This report was generated from the RouteX
frontend reporting module.

Live operational metrics are not included
because the Reports module currently has
no backend reporting service connected.

Generated by RouteX Fleet Management System.
        `.trim();

        let finalContent;
        let mimeType;

        if (format === "csv") {
            finalContent = [
                "Field,Value",
                `Report,"${generated.name}"`,
                `Category,"${generated.type}"`,
                `Frequency,"${generated.frequency}"`,
                `Date Range,"${generated.dateRange}"`,
                `Generated At,"${generated.generatedAt}"`,
            ].join("\n");

            mimeType = "text/csv";
        } else {
            finalContent = content;
            mimeType = "text/plain";
        }

        const blob = new Blob(
            [finalContent],
            {
                type: mimeType,
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download =
            `${generated.name
                .replace(/\s+/g, "_")
                .toLowerCase()}.${format}`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    /*
    |--------------------------------------------------------------------------
    | Session Statistics
    |--------------------------------------------------------------------------
    */

    const reportsGenerated = recentReports.length;

    const reportCategories = new Set(
        recentReports.map((report) => report.type)
    ).size;

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-6">

            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <p className="text-[10px] font-medium uppercase tracking-widest text-blue-400">
                            ROUTEX / REPORTING
                        </p>

                        <span className="h-1 w-1 rounded-full bg-slate-700" />

                        <span className="text-[10px] text-slate-600">
                            Analytics
                        </span>

                    </div>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        Reports
                    </h1>

                    <p className="mt-1 text-xs text-slate-500">
                        Generate and export fleet performance reports.
                    </p>

                </div>

                {/* DATE RANGE */}

                <div className="flex items-center gap-2">

                    <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3">

                        <CalendarDays
                            size={14}
                            className="text-slate-500"
                        />

                        <select
                            value={dateRange}
                            onChange={(e) =>
                                setDateRange(e.target.value)
                            }
                            className="bg-transparent py-2.5 text-xs text-slate-300 outline-none"
                        >
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Quarter</option>
                            <option>This Year</option>
                        </select>

                    </div>

                </div>

            </div>


            {/* =========================================================
                KPI CARDS
            ========================================================= */}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                <Kpi
                    icon={FileBarChart}
                    label="Available Reports"
                    value={reports.length}
                    description="Report templates"
                />

                <Kpi
                    icon={FileText}
                    label="Generated This Session"
                    value={reportsGenerated}
                    description="Created locally"
                />

                <Kpi
                    icon={BarChart3}
                    label="Categories Used"
                    value={reportCategories}
                    description="This session"
                />

                <Kpi
                    icon={CalendarDays}
                    label="Selected Period"
                    value={dateRange}
                    description="Current filter"
                />

            </div>


            {/* =========================================================
                INFO
            ========================================================= */}

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

                <div className="flex gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                        <Activity size={15} />

                    </div>

                    <div>

                        <p className="text-xs font-semibold text-blue-300">
                            Frontend Reporting
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-slate-500">
                            Reports can currently be generated and exported
                            from the frontend. Live report metrics will be
                            available once a reporting backend is connected.
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================================
                SEARCH + FILTER
            ========================================================= */}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                {/* SEARCH */}

                <div className="relative w-full lg:max-w-sm">

                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search reports..."
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />

                </div>


                {/* CATEGORY */}

                <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-1">

                    {categories.map((item) => (

                        <button
                            key={item}
                            onClick={() =>
                                setCategory(item)
                            }
                            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[10px] transition ${
                                category === item
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                            }`}
                        >
                            {item}
                        </button>

                    ))}

                </div>

            </div>


            {/* =========================================================
                AVAILABLE REPORTS
            ========================================================= */}

            <div>

                <div className="mb-3 flex items-center justify-between">

                    <div>

                        <h2 className="text-sm font-semibold text-white">
                            Available Reports
                        </h2>

                        <p className="mt-1 text-[10px] text-slate-600">
                            Select a report to generate an analysis.
                        </p>

                    </div>

                    <span className="text-[10px] text-slate-600">
                        {filteredReports.length} reports
                    </span>

                </div>


                {filteredReports.length === 0 ? (

                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

                        <Search
                            size={24}
                            className="mx-auto text-slate-700"
                        />

                        <p className="mt-3 text-xs font-medium text-slate-400">
                            No reports found
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                            Try another search or category.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                        {filteredReports.map((report) => {

                            const Icon = report.icon;

                            return (

                                <div
                                    key={report.id}
                                    className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-900/80"
                                >

                                    {/* ICON + TYPE */}

                                    <div className="flex items-start justify-between">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/10 bg-blue-500/10 text-blue-400">

                                            <Icon size={18} />

                                        </div>

                                        <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[9px] text-slate-500">
                                            {report.type}
                                        </span>

                                    </div>


                                    {/* NAME */}

                                    <h3 className="mt-5 text-sm font-semibold text-white">
                                        {report.name}
                                    </h3>


                                    {/* DESCRIPTION */}

                                    <p className="mt-2 min-h-[40px] text-xs leading-5 text-slate-500">
                                        {report.description}
                                    </p>


                                    {/* FOOTER */}

                                    <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">

                                        <div>

                                            <p className="text-[9px] uppercase tracking-wider text-slate-600">
                                                Frequency
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-400">
                                                {report.frequency}
                                            </p>

                                        </div>


                                        <button
                                            onClick={() =>
                                                generateReport(report)
                                            }
                                            disabled={generating}
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            {generating ? (

                                                <>
                                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                                    Generating
                                                </>

                                            ) : (

                                                <>
                                                    <FileText size={13} />

                                                    Generate
                                                </>

                                            )}

                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>


            {/* =========================================================
                GENERATED REPORT
            ========================================================= */}

            {generated && (

                <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-slate-900">

                    {/* HEADER */}

                    <div className="border-b border-slate-800 p-5">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">

                                    <CheckCircle2 size={18} />

                                </div>

                                <div>

                                    <p className="text-[9px] font-medium uppercase tracking-wider text-emerald-400">
                                        Report Ready
                                    </p>

                                    <h2 className="mt-1 text-sm font-semibold text-white">
                                        {generated.name}
                                    </h2>

                                    <p className="mt-1 text-[10px] text-slate-600">
                                        {generated.type}
                                        {" • "}
                                        {generated.dateRange}
                                        {" • "}
                                        {generated.generatedAt}
                                    </p>

                                </div>

                            </div>


                            <div className="flex gap-2">

                                <button
                                    onClick={() =>
                                        setShowPreview(true)
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-[10px] text-slate-300 hover:bg-slate-800"
                                >
                                    <FileText size={13} />
                                    Preview
                                </button>


                                <button
                                    onClick={() =>
                                        downloadReport("csv")
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-blue-500"
                                >
                                    <Download size={13} />
                                    CSV
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* REPORT DETAILS */}

                    <div className="grid grid-cols-2 gap-px bg-slate-800 lg:grid-cols-4">

                        <ReportMetric
                            label="Report"
                            value={generated.name}
                        />

                        <ReportMetric
                            label="Category"
                            value={generated.type}
                        />

                        <ReportMetric
                            label="Frequency"
                            value={generated.frequency}
                        />

                        <ReportMetric
                            label="Period"
                            value={generated.dateRange}
                        />

                    </div>

                </div>

            )}


            {/* =========================================================
                RECENT REPORTS
            ========================================================= */}

            <div className="rounded-xl border border-slate-800 bg-slate-900">

                <div className="flex items-center justify-between border-b border-slate-800 p-5">

                    <div>

                        <h2 className="text-sm font-semibold text-white">
                            Recent Reports
                        </h2>

                        <p className="mt-1 text-[10px] text-slate-600">
                            Reports generated during this session.
                        </p>

                    </div>

                    <Clock3
                        size={16}
                        className="text-slate-600"
                    />

                </div>


                {recentReports.length === 0 ? (

                    <div className="p-8 text-center">

                        <FileBarChart
                            size={25}
                            className="mx-auto text-slate-700"
                        />

                        <p className="mt-3 text-xs text-slate-500">
                            No reports generated yet.
                        </p>

                        <p className="mt-1 text-[9px] text-slate-700">
                            Generate a report above to see it here.
                        </p>

                    </div>

                ) : (

                    <div>

                        {recentReports.map((report, index) => (

                            <div
                                key={`${report.id}-${index}`}
                                className="flex items-center justify-between border-b border-slate-800 p-4 last:border-0"
                            >

                                <div className="flex items-center gap-3">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">

                                        <FileText size={14} />

                                    </div>


                                    <div>

                                        <p className="text-xs font-medium text-slate-300">
                                            {report.name}
                                        </p>

                                        <p className="mt-1 text-[9px] text-slate-600">
                                            {report.type}
                                            {" • "}
                                            {report.dateRange}
                                            {" • "}
                                            {report.generatedAt}
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={() => {
                                        setGenerated(report);
                                        setShowPreview(true);
                                    }}
                                    className="text-[10px] text-blue-400 hover:text-blue-300"
                                >
                                    View
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* =========================================================
                PREVIEW MODAL
            ========================================================= */}

            {showPreview && generated && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-800 p-5">

                            <div>

                                <p className="text-[9px] uppercase tracking-wider text-blue-400">
                                    Report Preview
                                </p>

                                <h2 className="mt-1 text-sm font-semibold text-white">
                                    {generated.name}
                                </h2>

                            </div>


                            <button
                                onClick={() =>
                                    setShowPreview(false)
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
                            >
                                <X size={16} />
                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="space-y-5 p-5">

                            <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">

                                <div className="mb-5">

                                    <p className="text-[9px] uppercase tracking-wider text-blue-400">
                                        RouteX Fleet Operations
                                    </p>

                                    <h3 className="mt-2 text-lg font-semibold text-white">
                                        {generated.name}
                                    </h3>

                                </div>


                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                                    <ReportMetric
                                        label="Category"
                                        value={generated.type}
                                    />

                                    <ReportMetric
                                        label="Frequency"
                                        value={generated.frequency}
                                    />

                                    <ReportMetric
                                        label="Date Range"
                                        value={generated.dateRange}
                                    />

                                    <ReportMetric
                                        label="Generated"
                                        value={generated.generatedAt}
                                    />

                                </div>

                            </div>


                            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">

                                <p className="text-[10px] font-semibold text-amber-400">
                                    Backend reporting not connected
                                </p>

                                <p className="mt-1 text-[9px] leading-4 text-slate-500">
                                    This preview contains report metadata only.
                                    Live shipment, vehicle, driver and financial
                                    metrics require a reporting backend.
                                </p>

                            </div>


                            {/* ACTIONS */}

                            <div className="flex justify-end gap-2">

                                <button
                                    onClick={() =>
                                        downloadReport("txt")
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800"
                                >
                                    <Download size={14} />
                                    TXT
                                </button>


                                <button
                                    onClick={() =>
                                        downloadReport("csv")
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
                                >
                                    <Download size={14} />
                                    Download CSV
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| KPI Component
|--------------------------------------------------------------------------
*/

function Kpi({
    icon: Icon,
    label,
    value,
    description,
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

            <div className="flex items-center justify-between">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                    <Icon size={15} />

                </div>

            </div>


            <p className="mt-4 text-[9px] uppercase tracking-wider text-slate-600">
                {label}
            </p>


            <p className="mt-1 truncate text-lg font-semibold text-white">
                {value}
            </p>


            <p className="mt-1 text-[9px] text-slate-600">
                {description}
            </p>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Report Metric
|--------------------------------------------------------------------------
*/

function ReportMetric({
    label,
    value,
}) {
    return (
        <div className="bg-slate-950 p-4">

            <p className="text-[9px] uppercase tracking-wider text-slate-600">
                {label}
            </p>

            <p
                className="mt-2 truncate text-sm font-semibold text-white"
                title={String(value)}
            >
                {value}
            </p>

        </div>
    );
}


export default Reports;