import {
    ArrowUpRight,
    MoreHorizontal,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";

function RecentShipments({ shipmentData = [] }) {

    const shipments = Array.isArray(shipmentData)
        ? shipmentData
        : [];

    const getValue = (shipment, fields, fallback = "—") => {
        for (const field of fields) {
            if (
                shipment?.[field] !== undefined &&
                shipment?.[field] !== null &&
                shipment?.[field] !== ""
            ) {
                return shipment[field];
            }
        }

        return fallback;
    };

    const formatStatus = (status) => {
        if (!status) return "—";

        return String(status)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatPriority = (priority) => {
        if (!priority) return "—";

        return String(priority)
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getPriorityClass = (priority) => {
        const value = String(priority || "").toLowerCase();

        if (value === "high" || value === "critical") {
            return "text-red-400";
        }

        if (value === "medium") {
            return "text-amber-400";
        }

        if (value === "low") {
            return "text-slate-500";
        }

        return "text-slate-400";
    };

    const formatETA = (shipment) => {
        const eta = getValue(
            shipment,
            [
                "eta",
                "estimated_delivery",
                "estimatedDelivery",
                "delivery_date",
                "deliveryDate",
            ],
            null
        );

        if (!eta) {
            return "—";
        }

        const date = new Date(eta);

        if (Number.isNaN(date.getTime())) {
            return String(eta);
        }

        return date.toLocaleDateString();
    };

    return (
        <Card
            title="Recent Shipments"
            description="Latest shipment activity"
            action={
                <a
                    href="/shipments"
                    className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300"
                >
                    View all
                    <ArrowUpRight size={12} />
                </a>
            }
        >

            <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                    <thead>

                        <tr className="border-b border-slate-800">

                            {[
                                "Shipment",
                                "Customer",
                                "Route",
                                "Vehicle",
                                "Driver",
                                "Priority",
                                "Status",
                                "ETA",
                                "",
                            ].map((heading) => (

                                <th
                                    key={heading}
                                    className="px-3 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-slate-600"
                                >
                                    {heading}
                                </th>

                            ))}

                        </tr>

                    </thead>

                    <tbody>

                        {shipments.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-3 py-10 text-center"
                                >
                                    <p className="text-xs font-medium text-white">
                                        No recent shipments
                                    </p>

                                    <p className="mt-1 text-[9px] text-slate-600">
                                        Shipment activity will appear here.
                                    </p>
                                </td>
                            </tr>

                        ) : (

                            shipments.map((shipment, index) => {

                                const shipmentId = getValue(
                                    shipment,
                                    [
                                        "tracking_number",
                                        "trackingNumber",
                                        "shipment_number",
                                        "shipmentNumber",
                                        "id",
                                    ],
                                    `Shipment ${index + 1}`
                                );

                                const customer = getValue(
                                    shipment,
                                    [
                                        "customer_name",
                                        "customerName",
                                        "company_name",
                                        "companyName",
                                        "customer",
                                    ]
                                );

                                const origin = getValue(
                                    shipment,
                                    [
                                        "origin_city",
                                        "originCity",
                                        "origin",
                                    ],
                                    ""
                                );

                                const destination = getValue(
                                    shipment,
                                    [
                                        "destination_city",
                                        "destinationCity",
                                        "destination",
                                    ],
                                    ""
                                );

                                const route =
                                    origin && destination
                                        ? `${origin} → ${destination}`
                                        : getValue(
                                              shipment,
                                              ["route"],
                                              "—"
                                          );

                                const vehicle = getValue(
                                    shipment,
                                    [
                                        "vehicle_number",
                                        "vehicleNumber",
                                        "vehicle",
                                    ]
                                );

                                const driver = getValue(
                                    shipment,
                                    [
                                        "driver_name",
                                        "driverName",
                                        "driver",
                                    ]
                                );

                                const priority = getValue(
                                    shipment,
                                    ["priority"],
                                    "Normal"
                                );

                                const status = getValue(
                                    shipment,
                                    ["status"],
                                    "pending"
                                );

                                return (
                                    <tr
                                        key={
                                            shipment.id ||
                                            shipment.tracking_number ||
                                            index
                                        }
                                        className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20"
                                    >

                                        {/* Shipment */}

                                        <td className="px-3 py-3">

                                            <span className="text-[10px] font-semibold text-white">
                                                {shipmentId}
                                            </span>

                                        </td>

                                        {/* Customer */}

                                        <td className="px-3 py-3">

                                            <span className="text-[10px] text-slate-400">
                                                {customer}
                                            </span>

                                        </td>

                                        {/* Route */}

                                        <td className="px-3 py-3">

                                            <span className="whitespace-nowrap text-[10px] text-slate-500">
                                                {route}
                                            </span>

                                        </td>

                                        {/* Vehicle */}

                                        <td className="px-3 py-3">

                                            <span className="rounded bg-slate-800 px-2 py-1 text-[9px] text-slate-400">
                                                {vehicle}
                                            </span>

                                        </td>

                                        {/* Driver */}

                                        <td className="px-3 py-3">

                                            <span className="text-[10px] text-slate-400">
                                                {driver}
                                            </span>

                                        </td>

                                        {/* Priority */}

                                        <td className="px-3 py-3">

                                            <span
                                                className={`text-[9px] font-medium ${getPriorityClass(
                                                    priority
                                                )}`}
                                            >
                                                {formatPriority(priority)}
                                            </span>

                                        </td>

                                        {/* Status */}

                                        <td className="px-3 py-3">

                                            <Badge
                                                status={formatStatus(status)}
                                            />

                                        </td>

                                        {/* ETA */}

                                        <td className="px-3 py-3">

                                            <span className="whitespace-nowrap text-[9px] text-slate-600">
                                                {formatETA(shipment)}
                                            </span>

                                        </td>

                                        {/* More */}

                                        <td className="px-3 py-3 text-right">

                                            <button
                                                type="button"
                                                className="rounded-md p-1.5 text-slate-600 hover:bg-slate-800 hover:text-white"
                                            >
                                                <MoreHorizontal
                                                    size={14}
                                                />
                                            </button>

                                        </td>

                                    </tr>
                                );
                            })
                        )}

                    </tbody>

                </table>

            </div>

        </Card>
    );
}

export default RecentShipments;