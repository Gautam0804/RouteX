import api from "../api/api";


// =====================================================
// GET ALL CUSTOMERS
// =====================================================

export const getCustomers = async (params = {}) => {

    const response = await api.get(
        "/customers",
        {
            params,
        }
    );

    return response.data;
};


// =====================================================
// GET CUSTOMER BY ID
// =====================================================

export const getCustomerById = async (id) => {

    const response = await api.get(
        `/customers/${id}`
    );

    return response.data;
};


// =====================================================
// CREATE CUSTOMER
// =====================================================

export const createCustomer = async (data) => {

    const response = await api.post(
        "/customers",
        data
    );

    return response.data;
};


// =====================================================
// UPDATE CUSTOMER
// =====================================================

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


// =====================================================
// DEACTIVATE CUSTOMER
// =====================================================

export const deleteCustomer = async (id) => {

    const response = await api.delete(
        `/customers/${id}`
    );

    return response.data;
};