const express = require("express");

const authMiddleware =
    require("../middleware/auth.middleware");

const {
    createTracking,
    getTrackingByAssignment,
    getLatestTracking,
    getLiveTracking,
    getShipmentTracking,
} = require("../controllers/tracking.controller");


const router = express.Router();


// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);


// =====================================================
// CREATE TRACKING
// POST /api/tracking
// =====================================================

router.post(
    "/",
    createTracking
);


// =====================================================
// LIVE TRACKING
// GET /api/tracking/live
// =====================================================

router.get(
    "/live",
    getLiveTracking
);


// =====================================================
// SHIPMENT TRACKING
// GET /api/tracking/shipment/:trackingNumber
// =====================================================

router.get(
    "/shipment/:trackingNumber",
    getShipmentTracking
);


// =====================================================
// LATEST LOCATION
// GET /api/tracking/assignment/:assignmentId/latest
// =====================================================

router.get(
    "/assignment/:assignmentId/latest",
    getLatestTracking
);


// =====================================================
// TRACKING HISTORY
// GET /api/tracking/assignment/:assignmentId
// =====================================================

router.get(
    "/assignment/:assignmentId",
    getTrackingByAssignment
);


module.exports = router;