const express = require("express");

const authMiddleware =
    require("../middleware/auth.middleware");

const {

    getOverview,

    getRecentShipments,

    getActiveAssignments,

    getRecentAlerts,

    getSummary,

} = require("../controllers/dashboard.controller");


const router = express.Router();


// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);


// =====================================================
// DASHBOARD OVERVIEW
// GET /api/dashboard/overview
// =====================================================

router.get(
    "/overview",
    getOverview
);


// =====================================================
// DASHBOARD SUMMARY
// GET /api/dashboard/summary
// =====================================================

router.get(
    "/summary",
    getSummary
);


// =====================================================
// RECENT SHIPMENTS
// GET /api/dashboard/recent-shipments
// =====================================================

router.get(
    "/recent-shipments",
    getRecentShipments
);


// =====================================================
// ACTIVE ASSIGNMENTS
// GET /api/dashboard/active-assignments
// =====================================================

router.get(
    "/active-assignments",
    getActiveAssignments
);


// =====================================================
// RECENT ALERTS
// GET /api/dashboard/recent-alerts
// =====================================================

router.get(
    "/recent-alerts",
    getRecentAlerts
);


module.exports = router;