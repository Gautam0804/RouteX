const express = require("express");

const authMiddleware =
    require("../middleware/auth.middleware");

const {

    getAlerts,

    getAlertById,

    createAlert,

    updateAlertStatus,

} = require("../controllers/alert.controller");


const router = express.Router();


// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);


// =====================================================
// GET ALL ALERTS
// GET /api/alerts
// =====================================================

router.get(
    "/",
    getAlerts
);


// =====================================================
// CREATE ALERT
// POST /api/alerts
// =====================================================

router.post(
    "/",
    createAlert
);


// =====================================================
// UPDATE ALERT STATUS
// PATCH /api/alerts/:id/status
// =====================================================

router.patch(
    "/:id/status",
    updateAlertStatus
);


// =====================================================
// GET ALERT BY ID
// GET /api/alerts/:id
// =====================================================

router.get(
    "/:id",
    getAlertById
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;