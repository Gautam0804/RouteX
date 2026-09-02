import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email: email.trim(),
                password,
            });

            const result = response.data;

            console.log("Login response:", result);

            if (!result?.success) {
                setError(
                    result?.message || "Invalid email or password"
                );
                return;
            }

            const token = result?.data?.token;
            const user = result?.data?.user;

            if (!token) {
                setError(
                    "Login successful but token was not received."
                );
                return;
            }

            localStorage.setItem("token", token);

            if (user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }

            navigate("/dashboard", {
                replace: true,
            });

        } catch (err) {
            console.error("Login error:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unable to login. Please try again.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-8">

            {/* =====================================================
                BACKGROUND DECORATION
            ====================================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />

            </div>

            {/* =====================================================
                MAIN CONTAINER
            ====================================================== */}

            <div className="relative z-10 w-full max-w-md">

                {/* =================================================
                    BRAND
                ================================================== */}

                <div className="mb-8 text-center">

                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-500/10">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/30">
                            RX
                        </div>

                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                        ROUTEX
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                        Fleet Operations
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Manage your fleet. Move smarter.
                    </p>

                </div>

                {/* =================================================
                    LOGIN CARD
                ================================================== */}

                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

                    {/* Card heading */}

                    <div className="mb-7">

                        <h2 className="text-xl font-semibold text-white">
                            Welcome back
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Sign in to access your fleet workspace.
                        </p>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                                !
                            </div>

                            <p className="text-sm leading-5 text-red-400">
                                {error}
                            </p>

                        </div>
                    )}

                    {/* =================================================
                        FORM
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Email address
                            </label>

                            <div className="relative">

                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">

                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.8"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1a3 3 0 006 0v-1a9 9 0 10-3.37 7"
                                        />
                                    </svg>

                                </div>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="admin@routex.com"
                                    autoComplete="email"
                                    required
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <div className="mb-2 flex items-center justify-between">

                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-300"
                                >
                                    Password
                                </label>

                                <span className="text-xs text-slate-600">
                                    Secure login
                                </span>

                            </div>

                            <div className="relative">

                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">

                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.8"
                                            d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5m-1 0h11a1 1 0 011 1v7a1 1 0 01-1 1h-11a1 1 0 01-1-1v-7a1 1 0 011-1z"
                                        />
                                    </svg>

                                </div>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                                {/* SHOW / HIDE PASSWORD */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={loading}
                                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showPassword ? (
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 4.24A10.94 10.94 0 0112 4c5 0 8.5 4 9.5 8a11.7 11.7 0 01-3.08 4.86M6.61 6.61C4.88 7.88 3.69 9.7 3 12c1 4 4.5 8 9 8 1.61 0 3.1-.43 4.42-1.18"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                                            />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="2.5"
                                                strokeWidth="1.8"
                                            />
                                        </svg>
                                    )}

                                </button>

                            </div>

                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading ? (
                                <>
                                    <svg
                                        className="h-5 w-5 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />

                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>

                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In

                                    <svg
                                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 12h14m-6-6l6 6-6 6"
                                        />
                                    </svg>
                                </>
                            )}

                        </button>

                    </form>

                    {/* =================================================
                        SECURITY FOOTER
                    ================================================== */}

                    <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-800/80 pt-5">

                        <svg
                            className="h-4 w-4 text-emerald-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
                            />
                        </svg>

                        <p className="text-xs text-slate-500">
                            Secure fleet management platform
                        </p>

                    </div>

                </div>

                {/* =================================================
                    COPYRIGHT
                ================================================== */}

                <p className="mt-6 text-center text-xs text-slate-600">
                    © {new Date().getFullYear()} RouteX. All rights reserved.
                </p>

            </div>

        </div>
    );
}

export default Login;