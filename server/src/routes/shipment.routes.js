const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const {
    requireRoles,
} = require("../middleware/role.middleware");

const {
    getShipments,
    getShipmentById,
    createShipment,
    updateShipment,
} = require("../controllers/shipment.controller");

const router = express.Router();


// =====================================================
// AUTHENTICATION
// =====================================================

// Every shipment endpoint requires JWT authentication.
router.use(authMiddleware);


// =====================================================
// GET ALL SHIPMENTS
// GET /api/shipments
// =====================================================

// Allowed roles:
// - super_admin
// - fleet_manager
// - dispatcher
// - driver
//
// Supports query parameters such as:
//
// /api/shipments
// /api/shipments?status=pending
// /api/shipments?priority=urgent
// /api/shipments?search=Delhi
// /api/shipments?page=1&limit=20
//
// The controller handles the filtering and pagination.

router.get(
    "/",
    requireRoles(
        "super_admin",
        "fleet_manager",
        "dispatcher",
        "driver"
    ),
    getShipments
);


// =====================================================
// GET SHIPMENT BY ID
// GET /api/shipments/:id
// =====================================================

// Operational users can view shipment details.

router.get(
    "/:id",
    requireRoles(
        "super_admin",
        "fleet_manager",
        "dispatcher",
        "driver"
    ),
    getShipmentById
);


// =====================================================
// CREATE SHIPMENT
// POST /api/shipments
// =====================================================

// Only administrative/operational users who create
// shipments should have access.

router.post(
    "/",
    requireRoles(
        "super_admin",
        "fleet_manager",
        "dispatcher"
    ),
    createShipment
);


// =====================================================
// UPDATE SHIPMENT
// PUT /api/shipments/:id
// =====================================================

// Shipment information can be updated by:
//
// - super_admin
// - fleet_manager
// - dispatcher

router.put(
    "/:id",
    requireRoles(
        "super_admin",
        "fleet_manager",
        "dispatcher"
    ),
    updateShipment
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;