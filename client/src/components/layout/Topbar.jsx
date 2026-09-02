import { useEffect, useState } from "react";

import {
    Search,
    Bell,
    Menu,
    Command,
    ChevronDown,
    User,
    Settings,
    LogOut,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import { getAlerts } from "../../services/api";


const pageTitles = {
    "/dashboard": {
        title: "Dashboard",
        description: "Fleet operations overview",
    },

    "/shipments": {
        title: "Shipments",
        description: "Manage and track shipments",
    },

    "/vehicles": {
        title: "Vehicles",
        description: "Manage your fleet",
    },

    "/drivers": {
        title: "Drivers",
        description: "Manage fleet drivers",
    },

    "/customers": {
        title: "Customers",
        description: "Manage your customers",
    },

    "/assignments": {
        title: "Assignments",
        description: "Manage shipment assignments",
    },

    "/tracking": {
        title: "Live Tracking",
        description: "Monitor vehicles in real time",
    },

    "/analytics": {
        title: "Analytics",
        description: "Fleet performance insights",
    },

    "/alerts": {
        title: "Alerts",
        description: "Monitor operational alerts",
    },

    "/settings": {
        title: "Settings",
        description: "Manage application settings",
    },

    "/reports": {
        title: "Reports",
        description: "Generate operational reports",
    },

    "/users": {
        title: "Users & Roles",
        description: "Manage system access",
    },
};


function Topbar({ onMenuClick }) {

    const location = useLocation();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);

    // ============================================================
    // REAL NOTIFICATIONS
    // ============================================================

    const [notifications, setNotifications] = useState([]);
    const [notificationLoading, setNotificationLoading] =
        useState(false);


    const currentPage =
        pageTitles[location.pathname] ||
        pageTitles["/dashboard"];


    // ============================================================
    // LOAD ALERTS
    // ============================================================

    const loadNotifications = async () => {

        try {

            setNotificationLoading(true);

            const response = await getAlerts();

            const data = Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response?.alerts)
                    ? response.alerts
                    : [];

            setNotifications(data);

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

            setNotifications([]);

        } finally {

            setNotificationLoading(false);

        }
    };


    // ============================================================
    // INITIAL LOAD + AUTO REFRESH
    // ============================================================

    useEffect(() => {

        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 30000);

        return () => {
            clearInterval(interval);
        };

    }, []);


    // ============================================================
    // REAL NOTIFICATION COUNT
    // ============================================================

    const notificationCount =
        notifications.filter(
            (notification) =>
                String(
                    notification.status || ""
                ).toLowerCase() !== "resolved"
        ).length;


    // ============================================================
    // SEARCH
    // ============================================================

    const handleSearch = (e) => {

        if (e.key !== "Enter") return;

        const value =
            search.trim().toLowerCase();

        if (!value) return;


        if (value.includes("shipment")) {
            navigate("/shipments");
        }

        else if (value.includes("vehicle")) {
            navigate("/vehicles");
        }

        else if (value.includes("driver")) {
            navigate("/drivers");
        }

        else if (value.includes("customer")) {
            navigate("/customers");
        }

        else if (value.includes("assignment")) {
            navigate("/assignments");
        }

        else if (value.includes("tracking")) {
            navigate("/tracking");
        }

        else if (value.includes("analytics")) {
            navigate("/analytics");
        }

        else if (value.includes("alert")) {
            navigate("/alerts");
        }

        else if (value.includes("setting")) {
            navigate("/settings");
        }

        else if (value.includes("report")) {
            navigate("/reports");
        }

        setSearch("");

    };


    return (

        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur sm:px-6 lg:px-7">

            {/* =====================================================
                LEFT
            ===================================================== */}

            <div className="flex items-center gap-3">

                {/* MOBILE MENU */}

                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900 hover:text-white lg:hidden"
                >
                    <Menu size={20} />
                </button>


                {/* PAGE INFORMATION */}

                <div>

                    <div className="flex items-center gap-2">

                        <h2 className="text-sm font-semibold text-white">
                            {currentPage.title}
                        </h2>

                        <span className="hidden rounded bg-slate-900 px-1.5 py-0.5 text-[8px] text-slate-600 sm:block">
                            ROUTEX
                        </span>

                    </div>


                    <p className="hidden text-[9px] text-slate-600 sm:block">
                        {currentPage.description}
                    </p>

                </div>

            </div>


            {/* =====================================================
                RIGHT
            ===================================================== */}

            <div className="flex items-center gap-2 sm:gap-4">


                {/* SEARCH */}

                <div className="hidden w-52 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 md:flex">

                    <Search
                        size={14}
                        className="shrink-0 text-slate-600"
                    />


                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={handleSearch}
                        type="text"
                        placeholder="Search RouteX..."
                        className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
                    />


                    <div className="flex items-center gap-1 rounded border border-slate-800 px-1.5 py-0.5">

                        <Command
                            size={9}
                            className="text-slate-600"
                        />

                        <span className="text-[8px] text-slate-600">
                            K
                        </span>

                    </div>

                </div>


                {/* MOBILE SEARCH */}

                <button
                    type="button"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-900 hover:text-white md:hidden"
                >
                    <Search size={17} />
                </button>


                {/* =================================================
                    REAL NOTIFICATIONS
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/alerts")
                    }
                    title={
                        notificationCount > 0
                            ? `${notificationCount} active notifications`
                            : "No active notifications"
                    }
                    className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-900 hover:text-white"
                >

                    <Bell
                        size={17}
                        className={
                            notificationCount > 0
                                ? "text-slate-300"
                                : ""
                        }
                    />


                    {/* REAL BADGE */}

                    {notificationCount > 0 && (

                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[7px] font-bold text-white shadow-lg shadow-red-500/20">

                            {notificationCount > 99
                                ? "99+"
                                : notificationCount}

                        </span>

                    )}

                </button>


                {/* DIVIDER */}

                <div className="hidden h-7 w-px bg-slate-800 sm:block" />


                {/* =====================================================
                    PROFILE
                ===================================================== */}

                <div className="relative">

                    <button
                        type="button"
                        onClick={() =>
                            setProfileOpen(
                                !profileOpen
                            )
                        }
                        className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-slate-900"
                    >

                        {/* AVATAR */}

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                            AM
                        </div>


                        {/* USER INFO */}

                        <div className="hidden text-left sm:block">

                            <p className="text-[10px] font-medium text-white">
                                Admin Manager
                            </p>

                            <p className="text-[8px] text-slate-600">
                                Super Admin
                            </p>

                        </div>


                        <ChevronDown
                            size={13}
                            className={`hidden text-slate-600 transition sm:block ${
                                profileOpen
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />

                    </button>


                    {/* PROFILE DROPDOWN */}

                    {profileOpen && (

                        <div className="absolute right-0 top-11 w-52 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">

                            {/* USER */}

                            <div className="border-b border-slate-800 p-3">

                                <p className="text-xs font-medium text-white">
                                    Admin Manager
                                </p>

                                <p className="mt-1 text-[9px] text-slate-600">
                                    admin@routex.com
                                </p>

                            </div>


                            {/* MENU */}

                            <div className="p-1.5">

                                <DropdownItem
                                    icon={User}
                                    label="My Profile"
                                    onClick={() => {
                                        navigate(
                                            "/settings"
                                        );
                                        setProfileOpen(
                                            false
                                        );
                                    }}
                                />


                                <DropdownItem
                                    icon={Settings}
                                    label="Settings"
                                    onClick={() => {
                                        navigate(
                                            "/settings"
                                        );
                                        setProfileOpen(
                                            false
                                        );
                                    }}
                                />

                            </div>


                            {/* LOGOUT */}

                            <div className="border-t border-slate-800 p-1.5">

                                <DropdownItem
                                    icon={LogOut}
                                    label="Sign Out"
                                    danger
                                    onClick={() => {
                                        setProfileOpen(
                                            false
                                        );

                                        alert(
                                            "Logout will be connected to backend authentication."
                                        );
                                    }}
                                />

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );
}


/* ================================================================
   DROPDOWN ITEM
================================================================ */

function DropdownItem({
    icon: Icon,
    label,
    onClick,
    danger = false,
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[10px] transition ${
                danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
        >

            <Icon size={14} />

            {label}

        </button>

    );
}


export default Topbar;