import { useApp } from "../../context/AppContext";
import {
    Monitor,
    Moon,
    Sun,
} from "lucide-react";

function SystemSettings() {
    const { theme, changeTheme } = useApp();

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-6 py-5">
                <h2 className="text-sm font-semibold text-white">
                    System Preferences
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Configure your RouteX workspace.
                </p>
            </div>

            <div className="p-6">
                <p className="mb-4 text-xs font-medium text-slate-400">
                    Appearance
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <ThemeButton
                        icon={Monitor}
                        title="System"
                        value="system"
                        active={theme === "system"}
                        onClick={() => changeTheme("system")}
                    />

                    <ThemeButton
                        icon={Sun}
                        title="Light"
                        value="light"
                        active={theme === "light"}
                        onClick={() => changeTheme("light")}
                    />

                    <ThemeButton
                        icon={Moon}
                        title="Dark"
                        value="dark"
                        active={theme === "dark"}
                        onClick={() => changeTheme("dark")}
                    />
                </div>
            </div>
        </div>
    );
}

function ThemeButton({
    icon: Icon,
    title,
    active,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                active
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
            }`}
        >
            <Icon
                size={18}
                className={
                    active
                        ? "text-blue-400"
                        : "text-slate-500"
                }
            />

            <span
                className={`text-xs font-medium ${
                    active
                        ? "text-white"
                        : "text-slate-400"
                }`}
            >
                {title}
            </span>
        </button>
    );
}

export default SystemSettings;