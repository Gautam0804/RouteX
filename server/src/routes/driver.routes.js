const express = require("express");

const authMiddleware =
    require("../middleware/auth.middleware");

const {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
} = require("../controllers/driver.controller");

const router = express.Router();

router.use(authMiddleware);

router.get(
    "/",
    getDrivers
);

router.get(
    "/:id",
    getDriverById
);

router.post(
    "/",
    createDriver
);

router.put(
    "/:id",
    updateDriver
);

router.delete(
    "/:id",
    deleteDriver
);

module.exports = router;