import { useState } from "react";

function CustomerForm({ customer = null, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        company: customer?.company || "",
        contactName: customer?.contactName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        postalCode: customer?.postalCode || "",
        type: customer?.type || "Business",
        status: customer?.status || "Active",
        notes: customer?.notes || "",
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
            id: customer?.id || `CUS-${Date.now()}`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Field
                    label="Company Name"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Acme Corporation"
                    required
                />

                <Field
                    label="Contact Person"
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder="Amit Sharma"
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
                    placeholder="amit@acme.com"
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

            <Field
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Business Park"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Delhi"
                />

                <Field
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Delhi"
                />

                <Field
                    label="Postal Code"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="110001"
                />

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <Select
                    label="Customer Type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    options={[
                        "Business",
                        "Enterprise",
                        "Individual",
                        "Government",
                    ]}
                />

                <Select
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                        "Active",
                        "Inactive",
                        "Pending",
                    ]}
                />

            </div>

            <Textarea
                label="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Customer notes..."
            />

            <FormButtons
                onCancel={onCancel}
                submitText={customer ? "Update Customer" : "Add Customer"}
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

export default CustomerForm;