import api from "./api";


// =====================================================
// GET DASHBOARD OVERVIEW
// GET /api/dashboard/overview
// =====================================================

export const getDashboardOverview = async () => {

    const response = await api.get(
        "/dashboard/overview"
    );

    return response.data;

};


// =====================================================
// GET RECENT SHIPMENTS
// GET /api/dashboard/recent-shipments
// =====================================================

export const getRecentShipments = async () => {

    const response = await api.get(
        "/dashboard/recent-shipments"
    );

    return response.data;

};