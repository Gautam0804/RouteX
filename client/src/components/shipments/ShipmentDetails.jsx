import Badge from "../common/Badge";

function ShipmentDetails({ shipment }) {

    if (!shipment) {
        return (
            <div className="py-10 text-center text-xs text-slate-500">
                No shipment selected.
            </div>
        );
    }

    const statusVariant =
        shipment.status === "Delivered"
            ? "success"
            : shipment.status === "Delayed"
            ? "danger"
            : shipment.status === "In Transit"
            ? "info"
            : "warning";

    return (
        <div className="space-y-6">

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Shipment ID
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-white">
                        {shipment.id}
                    </h3>
                </div>

                <Badge variant={statusVariant}>
                    {shipment.status}
                </Badge>

            </div>

            <div className="grid grid-cols-2 gap-5">

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Customer
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {shipment.customer || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Priority
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {shipment.priority || "Normal"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Route
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {shipment.route || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        ETA
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {shipment.eta || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Vehicle
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {shipment.vehicle || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Driver
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {shipment.driver || "Unassigned"}
                    </p>
                </div>

            </div>

            {shipment.notes && (
                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Notes
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                        {shipment.notes}
                    </p>
                </div>
            )}

        </div>
    );
}

export default ShipmentDetails;