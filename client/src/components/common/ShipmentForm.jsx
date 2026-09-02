import { useState } from "react";

function ShipmentForm({ shipment = null, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        customer: shipment?.customer || "",
        origin: shipment?.origin || "",
        destination: shipment?.destination || "",
        vehicle: shipment?.vehicle || "",
        driver: shipment?.driver || "",
        priority: shipment?.priority || "Normal",
        status: shipment?.status || "Pending",
        eta: shipment?.eta || "",
        weight: shipment?.weight || "",
        notes: shipment?.notes || "",
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
            id: shipment?.id || `SHP-${Date.now()}`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Customer"
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    placeholder="Acme Corporation"
                    required
                />

                <Field
                    label="Weight"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="2500 kg"
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Origin"
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    placeholder="Delhi"
                    required
                />

                <Field
                    label="Destination"
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    required
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Vehicle"
                    name="vehicle"
                    value={form.vehicle}
                    onChange={handleChange}
                    placeholder="TRK-1024"
                />

                <Field
                    label="Driver"
                    name="driver"
                    value={form.driver}
                    onChange={handleChange}
                    placeholder="Rajesh Kumar"
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <Select
                    label="Priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    options={["Low", "Normal", "High", "Critical"]}
                />

                <Select
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                        "Pending",
                        "Assigned",
                        "In Transit",
                        "Out for Delivery",
                        "Delivered",
                        "Delayed",
                    ]}
                />

                <Field
                    label="ETA"
                    name="eta"
                    type="datetime-local"
                    value={form.eta}
                    onChange={handleChange}
                />

            </div>

            <Textarea
                label="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional shipment information..."
            />

            <FormButtons
                onCancel={onCancel}
                submitText={shipment ? "Update Shipment" : "Create Shipment"}
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
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none transition focus:border-blue-500"
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
                    <option key={option} value={option}>
                        {option}
                    </option>
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
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs text-slate-300 transition hover:bg-slate-800"
            >
                Cancel
            </button>

            <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
                {submitText}
            </button>

        </div>
    );
}

export default ShipmentForm;