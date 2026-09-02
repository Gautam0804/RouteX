import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">

            {/* SIDEBAR */}
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* MAIN AREA */}
            <div className="lg:pl-64">

                {/* TOPBAR */}
                <Topbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* PAGE CONTENT */}
                <main className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-7">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default Layout;