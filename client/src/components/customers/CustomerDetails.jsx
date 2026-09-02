function CustomerDetails({ customer }) {

    if (!customer) {
        return (
            <div className="py-10 text-center text-xs text-slate-500">
                No customer selected.
            </div>
        );
    }

    return (
        <div className="space-y-5">

            <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 font-semibold text-blue-400">
                    {customer.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                    }
                </div>

                <div>
                    <h3 className="text-base font-semibold text-white">
                        {customer.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                        {customer.company || "Customer"}
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Email
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {customer.email || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Phone
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {customer.phone || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Shipments
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        {customer.shipments ?? 0}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-slate-600">
                        Status
                    </p>

                    <p className="mt-1 text-xs text-emerald-400">
                        {customer.status || "Active"}
                    </p>
                </div>

            </div>

            <div>
                <p className="text-[10px] uppercase text-slate-600">
                    Address
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                    {customer.address || "No address available."}
                </p>
            </div>

        </div>
    );
}

export default CustomerDetails;