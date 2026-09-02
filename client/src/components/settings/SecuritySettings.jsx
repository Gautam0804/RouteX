import { useState } from "react";
import {
    Lock,
    ShieldCheck,
    KeyRound,
} from "lucide-react";

function SecuritySettings() {
    const [twoFactor, setTwoFactor] = useState(true);

    const [passwords, setPasswords] = useState({
        current: "",
        newPassword: "",
        confirm: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setPasswords((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            !passwords.current ||
            !passwords.newPassword ||
            !passwords.confirm
        ) {
            return;
        }

        if (passwords.newPassword !== passwords.confirm) {
            alert("New passwords do not match.");
            return;
        }

        alert("Password updated successfully.");

        setPasswords({
            current: "",
            newPassword: "",
            confirm: "",
        });
    };

    return (
        <div className="space-y-5">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="border-b border-slate-800 px-6 py-5">
                    <h2 className="text-sm font-semibold text-white">
                        Account Security
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Protect your RouteX account.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <ShieldCheck size={19} />
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                            Two-factor authentication
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Add an additional layer of protection.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={`relative h-5 w-9 rounded-full ${
                            twoFactor
                                ? "bg-blue-600"
                                : "bg-slate-700"
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                                twoFactor
                                    ? "left-[18px]"
                                    : "left-0.5"
                            }`}
                        />
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60">
                <div className="border-b border-slate-800 px-6 py-5">
                    <h2 className="text-sm font-semibold text-white">
                        Change Password
                    </h2>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >
                    <div>
                        <label className="mb-2 block text-xs text-slate-400">
                            Current Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                            />

                            <input
                                type="password"
                                name="current"
                                value={passwords.current}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs text-slate-400">
                            New Password
                        </label>

                        <div className="relative">
                            <KeyRound
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                            />

                            <input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs text-slate-400">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirm"
                            value={passwords.confirm}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SecuritySettings;