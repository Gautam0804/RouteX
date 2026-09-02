import {
    X,
    AlertTriangle,
    Truck,
    User,
    MapPin,
    Clock,
    ShieldAlert,
} from "lucide-react";

function AlertDetails({ alert, onClose }) {
    if (!alert) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
                {/* HEADER */}

                <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                            <ShieldAlert size={19} />
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                {alert.id}
                            </p>

                            <h2 className="mt-1 text-base font-semibold text-white">
                                {alert.type}
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Alert details and incident information
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* DESCRIPTION */}

                <div className="border-b border-slate-800 p-6">
                    <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-4">
                        <div className="flex gap-3">
                            <AlertTriangle
                                size={17}
                                className="mt-0.5 shrink-0 text-red-400"
                            />

                            <div>
                                <p className="text-xs font-medium text-red-300">
                                    Alert Description
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                    {alert.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFORMATION */}

                <div className="grid grid-cols-1 gap-px bg-slate-800 sm:grid-cols-2">
                    <InfoItem
                        icon={Truck}
                        label="Vehicle"
                        value={alert.vehicle}
                    />

                    <InfoItem
                        icon={User}
                        label="Driver"
                        value={alert.driver}
                    />

                    <InfoItem
                        icon={MapPin}
                        label="Location"
                        value={alert.location}
                    />

                    <InfoItem
                        icon={Clock}
                        label="Detected"
                        value={alert.time}
                    />
                </div>

                {/* FOOTER */}

                <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-600">
                            Current status
                        </span>

                        <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-400">
                            {alert.status}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="bg-slate-950 p-5">
            <div className="mb-2 flex items-center gap-2">
                <Icon
                    size={14}
                    className="text-slate-600"
                />

                <span className="text-[10px] uppercase tracking-wider text-slate-600">
                    {label}
                </span>
            </div>

            <p className="text-xs font-medium text-white">
                {value}
            </p>
        </div>
    );
}

export default AlertDetails;