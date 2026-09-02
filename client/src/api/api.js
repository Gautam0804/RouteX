import axios from "axios";

// ======================================================
// API CONFIGURATION
// ======================================================

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error(
        "VITE_API_URL is not configured"
    );
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// ======================================================
// AUTH TOKEN
// ======================================================

api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("routex_token") ||
            localStorage.getItem("token");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ======================================================
// AUTH
// ======================================================

export const login = async (
    email,
    password
) => {
    const response = await api.post(
        "/auth/login",
        {
            email,
            password,
        }
    );

    const token =
        response.data?.token ||
        response.data?.data?.token;

    if (token) {
        localStorage.setItem(
            "routex_token",
            token
        );
    }

    return response.data;
};

export const getMe = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};

// ======================================================
// CUSTOMERS
// ======================================================

export const getCustomers = async (
    params = {}
) => {
    const response = await api.get(
        "/customers",
        { params }
    );

    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await api.get(
        `/customers/${id}`
    );

    return response.data;
};

export const createCustomer = async (data) => {
    const response = await api.post(
        "/customers",
        data
    );

    return response.data;
};

export const updateCustomer = async (
    id,
    data
) => {
    const response = await api.put(
        `/customers/${id}`,
        data
    );

    return response.data;
};

export const deleteCustomer = async (id) => {
    const response = await api.delete(
        `/customers/${id}`
    );

    return response.data;
};

// ======================================================
// SHIPMENTS
// ======================================================

export const getShipments = async (
    params = {}
) => {
    const response = await api.get(
        "/shipments",
        { params }
    );

    return response.data;
};

export const getShipmentById = async (id) => {
    const response = await api.get(
        `/shipments/${id}`
    );

    return response.data;
};

export const createShipment = async (data) => {
    const response = await api.post(
        "/shipments",
        data
    );

    return response.data;
};

export const updateShipment = async (
    id,
    data
) => {
    const response = await api.put(
        `/shipments/${id}`,
        data
    );

    return response.data;
};

export const deleteShipment = async (id) => {
    const response = await api.delete(
        `/shipments/${id}`
    );

    return response.data;
};

// ======================================================
// VEHICLES
// ======================================================

export const getVehicles = async (
    params = {}
) => {
    const response = await api.get(
        "/vehicles",
        { params }
    );

    return response.data;
};

export const getVehicleById = async (id) => {
    const response = await api.get(
        `/vehicles/${id}`
    );

    return response.data;
};

export const createVehicle = async (data) => {
    const response = await api.post(
        "/vehicles",
        data
    );

    return response.data;
};

export const updateVehicle = async (
    id,
    data
) => {
    const response = await api.put(
        `/vehicles/${id}`,
        data
    );

    return response.data;
};

export const deleteVehicle = async (id) => {
    const response = await api.delete(
        `/vehicles/${id}`
    );

    return response.data;
};

// ======================================================
// DRIVERS
// ======================================================

export const getDrivers = async (
    params = {}
) => {
    const response = await api.get(
        "/drivers",
        { params }
    );

    return response.data;
};

export const getDriver = async (id) => {
    const response = await api.get(
        `/drivers/${id}`
    );

    return response.data;
};

export const getDriverById = async (id) => {
    const response = await api.get(
        `/drivers/${id}`
    );

    return response.data;
};

export const createDriver = async (data) => {
    const response = await api.post(
        "/drivers",
        data
    );

    return response.data;
};

export const updateDriver = async (
    id,
    data
) => {
    const response = await api.put(
        `/drivers/${id}`,
        data
    );

    return response.data;
};

export const deleteDriver = async (id) => {
    const response = await api.delete(
        `/drivers/${id}`
    );

    return response.data;
};

// ======================================================
// ASSIGNMENTS
// ======================================================

export const getAssignments = async (
    params = {}
) => {
    const response = await api.get(
        "/assignments",
        { params }
    );

    return response.data;
};

export const getAssignmentById = async (
    id
) => {
    const response = await api.get(
        `/assignments/${id}`
    );

    return response.data;
};

export const createAssignment = async (
    data
) => {
    const response = await api.post(
        "/assignments",
        {
            shipmentId: Number(
                data.shipmentId
            ),
            vehicleId: Number(
                data.vehicleId
            ),
            driverId: Number(
                data.driverId
            ),
        }
    );

    return response.data;
};

export const updateAssignmentStatus =
    async (id, status) => {
        const response = await api.patch(
            `/assignments/${id}/status`,
            { status }
        );

        return response.data;
    };

// ======================================================
// ALERTS
// ======================================================

export const getAlerts = async (
    params = {}
) => {
    const response = await api.get(
        "/alerts",
        { params }
    );

    return response.data;
};

export const updateAlertStatus =
    async (id, status) => {
        const response = await api.patch(
            `/alerts/${id}/status`,
            { status }
        );

        return response.data;
    };

// ======================================================
// TRACKING
// ======================================================

export const getTracking = async (
    assignmentId
) => {
    const response = await api.get(
        `/tracking/assignment/${assignmentId}`
    );

    return response.data;
};

export const getLatestTracking = async (
    assignmentId
) => {
    const response = await api.get(
        `/tracking/assignment/${assignmentId}/latest`
    );

    return response.data;
};

export const getLiveTracking = async () => {
    const response = await api.get(
        "/tracking/live"
    );

    return response.data;
};

export const getShipmentTracking = async (
    trackingNumber
) => {
    const response = await api.get(
        `/tracking/shipment/${trackingNumber}`
    );

    return response.data;
};

export const createTracking = async (
    data
) => {
    const response = await api.post(
        "/tracking",
        data
    );

    return response.data;
};

// ======================================================
// DASHBOARD
// ======================================================

export const getDashboardOverview =
    async () => {
        const response = await api.get(
            "/dashboard/overview"
        );

        return response.data;
    };

export const getRecentShipments =
    async () => {
        const response = await api.get(
            "/dashboard/recent-shipments"
        );

        return response.data;
    };

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default api;