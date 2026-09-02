import { Inbox } from "lucide-react";

function EmptyState({
    icon: Icon = Inbox,
    title = "No data found",
    description = "There is nothing to display here.",
    action,
}) {

    return (
        <div
            className="
                flex
                min-h-[250px]
                flex-col
                items-center
                justify-center
                px-5
                text-center
            "
        >

            <div
                className="
                    mb-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-800
                "
            >

                <Icon
                    size={22}
                    className="text-slate-500"
                />

            </div>

            <h3 className="text-sm font-semibold text-white">
                {title}
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-500">
                {description}
            </p>

            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}

        </div>
    );
}

export default EmptyState;