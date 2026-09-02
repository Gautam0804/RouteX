import { useState } from "react";
import {
    Building2,
    X,
    Save,
    Loader2,
} from "lucide-react";

function CustomerForm({
    customer = null,
    onSubmit,
    onCancel,
}) {
    const isEditing = Boolean(customer);

    const [form, setForm] = useState({
        customerId: customer?.customerId || "",
        companyName: customer?.companyName || "",
        contactName: customer?.contactName || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        postalCode: customer?.postalCode || "",
        customerType: customer?.customerType || "Business",
        status: customer?.status || "Active",
        paymentTerms: customer?.paymentTerms || "Net 30",
        creditLimit: customer?.creditLimit || "",
        notes: customer?.notes || "",
    });

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.customerId.trim()) {
            newErrors.customerId = "Customer ID is required.";
        }

        if (!form.companyName.trim()) {
            newErrors.companyName =
                "Company name is required.";
        }

        if (!form.contactName.trim()) {
            newErrors.contactName =
                "Contact person is required.";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        }

        if (
            form.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email
            )
        ) {
            newErrors.email =
                "Enter a valid email address.";
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

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <Building2 size={19} />
                    </div>

                    <div>

                        <h2 className="text-sm font-semibold text-white">
                            {isEditing
                                ? "Edit Customer"
                                : "Add New Customer"}
                        </h2>

                        <p className="mt-1 text-[10px] text-slate-500">
                            Manage customer account and billing information.
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

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
            >

                <Section title="Customer Information">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <Input
                            label="Customer ID"
                            name="customerId"
                            value={form.customerId}
                            onChange={handleChange}
                            placeholder="CUS-1001"
                            required
                            error={errors.customerId}
                        />

                        <Select
                            label="Customer Type"
                            name="customerType"
                            value={form.customerType}
                            onChange={handleChange}
                            options={[
                                "Business",
                                "Enterprise",
                                "Individual",
                                "Government",
                            ]}
                        />

                        <Input
                            label="Company Name"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            placeholder="ABC Logistics Pvt Ltd"
                            required
                            error={errors.companyName}
                        />

                        <Input
                            label="Contact Person"
                            name="contactName"
                            value={form.contactName}
                            onChange={handleChange}
                            placeholder="Amit Sharma"
                            required
                            error={errors.contactName}
                        />

                    </div>

                </Section>

                <Section title="Contact Details">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <Input
                            label="Email Address"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="contact@company.com"
                            type="email"
                            error={errors.email}
                        />

                        <Input
                            label="Phone Number"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                            required
                            error={errors.phone}
                        />

                    </div>

                </Section>

                <Section title="Address">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div className="md:col-span-3">

                            <Input
                                label="Street Address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Industrial Area, Sector 10"
                            />

                        </div>

                        <Input
                            label="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Delhi"
                        />

                        <Input
                            label="State"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="Delhi"
                        />

                        <Input
                            label="Postal Code"
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleChange}
                            placeholder="110001"
                        />

                    </div>

                </Section>

                <Section title="Account Settings">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <Select
                            label="Account Status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            options={[
                                "Active",
                                "Inactive",
                                "Suspended",
                            ]}
                        />

                        <Select
                            label="Payment Terms"
                            name="paymentTerms"
                            value={form.paymentTerms}
                            onChange={handleChange}
                            options={[
                                "Due on Receipt",
                                "Net 15",
                                "Net 30",
                                "Net 45",
                                "Net 60",
                                "Net 90",
                            ]}
                        />

                        <Input
                            label="Credit Limit"
                            name="creditLimit"
                            value={form.creditLimit}
                            onChange={handleChange}
                            placeholder="₹5,00,000"
                        />

                    </div>

                </Section>

                <Section title="Notes">

                    <Textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Additional customer information..."
                    />

                </Section>

                <Actions
                    saving={saving}
                    editing={isEditing}
                    onCancel={onCancel}
                    createText="Create Customer"
                    editText="Save Customer"
                />

            </form>

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
            rows={3}
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
                className="rounded-lg border border-slate-800 px-4 py-2.5 text-xs text-slate-400 hover:bg-slate-900 hover:text-white"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
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

export default CustomerForm;