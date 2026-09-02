import { useState } from "react";

import {
    User,
    Bell,
    Shield,
    Monitor,
} from "lucide-react";

import ProfileSettings from "./ProfileSettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";
import SystemSettings from "./SystemSettings";

const tabs = [
    {
        id: "profile",
        label: "Profile",
        icon: User,
    },
    {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
    },
    {
        id: "security",
        label: "Security",
        icon: Shield,
    },
    {
        id: "system",
        label: "System",
        icon: Monitor,
    },
];

function SettingsPanel() {
    const [activeTab, setActiveTab] = useState("profile");

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileSettings />;

            case "notifications":
                return <NotificationSettings />;

            case "security":
                return <SecuritySettings />;

            case "system":
                return <SystemSettings />;

            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div>
            <div className="mb-7">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    SYSTEM
                </p>

                <h1 className="mt-1 text-2xl font-semibold text-white">
                    Settings
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                    Manage your account and RouteX preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
                {/* SETTINGS MENU */}

                <div className="h-fit rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;

                        const active =
                            activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() =>
                                    setActiveTab(tab.id)
                                }
                                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs transition ${
                                    active
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <Icon size={16} />

                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* CONTENT */}

                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default SettingsPanel;