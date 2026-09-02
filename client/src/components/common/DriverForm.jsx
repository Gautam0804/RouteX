import { useState } from "react";

function DriverForm({ driver = null, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        name: driver?.name || "",
        phone: driver?.phone || "",
        email: driver?.email || "",
        licenseNumber: driver?.licenseNumber || "",
        licenseExpiry: driver?.licenseExpiry || "",
        experience: driver?.experience || "",
        vehicle: driver?.vehicle || "",
        status: driver?.status || "Available",
        address: driver?.address || "",
        notes: driver?.notes || "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit?.({
            ...form,
            id: driver?.id || `DRV-${Date.now()}`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rajesh Kumar"
                    required
                />

                <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="rajesh@routex.com"
                />

                <Field
                    label="License Number"
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="DL-0420260012345"
                    required
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <Field
                    label="License Expiry"
                    name="licenseExpiry"
                    type="date"
                    value={form.licenseExpiry}
                    onChange={handleChange}
                />

                <Field
                    label="Experience"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="6 years"
                />

                <Select
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                        "Available",
                        "On Duty",
                        "On Leave",
                        "Inactive",
                    ]}
                />

            </div>

            <Field
                label="Assigned Vehicle"
                name="vehicle"
                value={form.vehicle}
                onChange={handleChange}
                placeholder="TRK-1024"
            />

            <Field
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Driver address"
            />

            <Textarea
                label="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Driver notes..."
            />

            <FormButtons
                onCancel={onCancel}
                submitText={driver ? "Update Driver" : "Add Driver"}
            />

        </form>
    );
}

function Field({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
            />
        </div>
    );
}

function Select({ label, name, value, onChange, options }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
            >
                {options.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}

function Textarea({
    label,
    name,
    value,
    onChange,
    placeholder,
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
                {label}
            </label>

            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={3}
                placeholder={placeholder}
                className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
            />
        </div>
    );
}

function FormButtons({ onCancel, submitText }) {
    return (
        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">

            <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800"
            >
                Cancel
            </button>

            <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
            >
                {submitText}
            </button>

        </div>
    );
}

export default DriverForm;