import { useState } from "react";

function AssignmentForm({
    assignment = null,
    onSubmit,
    onCancel,
}) {
    const [form, setForm] = useState({
        shipment: assignment?.shipment || "",
        vehicle: assignment?.vehicle || "",
        driver: assignment?.driver || "",
        route: assignment?.route || "",
        startDate: assignment?.startDate || "",
        startTime: assignment?.startTime || "",
        priority: assignment?.priority || "Normal",
        status: assignment?.status || "Assigned",
        notes: assignment?.notes || "",
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
            id: assignment?.id || `ASN-${Date.now()}`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <div className="rounded-lg border border-blue-900/40 bg-blue-950/20 p-4">

                <p className="text-xs font-semibold text-blue-400">
                    Assignment Details
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                    Assign a shipment to a vehicle and driver.
                </p>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <Field
                    label="Shipment ID"
                    name="shipment"
                    value={form.shipment}
                    onChange={handleChange}
                    placeholder="SHP-1001"
                    required
                />

                <Field
                    label="Vehicle"
                    name="vehicle"
                    value={form.vehicle}
                    onChange={handleChange}
                    placeholder="TRK-1024"
                    required
                />

                <Field
                    label="Driver"
                    name="driver"
                    value={form.driver}
                    onChange={handleChange}
                    placeholder="Rajesh Kumar"
                    required
                />

            </div>

            <Field
                label="Route"
                name="route"
                value={form.route}
                onChange={handleChange}
                placeholder="Delhi → Mumbai"
                required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                />

                <Field
                    label="Start Time"
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Select
                    label="Priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    options={[
                        "Low",
                        "Normal",
                        "High",
                        "Critical",
                    ]}
                />

                <Select
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                        "Assigned",
                        "Dispatched",
                        "In Transit",
                        "Completed",
                        "Cancelled",
                    ]}
                />

            </div>

            <Textarea
                label="Assignment Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Special instructions for the driver..."
            />

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        ✓
                    </div>

                    <div>
                        <p className="text-xs font-medium text-white">
                            Ready for dispatch
                        </p>

                        <p className="text-[10px] text-slate-500">
                            Verify vehicle and driver availability before assigning.
                        </p>
                    </div>

                </div>

            </div>

            <FormButtons
                onCancel={onCancel}
                submitText={
                    assignment
                        ? "Update Assignment"
                        : "Create Assignment"
                }
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

function Select({
    label,
    name,
    value,
    onChange,
    options,
}) {
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
                    <option key={option}>
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

function FormButtons({
    onCancel,
    submitText,
}) {
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

export default AssignmentForm;