import { useEffect, useState } from "react";

import {
    LayoutDashboard,
    Truck,
    Users,
    MapPinned,
    ClipboardList,
    UserRound,
    ShieldCheck,
    FileBarChart,
    Bell,
    Settings,
    ChevronDown,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { getAlerts } from "../../services/api";

const menuSections = [
    {
        title: "OPERATIONS",
        items: [
            {
                name: "Shipments",
                path: "/shipments",
                icon: ClipboardList,
            },
            {
                name: "Vehicles",
                path: "/vehicles",
                icon: Truck,
            },
            {
                name: "Drivers",
                path: "/drivers",
                icon: Users,
            },
            {
                name: "Assignments",
                path: "/assignments",
                icon: ClipboardList,
            },
            {
                name: "Tracking",
                path: "/tracking",
                icon: MapPinned,
            },
        ],
    },

    {
        title: "MANAGEMENT",
        items: [
            {
                name: "Customers",
                path: "/customers",
                icon: UserRound,
            },
            {
                name: "Users & Roles",
                path: "/users",
                icon: ShieldCheck,
            },
            {
                name: "Reports",
                path: "/reports",
                icon: FileBarChart,
            },
            {
                name: "Analytics",
                path: "/analytics",
                icon: FileBarChart,
            },
        ],
    },
];

function Sidebar() {
    const [openAlerts, setOpenAlerts] = useState(0);

    // Load real alerts
    const loadAlertCount = async () => {
        try {
            const response = await getAlerts();

            const alerts = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response?.alerts)
                        ? response.alerts
                        : [];

            // Only OPEN alerts are counted
            const count = alerts.filter(
                (alert) => String(alert?.status || "").toLowerCase() === "open"
            ).length;

            setOpenAlerts(count);
        } catch (error) {
            console.error("Failed to load alert count:", error);
            setOpenAlerts(0);
        }
    };

    useEffect(() => {
        loadAlertCount();

        // Refresh alert count every 30 seconds
        const interval = setInterval(loadAlertCount, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950">

            {/* LOGO */}

            <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                    <Truck size={22} />
                </div>

                <div>
                    <h1 className="text-xl font-bold text-white">
                        RouteX
                    </h1>

                    <p className="text-[9px] font-medium tracking-widest text-slate-500">
                        FLEET OPERATIONS
                    </p>
                </div>

            </div>

            {/* NAVIGATION */}

            <nav className="flex-1 overflow-y-auto px-3 py-5">

                {/* DASHBOARD */}

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `mb-6 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`
                    }
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>

                {/* MENU */}

                {menuSections.map((section) => (
                    <div
                        key={section.title}
                        className="mb-6"
                    >

                        <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-slate-600">
                            {section.title}
                        </p>

                        <div className="space-y-1">

                            {section.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                                                isActive
                                                    ? "bg-blue-600/10 text-blue-400"
                                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                            }`
                                        }
                                    >
                                        <Icon size={17} />
                                        {item.name}
                                    </NavLink>
                                );
                            })}

                        </div>

                    </div>
                ))}

            </nav>

            {/* SYSTEM */}

            <div className="border-t border-slate-800 p-3">

                {/* ALERTS */}

                <NavLink
                    to="/alerts"
                    className={({ isActive }) =>
                        `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                            isActive
                                ? "bg-blue-600/10 text-blue-400"
                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`
                    }
                >
                    <Bell size={17} />

                    <span>
                        Alerts
                    </span>

                    {/* REAL ALERT COUNT */}

                    {openAlerts > 0 && (
                        <span className="ml-auto min-w-[20px] rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-semibold text-white">
                            {openAlerts > 99 ? "99+" : openAlerts}
                        </span>
                    )}

                </NavLink>

                {/* SETTINGS */}

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                            isActive
                                ? "bg-blue-600/10 text-blue-400"
                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`
                    }
                >
                    <Settings size={17} />
                    Settings
                </NavLink>

            </div>

            {/* USER */}

            <div className="border-t border-slate-800 p-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        AM
                    </div>

                    <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium text-white">
                            Admin Manager
                        </p>

                        <p className="truncate text-xs text-slate-500">
                            admin@routex.com
                        </p>

                    </div>

                    <ChevronDown
                        size={15}
                        className="text-slate-500"
                    />

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;