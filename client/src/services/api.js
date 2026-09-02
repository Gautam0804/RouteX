import axios from "axios";

// =====================================================
// API CONFIGURATION
// =====================================================

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("VITE_API_URL is not configured");
}

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// =====================================================
// AUTH TOKEN INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }

        return Promise.reject(error);
    }
);

// =====================================================
// AUTH
// =====================================================

export const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const logout = async () => {
    localStorage.removeItem("token");
    return true;
};

// =====================================================
// CUSTOMERS
// =====================================================

export const getCustomers = async (params = {}) => {
    const response = await api.get("/customers", {
        params,
    });

    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

export const createCustomer = async (data) => {
    const response = await api.post("/customers", data);
    return response.data;
};

export const updateCustomer = async (id, data) => {
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

// =====================================================
// SHIPMENTS
// =====================================================

export const getShipments = async (params = {}) => {
    const response = await api.get("/shipments", {
        params,
    });

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

export const updateShipment = async (id, data) => {
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

// =====================================================
// VEHICLES
// =====================================================

export const getVehicles = async (params = {}) => {
    const response = await api.get("/vehicles", {
        params,
    });

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

export const updateVehicle = async (id, data) => {
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

// =====================================================
// DRIVERS
// =====================================================

export const getDrivers = async (params = {}) => {
    const response = await api.get("/drivers", {
        params,
    });

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

export const updateDriver = async (id, data) => {
    const response = await api.put(
        `/drivers/${id}`,
        data
    );

    return response.data;
};

export const updateDriverStatus = async (
    id,
    status
) => {
    const response = await api.patch(
        `/drivers/${id}/status`,
        {
            status,
        }
    );

    return response.data;
};

export const deleteDriver = async (id) => {
    const response = await api.delete(
        `/drivers/${id}`
    );

    return response.data;
};

// =====================================================
// ASSIGNMENTS
// =====================================================

export const getAssignments = async (params = {}) => {
    const response = await api.get(
        "/assignments",
        {
            params,
        }
    );

    return response.data;
};

export const getAssignmentById = async (id) => {
    const response = await api.get(
        `/assignments/${id}`
    );

    return response.data;
};

export const createAssignment = async (data) => {
    const response = await api.post(
        "/assignments",
        data
    );

    return response.data;
};

export const updateAssignmentStatus = async (
    id,
    status
) => {
    const response = await api.patch(
        `/assignments/${id}/status`,
        {
            status,
        }
    );

    return response.data;
};

// =====================================================
// ALERTS
// =====================================================

export const getAlerts = async (params = {}) => {
    const response = await api.get("/alerts", {
        params,
    });

    return response.data;
};

export const updateAlertStatus = async (
    id,
    status
) => {
    const response = await api.patch(
        `/alerts/${id}/status`,
        {
            status,
        }
    );

    return response.data;
};

// =====================================================
// TRACKING
// =====================================================

export const getTracking = async (params = {}) => {
    const response = await api.get("/tracking", {
        params,
    });

    return response.data;
};

export const getLatestTracking = async (id) => {
    const response = await api.get(
        `/tracking/latest/${id}`
    );

    return response.data;
};

export const getLiveTracking = async () => {
    const response = await api.get(
        "/tracking/live"
    );

    return response.data;
};

export const getShipmentTracking = async (id) => {
    const response = await api.get(
        `/tracking/shipment/${id}`
    );

    return response.data;
};

export const createTracking = async (data) => {
    const response = await api.post(
        "/tracking",
        data
    );

    return response.data;
};

// =====================================================
// DASHBOARD
// =====================================================

export const getDashboardOverview = async () => {
    const response = await api.get(
        "/dashboard/overview"
    );

    return response.data;
};

export const getRecentShipments = async (
    params = {}
) => {
    const response = await api.get(
        "/dashboard/recent-shipments",
        {
            params,
        }
    );

    return response.data;
};

// =====================================================
// USERS
// =====================================================

export const getUsers = async (params = {}) => {
    const response = await api.get("/users", {
        params,
    });

    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(
        `/users/${id}`
    );

    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post(
        "/users",
        data
    );

    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put(
        `/users/${id}`,
        data
    );

    return response.data;
};

export const updateUserStatus = async (
    id,
    status
) => {
    const response = await api.patch(
        `/users/${id}/status`,
        {
            status,
        }
    );

    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(
        `/users/${id}`
    );

    return response.data;
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;