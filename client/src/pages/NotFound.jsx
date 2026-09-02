import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="w-full max-w-lg text-center">

                {/* ERROR CODE */}
                <div className="mb-6">
                    <h1 className="text-8xl font-bold tracking-tight text-blue-500">
                        404
                    </h1>

                    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-blue-500" />
                </div>

                {/* MESSAGE */}
                <h2 className="text-2xl font-semibold text-white">
                    Page not found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                    The page you're looking for doesn't exist or may have
                    been moved to another location.
                </p>

                {/* ACTIONS */}
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 px-5 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white"
                    >
                        <ArrowLeft size={15} />
                        Go Back
                    </button>

                    <Link
                        to="/dashboard"
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                    >
                        <Home size={15} />
                        Dashboard
                    </Link>

                </div>

                {/* ROUTEX */}
                <p className="mt-10 text-[10px] uppercase tracking-[0.2em] text-slate-700">
                    RouteX Fleet Operations
                </p>

            </div>
        </div>
    );
}

export default NotFound;