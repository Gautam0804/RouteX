import {
    MoreHorizontal,
} from "lucide-react";

import Badge from "../common/Badge";

function DriverTable({
    drivers = [],
    onSelect,
}) {

    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50">

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Driver
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                License
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Vehicle
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Rating
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

                        {drivers.map((driver) => (

                            <tr
                                key={driver.id}
                                className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/30"
                            >

                                <td className="px-5 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-blue-400">
                                            {driver.name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)
                                            }
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {driver.name}
                                            </p>

                                            <p className="text-[10px] text-slate-600">
                                                {driver.phone}
                                            </p>
                                        </div>

                                    </div>

                                </td>

                                <td className="px-5 py-4 text-xs text-slate-400">
                                    {driver.license || "—"}
                                </td>

                                <td className="px-5 py-4 text-xs text-slate-400">
                                    {driver.vehicle || "Unassigned"}
                                </td>

                                <td className="px-5 py-4 text-xs text-amber-400">
                                    ★ {driver.rating ?? "—"}
                                </td>

                                <td className="px-5 py-4">

                                    <Badge
                                        variant={
                                            driver.status === "Available"
                                                ? "success"
                                                : driver.status === "On Duty"
                                                ? "info"
                                                : "warning"
                                        }
                                    >
                                        {driver.status}
                                    </Badge>

                                </td>

                                <td className="px-5 py-4 text-right">

                                    <button
                                        onClick={() => onSelect?.(driver)}
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

export default DriverTable;