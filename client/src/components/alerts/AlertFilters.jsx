import {
    Search,
    Filter,
    RotateCcw,
} from "lucide-react";

function AlertFilters({
    search,
    setSearch,
    priority,
    setPriority,
    status,
    setStatus,
}) {
    const resetFilters = () => {
        setSearch("");
        setPriority("All");
        setStatus("All");
    };

    return (
        <div className="mb-5 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* SEARCH */}

                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search alerts..."
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                </div>

                {/* PRIORITY */}

                <div className="flex items-center gap-2">
                    <Filter
                        size={14}
                        className="text-slate-600"
                    />

                    <select
                        value={priority}
                        onChange={(event) =>
                            setPriority(event.target.value)
                        }
                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-400 outline-none focus:border-blue-500"
                    >
                        <option value="All">
                            All Priority
                        </option>

                        <option value="High">
                            High
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Low">
                            Low
                        </option>
                    </select>
                </div>

                {/* STATUS */}

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                    className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-400 outline-none focus:border-blue-500"
                >
                    <option value="All">
                        All Status
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Investigating">
                        Investigating
                    </option>

                    <option value="Resolved">
                        Resolved
                    </option>
                </select>

                {/* RESET */}

                <button
                    onClick={resetFilters}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 px-4 py-2.5 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                    <RotateCcw size={14} />
                    Reset
                </button>
            </div>
        </div>
    );
}

export default AlertFilters;