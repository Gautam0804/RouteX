const express = require("express");

const router = express.Router();

const {
    login,
    getMe,
} = require("../controllers/auth.controller");

const authMiddleware =
    require("../middleware/auth.middleware");


// ======================================
// LOGIN
// ======================================

router.post(
    "/login",
    login
);


// ======================================
// CURRENT USER
// ======================================

router.get(
    "/me",
    authMiddleware,
    getMe
);


module.exports = router;