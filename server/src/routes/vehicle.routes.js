const express = require("express");

const authMiddleware =
    require("../middleware/auth.middleware");

const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    updateVehicleStatus,
    updateVehicleLocation,
    deleteVehicle,
} = require("../controllers/vehicle.controller");


const router = express.Router();


// All vehicle APIs require login
router.use(authMiddleware);


// GET /api/vehicles
router.get(
    "/",
    getVehicles
);


// GET /api/vehicles/:id
router.get(
    "/:id",
    getVehicleById
);


// POST /api/vehicles
router.post(
    "/",
    createVehicle
);


// PUT /api/vehicles/:id
router.put(
    "/:id",
    updateVehicle
);


// PATCH /api/vehicles/:id/status
router.patch(
    "/:id/status",
    updateVehicleStatus
);


// PATCH /api/vehicles/:id/location
router.patch(
    "/:id/location",
    updateVehicleLocation
);


// DELETE /api/vehicles/:id
router.delete(
    "/:id",
    deleteVehicle
);


module.exports = router;