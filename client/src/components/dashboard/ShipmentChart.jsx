import {
    TrendingUp,
    MoreHorizontal,
} from "lucide-react";


function ShipmentChart({ data = [], totalShipments = 0, trend = "12.5%" }) {

    // Make sure chart values are valid numbers
    const chartData = data.map((value) => Number(value) || 0);

    const max = Math.max(...chartData, 1);

    return (

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">

            {/* HEADER */}

            <div className="flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                            Operations
                        </p>

                        <span className="flex items-center gap-1 text-[9px] text-emerald-400">

                            <TrendingUp size={10} />

                            {trend}

                        </span>

                    </div>

                    <h2 className="mt-1 text-sm font-semibold text-white">
                        Shipment Activity
                    </h2>

                </div>


                <button
                    type="button"
                    className="rounded-md p-1.5 text-slate-600 hover:bg-slate-800 hover:text-white"
                >

                    <MoreHorizontal size={15} />

                </button>

            </div>


            {/* SUMMARY */}

            <div className="mt-5 flex items-end gap-3">

                <p className="text-2xl font-semibold text-white">
                    {Number(totalShipments).toLocaleString()}
                </p>

                <p className="mb-1 text-[10px] text-slate-600">
                    shipments this month
                </p>

            </div>


            {/* CHART */}

            <div className="mt-7 flex h-48 items-end gap-2">

                {chartData.length > 0 ? (

                    chartData.map((value, index) => {

                        const height =
                            (value / max) * 100;

                        return (

                            <div
                                key={index}
                                className="group flex h-full flex-1 items-end"
                            >

                                <div
                                    className="relative w-full rounded-t-md bg-blue-500/60 transition-all duration-300 group-hover:bg-blue-400"
                                    style={{
                                        height: `${Math.max(height, 2)}%`,
                                    }}
                                >

                                    {/* TOOLTIP */}

                                    <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[9px] text-white group-hover:block whitespace-nowrap">
                                        {value} shipments
                                    </div>

                                </div>

                            </div>

                        );

                    })

                ) : (

                    <div className="flex h-full w-full items-center justify-center">

                        <p className="text-xs text-slate-600">
                            No shipment activity available
                        </p>

                    </div>

                )}

            </div>


            {/* LABELS */}

            <div className="mt-3 flex justify-between text-[9px] text-slate-700">

                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>

            </div>

        </div>

    );

}


export default ShipmentChart;