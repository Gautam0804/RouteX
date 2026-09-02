const express = require("express");

const authMiddleware =
    require("../middleware/auth.middleware");

const {
    createAuditLog,
    getAuditLogs,
    getAuditLogById,
} = require("../controllers/audit.controller");


const router = express.Router();


// ==========================================
// AUTHENTICATION
// ==========================================

router.use(authMiddleware);


// ==========================================
// GET ALL
// ==========================================

router.get(
    "/",
    getAuditLogs
);


// ==========================================
// GET BY ID
// ==========================================

router.get(
    "/:id",
    getAuditLogById
);


// ==========================================
// CREATE
// ==========================================

router.post(
    "/",
    createAuditLog
);


module.exports = router;