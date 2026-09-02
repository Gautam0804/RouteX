const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");

const {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignmentStatus,
} = require("../controllers/assignment.controller");

const router = express.Router();

// =====================================================
// AUTHENTICATION
// =====================================================

// Every assignment API requires authentication
router.use(authMiddleware);


// =====================================================
// GET ALL ASSIGNMENTS
// GET /api/assignments
// =====================================================

// Allowed roles:
// super_admin
// fleet_manager
// dispatcher
// driver

router.get(
    "/",
    requireRoles(
        "super_admin",
        "fleet_manager",
        "dispatcher",
        "driver"
    ),
    getAssignments
);


// =====================================================
// GET ASSIGNMENT BY ID
// GET /api/assignments/:id
// =====================================================

// Allowed roles:
// super_admin
// fleet_manager
// dispatcher
// driver

router.get(
    "/:id",
    requireRoles(
        "super_admin",
        "fleet_manager",
        "dispatcher",
        "driver"
    ),
    getAssignmentById
);


// =====================================================
// CREATE ASSIGNMENT
// POST /api/assignments
// =====================================================

// Allowed roles:
// super_admin
// fleet_manager
// dispatcher

router.post(
    "/",
    requireRoles(
        "super_admin",
        "fleet_manager",
        "dispatcher"
    ),
    createAssignment
);


// =====================================================
// UPDATE ASSIGNMENT STATUS
// PATCH /api/assignments/:id/status
// =====================================================

// Allowed roles:
// super_admin
// fleet_manager
// dispatcher
// driver

router.patch(
    "/:id/status",
    requireRoles(
        "super_admin",
        "fleet_manager",
        "dispatcher",
        "driver"
    ),
    updateAssignmentStatus
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;