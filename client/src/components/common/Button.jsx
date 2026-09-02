import { Loader2 } from "lucide-react";

function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    onClick,
}) {

    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-500",

        secondary:
            "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800",

        danger:
            "bg-red-600 text-white hover:bg-red-500",

        success:
            "bg-emerald-600 text-white hover:bg-emerald-500",

        ghost:
            "text-slate-400 hover:bg-slate-800 hover:text-white",

        outline:
            "border border-slate-700 text-slate-300 hover:bg-slate-800",
    };

    const sizes = {
        sm: "px-3 py-2 text-[10px]",
        md: "px-4 py-2.5 text-xs",
        lg: "px-5 py-3 text-sm",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                font-semibold
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >

            {loading && (
                <Loader2
                    size={14}
                    className="animate-spin"
                />
            )}

            {children}

        </button>
    );
}

export default Button;