function Card({
    children,
    title,
    description,
    action,
    className = "",
}) {

    return (
        <div
            className={`
                overflow-hidden
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                ${className}
            `}
        >

            {(title || description || action) && (

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

                    <div>

                        {title && (
                            <h3 className="text-sm font-semibold text-white">
                                {title}
                            </h3>
                        )}

                        {description && (
                            <p className="mt-1 text-[10px] text-slate-500">
                                {description}
                            </p>
                        )}

                    </div>

                    {action && (
                        <div>
                            {action}
                        </div>
                    )}

                </div>

            )}

            <div className="p-5">
                {children}
            </div>

        </div>
    );
}

export default Card;