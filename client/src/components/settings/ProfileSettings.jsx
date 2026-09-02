import { useState } from "react";
import { User, Mail, Briefcase, Save } from "lucide-react";
import { useApp } from "../../context/AppContext";

function ProfileSettings() {
    const { user, updateUser } = useApp();

    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSaved(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        updateUser({
            name: form.name,
            email: form.email,
            role: form.role,
            initials: form.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
        });

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-6 py-5">
                <h2 className="text-sm font-semibold text-white">
                    Profile Information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Update your personal and account information.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
            >
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-400">
                        Full Name
                    </label>

                    <div className="relative">
                        <User
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-400">
                        Email Address
                    </label>

                    <div className="relative">
                        <Mail
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-400">
                        Role
                    </label>

                    <div className="relative">
                        <Briefcase
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                            type="text"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    {saved ? (
                        <span className="text-xs text-emerald-400">
                            Profile updated successfully.
                        </span>
                    ) : (
                        <span />
                    )}

                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                    >
                        <Save size={15} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileSettings;