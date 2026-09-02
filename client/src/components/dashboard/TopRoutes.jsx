import {
    ArrowRight,
    MapPinned,
} from "lucide-react";

import Card from "../common/Card";

function TopRoutes({ routeData = [] }) {

    const routes = Array.isArray(routeData) ? routeData : [];

    return (
        <Card
            title="Top Routes"
            description="Most active shipping routes"
        >
            <div className="space-y-3">

                {routes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6">
                        <MapPinned
                            size={24}
                            className="mb-2 text-slate-600"
                        />

                        <p className="text-xs text-slate-500">
                            No route data available
                        </p>
                    </div>
                ) : (
                    routes.map((route, index) => {

                        const from =
                            route.from ||
                            route.origin ||
                            route.origin_city ||
                            route.pickup_city ||
                            "Unknown";

                        const to =
                            route.to ||
                            route.destination ||
                            route.destination_city ||
                            route.delivery_city ||
                            "Unknown";

                        const shipments = Number(
                            route.shipments ??
                            route.shipment_count ??
                            route.total_shipments ??
                            route.count ??
                            0
                        );

                        const successRate = Number(
                            route.successRate ??
                            route.success_rate ??
                            route.successRatePercentage ??
                            0
                        );

                        return (
                            <div
                                key={
                                    route.id ||
                                    route.route_id ||
                                    `${from}-${to}-${index}`
                                }
                                className="rounded-lg border border-slate-800 bg-slate-950 p-3"
                            >

                                <div className="flex items-center gap-2">

                                    <MapPinned
                                        size={14}
                                        className="shrink-0 text-blue-400"
                                    />

                                    <div className="flex min-w-0 flex-1 items-center gap-2">

                                        <span className="truncate text-[10px] text-slate-300">
                                            {from}
                                        </span>

                                        <ArrowRight
                                            size={12}
                                            className="shrink-0 text-slate-600"
                                        />

                                        <span className="truncate text-[10px] text-slate-300">
                                            {to}
                                        </span>

                                    </div>

                                </div>

                                <div className="mt-2 flex items-center justify-between">

                                    <span className="text-[9px] text-slate-600">
                                        {shipments} shipments
                                    </span>

                                    <span className="text-[9px] font-medium text-emerald-400">
                                        {successRate}% success
                                    </span>

                                </div>

                            </div>
                        );
                    })
                )}

            </div>
        </Card>
    );
}

export default TopRoutes;