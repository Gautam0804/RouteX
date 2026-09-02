import api from "../api/api";


// =====================================================
// GET ALL VEHICLES
// =====================================================

export const getVehicles = async (params = {}) => {

    const response = await api.get(
        "/vehicles",
        {
            params,
        }
    );

    return response.data;
};


// =====================================================
// GET VEHICLE BY ID
// =====================================================

export const getVehicleById = async (id) => {

    const response = await api.get(
        `/vehicles/${id}`
    );

    return response.data;
};


// =====================================================
// CREATE VEHICLE
// =====================================================

export const createVehicle = async (data) => {

    const response = await api.post(
        "/vehicles",
        data
    );

    return response.data;
};


// =====================================================
// UPDATE VEHICLE
// =====================================================

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


// =====================================================
// DELETE / DEACTIVATE VEHICLE
// =====================================================

export const deleteVehicle = async (id) => {

    const response = await api.delete(
        `/vehicles/${id}`
    );

    return response.data;
};


export default {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
};