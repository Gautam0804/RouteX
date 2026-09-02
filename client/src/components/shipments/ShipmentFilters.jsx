import {
    Search,
    SlidersHorizontal,
} from "lucide-react";

function ShipmentFilter({
    search = "",
    setSearch,
    status = "All",
    setStatus,
}) {
    return (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:flex-row">

            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5">

                <Search
                    size={15}
                    className="text-slate-600"
                />

                <input
                    value={search}
                    onChange={(e) => setSearch?.(e.target.value)}
                    placeholder="Search by shipment ID, customer or route..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-600"
                />

            </div>

            <div className="flex items-center gap-2">

                <SlidersHorizontal
                    size={15}
                    className="text-slate-600"
                />

                <select
                    value={status}
                    onChange={(e) => setStatus?.(e.target.value)}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-300 outline-none"
                >
                    <option value="All">
                        All Status
                    </option>

                    <option value="Delivered">
                        Delivered
                    </option>

                    <option value="In Transit">
                        In Transit
                    </option>

                    <option value="Delayed">
                        Delayed
                    </option>

                    <option value="Out for Delivery">
                        Out for Delivery
                    </option>
                </select>

            </div>

        </div>
    );
}

export default ShipmentFilter;