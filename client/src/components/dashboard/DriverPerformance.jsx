import { Star, Users } from "lucide-react";

import Card from "../common/Card";

function DriverPerformance({ driverData = [] }) {

    const drivers = Array.isArray(driverData) ? driverData : [];

    return (
        <Card
            title="Driver Performance"
            description="Top performing drivers"
        >
            <div className="space-y-4">

                {drivers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6">
                        <Users
                            size={24}
                            className="mb-2 text-slate-600"
                        />

                        <p className="text-xs text-slate-500">
                            No driver performance data available
                        </p>
                    </div>
                ) : (
                    drivers.map((driver, index) => {

                        const firstName = driver.first_name || "";
                        const lastName = driver.last_name || "";

                        const name =
                            driver.name ||
                            driver.driver_name ||
                            `${firstName} ${lastName}`.trim() ||
                            `Driver ${driver.id || driver.driver_id || ""}`;

                        const initials = name
                            .split(" ")
                            .filter(Boolean)
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                        const rating =
                            Number(
                                driver.rating ??
                                driver.average_rating ??
                                driver.performance_rating ??
                                0
                            ).toFixed(1);

                        const deliveries =
                            Number(
                                driver.deliveries ??
                                driver.completed_deliveries ??
                                driver.total_deliveries ??
                                0
                            );

                        return (
                            <div
                                key={
                                    driver.id ||
                                    driver.driver_id ||
                                    `${name}-${index}`
                                }
                                className="flex items-center gap-3"
                            >

                                {/* Rank */}
                                <span className="w-4 text-[9px] text-slate-600">
                                    {index + 1}
                                </span>

                                {/* Initials */}
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-[9px] font-bold text-blue-400">
                                    {initials || "DR"}
                                </div>

                                {/* Driver details */}
                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-xs font-medium text-white">
                                        {name}
                                    </p>

                                    <div className="mt-1 flex items-center gap-1">

                                        <Star
                                            size={10}
                                            className="fill-current text-amber-400"
                                        />

                                        <span className="text-[9px] text-slate-500">
                                            {rating}
                                        </span>

                                    </div>

                                </div>

                                {/* Deliveries */}
                                <div className="text-right">

                                    <p className="text-xs font-semibold text-white">
                                        {deliveries}
                                    </p>

                                    <p className="text-[8px] text-slate-600">
                                        deliveries
                                    </p>

                                </div>

                            </div>
                        );
                    })
                )}

            </div>
        </Card>
    );
}

export default DriverPerformance;