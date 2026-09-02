import { useState } from "react";
import {
    Package,
    X,
    Save,
    Loader2,
} from "lucide-react";

function ShipmentForm({
    shipment = null,
    customers = [],
    vehicles = [],
    drivers = [],
    onSubmit,
    onCancel,
}) {
    const isEditing = Boolean(shipment);

    const [form, setForm] = useState({
        shipmentId: shipment?.shipmentId || "",
        customer: shipment?.customer || "",
        route: shipment?.route || "",
        origin: shipment?.origin || "",
        destination: shipment?.destination || "",
        cargo: shipment?.cargo || "",
        weight: shipment?.weight || "",
        vehicle: shipment?.vehicle || "",
        driver: shipment?.driver || "",
        priority: shipment?.priority || "Normal",
        status: shipment?.status || "Pending",
        eta: shipment?.eta || "",
        notes: shipment?.notes || "",
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((previous) => ({
                ...previous,
                [name]: "",
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.shipmentId.trim()) {
            newErrors.shipmentId = "Shipment ID is required.";
        }

        if (!form.customer.trim()) {
            newErrors.customer = "Customer is required.";
        }

        if (!form.origin.trim()) {
            newErrors.origin = "Origin is required.";
        }

        if (!form.destination.trim()) {
            newErrors.destination = "Destination is required.";
        }

        if (!form.cargo.trim()) {
            newErrors.cargo = "Cargo description is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setSaving(true);

            await onSubmit?.({
                ...form,
                updatedAt: new Date().toISOString(),
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">

            <Header
                icon={<Package size={19} />}
                title={
                    isEditing
                        ? "Edit Shipment"
                        : "Create Shipment"
                }
                description={
                    isEditing
                        ? "Update shipment information and delivery details."
                        : "Create a new shipment and configure its delivery."
                }
                onCancel={onCancel}
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >

                <Section title="Shipment Information">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <Input
                            label="Shipment ID"
                            name="shipmentId"
                            value={form.shipmentId}
                            onChange={handleChange}
                            placeholder="SHP-1001"
                            required
                            error={errors.shipmentId}
                        />

                        <Input
                            label="Customer"
                            name="customer"
                            value={form.customer}
                            onChange={handleChange}
                            placeholder="ABC Logistics"
                            required
                            error={errors.customer}
                        />

                        <Input
                            label="Origin"
                            name="origin"
                            value={form.origin}
                            onChange={handleChange}
                            placeholder="Delhi"
                            required
                            error={errors.origin}
                        />

                        <Input
                            label="Destination"
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            placeholder="Mumbai"
                            required
                            error={errors.destination}
                        />

                    </div>

                </Section>

                <Section title="Cargo Details">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <Input
                            label="Cargo"
                            name="cargo"
                            value={form.cargo}
                            onChange={handleChange}
                            placeholder="Electronic Equipment"
                            required
                            error={errors.cargo}
                        />

                        <Input
                            label="Weight"
                            name="weight"
                            value={form.weight}
                            onChange={handleChange}
                            placeholder="1,250 kg"
                        />

                    </div>

                </Section>

                <Section title="Fleet Assignment">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <Input
                            label="Vehicle"
                            name="vehicle"
                            value={form.vehicle}
                            onChange={handleChange}
                            placeholder="TRK-1024"
                        />

                        <Input
                            label="Driver"
                            name="driver"
                            value={form.driver}
                            onChange={handleChange}
                            placeholder="Rajesh Kumar"
                        />

                    </div>

                </Section>

                <Section title="Delivery Settings">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <Select
                            label="Priority"
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            options={[
                                "Low",
                                "Normal",
                                "High",
                                "Urgent",
                            ]}
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
                                "Cancelled",
                            ]}
                        />

                        <Input
                            label="Estimated Delivery"
                            name="eta"
                            value={form.eta}
                            onChange={handleChange}
                            placeholder="29 Aug 2026, 18:30"
                        />

                    </div>

                </Section>

                <Section title="Notes">

                    <Textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Delivery instructions or additional information..."
                    />

                </Section>

                <Actions
                    saving={saving}
                    editing={isEditing}
                    onCancel={onCancel}
                    createText="Create Shipment"
                    editText="Save Shipment"
                />

            </form>
        </div>
    );
}

function Header({
    icon,
    title,
    description,
    onCancel,
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

            <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    {icon}
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-white">
                        {title}
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-500">
                        {description}
                    </p>
                </div>

            </div>

            <button
                type="button"
                onClick={onCancel}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-900 hover:text-white"
            >
                <X size={17} />
            </button>

        </div>
    );
}

function Section({ title, children }) {
    return (
        <section>

            <h3 className="mb-4 text-xs font-semibold text-white">
                {title}
            </h3>

            {children}

        </section>
    );
}

function Input({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
    error,
}) {
    return (
        <div>

            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-slate-500">
                {label}

                {required && (
                    <span className="ml-1 text-red-400">*</span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-lg border bg-slate-900 px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-600 ${
                    error
                        ? "border-red-500"
                        : "border-slate-800 focus:border-blue-500"
                }`}
            />

            {error && (
                <p className="mt-1 text-[10px] text-red-400">
                    {error}
                </p>
            )}

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

            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-slate-500">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
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
    name,
    value,
    onChange,
    placeholder,
}) {
    return (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={4}
            placeholder={placeholder}
            className="w-full resize-none rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />
    );
}

function Actions({
    saving,
    editing,
    onCancel,
    createText,
    editText,
}) {
    return (
        <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">

            <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="rounded-lg border border-slate-800 px-4 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-white disabled:opacity-50"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {saving ? (
                    <>
                        <Loader2
                            size={14}
                            className="animate-spin"
                        />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save size={14} />
                        {editing ? editText : createText}
                    </>
                )}
            </button>

        </div>
    );
}

export default ShipmentForm;