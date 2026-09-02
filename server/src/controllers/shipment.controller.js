const { pool } = require("../config/db");

// =====================================================
// CONSTANTS
// =====================================================

const VALID_STATUSES = [
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "delayed",
    "cancelled",
];

const VALID_PRIORITIES = [
    "low",
    "normal",
    "high",
    "urgent",
];

const ALLOWED_TRANSITIONS = {
    pending: ["assigned", "cancelled"],

    assigned: [
        "picked_up",
        "cancelled",
    ],

    picked_up: [
        "in_transit",
        "cancelled",
    ],

    in_transit: [
        "out_for_delivery",
        "delivered",
        "delayed",
        "cancelled",
    ],

    out_for_delivery: [
        "delivered",
        "delayed",
        "cancelled",
    ],

    delayed: [
        "in_transit",
        "out_for_delivery",
        "cancelled",
    ],

    delivered: [],

    cancelled: [],
};


// =====================================================
// GET ALL SHIPMENTS
// GET /api/shipments
// =====================================================

const getShipments = async (req, res, next) => {

    try {

        const {
            search = "",
            status = "all",
            priority = "all",
            page = 1,
            limit = 20,
        } = req.query;


        const pageNumber =
            Math.max(
                Number(page) || 1,
                1
            );

        const limitNumber =
            Math.min(
                Math.max(
                    Number(limit) || 20,
                    1
                ),
                100
            );

        const offset =
            (pageNumber - 1) *
            limitNumber;


        const conditions = [];
        const params = [];


        // =================================================
        // STATUS FILTER
        // =================================================

        if (
            status &&
            status !== "all"
        ) {

            if (
                !VALID_STATUSES.includes(
                    status
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid shipment status",
                });

            }

            conditions.push(
                "s.status = ?"
            );

            params.push(status);
        }


        // =================================================
        // PRIORITY FILTER
        // =================================================

        if (
            priority &&
            priority !== "all"
        ) {

            if (
                !VALID_PRIORITIES.includes(
                    priority
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid shipment priority",
                });

            }

            conditions.push(
                "s.priority = ?"
            );

            params.push(priority);
        }


        // =================================================
        // SEARCH
        // =================================================

        if (search.trim()) {

            const searchValue =
                `%${search.trim()}%`;

            conditions.push(`
                (
                    s.tracking_number LIKE ?
                    OR s.origin_city LIKE ?
                    OR s.destination_city LIKE ?
                    OR c.company_name LIKE ?
                )
            `);

            params.push(
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


        // =================================================
        // COUNT
        // =================================================

        const [countRows] =
            await pool.execute(
                `
                SELECT COUNT(*) AS total

                FROM shipments AS s

                LEFT JOIN customers AS c
                    ON c.id = s.customer_id

                ${whereClause}
                `,
                params
            );


        const total =
            Number(
                countRows[0]?.total || 0
            );


        // =================================================
        // SHIPMENTS
        // =================================================

        const [shipments] =
            await pool.execute(
                `
                SELECT

                    s.id,
                    s.tracking_number,
                    s.customer_id,

                    s.origin_address,
                    s.origin_city,

                    s.destination_address,
                    s.destination_city,

                    s.package_description,
                    s.package_count,
                    s.weight_kg,

                    s.priority,
                    s.status,

                    s.estimated_delivery_at,
                    s.actual_delivery_at,

                    s.delivery_notes,

                    s.created_by,
                    s.created_at,
                    s.updated_at,

                    c.customer_code,
                    c.company_name,
                    c.contact_person,
                    c.phone AS customer_phone

                FROM shipments AS s

                LEFT JOIN customers AS c
                    ON c.id = s.customer_id

                ${whereClause}

                ORDER BY s.created_at DESC

                LIMIT ${limitNumber}
                OFFSET ${offset}
                `,
                params
            );


        return res.status(200).json({

            success: true,

            data: shipments,

            pagination: {

                page: pageNumber,

                limit: limitNumber,

                total,

                totalPages:
                    Math.ceil(
                        total / limitNumber
                    ),

            },

        });

    } catch (error) {

        console.error(
            "GET SHIPMENTS ERROR:",
            error
        );

        return next(error);
    }
};


// =====================================================
// GET SHIPMENT BY ID
// GET /api/shipments/:id
// =====================================================

const getShipmentById = async (
    req,
    res,
    next
) => {

    try {

        const id =
            Number(req.params.id);


        // =================================================
        // VALIDATE ID
        // =================================================

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID",
            });

        }


        // =================================================
        // GET SHIPMENT
        // =================================================

        const [shipments] =
            await pool.execute(
                `
                SELECT

                    s.id,
                    s.tracking_number,
                    s.customer_id,

                    s.origin_address,
                    s.origin_city,

                    s.destination_address,
                    s.destination_city,

                    s.package_description,
                    s.package_count,
                    s.weight_kg,

                    s.priority,
                    s.status,

                    s.estimated_delivery_at,
                    s.actual_delivery_at,

                    s.delivery_notes,

                    s.created_by,
                    s.created_at,
                    s.updated_at,

                    c.customer_code,
                    c.company_name,
                    c.contact_person,
                    c.email AS customer_email,
                    c.phone AS customer_phone

                FROM shipments AS s

                LEFT JOIN customers AS c
                    ON c.id = s.customer_id

                WHERE s.id = ?

                LIMIT 1
                `,
                [id]
            );


        // =================================================
        // NOT FOUND
        // =================================================

        if (
            shipments.length === 0
        ) {

            return res.status(404).json({
                success: false,
                message: "Shipment not found",
            });

        }


        return res.status(200).json({

            success: true,

            data: shipments[0],

        });

    } catch (error) {

        console.error(
            "GET SHIPMENT BY ID ERROR:",
            error
        );

        return next(error);
    }
};


// =====================================================
// CREATE SHIPMENT
// POST /api/shipments
// =====================================================

const createShipment = async (
    req,
    res,
    next
) => {

    const connection =
        await pool.getConnection();

    try {

        const {

            trackingNumber,

            customerId,

            originAddress,
            originCity,

            destinationAddress,
            destinationCity,

            packageDescription,

            packageCount = 1,

            weightKg,

            priority = "normal",

            estimatedDeliveryAt,

            deliveryNotes,

        } = req.body;


        // =================================================
        // REQUIRED FIELDS
        // =================================================

        if (
            !trackingNumber ||
            !customerId ||
            !originAddress ||
            !originCity ||
            !destinationAddress ||
            !destinationCity ||
            !packageDescription ||
            weightKg === undefined ||
            weightKg === null
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "All required shipment fields must be provided",
            });

        }


        // =================================================
        // VALIDATE PRIORITY
        // =================================================

        if (
            !VALID_PRIORITIES.includes(
                priority
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid shipment priority",
            });

        }


        // =================================================
        // VALIDATE NUMBERS
        // =================================================

        const customerIdNumber =
            Number(customerId);

        const packageCountNumber =
            Number(packageCount);

        const weightNumber =
            Number(weightKg);


        if (
            !Number.isInteger(
                customerIdNumber
            ) ||
            customerIdNumber <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });

        }


        if (
            !Number.isInteger(
                packageCountNumber
            ) ||
            packageCountNumber <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Package count must be greater than zero",
            });

        }


        if (
            !Number.isFinite(
                weightNumber
            ) ||
            weightNumber <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Weight must be greater than zero",
            });

        }


        // =================================================
        // TRANSACTION
        // =================================================

        await connection.beginTransaction();


        // =================================================
        // CHECK CUSTOMER
        // =================================================

        const [customers] =
            await connection.execute(
                `
                SELECT
                    id,
                    status
                FROM customers
                WHERE id = ?
                LIMIT 1
                `,
                [customerIdNumber]
            );


        if (
            customers.length === 0
        ) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });

        }


        if (
            customers[0].status !== "active"
        ) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message:
                    "Cannot create shipment for inactive customer",
            });

        }


        // =================================================
        // CHECK TRACKING NUMBER
        // =================================================

        const [existing] =
            await connection.execute(
                `
                SELECT id
                FROM shipments
                WHERE tracking_number = ?
                LIMIT 1
                `,
                [trackingNumber.trim()]
            );


        if (
            existing.length > 0
        ) {

            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    "Tracking number already exists",
            });

        }


        // =================================================
        // CREATE
        // =================================================

        const [result] =
            await connection.execute(
                `
                INSERT INTO shipments (

                    tracking_number,
                    customer_id,

                    origin_address,
                    origin_city,

                    destination_address,
                    destination_city,

                    package_description,
                    package_count,
                    weight_kg,

                    priority,
                    status,

                    estimated_delivery_at,
                    delivery_notes,

                    created_by

                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [

                    trackingNumber.trim(),
                    customerIdNumber,

                    originAddress.trim(),
                    originCity.trim(),

                    destinationAddress.trim(),
                    destinationCity.trim(),

                    packageDescription.trim(),
                    packageCountNumber,
                    weightNumber,

                    priority,
                    "pending",

                    estimatedDeliveryAt || null,
                    deliveryNotes?.trim() || null,

                    req.user?.sub || null,

                ]
            );


        await connection.commit();


        // =================================================
        // RETURN CREATED SHIPMENT
        // =================================================

        const [shipments] =
            await pool.execute(
                `
                SELECT *

                FROM shipments

                WHERE id = ?

                LIMIT 1
                `,
                [result.insertId]
            );


        return res.status(201).json({

            success: true,

            message:
                "Shipment created successfully",

            data: shipments[0],

        });

    } catch (error) {

        try {
            await connection.rollback();
        } catch (_) {}

        console.error(
            "CREATE SHIPMENT ERROR:",
            error
        );

        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "Tracking number already exists",
            });

        }

        return next(error);

    } finally {

        connection.release();

    }
};


// =====================================================
// UPDATE SHIPMENT
// PUT /api/shipments/:id
// =====================================================

const updateShipment = async (
    req,
    res,
    next
) => {

    const connection =
        await pool.getConnection();

    try {

        const id =
            Number(req.params.id);


        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID",
            });

        }


        const {

            originAddress,
            originCity,

            destinationAddress,
            destinationCity,

            packageDescription,
            packageCount,
            weightKg,

            priority,
            status,

            estimatedDeliveryAt,
            actualDeliveryAt,

            deliveryNotes,

        } = req.body;


        // =================================================
        // VALIDATE PRIORITY
        // =================================================

        if (
            priority !== undefined &&
            priority !== null &&
            !VALID_PRIORITIES.includes(
                priority
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid shipment priority",
            });

        }


        // =================================================
        // VALIDATE STATUS
        // =================================================

        if (
            status !== undefined &&
            status !== null &&
            !VALID_STATUSES.includes(
                status
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid shipment status",
            });

        }


        // =================================================
        // VALIDATE PACKAGE COUNT
        // =================================================

        if (
            packageCount !== undefined &&
            packageCount !== null
        ) {

            const count =
                Number(packageCount);

            if (
                !Number.isInteger(count) ||
                count <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Package count must be greater than zero",
                });

            }

        }


        // =================================================
        // VALIDATE WEIGHT
        // =================================================

        if (
            weightKg !== undefined &&
            weightKg !== null
        ) {

            const weight =
                Number(weightKg);

            if (
                !Number.isFinite(weight) ||
                weight <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Weight must be greater than zero",
                });

            }

        }


        await connection.beginTransaction();


        // =================================================
        // LOCK SHIPMENT
        // =================================================

        const [currentRows] =
            await connection.execute(
                `
                SELECT *

                FROM shipments

                WHERE id = ?

                FOR UPDATE
                `,
                [id]
            );


        if (
            currentRows.length === 0
        ) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Shipment not found",
            });

        }


        const current =
            currentRows[0];


        // =================================================
        // STATUS TRANSITION
        // =================================================

        if (
            status &&
            status !== current.status
        ) {

            const allowed =
                ALLOWED_TRANSITIONS[
                    current.status
                ] || [];


            if (
                !allowed.includes(status)
            ) {

                await connection.rollback();

                return res.status(409).json({
                    success: false,
                    message:
                        `Cannot change shipment status from ${current.status} to ${status}`,
                });

            }

        }


        // =================================================
        // UPDATE
        // =================================================

        const newStatus =
            status ?? current.status;


        const newPriority =
            priority ?? current.priority;


        const newActualDeliveryAt =
            newStatus === "delivered"
                ? (
                    actualDeliveryAt ||
                    current.actual_delivery_at ||
                    new Date()
                )
                : (
                    actualDeliveryAt ??
                    current.actual_delivery_at
                );


        await connection.execute(
            `
            UPDATE shipments

            SET

                origin_address =
                    COALESCE(?, origin_address),

                origin_city =
                    COALESCE(?, origin_city),

                destination_address =
                    COALESCE(
                        ?,
                        destination_address
                    ),

                destination_city =
                    COALESCE(
                        ?,
                        destination_city
                    ),

                package_description =
                    COALESCE(
                        ?,
                        package_description
                    ),

                package_count =
                    COALESCE(
                        ?,
                        package_count
                    ),

                weight_kg =
                    COALESCE(
                        ?,
                        weight_kg
                    ),

                priority = ?,

                status = ?,

                estimated_delivery_at =
                    COALESCE(
                        ?,
                        estimated_delivery_at
                    ),

                actual_delivery_at = ?,

                delivery_notes =
                    COALESCE(
                        ?,
                        delivery_notes
                    )

            WHERE id = ?
            `,
            [

                originAddress ?? null,
                originCity ?? null,

                destinationAddress ?? null,
                destinationCity ?? null,

                packageDescription ?? null,

                packageCount !== undefined
                    ? Number(packageCount)
                    : null,

                weightKg !== undefined
                    ? Number(weightKg)
                    : null,

                newPriority,

                newStatus,

                estimatedDeliveryAt ?? null,

                newActualDeliveryAt,

                deliveryNotes ?? null,

                id,

            ]
        );


        await connection.commit();


        // =================================================
        // RETURN UPDATED SHIPMENT
        // =================================================

        const [shipments] =
            await pool.execute(
                `
                SELECT *

                FROM shipments

                WHERE id = ?

                LIMIT 1
                `,
                [id]
            );


        return res.status(200).json({

            success: true,

            message:
                "Shipment updated successfully",

            data: shipments[0],

        });

    } catch (error) {

        try {
            await connection.rollback();
        } catch (_) {}

        console.error(
            "UPDATE SHIPMENT ERROR:",
            error
        );

        return next(error);

    } finally {

        connection.release();

    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getShipments,

    getShipmentById,

    createShipment,

    updateShipment,

};