import Badge from "../common/Badge";

function VehicleDetails({ vehicle }) {

    if (!vehicle) {
        return (
            <div className="py-10 text-center text-xs text-slate-500">
                No vehicle selected.
            </div>
        );
    }

    const statusVariant =
        vehicle.status === "Active"
            ? "success"
            : vehicle.status === "Maintenance"
            ? "warning"
            : "default";

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                    🚚
                </div>

                <div>
                    <h3 className="text-base font-semibold text-white">
                        {vehicle.registration}
                    </h3>

                    <p className="text-xs text-slate-500">
                        {vehicle.model || vehicle.type}
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-2 gap-5">

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Vehicle ID
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {vehicle.id || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Type
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {vehicle.type || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Driver
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {vehicle.driver || "Unassigned"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Fuel
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {vehicle.fuelType || "Diesel"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Mileage
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {vehicle.mileage
                            ? `${vehicle.mileage.toLocaleString()} km`
                            : "—"
                        }
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Status
                    </p>

                    <div className="mt-1">
                        <Badge variant={statusVariant}>
                            {vehicle.status}
                        </Badge>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default VehicleDetails;