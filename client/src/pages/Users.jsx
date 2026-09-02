import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    UsersRound,
    Pencil,
    Trash2,
    X,
    ShieldCheck,
    Mail,
    Phone,
    UserRound,
    RefreshCw,
    Eye,
    CheckCircle2,
    UserX,
    KeyRound,
    Clock3,
} from "lucide-react";

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser as deleteUserApi,
} from "../services/api";


// =====================================================
// HELPERS
// =====================================================

const formatStatus = (status) => {
    if (!status) return "Unknown";

    return String(status)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};


const formatRole = (role) => {
    if (!role) return "No Role";

    return String(role)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};


const getFullName = (user) => {
    const firstName = user.first_name || user.firstName || "";
    const lastName = user.last_name || user.lastName || "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || "Unnamed User";
};


const getRoleName = (user) => {
    return (
        user.role_name ||
        user.roleName ||
        user.role ||
        "No Role"
    );
};


const getInitials = (user) => {
    const name = getFullName(user);

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
};


const getStatusClass = (status) => {
    switch (String(status).toLowerCase()) {
        case "active":
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

        case "inactive":
            return "border-slate-700 bg-slate-800 text-slate-400";

        case "suspended":
            return "border-red-500/20 bg-red-500/10 text-red-400";

        default:
            return "border-slate-700 bg-slate-800 text-slate-400";
    }
};


// =====================================================
// MAIN COMPONENT
// =====================================================

function Users() {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [roleFilter, setRoleFilter] = useState("All");

    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [viewingUser, setViewingUser] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [statusLoadingId, setStatusLoadingId] = useState(null);

    const [formError, setFormError] = useState("");

    const [form, setForm] = useState({
        roleId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        avatarUrl: "",
        status: "active",
    });


    // =====================================================
    // LOAD USERS
    // =====================================================

    const loadUsers = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getUsers();

            const userData = Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response)
                    ? response
                    : [];

            setUsers(userData);
        } catch (err) {
            console.error("Load users error:", err);

            setError(
                err?.message ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        loadUsers();
    }, []);


    // =====================================================
    // FILTERS
    // =====================================================

    const roles = useMemo(() => {
        const uniqueRoles = users
            .map((user) => getRoleName(user))
            .filter(Boolean);

        return ["All", ...new Set(uniqueRoles)];
    }, [users]);


    const filteredUsers = useMemo(() => {
        const text = search.toLowerCase().trim();

        return users.filter((user) => {
            const name = getFullName(user).toLowerCase();
            const email = String(user.email || "").toLowerCase();
            const role = getRoleName(user).toLowerCase();
            const phone = String(user.phone || "").toLowerCase();
            const id = String(user.id || "").toLowerCase();

            const matchesSearch =
                !text ||
                name.includes(text) ||
                email.includes(text) ||
                role.includes(text) ||
                phone.includes(text) ||
                id.includes(text);

            const matchesStatus =
                statusFilter === "All" ||
                String(user.status).toLowerCase() ===
                    statusFilter.toLowerCase();

            const matchesRole =
                roleFilter === "All" ||
                getRoleName(user) === roleFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesRole
            );
        });
    }, [
        users,
        search,
        statusFilter,
        roleFilter,
    ]);


    // =====================================================
    // STATS
    // =====================================================

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) =>
            String(user.status).toLowerCase() === "active"
    ).length;

    const inactiveUsers = users.filter(
        (user) =>
            String(user.status).toLowerCase() === "inactive"
    ).length;

    const suspendedUsers = users.filter(
        (user) =>
            String(user.status).toLowerCase() === "suspended"
    ).length;


    // =====================================================
    // FORM
    // =====================================================

    const resetForm = () => {
        setForm({
            roleId: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            avatarUrl: "",
            status: "active",
        });

        setFormError("");
    };


    const openCreate = () => {
        setEditingUser(null);
        resetForm();
        setShowForm(true);
    };


    const openEdit = async (user) => {
        try {
            setFormError("");

            let selectedUser = user;

            try {
                const response = await getUserById(user.id);

                if (response?.data) {
                    selectedUser = response.data;
                }
            } catch (err) {
                console.warn(
                    "Unable to load detailed user. Using list data.",
                    err
                );
            }

            setEditingUser(selectedUser);

            setForm({
                roleId:
                    selectedUser.role_id ||
                    selectedUser.roleId ||
                    "",

                firstName:
                    selectedUser.first_name ||
                    selectedUser.firstName ||
                    "",

                lastName:
                    selectedUser.last_name ||
                    selectedUser.lastName ||
                    "",

                email:
                    selectedUser.email ||
                    "",

                phone:
                    selectedUser.phone ||
                    "",

                password: "",

                avatarUrl:
                    selectedUser.avatar_url ||
                    selectedUser.avatarUrl ||
                    "",

                status:
                    selectedUser.status ||
                    "active",
            });

            setShowForm(true);
        } catch (err) {
            console.error("Open edit user error:", err);

            setFormError(
                err?.message ||
                "Unable to open user."
            );
        }
    };


    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingUser(null);
        resetForm();
    };


    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");

        if (!form.roleId) {
            setFormError("Role ID is required.");
            return;
        }

        if (!form.firstName.trim()) {
            setFormError("First name is required.");
            return;
        }

        if (!form.lastName.trim()) {
            setFormError("Last name is required.");
            return;
        }

        if (!form.email.trim()) {
            setFormError("Email is required.");
            return;
        }

        if (!editingUser && !form.password) {
            setFormError("Password is required.");
            return;
        }

        if (
            !editingUser &&
            form.password.length < 8
        ) {
            setFormError(
                "Password must be at least 8 characters."
            );
            return;
        }

        try {
            setSaving(true);

            let response;

            if (editingUser) {
                const payload = {
                    roleId: Number(form.roleId),
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    avatarUrl: form.avatarUrl.trim(),
                    status: form.status,
                };

                if (form.password.trim()) {
                    if (form.password.length < 8) {
                        setFormError(
                            "Password must be at least 8 characters."
                        );
                        return;
                    }

                    payload.password = form.password;
                }

                response = await updateUser(
                    editingUser.id,
                    payload
                );
            } else {
                response = await createUser({
                    roleId: Number(form.roleId),
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    phone: form.phone.trim(),
                    avatarUrl: form.avatarUrl.trim(),
                    status: form.status,
                });
            }

            if (response?.success === false) {
                throw new Error(
                    response.message ||
                    "Unable to save user."
                );
            }

            closeForm();

            await loadUsers(true);
        } catch (err) {
            console.error("Save user error:", err);

            setFormError(
                err?.message ||
                "Unable to save user."
            );
        } finally {
            setSaving(false);
        }
    };


    // =====================================================
    // STATUS
    // =====================================================

    const handleStatusChange = async (user) => {
        const currentStatus =
            String(user.status || "").toLowerCase();

        const newStatus =
            currentStatus === "active"
                ? "inactive"
                : "active";

        const confirmed = window.confirm(
            `${newStatus === "active" ? "Activate" : "Deactivate"} this user?`
        );

        if (!confirmed) return;

        try {
            setStatusLoadingId(user.id);

            const response =
                await updateUserStatus(
                    user.id,
                    newStatus
                );

            if (response?.success === false) {
                throw new Error(
                    response.message ||
                    "Unable to update user status."
                );
            }

            await loadUsers(true);
        } catch (err) {
            console.error(
                "Update user status error:",
                err
            );

            alert(
                err?.message ||
                "Unable to update user status."
            );
        } finally {
            setStatusLoadingId(null);
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Delete this user? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            const response =
                await deleteUserApi(id);

            if (response?.success === false) {
                throw new Error(
                    response.message ||
                    "Unable to delete user."
                );
            }

            await loadUsers(true);
        } catch (err) {
            console.error(
                "Delete user error:",
                err
            );

            alert(
                err?.message ||
                "Unable to delete user."
            );
        } finally {
            setDeletingId(null);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw
                        size={22}
                        className="animate-spin text-blue-400"
                    />

                    <p className="text-xs text-slate-500">
                        Loading users...
                    </p>
                </div>
            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="space-y-5">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                    <div>

                        <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                <UsersRound size={16} />
                            </div>

                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                                ROUTEX / ADMINISTRATION
                            </p>

                        </div>

                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Users & Roles
                        </h1>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Manage employees, system access and user accounts.
                        </p>

                    </div>


                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={() => loadUsers(true)}
                            disabled={refreshing}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-[10px] font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
                        >
                            <RefreshCw
                                size={13}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh
                        </button>


                        <button
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-blue-500"
                        >
                            <Plus size={14} />

                            Add User
                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                    <UserX
                        size={17}
                        className="mt-0.5 shrink-0 text-red-400"
                    />

                    <div className="flex-1">

                        <p className="text-xs font-semibold text-red-400">
                            Unable to load users
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-slate-500">
                            {error}
                        </p>

                    </div>

                    <button
                        onClick={() => loadUsers(true)}
                        className="text-[10px] font-semibold text-blue-400 hover:text-blue-300"
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* =================================================
                STATS
            ================================================= */}

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    icon={UsersRound}
                    title="Total Users"
                    value={totalUsers}
                />

                <StatCard
                    icon={CheckCircle2}
                    title="Active Users"
                    value={activeUsers}
                />

                <StatCard
                    icon={UserX}
                    title="Inactive Users"
                    value={inactiveUsers}
                />

                <StatCard
                    icon={ShieldCheck}
                    title="Suspended"
                    value={suspendedUsers}
                />

            </section>


            {/* =================================================
                FILTERS
            ================================================= */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">

                <div className="flex flex-col gap-3 xl:flex-row">

                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search by name, email, role or phone..."
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-[10px] text-white outline-none placeholder:text-slate-700 focus:border-blue-500/40"
                        />

                    </div>


                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-[10px] text-slate-300 outline-none focus:border-blue-500/40"
                    >
                        <option value="All">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                        <option value="suspended">
                            Suspended
                        </option>

                    </select>


                    {/* ROLE */}

                    <select
                        value={roleFilter}
                        onChange={(event) =>
                            setRoleFilter(event.target.value)
                        }
                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-[10px] text-slate-300 outline-none focus:border-blue-500/40"
                    >
                        {roles.map((role) => (
                            <option
                                key={role}
                                value={role}
                            >
                                {role === "All"
                                    ? "All Roles"
                                    : formatRole(role)}
                            </option>
                        ))}
                    </select>

                </div>

            </section>


            {/* =================================================
                USERS TABLE
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

                    <div>

                        <h2 className="text-xs font-semibold text-white">
                            System Users
                        </h2>

                        <p className="mt-1 text-[9px] text-slate-600">
                            {filteredUsers.length} user
                            {filteredUsers.length === 1 ? "" : "s"}
                            displayed
                        </p>

                    </div>

                </div>


                {filteredUsers.length === 0 ? (

                    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">

                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-600">
                            <UsersRound size={18} />
                        </div>

                        <p className="text-xs font-semibold text-white">
                            No users found
                        </p>

                        <p className="mt-1 max-w-sm text-[9px] leading-5 text-slate-600">
                            Try changing your search or filters,
                            or create a new user.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px]">

                            <thead>

                                <tr className="border-b border-slate-800 bg-slate-950/50">

                                    <th className="px-5 py-3 text-left text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                                        User
                                    </th>

                                    <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                                        Contact
                                    </th>

                                    <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                                        Role
                                    </th>

                                    <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-right text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredUsers.map((user) => {

                                    const status =
                                        String(
                                            user.status || ""
                                        ).toLowerCase();

                                    return (
                                        <tr
                                            key={user.id}
                                            className="border-b border-slate-800/70 transition hover:bg-slate-950/40"
                                        >

                                            {/* USER */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-[10px] font-bold text-blue-400">
                                                        {getInitials(user)}
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate text-[10px] font-semibold text-white">
                                                            {getFullName(user)}
                                                        </p>

                                                        <p className="mt-1 text-[8px] text-slate-600">
                                                            User ID: {user.id}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CONTACT */}

                                            <td className="px-4 py-4">

                                                <div className="space-y-1">

                                                    <div className="flex items-center gap-1.5">

                                                        <Mail
                                                            size={10}
                                                            className="text-slate-600"
                                                        />

                                                        <span className="text-[9px] text-slate-400">
                                                            {user.email || "—"}
                                                        </span>

                                                    </div>

                                                    <div className="flex items-center gap-1.5">

                                                        <Phone
                                                            size={10}
                                                            className="text-slate-600"
                                                        />

                                                        <span className="text-[9px] text-slate-500">
                                                            {user.phone || "—"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* ROLE */}

                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-2">

                                                    <ShieldCheck
                                                        size={12}
                                                        className="text-blue-400"
                                                    />

                                                    <span className="text-[9px] font-medium text-slate-300">
                                                        {formatRole(
                                                            getRoleName(user)
                                                        )}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-4 py-4">

                                                <span
                                                    className={`inline-flex rounded-full border px-2 py-1 text-[8px] font-semibold ${getStatusClass(
                                                        status
                                                    )}`}
                                                >
                                                    {formatStatus(status)}
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center justify-end gap-1.5">

                                                    <button
                                                        onClick={() =>
                                                            setViewingUser(user)
                                                        }
                                                        title="View user"
                                                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-500 transition hover:border-blue-500/30 hover:text-blue-400"
                                                    >
                                                        <Eye size={12} />
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            openEdit(user)
                                                        }
                                                        title="Edit user"
                                                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-500 transition hover:border-blue-500/30 hover:text-blue-400"
                                                    >
                                                        <Pencil size={12} />
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                user
                                                            )
                                                        }
                                                        disabled={
                                                            statusLoadingId ===
                                                            user.id
                                                        }
                                                        title={
                                                            status === "active"
                                                                ? "Deactivate user"
                                                                : "Activate user"
                                                        }
                                                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-500 transition hover:border-amber-500/30 hover:text-amber-400 disabled:opacity-50"
                                                    >
                                                        {statusLoadingId ===
                                                        user.id ? (
                                                            <RefreshCw
                                                                size={12}
                                                                className="animate-spin"
                                                            />
                                                        ) : status ===
                                                          "active" ? (
                                                            <UserX size={12} />
                                                        ) : (
                                                            <CheckCircle2
                                                                size={12}
                                                            />
                                                        )}
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            user.id
                                                        }
                                                        title="Delete user"
                                                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-500 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
                                                    >
                                                        {deletingId ===
                                                        user.id ? (
                                                            <RefreshCw
                                                                size={12}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2 size={12} />
                                                        )}
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* =================================================
                SECURITY PANEL
            ================================================= */}

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                <SecurityCard
                    icon={ShieldCheck}
                    title="Role-Based Access"
                    text="Users receive permissions based on their assigned role."
                />

                <SecurityCard
                    icon={KeyRound}
                    title="Secure Authentication"
                    text="Account credentials are protected by the platform."
                />

                <SecurityCard
                    icon={Clock3}
                    title="Login Monitoring"
                    text="Track user activity and recent authentication events."
                />

            </section>


            {/* =================================================
                VIEW USER
            ================================================= */}

            {viewingUser && (
                <UserDetails
                    user={viewingUser}
                    onClose={() =>
                        setViewingUser(null)
                    }
                    onEdit={() => {
                        setViewingUser(null);
                        openEdit(viewingUser);
                    }}
                />
            )}


            {/* =================================================
                CREATE / EDIT
            ================================================= */}

            {showForm && (
                <UserFormModal
                    form={form}
                    editingUser={editingUser}
                    saving={saving}
                    error={formError}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeForm}
                />
            )}

        </div>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    icon: Icon,
    title,
    value,
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <div className="flex items-center justify-between">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Icon size={15} />
                </div>

                <span className="text-lg font-semibold text-white">
                    {value}
                </span>

            </div>

            <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                {title}
            </p>

        </div>
    );
}


// =====================================================
// SECURITY CARD
// =====================================================

function SecurityCard({
    icon: Icon,
    title,
    text,
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">

            <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Icon size={15} />
                </div>

                <div>

                    <p className="text-[10px] font-semibold text-white">
                        {title}
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-slate-600">
                        {text}
                    </p>

                </div>

            </div>

        </div>
    );
}


// =====================================================
// VIEW USER MODAL
// =====================================================

function UserDetails({
    user,
    onClose,
    onEdit,
}) {
    const fullName = getFullName(user);
    const roleName = getRoleName(user);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

                    <div>

                        <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">
                            User Details
                        </p>

                        <h2 className="mt-1 text-sm font-semibold text-white">
                            {fullName}
                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white"
                    >
                        <X size={15} />
                    </button>

                </div>


                {/* BODY */}

                <div className="space-y-4 p-5">

                    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-400">
                            {getInitials(user)}
                        </div>

                        <div>

                            <p className="text-xs font-semibold text-white">
                                {fullName}
                            </p>

                            <p className="mt-1 text-[9px] text-slate-600">
                                ID: {user.id}
                            </p>

                        </div>

                    </div>


                    <DetailRow
                        icon={Mail}
                        label="Email"
                        value={user.email || "—"}
                    />

                    <DetailRow
                        icon={Phone}
                        label="Phone"
                        value={user.phone || "—"}
                    />

                    <DetailRow
                        icon={ShieldCheck}
                        label="Role"
                        value={formatRole(roleName)}
                    />

                    <DetailRow
                        icon={UserRound}
                        label="Status"
                        value={formatStatus(user.status)}
                    />

                    <DetailRow
                        icon={Clock3}
                        label="Last Login"
                        value={
                            user.last_login_at ||
                            user.lastLogin ||
                            "Never"
                        }
                    />

                    <DetailRow
                        icon={Clock3}
                        label="Created"
                        value={
                            user.created_at ||
                            user.createdAt ||
                            "—"
                        }
                    />

                </div>


                {/* FOOTER */}

                <div className="flex justify-end gap-2 border-t border-slate-800 px-5 py-4">

                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-[10px] font-semibold text-slate-400 hover:text-white"
                    >
                        Close
                    </button>

                    <button
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-semibold text-white hover:bg-blue-500"
                    >
                        <Pencil size={12} />
                        Edit User
                    </button>

                </div>

            </div>

        </div>
    );
}


// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-800/70 pb-3">

            <div className="flex items-center gap-2">

                <Icon
                    size={12}
                    className="text-slate-600"
                />

                <span className="text-[9px] text-slate-600">
                    {label}
                </span>

            </div>

            <span className="max-w-[60%] truncate text-right text-[9px] font-medium text-slate-300">
                {value}
            </span>

        </div>
    );
}


// =====================================================
// FORM MODAL
// =====================================================

function UserFormModal({
    form,
    editingUser,
    saving,
    error,
    onChange,
    onSubmit,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">

            <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

                    <div>

                        <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">
                            RouteX / Administration
                        </p>

                        <h2 className="mt-1 text-sm font-semibold text-white">
                            {editingUser
                                ? "Edit User"
                                : "Create User"}
                        </h2>

                        <p className="mt-1 text-[9px] text-slate-600">
                            {editingUser
                                ? "Update account information."
                                : "Create a new system user."}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-50"
                    >
                        <X size={15} />
                    </button>

                </div>


                {/* BODY */}

                <form
                    onSubmit={onSubmit}
                    className="space-y-4 p-5"
                >

                    {error && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-[10px] leading-5 text-red-400">
                            {error}
                        </div>
                    )}


                    {/* NAME */}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <FormField
                            label="First Name"
                            name="firstName"
                            value={form.firstName}
                            onChange={onChange}
                            placeholder="First name"
                            required
                        />

                        <FormField
                            label="Last Name"
                            name="lastName"
                            value={form.lastName}
                            onChange={onChange}
                            placeholder="Last name"
                            required
                        />

                    </div>


                    {/* EMAIL / PHONE */}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        <FormField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="user@routex.com"
                            required
                        />

                        <FormField
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            placeholder="+91..."
                        />

                    </div>


                    {/* ROLE ID */}

                    <FormField
                        label="Role ID"
                        name="roleId"
                        type="number"
                        value={form.roleId}
                        onChange={onChange}
                        placeholder="Enter role ID"
                        required
                    />

                    <p className="-mt-2 text-[8px] leading-4 text-slate-600">
                        Enter the ID of an existing role from your database.
                    </p>


                    {/* PASSWORD */}

                    <FormField
                        label={
                            editingUser
                                ? "New Password (optional)"
                                : "Password"
                        }
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        placeholder={
                            editingUser
                                ? "Leave blank to keep current password"
                                : "Minimum 8 characters"
                        }
                        required={!editingUser}
                    />


                    {/* AVATAR */}

                    <FormField
                        label="Avatar URL"
                        name="avatarUrl"
                        value={form.avatarUrl}
                        onChange={onChange}
                        placeholder="https://..."
                    />


                    {/* STATUS */}

                    <div>

                        <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                            Status
                        </label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={onChange}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-[10px] text-slate-300 outline-none focus:border-blue-500/40"
                        >
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                            <option value="suspended">
                                Suspended
                            </option>

                        </select>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-slate-700 px-4 py-2 text-[10px] font-semibold text-slate-400 hover:text-white disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-[10px] font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                        >
                            {saving && (
                                <RefreshCw
                                    size={12}
                                    className="animate-spin"
                                />
                            )}

                            {editingUser
                                ? "Save Changes"
                                : "Create User"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


// =====================================================
// FORM FIELD
// =====================================================

function FormField({
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

            <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">

                {label}

                {required && (
                    <span className="ml-1 text-red-400">
                        *
                    </span>
                )}

            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-[10px] text-white outline-none placeholder:text-slate-700 focus:border-blue-500/40"
            />

        </div>
    );
}


export default Users;