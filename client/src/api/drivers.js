import api from "./api";


// =====================================================
// GET ALL DRIVERS
// =====================================================

export const getDrivers = async (params = {}) => {

    const response = await api.get(
        "/drivers",
        {
            params,
        }
    );

    return response.data;
};


// =====================================================
// GET DRIVER BY ID
// =====================================================

export const getDriverById = async (id) => {

    const response = await api.get(
        `/drivers/${id}`
    );

    return response.data;
};


// =====================================================
// CREATE DRIVER
// =====================================================

export const createDriver = async (data) => {

    const response = await api.post(
        "/drivers",
        data
    );

    return response.data;
};


// =====================================================
// UPDATE DRIVER
// =====================================================

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


// =====================================================
// DELETE DRIVER
// =====================================================

export const deleteDriver = async (id) => {

    const response = await api.delete(
        `/drivers/${id}`
    );

    return response.data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
};