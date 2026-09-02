import api from "../api/api";


// =====================================================
// GET ALL ASSIGNMENTS
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


// =====================================================
// GET ASSIGNMENT BY ID
// =====================================================

export const getAssignmentById = async (id) => {

    const response = await api.get(
        `/assignments/${id}`
    );

    return response.data;
};


// =====================================================
// CREATE ASSIGNMENT
// =====================================================

export const createAssignment = async (data) => {

    const response = await api.post(
        "/assignments",
        data
    );

    return response.data;
};


// =====================================================
// UPDATE ASSIGNMENT STATUS
// =====================================================

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


export default {
    getAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignmentStatus,
};