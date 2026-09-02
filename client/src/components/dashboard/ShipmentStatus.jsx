import {
    PackageCheck,
    Truck,
    Clock3,
    XCircle,
} from "lucide-react";


const statusConfig = {
    delivered: {
        label: "Delivered",
        icon: PackageCheck,
        className: "bg-emerald-500",
        text: "text-emerald-400",
    },

    in_transit: {
        label: "In Transit",
        icon: Truck,
        className: "bg-blue-500",
        text: "text-blue-400",
    },

    delayed: {
        label: "Delayed",
        icon: Clock3,
        className: "bg-amber-500",
        text: "text-amber-400",
    },

    cancelled: {
        label: "Cancelled",
        icon: XCircle,
        className: "bg-red-500",
        text: "text-red-400",
    },
};


function ShipmentStatus({ statusData = [], period = "Today" }) {

    /*
     * Expected data:
     *
     * [
     *   {
     *     status: "delivered",
     *     count: 1024,
     *     percentage: 82
     *   },
     *   ...
     * ]
     */

    const normalizedData = statusData.map((item) => {

        const key = String(item.status || "")
            .toLowerCase()
            .replace(/[\s-]+/g, "_");

        const config = statusConfig[key];

        if (!config) {
            return null;
        }

        return {
            ...item,
            ...config,
            count: Number(item.count) || 0,
            percentage: Number(
                item.percentage ?? item.value ?? 0
            ),
        };

    }).filter(Boolean);


    const delivered =
        normalizedData.find(
            (item) => item.status === "delivered"
        );

    const deliveredPercentage =
        delivered?.percentage || 0;


    return (

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">

            {/* HEADER */}

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Shipment health
                    </p>

                    <h2 className="mt-1 text-sm font-semibold text-white">
                        Shipment Status
                    </h2>

                </div>


                <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[9px] text-slate-600">
                    {period}
                </span>

            </div>


            {/* DONUT */}

            <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-[14px] border-emerald-500/20">

                <div className="text-center">

                    <p className="text-2xl font-semibold text-white">
                        {deliveredPercentage}%
                    </p>

                    <p className="text-[9px] text-slate-600">
                        Delivered
                    </p>

                </div>

            </div>


            {/* STATUS LIST */}

            <div className="mt-6 space-y-3">

                {normalizedData.length > 0 ? (

                    normalizedData.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.status}
                                className="group"
                            >

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-2">

                                        <Icon
                                            size={13}
                                            className={item.text}
                                        />

                                        <span className="text-[10px] text-slate-400">
                                            {item.label}
                                        </span>

                                    </div>


                                    <div className="flex items-center gap-2">

                                        <span className="text-[9px] text-slate-600">
                                            {item.count}
                                        </span>

                                        <span className="w-8 text-right text-[10px] font-medium text-slate-300">
                                            {item.percentage}%
                                        </span>

                                    </div>

                                </div>


                                {/* PROGRESS */}

                                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">

                                    <div
                                        className={`h-full rounded-full ${item.className}`}
                                        style={{
                                            width: `${Math.min(
                                                Math.max(
                                                    item.percentage,
                                                    0
                                                ),
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        );

                    })

                ) : (

                    <div className="py-5 text-center">

                        <p className="text-xs text-slate-600">
                            No shipment status data available
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}


export default ShipmentStatus;