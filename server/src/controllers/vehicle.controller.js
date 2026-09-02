const { pool: db } = require("../config/db");


// =====================================================
// HELPERS
// =====================================================

const ALLOWED_STATUSES = [
    "available",
    "in_transit",
    "maintenance",
    "inactive",
];

const ALLOWED_FUEL_TYPES = [
    "diesel",
    "petrol",
    "cng",
    "electric",
    "hybrid",
];


// =====================================================
// GET ALL VEHICLES
// GET /api/vehicles
// =====================================================

const getVehicles = async (req, res, next) => {
    try {
        const {
            status,
            vehicleType,
            fuelType,
            search = "",
        } = req.query;

        const pageNumber =
            Math.max(Number(req.query.page) || 1, 1);

        const limitNumber =
            Math.min(
                Math.max(
                    Number(req.query.limit) || 10,
                    1
                ),
                100
            );

        const offset =
            (pageNumber - 1) * limitNumber;


        const conditions = [];
        const values = [];


        // -----------------------------
        // STATUS
        // -----------------------------

        if (status) {
            if (!ALLOWED_STATUSES.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid vehicle status",
                });
            }

            conditions.push("status = ?");
            values.push(status);
        }


        // -----------------------------
        // VEHICLE TYPE
        // -----------------------------

        if (vehicleType) {
            conditions.push(
                "vehicle_type = ?"
            );

            values.push(vehicleType);
        }


        // -----------------------------
        // FUEL TYPE
        // -----------------------------

        if (fuelType) {
            if (!ALLOWED_FUEL_TYPES.includes(fuelType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid fuel type",
                });
            }

            conditions.push(
                "fuel_type = ?"
            );

            values.push(fuelType);
        }


        // -----------------------------
        // SEARCH
        // -----------------------------

        if (search.trim()) {
            const searchValue =
                `%${search.trim()}%`;

            conditions.push(`
                (
                    vehicle_number LIKE ?
                    OR registration_number LIKE ?
                    OR vehicle_type LIKE ?
                    OR manufacturer LIKE ?
                    OR model LIKE ?
                )
            `);

            values.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }


        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";


        // -----------------------------
        // TOTAL COUNT
        // -----------------------------

        const [countRows] =
            await db.execute(
                `
                SELECT COUNT(*) AS total
                FROM vehicles
                ${whereClause}
                `,
                values
            );


        const total =
            Number(countRows[0]?.total || 0);


        // -----------------------------
        // VEHICLES
        // -----------------------------

        const [vehicles] =
            await db.execute(
                `
                SELECT
                    id,

                    vehicle_number AS vehicleNumber,
                    registration_number AS registrationNumber,
                    vehicle_type AS vehicleType,

                    manufacturer,
                    model,

                    manufacture_year AS manufactureYear,
                    capacity_kg AS capacityKg,

                    fuel_type AS fuelType,
                    status,

                    current_latitude AS currentLatitude,
                    current_longitude AS currentLongitude,

                    odometer_km AS odometerKm,
                    last_service_date AS lastServiceDate,

                    created_at AS createdAt,
                    updated_at AS updatedAt

                FROM vehicles

                ${whereClause}

                ORDER BY created_at DESC

                LIMIT ${limitNumber}
                OFFSET ${offset}
                `,
                values
            );


        const totalPages =
            total === 0
                ? 0
                : Math.ceil(
                    total / limitNumber
                );


        return res.status(200).json({
            success: true,

            data: vehicles,

            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages,
            },
        });

    } catch (error) {
        console.error(
            "Get vehicles error:",
            error
        );

        next(error);
    }
};


// =====================================================
// GET VEHICLE BY ID
// GET /api/vehicles/:id
// =====================================================

const getVehicleById = async (
    req,
    res,
    next
) => {
    try {
        const id =
            Number(req.params.id);


        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }


        const [vehicles] =
            await db.execute(
                `
                SELECT
                    id,

                    vehicle_number AS vehicleNumber,
                    registration_number AS registrationNumber,
                    vehicle_type AS vehicleType,

                    manufacturer,
                    model,

                    manufacture_year AS manufactureYear,
                    capacity_kg AS capacityKg,

                    fuel_type AS fuelType,
                    status,

                    current_latitude AS currentLatitude,
                    current_longitude AS currentLongitude,

                    odometer_km AS odometerKm,
                    last_service_date AS lastServiceDate,

                    created_at AS createdAt,
                    updated_at AS updatedAt

                FROM vehicles

                WHERE id = ?

                LIMIT 1
                `,
                [id]
            );


        if (vehicles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }


        return res.status(200).json({
            success: true,
            data: vehicles[0],
        });

    } catch (error) {
        console.error(
            "Get vehicle error:",
            error
        );

        next(error);
    }
};


// =====================================================
// CREATE VEHICLE
// POST /api/vehicles
// =====================================================

const createVehicle = async (
    req,
    res,
    next
) => {
    try {
        const {
            vehicleNumber,
            registrationNumber,
            vehicleType,
            manufacturer,
            model,
            manufactureYear,
            capacityKg,
            fuelType = "diesel",
        } = req.body || {};


        // -----------------------------
        // REQUIRED
        // -----------------------------

        if (
            !vehicleNumber?.trim() ||
            !registrationNumber?.trim() ||
            !vehicleType?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Vehicle number, registration number and vehicle type are required",
            });
        }


        // -----------------------------
        // FUEL
        // -----------------------------

        if (
            !ALLOWED_FUEL_TYPES.includes(
                fuelType
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid fuel type",
            });
        }


        // -----------------------------
        // CAPACITY
        // -----------------------------

        if (
            capacityKg !== undefined &&
            capacityKg !== null &&
            (
                !Number.isFinite(
                    Number(capacityKg)
                ) ||
                Number(capacityKg) < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Capacity must be a valid non-negative number",
            });
        }


        // -----------------------------
        // MANUFACTURE YEAR
        // -----------------------------

        if (
            manufactureYear !== undefined &&
            manufactureYear !== null &&
            manufactureYear !== ""
        ) {
            const year =
                Number(manufactureYear);

            if (
                !Number.isInteger(year) ||
                year < 1900 ||
                year > new Date().getFullYear() + 1
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid manufacture year",
                });
            }
        }


        // -----------------------------
        // INSERT
        // -----------------------------

        const [result] =
            await db.execute(
                `
                INSERT INTO vehicles (
                    vehicle_number,
                    registration_number,
                    vehicle_type,
                    manufacturer,
                    model,
                    manufacture_year,
                    capacity_kg,
                    fuel_type,
                    status
                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available')
                `,
                [
                    vehicleNumber.trim(),
                    registrationNumber.trim(),
                    vehicleType.trim(),
                    manufacturer?.trim() || null,
                    model?.trim() || null,
                    manufactureYear || null,
                    capacityKg !== undefined &&
                    capacityKg !== null &&
                    capacityKg !== ""
                        ? Number(capacityKg)
                        : null,
                    fuelType,
                ]
            );


        // -----------------------------
        // RETURN CREATED VEHICLE
        // -----------------------------

        const [vehicles] =
            await db.execute(
                `
                SELECT
                    id,

                    vehicle_number AS vehicleNumber,
                    registration_number AS registrationNumber,
                    vehicle_type AS vehicleType,

                    manufacturer,
                    model,

                    manufacture_year AS manufactureYear,
                    capacity_kg AS capacityKg,

                    fuel_type AS fuelType,
                    status,

                    current_latitude AS currentLatitude,
                    current_longitude AS currentLongitude,

                    odometer_km AS odometerKm,
                    last_service_date AS lastServiceDate,

                    created_at AS createdAt,
                    updated_at AS updatedAt

                FROM vehicles

                WHERE id = ?

                LIMIT 1
                `,
                [result.insertId]
            );


        return res.status(201).json({
            success: true,
            message:
                "Vehicle created successfully",
            data: vehicles[0],
        });

    } catch (error) {

        if (
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Vehicle number or registration number already exists",
            });
        }


        console.error(
            "Create vehicle error:",
            error
        );

        next(error);
    }
};


// =====================================================
// UPDATE VEHICLE
// PUT /api/vehicles/:id
// =====================================================

const updateVehicle = async (
    req,
    res,
    next
) => {
    try {
        const id =
            Number(req.params.id);


        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }


        const {
            vehicleNumber,
            registrationNumber,
            vehicleType,
            manufacturer,
            model,
            manufactureYear,
            capacityKg,
            fuelType,
            status,
            currentLatitude,
            currentLongitude,
            odometerKm,
            lastServiceDate,
        } = req.body || {};


        // -----------------------------
        // STATUS
        // -----------------------------

        if (
            status &&
            !ALLOWED_STATUSES.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle status",
            });
        }


        // -----------------------------
        // FUEL
        // -----------------------------

        if (
            fuelType &&
            !ALLOWED_FUEL_TYPES.includes(
                fuelType
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid fuel type",
            });
        }


        // -----------------------------
        // NUMBER VALIDATION
        // -----------------------------

        if (
            capacityKg !== undefined &&
            capacityKg !== null &&
            capacityKg !== "" &&
            (
                !Number.isFinite(
                    Number(capacityKg)
                ) ||
                Number(capacityKg) < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Capacity must be non-negative",
            });
        }


        if (
            odometerKm !== undefined &&
            odometerKm !== null &&
            odometerKm !== "" &&
            (
                !Number.isFinite(
                    Number(odometerKm)
                ) ||
                Number(odometerKm) < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Odometer must be non-negative",
            });
        }


        // -----------------------------
        // CHECK VEHICLE
        // -----------------------------

        const [existing] =
            await db.execute(
                `
                SELECT
                    id,
                    status
                FROM vehicles
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );


        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }


        // -----------------------------
        // PROTECT ACTIVE VEHICLE
        // -----------------------------

        if (
            existing[0].status ===
                "in_transit" &&
            status &&
            status !== "in_transit"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Cannot manually change the status of a vehicle currently in transit",
            });
        }


        // -----------------------------
        // UPDATE
        // -----------------------------

        await db.execute(
            `
            UPDATE vehicles

            SET
                vehicle_number =
                    COALESCE(?, vehicle_number),

                registration_number =
                    COALESCE(?, registration_number),

                vehicle_type =
                    COALESCE(?, vehicle_type),

                manufacturer =
                    COALESCE(?, manufacturer),

                model =
                    COALESCE(?, model),

                manufacture_year =
                    COALESCE(?, manufacture_year),

                capacity_kg =
                    COALESCE(?, capacity_kg),

                fuel_type =
                    COALESCE(?, fuel_type),

                status =
                    COALESCE(?, status),

                current_latitude =
                    COALESCE(?, current_latitude),

                current_longitude =
                    COALESCE(?, current_longitude),

                odometer_km =
                    COALESCE(?, odometer_km),

                last_service_date =
                    COALESCE(?, last_service_date)

            WHERE id = ?
            `,
            [
                vehicleNumber?.trim() || null,
                registrationNumber?.trim() || null,
                vehicleType?.trim() || null,
                manufacturer?.trim() || null,
                model?.trim() || null,
                manufactureYear || null,
                capacityKg !== undefined &&
                capacityKg !== null &&
                capacityKg !== ""
                    ? Number(capacityKg)
                    : null,
                fuelType || null,
                status || null,
                currentLatitude !== undefined &&
                currentLatitude !== null &&
                currentLatitude !== ""
                    ? Number(currentLatitude)
                    : null,
                currentLongitude !== undefined &&
                currentLongitude !== null &&
                currentLongitude !== ""
                    ? Number(currentLongitude)
                    : null,
                odometerKm !== undefined &&
                odometerKm !== null &&
                odometerKm !== ""
                    ? Number(odometerKm)
                    : null,
                lastServiceDate || null,
                id,
            ]
        );


        // -----------------------------
        // RETURN UPDATED
        // -----------------------------

        const [vehicles] =
            await db.execute(
                `
                SELECT
                    id,

                    vehicle_number AS vehicleNumber,
                    registration_number AS registrationNumber,
                    vehicle_type AS vehicleType,

                    manufacturer,
                    model,

                    manufacture_year AS manufactureYear,
                    capacity_kg AS capacityKg,

                    fuel_type AS fuelType,
                    status,

                    current_latitude AS currentLatitude,
                    current_longitude AS currentLongitude,

                    odometer_km AS odometerKm,
                    last_service_date AS lastServiceDate,

                    created_at AS createdAt,
                    updated_at AS updatedAt

                FROM vehicles

                WHERE id = ?

                LIMIT 1
                `,
                [id]
            );


        return res.status(200).json({
            success: true,
            message:
                "Vehicle updated successfully",
            data: vehicles[0],
        });

    } catch (error) {

        if (
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Vehicle number or registration number already exists",
            });
        }


        console.error(
            "Update vehicle error:",
            error
        );

        next(error);
    }
};


// =====================================================
// UPDATE VEHICLE STATUS
// PATCH /api/vehicles/:id/status
// =====================================================

const updateVehicleStatus = async (
    req,
    res,
    next
) => {
    try {
        const id =
            Number(req.params.id);

        const { status } =
            req.body || {};


        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }


        if (
            !ALLOWED_STATUSES.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid vehicle status",
            });
        }


        const [vehicles] =
            await db.execute(
                `
                SELECT
                    id,
                    status
                FROM vehicles
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );


        if (vehicles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }


        const currentStatus =
            vehicles[0].status;


        // Don't manually remove a vehicle
        // from transit.

        if (
            currentStatus ===
                "in_transit" &&
            status !== "in_transit"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Vehicle is currently in transit and its status is controlled by the assignment lifecycle",
            });
        }


        await db.execute(
            `
            UPDATE vehicles
            SET status = ?
            WHERE id = ?
            `,
            [
                status,
                id,
            ]
        );


        return res.status(200).json({
            success: true,
            message:
                "Vehicle status updated successfully",
            data: {
                id,
                status,
            },
        });

    } catch (error) {
        console.error(
            "Vehicle status error:",
            error
        );

        next(error);
    }
};


// =====================================================
// UPDATE VEHICLE LOCATION
// PATCH /api/vehicles/:id/location
// =====================================================

const updateVehicleLocation = async (
    req,
    res,
    next
) => {
    try {
        const id =
            Number(req.params.id);

        const {
            latitude,
            longitude,
        } = req.body || {};


        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }


        const lat =
            Number(latitude);

        const lng =
            Number(longitude);


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Latitude and longitude must be valid numbers",
            });
        }


        if (
            lat < -90 ||
            lat > 90
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Latitude must be between -90 and 90",
            });
        }


        if (
            lng < -180 ||
            lng > 180
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Longitude must be between -180 and 180",
            });
        }


        const [result] =
            await db.execute(
                `
                UPDATE vehicles

                SET
                    current_latitude = ?,
                    current_longitude = ?

                WHERE id = ?
                `,
                [
                    lat,
                    lng,
                    id,
                ]
            );


        if (
            result.affectedRows === 0
        ) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }


        return res.status(200).json({
            success: true,
            message:
                "Vehicle location updated successfully",
            data: {
                id,
                latitude: lat,
                longitude: lng,
            },
        });

    } catch (error) {
        console.error(
            "Vehicle location error:",
            error
        );

        next(error);
    }
};


// =====================================================
// DELETE / DEACTIVATE VEHICLE
// DELETE /api/vehicles/:id
// =====================================================

const deleteVehicle = async (
    req,
    res,
    next
) => {
    try {
        const id =
            Number(req.params.id);


        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }


        const [vehicles] =
            await db.execute(
                `
                SELECT
                    id,
                    status
                FROM vehicles
                WHERE id = ?
                LIMIT 1
                `,
                [id]
            );


        if (vehicles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }


        if (
            vehicles[0].status ===
            "in_transit"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Cannot deactivate a vehicle currently in transit",
            });
        }


        await db.execute(
            `
            UPDATE vehicles
            SET status = 'inactive'
            WHERE id = ?
            `,
            [id]
        );


        return res.status(200).json({
            success: true,
            message:
                "Vehicle deactivated successfully",
        });

    } catch (error) {
        console.error(
            "Delete vehicle error:",
            error
        );

        next(error);
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    updateVehicleStatus,
    updateVehicleLocation,
    deleteVehicle,
};