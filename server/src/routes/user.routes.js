const express = require("express");

const authMiddleware =
    require("../middleware/auth.middleware");

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
} = require("../controllers/user.controller");


const router = express.Router();


// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);


// =====================================================
// USERS
// =====================================================

// GET /api/users
router.get(
    "/",
    getUsers
);


// GET /api/users/:id
router.get(
    "/:id",
    getUserById
);


// POST /api/users
router.post(
    "/",
    createUser
);


// PUT /api/users/:id
router.put(
    "/:id",
    updateUser
);


// PATCH /api/users/:id/status
router.patch(
    "/:id/status",
    updateUserStatus
);


// DELETE /api/users/:id
router.delete(
    "/:id",
    deleteUser
);


module.exports = router;