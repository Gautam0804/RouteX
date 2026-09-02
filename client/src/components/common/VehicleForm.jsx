import { useState } from "react";

function VehicleForm({ vehicle = null, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        registration: vehicle?.registration || "",
        type: vehicle?.type || "Truck",
        model: vehicle?.model || "",
        manufacturer: vehicle?.manufacturer || "",
        year: vehicle?.year || "",
        capacity: vehicle?.capacity || "",
        status: vehicle?.status || "Available",
        mileage: vehicle?.mileage || "",
        fuelType: vehicle?.fuelType || "Diesel",
        notes: vehicle?.notes || "",
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
            id: vehicle?.id || `VEH-${Date.now()}`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Registration Number"
                    name="registration"
                    value={form.registration}
                    onChange={handleChange}
                    placeholder="DL-01-AB-1234"
                    required
                />

                <Select
                    label="Vehicle Type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    options={[
                        "Truck",
                        "Van",
                        "Pickup",
                        "Trailer",
                        "Tanker",
                        "Refrigerated Truck",
                    ]}
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Manufacturer"
                    name="manufacturer"
                    value={form.manufacturer}
                    onChange={handleChange}
                    placeholder="Tata"
                />

                <Field
                    label="Model"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Prima 3530"
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <Field
                    label="Year"
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="2025"
                />

                <Field
                    label="Capacity"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="20 Ton"
                />

                <Field
                    label="Mileage"
                    name="mileage"
                    value={form.mileage}
                    onChange={handleChange}
                    placeholder="42,500 km"
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Select
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                        "Available",
                        "In Transit",
                        "Maintenance",
                        "Inactive",
                    ]}
                />

                <Select
                    label="Fuel Type"
                    name="fuelType"
                    value={form.fuelType}
                    onChange={handleChange}
                    options={[
                        "Diesel",
                        "Petrol",
                        "CNG",
                        "Electric",
                        "Hybrid",
                    ]}
                />

            </div>

            <Textarea
                label="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Vehicle notes..."
            />

            <FormButtons
                onCancel={onCancel}
                submitText={vehicle ? "Update Vehicle" : "Add Vehicle"}
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

export default VehicleForm;