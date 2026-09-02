import {
    MoreHorizontal,
} from "lucide-react";

import Badge from "../common/Badge";

function CustomerTable({
    customers = [],
    onSelect,
}) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50">

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Customer
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Contact
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-slate-600">
                                Shipments
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

                        {customers.map((customer) => (

                            <tr
                                key={customer.id}
                                className="border-b border-slate-800/70 last:border-0 hover:bg-slate-800/30"
                            >

                                <td className="px-5 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-xs font-semibold text-blue-400">
                                            {customer.name
                                                ?.split(" ")
                                                .map((word) => word[0])
                                                .join("")
                                                .slice(0, 2)
                                            }
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {customer.name}
                                            </p>

                                            <p className="text-[10px] text-slate-600">
                                                {customer.id}
                                            </p>
                                        </div>

                                    </div>

                                </td>

                                <td className="px-5 py-4">

                                    <p className="text-xs text-slate-400">
                                        {customer.email}
                                    </p>

                                    <p className="mt-1 text-[10px] text-slate-600">
                                        {customer.phone}
                                    </p>

                                </td>

                                <td className="px-5 py-4 text-sm text-slate-400">
                                    {customer.shipments ?? 0}
                                </td>

                                <td className="px-5 py-4">

                                    <Badge
                                        variant={
                                            customer.status === "Active"
                                                ? "success"
                                                : "default"
                                        }
                                    >
                                        {customer.status}
                                    </Badge>

                                </td>

                                <td className="px-5 py-4 text-right">

                                    <button
                                        onClick={() => onSelect?.(customer)}
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

export default CustomerTable;