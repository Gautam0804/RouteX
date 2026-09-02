import { useState } from "react";

import {
    User,
    Bell,
    Shield,
    Globe,
    Save,
    CheckCircle2,
    Building2,
    Mail,
    Clock3,
    IndianRupee,
    Smartphone,
    Monitor,
    Sun,
    KeyRound,
    Truck,
} from "lucide-react";


function Settings() {

    const [activeTab, setActiveTab] = useState("General");

    const [saved, setSaved] = useState(false);


    // ============================================================
    // GENERAL SETTINGS
    // ============================================================

    const [general, setGeneral] = useState({
        organization: "RouteX Logistics",
        email: "admin@routex.com",
        timezone: "Asia/Kolkata",
        currency: "INR",
    });


    // ============================================================
    // PROFILE
    // ============================================================

    const [profile, setProfile] = useState({
        name: "RouteX Administrator",
        email: "admin@routex.com",
        phone: "+91 98765 43210",
        role: "Fleet Administrator",
    });


    // ============================================================
    // NOTIFICATIONS
    // ============================================================

    const [notifications, setNotifications] = useState({
        shipment: true,
        vehicle: true,
        driver: true,
        email: true,
        browser: false,
    });


    // ============================================================
    // SECURITY
    // ============================================================

    const [security, setSecurity] = useState({
        twoFactor: false,
        loginAlerts: true,
        sessionTimeout: "30 minutes",
    });


    // ============================================================
    // LOCALIZATION
    // ============================================================

    const [localization, setLocalization] = useState({
        language: "English",
        dateFormat: "DD/MM/YYYY",
        distance: "Kilometers",
        temperature: "Celsius",
    });


    // ============================================================
    // TABS
    // ============================================================

    const tabs = [
        {
            id: "General",
            icon: Building2,
        },
        {
            id: "Profile",
            icon: User,
        },
        {
            id: "Notifications",
            icon: Bell,
        },
        {
            id: "Security",
            icon: Shield,
        },
        {
            id: "Localization",
            icon: Globe,
        },
    ];


    // ============================================================
    // SAVE
    // ============================================================

    const handleSave = () => {

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);

    };


    return (

        <div className="space-y-6">

            {/* ============================================================
                HEADER
            ============================================================ */}

            <div>

                <div className="flex items-center gap-2">

                    <p className="text-[10px] font-medium uppercase tracking-widest text-blue-400">
                        ROUTEX / SYSTEM
                    </p>

                    <span className="h-1 w-1 rounded-full bg-slate-700" />

                    <span className="text-[10px] text-slate-600">
                        Configuration
                    </span>

                </div>


                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Settings
                </h1>


                <p className="mt-1 text-xs text-slate-500">
                    Manage your RouteX workspace, preferences and security.
                </p>

            </div>


            {/* ============================================================
                SETTINGS LAYOUT
            ============================================================ */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">


                {/* ========================================================
                    SIDEBAR
                ======================================================== */}

                <div className="h-fit rounded-xl border border-slate-800 bg-slate-900 p-2">

                    <p className="px-3 py-2 text-[9px] font-medium uppercase tracking-widest text-slate-600">
                        Settings
                    </p>


                    <div className="space-y-1">

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
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                                        active
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                                    }`}
                                >

                                    <Icon size={15} />

                                    {tab.id}

                                </button>

                            );

                        })}

                    </div>

                </div>


                {/* ========================================================
                    CONTENT
                ======================================================== */}

                <div className="min-w-0">


                    {/* GENERAL */}

                    {activeTab === "General" && (

                        <GeneralSettings
                            data={general}
                            setData={setGeneral}
                            onSave={handleSave}
                        />

                    )}


                    {/* PROFILE */}

                    {activeTab === "Profile" && (

                        <ProfileSettings
                            data={profile}
                            setData={setProfile}
                            onSave={handleSave}
                        />

                    )}


                    {/* NOTIFICATIONS */}

                    {activeTab === "Notifications" && (

                        <NotificationSettings
                            data={notifications}
                            setData={setNotifications}
                            onSave={handleSave}
                        />

                    )}


                    {/* SECURITY */}

                    {activeTab === "Security" && (

                        <SecuritySettings
                            data={security}
                            setData={setSecurity}
                            onSave={handleSave}
                        />

                    )}


                    {/* LOCALIZATION */}

                    {activeTab === "Localization" && (

                        <LocalizationSettings
                            data={localization}
                            setData={setLocalization}
                            onSave={handleSave}
                        />

                    )}

                </div>

            </div>


            {/* ============================================================
                SAVE SUCCESS
            ============================================================ */}

            {saved && (

                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-slate-900 px-4 py-3 shadow-2xl">

                    <CheckCircle2
                        size={16}
                        className="text-emerald-400"
                    />

                    <div>

                        <p className="text-xs font-medium text-white">
                            Changes saved
                        </p>

                        <p className="text-[9px] text-slate-500">
                            Your settings have been updated.
                        </p>

                    </div>

                </div>

            )}

        </div>

    );
}


/* =========================================================================
   GENERAL SETTINGS
============================================================================= */

function GeneralSettings({
    data,
    setData,
    onSave,
}) {

    return (

        <SettingsCard
            title="General Settings"
            description="Configure your organization and workspace."
            icon={Building2}
        >

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Input
                    label="Organization Name"
                    icon={Building2}
                    value={data.organization}
                    onChange={(value) =>
                        setData({
                            ...data,
                            organization: value,
                        })
                    }
                />


                <Input
                    label="Administrator Email"
                    icon={Mail}
                    value={data.email}
                    onChange={(value) =>
                        setData({
                            ...data,
                            email: value,
                        })
                    }
                />


                <Select
                    label="Timezone"
                    icon={Clock3}
                    value={data.timezone}
                    onChange={(value) =>
                        setData({
                            ...data,
                            timezone: value,
                        })
                    }
                    options={[
                        "Asia/Kolkata",
                        "Asia/Dubai",
                        "Europe/London",
                        "America/New_York",
                    ]}
                />


                <Select
                    label="Default Currency"
                    icon={IndianRupee}
                    value={data.currency}
                    onChange={(value) =>
                        setData({
                            ...data,
                            currency: value,
                        })
                    }
                    options={[
                        "INR",
                        "USD",
                        "EUR",
                        "GBP",
                    ]}
                />

            </div>


            <SaveButton onClick={onSave} />

        </SettingsCard>

    );
}


/* =========================================================================
   PROFILE
============================================================================= */

function ProfileSettings({
    data,
    setData,
    onSave,
}) {

    return (

        <SettingsCard
            title="Administrator Profile"
            description="Manage your personal account information."
            icon={User}
        >

            <div className="mb-6 flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    RA
                </div>

                <div>

                    <p className="text-sm font-medium text-white">
                        {data.name}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                        {data.role}
                    </p>

                </div>

            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Input
                    label="Full Name"
                    icon={User}
                    value={data.name}
                    onChange={(value) =>
                        setData({
                            ...data,
                            name: value,
                        })
                    }
                />


                <Input
                    label="Email Address"
                    icon={Mail}
                    value={data.email}
                    onChange={(value) =>
                        setData({
                            ...data,
                            email: value,
                        })
                    }
                />


                <Input
                    label="Phone Number"
                    icon={Smartphone}
                    value={data.phone}
                    onChange={(value) =>
                        setData({
                            ...data,
                            phone: value,
                        })
                    }
                />


                <Input
                    label="Role"
                    icon={Shield}
                    value={data.role}
                    onChange={(value) =>
                        setData({
                            ...data,
                            role: value,
                        })
                    }
                />

            </div>


            <SaveButton onClick={onSave} />

        </SettingsCard>

    );
}


/* =========================================================================
   NOTIFICATIONS
============================================================================= */

function NotificationSettings({
    data,
    setData,
    onSave,
}) {

    return (

        <SettingsCard
            title="Notifications"
            description="Control which operational events you receive."
            icon={Bell}
        >

            <div className="space-y-1">

                <Toggle
                    title="Shipment Alerts"
                    description="Receive alerts for delayed or failed shipments."
                    value={data.shipment}
                    onChange={() =>
                        setData({
                            ...data,
                            shipment: !data.shipment,
                        })
                    }
                />


                <Toggle
                    title="Vehicle Alerts"
                    description="Receive vehicle maintenance and status alerts."
                    value={data.vehicle}
                    onChange={() =>
                        setData({
                            ...data,
                            vehicle: !data.vehicle,
                        })
                    }
                />


                <Toggle
                    title="Driver Alerts"
                    description="Receive important driver activity notifications."
                    value={data.driver}
                    onChange={() =>
                        setData({
                            ...data,
                            driver: !data.driver,
                        })
                    }
                />


                <Toggle
                    title="Email Notifications"
                    description="Send important operational alerts to your email."
                    value={data.email}
                    onChange={() =>
                        setData({
                            ...data,
                            email: !data.email,
                        })
                    }
                />


                <Toggle
                    title="Browser Notifications"
                    description="Show real-time alerts in your browser."
                    value={data.browser}
                    onChange={() =>
                        setData({
                            ...data,
                            browser: !data.browser,
                        })
                    }
                />

            </div>


            <SaveButton onClick={onSave} />

        </SettingsCard>

    );
}


/* =========================================================================
   SECURITY
============================================================================= */

function SecuritySettings({
    data,
    setData,
    onSave,
}) {

    return (

        <SettingsCard
            title="Security"
            description="Manage authentication and account protection."
            icon={Shield}
        >

            <div className="space-y-1">

                <Toggle
                    title="Two-Factor Authentication"
                    description="Require an additional verification step during login."
                    value={data.twoFactor}
                    onChange={() =>
                        setData({
                            ...data,
                            twoFactor: !data.twoFactor,
                        })
                    }
                />


                <Toggle
                    title="Login Alerts"
                    description="Notify you when a new login is detected."
                    value={data.loginAlerts}
                    onChange={() =>
                        setData({
                            ...data,
                            loginAlerts: !data.loginAlerts,
                        })
                    }
                />

            </div>


            <div className="mt-5">

                <Select
                    label="Session Timeout"
                    icon={Clock3}
                    value={data.sessionTimeout}
                    onChange={(value) =>
                        setData({
                            ...data,
                            sessionTimeout: value,
                        })
                    }
                    options={[
                        "15 minutes",
                        "30 minutes",
                        "1 hour",
                        "4 hours",
                        "Never",
                    ]}
                />

            </div>


            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-xs text-slate-300 transition hover:bg-slate-800"
                >

                    <KeyRound size={14} />

                    Change Password

                </button>


                <SaveButton onClick={onSave} />

            </div>

        </SettingsCard>

    );
}


/* =========================================================================
   LOCALIZATION
============================================================================= */

function LocalizationSettings({
    data,
    setData,
    onSave,
}) {

    return (

        <SettingsCard
            title="Localization"
            description="Configure regional and display preferences."
            icon={Globe}
        >

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <Select
                    label="Language"
                    icon={Globe}
                    value={data.language}
                    onChange={(value) =>
                        setData({
                            ...data,
                            language: value,
                        })
                    }
                    options={[
                        "English",
                        "Hindi",
                    ]}
                />


                <Select
                    label="Date Format"
                    icon={CalendarIcon}
                    value={data.dateFormat}
                    onChange={(value) =>
                        setData({
                            ...data,
                            dateFormat: value,
                        })
                    }
                    options={[
                        "DD/MM/YYYY",
                        "MM/DD/YYYY",
                        "YYYY-MM-DD",
                    ]}
                />


                <Select
                    label="Distance Unit"
                    icon={TruckIcon}
                    value={data.distance}
                    onChange={(value) =>
                        setData({
                            ...data,
                            distance: value,
                        })
                    }
                    options={[
                        "Kilometers",
                        "Miles",
                    ]}
                />


                <Select
                    label="Temperature"
                    icon={Sun}
                    value={data.temperature}
                    onChange={(value) =>
                        setData({
                            ...data,
                            temperature: value,
                        })
                    }
                    options={[
                        "Celsius",
                        "Fahrenheit",
                    ]}
                />

            </div>


            <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                    <Monitor
                        size={16}
                        className="text-blue-400"
                    />

                    <div>

                        <p className="text-xs font-medium text-white">
                            Display Preferences
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                            RouteX currently uses the dark interface.
                        </p>

                    </div>

                </div>

            </div>


            <SaveButton onClick={onSave} />

        </SettingsCard>

    );
}


/* =========================================================================
   COMMON SETTINGS CARD
============================================================================= */

function SettingsCard({
    title,
    description,
    icon: Icon,
    children,
}) {

    return (

        <div className="rounded-xl border border-slate-800 bg-slate-900">

            <div className="flex items-start gap-3 border-b border-slate-800 p-5">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">

                    <Icon
                        size={17}
                        className="text-blue-400"
                    />

                </div>


                <div>

                    <h2 className="text-sm font-semibold text-white">
                        {title}
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-600">
                        {description}
                    </p>

                </div>

            </div>


            <div className="p-5">

                {children}

            </div>

        </div>

    );
}


/* =========================================================================
   INPUT
============================================================================= */

function Input({
    label,
    icon: Icon,
    value,
    onChange,
}) {

    return (

        <div>

            <label className="text-[10px] font-medium text-slate-500">
                {label}
            </label>


            <div className="relative mt-2">

                <Icon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700"
                />


                <input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white outline-none transition focus:border-blue-500"
                />

            </div>

        </div>

    );
}


/* =========================================================================
   SELECT
============================================================================= */

function Select({
    label,
    icon: Icon,
    value,
    onChange,
    options,
}) {

    return (

        <div>

            <label className="text-[10px] font-medium text-slate-500">
                {label}
            </label>


            <div className="relative mt-2">

                <Icon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700"
                />


                <select
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white outline-none transition focus:border-blue-500"
                >

                    {options.map((option) => (

                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>

                    ))}

                </select>

            </div>

        </div>

    );
}


/* =========================================================================
   TOGGLE
============================================================================= */

function Toggle({
    title,
    description,
    value,
    onChange,
}) {

    return (

        <button
            type="button"
            onClick={onChange}
            className="flex w-full items-center justify-between rounded-lg p-4 text-left transition hover:bg-slate-950"
        >

            <div className="pr-5">

                <p className="text-xs font-medium text-slate-300">
                    {title}
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-600">
                    {description}
                </p>

            </div>


            <div
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                    value
                        ? "bg-blue-600"
                        : "bg-slate-700"
                }`}
            >

                <span
                    className={`absolute top-1 h-3 w-3 rounded-full bg-white transition ${
                        value
                            ? "left-5"
                            : "left-1"
                    }`}
                />

            </div>

        </button>

    );
}


/* =========================================================================
   SAVE BUTTON
============================================================================= */

function SaveButton({
    onClick,
}) {

    return (

        <div className="mt-6 flex justify-end">

            <button
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
            >

                <Save size={14} />

                Save Changes

            </button>

        </div>

    );
}


/* =========================================================================
   ICON HELPERS
============================================================================= */

function CalendarIcon(props) {
    return <Clock3 {...props} />;
}


function TruckIcon(props) {
    return <Truck {...props} />;
}


export default Settings;