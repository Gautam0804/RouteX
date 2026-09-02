import { X } from "lucide-react";

function Modal({
    open,
    onClose,
    title,
    children,
    size = "md",
}) {

    if (!open) {
        return null;
    }

    const sizes = {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-3xl",
        xl: "max-w-5xl",
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/70
                p-4
                backdrop-blur-sm
            "
            onMouseDown={(event) => {

                if (event.target === event.currentTarget) {
                    onClose();
                }

            }}
        >

            <div
                className={`
                    w-full
                    ${sizes[size]}
                    max-h-[90vh]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-950
                    shadow-2xl
                `}
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-800
                        px-5
                        py-4
                    "
                >

                    <h2 className="text-sm font-semibold text-white">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-1.5
                            text-slate-500
                            transition
                            hover:bg-slate-800
                            hover:text-white
                        "
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* CONTENT */}

                <div className="max-h-[calc(90vh-65px)] overflow-y-auto p-5">

                    {children}

                </div>

            </div>

        </div>
    );
}

export default Modal;