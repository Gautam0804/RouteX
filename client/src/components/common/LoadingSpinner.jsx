import { Loader2 } from "lucide-react";

function LoadingSpinner({
    text = "Loading...",
    fullPage = false,
}) {

    return (
        <div
            className={`
                flex
                flex-col
                items-center
                justify-center
                gap-3
                ${fullPage ? "min-h-[60vh]" : "min-h-[200px]"}
            `}
        >

            <Loader2
                size={24}
                className="animate-spin text-blue-500"
            />

            <p className="text-xs text-slate-500">
                {text}
            </p>

        </div>
    );
}

export default LoadingSpinner;