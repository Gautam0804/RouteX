import {
    MoreHorizontal,
} from "lucide-react";

import Badge from "../common/Badge";

function ShipmentTable({
    shipments = [],
    onSelect,
}) {

    const getStatusVariant = (status) => {

        switch (status) {
            case "Delivered":
                return "success";

            case "In Transit":
                return "info";

            case "Delayed":
                return "danger";

            case "Out for Delivery":
                return "warning";

            default:
                return "default";
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50">

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Shipment
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Customer
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Route
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Vehicle
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Driver
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Priority
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Status
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] uppercase tracking-wider text-slate-600">
                                Action
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {shipments.map((shipment) => (

                            <tr
                                key={shipment.id}
                                className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/30"
                            >

                                <td className="px-5 py-4">
                                    <p className="text-sm font-semibold text-white">
                                        {shipment.id}
                                    </p>

                                    <p className="mt-1 text-[10px] text-slate-600">
                                        {shipment.date || "—"}
                                    </p>
                                </td>

                                <td className="px-5 py-4 text-xs text-slate-400">
                                    {shipment.customer}
                                </td>

                                <td className="px-5 py-4 text-xs text-slate-400">
                                    {shipment.route}
                                </td>

                                <td className="px-5 py-4">

                                    <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] text-slate-300">
                                        {shipment.vehicle || "—"}
                                    </span>

                                </td>

                                <td className="px-5 py-4 text-xs text-slate-400">
                                    {shipment.driver || "Unassigned"}
                                </td>

                                <td className="px-5 py-4 text-xs">

                                    <span
                                        className={
                                            shipment.priority === "High"
                                                ? "text-red-400"
                                                : shipment.priority === "Low"
                                                ? "text-slate-500"
                                                : "text-slate-400"
                                        }
                                    >
                                        {shipment.priority || "Normal"}
                                    </span>

                                </td>

                                <td className="px-5 py-4">

                                    <Badge variant={getStatusVariant(shipment.status)}>
                                        {shipment.status}
                                    </Badge>

                                </td>

                                <td className="px-5 py-4 text-right">

                                    <button
                                        onClick={() => onSelect?.(shipment)}
                                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ShipmentTable;