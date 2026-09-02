import Badge from "../common/Badge";

function DriverDetails({ driver }) {

    if (!driver) {
        return (
            <div className="py-10 text-center text-xs text-slate-500">
                No driver selected.
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 font-bold text-blue-400">
                    {driver.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    }
                </div>

                <div>
                    <h3 className="text-base font-semibold text-white">
                        {driver.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                        {driver.phone}
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-2 gap-5">

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        License
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {driver.license || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Vehicle
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {driver.vehicle || "Unassigned"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Rating
                    </p>

                    <p className="mt-1 text-xs text-amber-400">
                        ★ {driver.rating || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Experience
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {driver.experience || "—"}
                    </p>
                </div>

            </div>

            <div>
                <p className="mb-2 text-[10px] uppercase text-slate-600">
                    Current Status
                </p>

                <Badge variant="success">
                    {driver.status || "Available"}
                </Badge>
            </div>

        </div>
    );
}

export default DriverDetails;