import {
    Package,
    ArrowUpRight,
} from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";

import { shipments } from "../../data/dashboardData";

function ShipmentOverview() {

    const recent = shipments.slice(0, 5);

    return (
        <Card
            title="Shipment Overview"
            description="Latest shipment updates"
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

            <div className="space-y-3">

                {recent.map((shipment) => (

                    <div
                        key={shipment.id}
                        className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3"
                    >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">

                            <Package
                                size={14}
                                className="text-blue-400"
                            />

                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="text-[10px] font-semibold text-white">
                                {shipment.id}
                            </p>

                            <p className="mt-1 truncate text-[9px] text-slate-600">
                                {shipment.route}
                            </p>

                        </div>

                        <Badge status={shipment.status} />

                    </div>

                ))}

            </div>

        </Card>
    );
}

export default ShipmentOverview;