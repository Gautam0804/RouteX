import {
    Sparkles,
    ArrowRight,
    AlertTriangle,
    TrendingUp,
    Clock3,
    CheckCircle2,
    Info,
} from "lucide-react";


const iconMap = {
    warning: AlertTriangle,
    success: TrendingUp,
    info: Clock3,
    positive: CheckCircle2,
};


function AIInsights({ insights = [], onViewAll }) {

    const insightList = Array.isArray(insights)
        ? insights
        : [];


    const getIcon = (type) => {
        return (
            iconMap[String(type || "info").toLowerCase()] ||
            Info
        );
    };


    const getIconClass = (type) => {
        const normalizedType =
            String(type || "info").toLowerCase();

        if (normalizedType === "warning") {
            return "text-amber-400";
        }

        if (
            normalizedType === "success" ||
            normalizedType === "positive"
        ) {
            return "text-emerald-400";
        }

        return "text-blue-400";
    };


    return (

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">

            {/* HEADER */}

            <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">

                    <Sparkles size={17} />

                </div>

                <div>

                    <p className="text-[10px] uppercase tracking-wider text-violet-400">
                        RouteX Intelligence
                    </p>

                    <h2 className="mt-1 text-sm font-semibold text-white">
                        Operations Insights
                    </h2>

                </div>

            </div>


            {/* INSIGHTS */}

            <div className="mt-5 space-y-3">

                {insightList.length === 0 ? (

                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-center">

                        <Sparkles
                            size={20}
                            className="mx-auto mb-2 text-slate-700"
                        />

                        <p className="text-[10px] font-medium text-slate-400">
                            No insights available
                        </p>

                        <p className="mt-1 text-[9px] leading-4 text-slate-600">
                            Intelligence insights will appear here
                            when enough operational data is available.
                        </p>

                    </div>

                ) : (

                    insightList.map((item, index) => {

                        const type =
                            String(
                                item?.type || "info"
                            ).toLowerCase();

                        const Icon =
                            getIcon(type);

                        const title =
                            item?.title ||
                            item?.name ||
                            "Operational Insight";

                        const text =
                            item?.text ||
                            item?.description ||
                            item?.message ||
                            "No additional information available.";

                        return (

                            <div
                                key={
                                    item?.id ||
                                    `${title}-${index}`
                                }
                                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                            >

                                <div className="flex gap-3">

                                    <Icon
                                        size={14}
                                        className={getIconClass(
                                            type
                                        )}
                                    />

                                    <div className="min-w-0">

                                        <p className="text-[10px] font-semibold text-slate-300">
                                            {title}
                                        </p>

                                        <p className="mt-1 text-[9px] leading-4 text-slate-600">
                                            {text}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        );

                    })

                )}

            </div>


            {/* FOOTER */}

            <button
                type="button"
                onClick={onViewAll}
                className="mt-4 flex w-full items-center justify-between rounded-lg border border-slate-800 px-3 py-2.5 text-[10px] text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >

                View all insights

                <ArrowRight size={12} />

            </button>

        </div>

    );

}


export default AIInsights;