import {
    Truck,
    CheckCircle2,
    Wrench,
    PauseCircle,
} from "lucide-react";

import Card from "../common/Card";

const icons = {
    Active: CheckCircle2,
    Maintenance: Wrench,
    Idle: PauseCircle,
};

function VehicleStatus({ vehicleData = {} }) {

    const statusData = [
        {
            status: "Active",
            count: Number(vehicleData.inTransit) || 0,
            description: "Currently in transit",
            color: "text-emerald-400",
        },
        {
            status: "Maintenance",
            count: Number(vehicleData.maintenance) || 0,
            description: "Under maintenance",
            color: "text-amber-400",
        },
        {
            status: "Idle",
            count: Number(vehicleData.available) || 0,
            description: "Currently available",
            color: "text-blue-400",
        },
    ];

    return (
        <Card
            title="Vehicle Status"
            description="Current fleet availability"
        >
            <div className="space-y-4">

                {statusData.map((item) => {

                    const Icon = icons[item.status] || Truck;

                    return (
                        <div
                            key={item.status}
                            className="flex items-center justify-between"
                        >

                            <div className="flex items-center gap-3">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                                    <Icon
                                        size={15}
                                        className={item.color}
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-white">
                                        {item.status}
                                    </p>

                                    <p className="text-[9px] text-slate-600">
                                        {item.description}
                                    </p>
                                </div>

                            </div>

                            <span className="text-lg font-semibold text-white">
                                {item.count}
                            </span>

                        </div>
                    );
                })}

            </div>
        </Card>
    );
}

export default VehicleStatus;