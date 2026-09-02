import api from "./api";


// =====================================================
// GET ALL SHIPMENTS
// =====================================================

export const getShipments = async (params = {}) => {

    const response = await api.get(
        "/shipments",
        {
            params,
        }
    );

    return response.data;
};


// =====================================================
// GET SHIPMENT BY ID
// =====================================================

export const getShipmentById = async (id) => {

    const response = await api.get(
        `/shipments/${id}`
    );

    return response.data;
};


// =====================================================
// CREATE SHIPMENT
// =====================================================

export const createShipment = async (data) => {

    const response = await api.post(
        "/shipments",
        data
    );

    return response.data;
};


// =====================================================
// UPDATE SHIPMENT
// =====================================================

export const updateShipment = async (id, data) => {

    const response = await api.put(
        `/shipments/${id}`,
        data
    );

    return response.data;
};


// =====================================================
// DELETE SHIPMENT
// =====================================================

export const deleteShipment = async (id) => {

    const response = await api.delete(
        `/shipments/${id}`
    );

    return response.data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment,
};