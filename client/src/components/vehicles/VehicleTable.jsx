import {
    MoreHorizontal,
} from "lucide-react";

import Badge from "../common/Badge";

function VehicleTable({
    vehicles = [],
    onSelect,
}) {

    const getVariant = (status) => {

        if (status === "Active") return "success";
        if (status === "Maintenance") return "warning";
        if (status === "Inactive") return "default";

        return "info";
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50">

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Vehicle
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Type
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Driver
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Mileage
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

                        {vehicles.map((vehicle) => (

                            <tr
                                key={vehicle.id}
                                className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/30"
                            >

                                <td className="px-5 py-4">

                                    <p className="text-sm font-semibold text-white">
                                        {vehicle.registration}
                                    </p>

                                    <p className="mt-1 text-[10px] text-slate-600">
                                        {vehicle.id}
                                    </p>

                                </td>

                                <td className="px-5 py-4 text-xs text-slate-400">
                                    {vehicle.type}
                                </td>

                                <td className="px-5 py-4 text-xs text-slate-400">
                                    {vehicle.driver || "Unassigned"}
                                </td>

                                <td className="px-5 py-4 text-xs text-slate-400">
                                    {vehicle.mileage
                                        ? `${vehicle.mileage.toLocaleString()} km`
                                        : "—"
                                    }
                                </td>

                                <td className="px-5 py-4">

                                    <Badge variant={getVariant(vehicle.status)}>
                                        {vehicle.status}
                                    </Badge>

                                </td>

                                <td className="px-5 py-4 text-right">

                                    <button
                                        onClick={() => onSelect?.(vehicle)}
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

export default VehicleTable;