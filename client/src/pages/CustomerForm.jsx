import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Save,
    Building2,
    Loader2,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    createCustomer,
    getCustomerById,
    updateCustomer,
} from "../api/api";


function CustomerForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);


    const [form, setForm] = useState({
        customerCode: "",
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
    });


    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD CUSTOMER FOR EDIT
    // =====================================================

    useEffect(() => {

        if (!isEdit) {
            return;
        }

        const loadCustomer = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getCustomerById(id);

                if (!response?.success) {

                    setError(
                        response?.message ||
                        "Unable to load customer"
                    );

                    return;
                }

                const customer = response.data;

                if (!customer) {

                    setError("Customer not found.");

                    return;
                }


                setForm({
                    customerCode:
                        customer.customer_code || "",

                    companyName:
                        customer.company_name || "",

                    contactPerson:
                        customer.contact_person || "",

                    email:
                        customer.email || "",

                    phone:
                        customer.phone || "",

                    addressLine1:
                        customer.address_line1 || "",

                    addressLine2:
                        customer.address_line2 || "",

                    city:
                        customer.city || "",

                    state:
                        customer.state || "",

                    postalCode:
                        customer.postal_code || "",

                    country:
                        customer.country || "India",
                });

            } catch (err) {

                console.error(
                    "Load customer error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load customer"
                );

            } finally {

                setLoading(false);

            }

        };


        loadCustomer();

    }, [id, isEdit]);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!form.customerCode.trim()) {
            return "Customer code is required.";
        }

        if (!form.companyName.trim()) {
            return "Company name is required.";
        }

        if (!form.contactPerson.trim()) {
            return "Contact person is required.";
        }

        if (!form.phone.trim()) {
            return "Phone number is required.";
        }

        if (!form.addressLine1.trim()) {
            return "Address is required.";
        }

        if (!form.city.trim()) {
            return "City is required.";
        }

        if (!form.state.trim()) {
            return "State is required.";
        }


        if (
            form.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email.trim()
            )
        ) {
            return "Please enter a valid email address.";
        }


        return null;

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        const validationError = validateForm();

        if (validationError) {

            setError(validationError);

            return;
        }


        try {

            setSaving(true);


            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                customerCode:
                    form.customerCode.trim(),

                companyName:
                    form.companyName.trim(),

                contactPerson:
                    form.contactPerson.trim(),

                email:
                    form.email.trim() || null,

                phone:
                    form.phone.trim(),

                addressLine1:
                    form.addressLine1.trim(),

                addressLine2:
                    form.addressLine2.trim() || null,

                city:
                    form.city.trim(),

                state:
                    form.state.trim(),

                postalCode:
                    form.postalCode.trim() || null,

                country:
                    form.country.trim() || "India",

            };


            let response;


            if (isEdit) {

                response = await updateCustomer(
                    id,
                    payload
                );

            } else {

                response = await createCustomer(
                    payload
                );

            }


            if (!response?.success) {

                setError(
                    response?.message ||
                    "Unable to save customer"
                );

                return;
            }


            // =================================================
            // SUCCESS
            // =================================================

            navigate(
                "/customers",
                {
                    replace: true,
                }
            );

        } catch (err) {

            console.error(
                "Save customer error:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to save customer"
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="flex min-h-[500px] items-center justify-center">

                <div className="flex items-center gap-2">

                    <Loader2
                        size={16}
                        className="animate-spin text-blue-400"
                    />

                    <p className="text-xs text-slate-500">
                        Loading customer...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="mx-auto max-w-5xl space-y-5">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/customers")
                            }
                            className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-500 transition hover:border-slate-700 hover:text-white"
                        >

                            <ArrowLeft size={16} />

                        </button>


                        <div>

                            <div className="flex items-center gap-2">

                                <Building2
                                    size={15}
                                    className="text-blue-400"
                                />

                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                                    ROUTEX / CRM
                                </p>

                            </div>


                            <h1 className="mt-2 text-2xl font-semibold text-white">

                                {isEdit
                                    ? "Edit Customer"
                                    : "New Customer"}

                            </h1>


                            <p className="mt-1 text-xs text-slate-500">

                                {isEdit
                                    ? "Update customer information."
                                    : "Create a new customer record."}

                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                    <p className="text-xs text-red-400">
                        {error}
                    </p>

                </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="mb-5">

                        <h2 className="text-sm font-semibold text-white">
                            Customer Information
                        </h2>

                        <p className="mt-1 text-[11px] text-slate-600">
                            Basic company and contact information.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <Input
                            label="Customer Code"
                            name="customerCode"
                            value={form.customerCode}
                            onChange={handleChange}
                            placeholder="CUS-1001"
                            required
                        />


                        <Input
                            label="Company Name"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            placeholder="ABC Logistics"
                            required
                        />


                        <Input
                            label="Contact Person"
                            name="contactPerson"
                            value={form.contactPerson}
                            onChange={handleChange}
                            placeholder="Rahul Sharma"
                            required
                        />


                        <Input
                            label="Phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            required
                        />


                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="contact@company.com"
                        />

                    </div>

                </section>


                {/* =================================================
                    ADDRESS
                ================================================= */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="mb-5">

                        <h2 className="text-sm font-semibold text-white">
                            Address
                        </h2>

                        <p className="mt-1 text-[11px] text-slate-600">
                            Customer billing and delivery address.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div className="md:col-span-2">

                            <Input
                                label="Address Line 1"
                                name="addressLine1"
                                value={form.addressLine1}
                                onChange={handleChange}
                                placeholder="MG Road"
                                required
                            />

                        </div>


                        <div className="md:col-span-2">

                            <Input
                                label="Address Line 2"
                                name="addressLine2"
                                value={form.addressLine2}
                                onChange={handleChange}
                                placeholder="Building / Apartment / Area"
                            />

                        </div>


                        <Input
                            label="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="New Delhi"
                            required
                        />


                        <Input
                            label="State"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="Delhi"
                            required
                        />


                        <Input
                            label="Postal Code"
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleChange}
                            placeholder="110001"
                        />


                        <Input
                            label="Country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            placeholder="India"
                        />

                    </div>

                </section>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <section className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/customers")
                        }
                        disabled={saving}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-5 py-3 text-xs font-medium text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {saving ? (
                            <Loader2
                                size={14}
                                className="animate-spin"
                            />
                        ) : (
                            <Save size={14} />
                        )}


                        {saving
                            ? "Saving..."
                            : isEdit
                                ? "Update Customer"
                                : "Create Customer"}

                    </button>

                </section>

            </form>

        </div>

    );

}


// =====================================================
// INPUT COMPONENT
// =====================================================

function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
}) {

    return (

        <div>

            <label
                htmlFor={name}
                className="mb-2 block text-[11px] font-medium text-slate-400"
            >

                {label}

                {required && (
                    <span className="ml-1 text-red-400">
                        *
                    </span>
                )}

            </label>


            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={false}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            />

        </div>

    );

}


export default CustomerForm;