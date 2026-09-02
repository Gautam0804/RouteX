import { useState } from "react";
import {
    Bell,
    Mail,
    Truck,
    AlertTriangle,
} from "lucide-react";

function NotificationSettings() {
    const [settings, setSettings] = useState({
        shipmentUpdates: true,
        vehicleAlerts: true,
        emailNotifications: true,
        systemAlerts: true,
    });

    const toggleSetting = (key) => {
        setSettings((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));
    };

    const options = [
        {
            key: "shipmentUpdates",
            title: "Shipment Updates",
            description:
                "Receive notifications when shipment status changes.",
            icon: Truck,
        },
        {
            key: "vehicleAlerts",
            title: "Vehicle Alerts",
            description:
                "Get alerts for vehicle maintenance and breakdowns.",
            icon: AlertTriangle,
        },
        {
            key: "emailNotifications",
            title: "Email Notifications",
            description:
                "Receive important fleet updates through email.",
            icon: Mail,
        },
        {
            key: "systemAlerts",
            title: "System Alerts",
            description:
                "Receive important system and security notifications.",
            icon: Bell,
        },
    ];

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-6 py-5">
                <h2 className="text-sm font-semibold text-white">
                    Notification Preferences
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Choose which notifications you want to receive.
                </p>
            </div>

            <div className="divide-y divide-slate-800">
                {options.map((option) => {
                    const Icon = option.icon;

                    return (
                        <div
                            key={option.key}
                            className="flex items-center gap-4 px-6 py-5"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                <Icon size={17} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white">
                                    {option.title}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {option.description}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    toggleSetting(option.key)
                                }
                                className={`relative h-5 w-9 rounded-full transition ${
                                    settings[option.key]
                                        ? "bg-blue-600"
                                        : "bg-slate-700"
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                                        settings[option.key]
                                            ? "left-[18px]"
                                            : "left-0.5"
                                    }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default NotificationSettings;