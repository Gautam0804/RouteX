const { pool: db } = require("../config/db");

// =====================================================
// VALID ASSIGNMENT STATUSES
// =====================================================

const VALID_STATUSES = [
    "assigned",
    "accepted",
    "in_progress",
    "completed",
    "cancelled",
];

// =====================================================
// VALID STATUS TRANSITIONS
// =====================================================

const STATUS_TRANSITIONS = {
    assigned: ["accepted", "cancelled"],
    accepted: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

// =====================================================
// CREATE ASSIGNMENT
// POST /api/assignments
// =====================================================

const createAssignment = async (req, res) => {
    let connection;

    try {
        const shipmentId = Number(req.body.shipmentId);
        const vehicleId = Number(req.body.vehicleId);
        const driverId = Number(req.body.driverId);

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (
            !Number.isInteger(shipmentId) ||
            shipmentId <= 0 ||
            !Number.isInteger(vehicleId) ||
            vehicleId <= 0 ||
            !Number.isInteger(driverId) ||
            driverId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "shipmentId, vehicleId and driverId must be valid numbers",
            });
        }

        connection = await db.getConnection();

        await connection.beginTransaction();

        // -------------------------------------------------
        // CHECK SHIPMENT
        // -------------------------------------------------

        const [shipmentRows] = await connection.query(
            `
            SELECT id, status
            FROM shipments
            WHERE id = ?
            FOR UPDATE
            `,
            [shipmentId]
        );

        if (shipmentRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Shipment not found",
            });
        }

        const shipment = shipmentRows[0];

        if (shipment.status !== "pending") {
            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    `Shipment cannot be assigned because its current status is '${shipment.status}'`,
            });
        }

        // -------------------------------------------------
        // CHECK VEHICLE
        // -------------------------------------------------

        const [vehicleRows] = await connection.query(
            `
            SELECT id, status
            FROM vehicles
            WHERE id = ?
            FOR UPDATE
            `,
            [vehicleId]
        );

        if (vehicleRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        const vehicle = vehicleRows[0];

        if (vehicle.status !== "available") {
            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    `Vehicle is not available. Current status: '${vehicle.status}'`,
            });
        }

        // -------------------------------------------------
        // CHECK DRIVER
        // -------------------------------------------------

        const [driverRows] = await connection.query(
            `
            SELECT id, status
            FROM drivers
            WHERE id = ?
            FOR UPDATE
            `,
            [driverId]
        );

        if (driverRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });
        }

        const driver = driverRows[0];

        if (driver.status !== "available") {
            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    `Driver is not available. Current status: '${driver.status}'`,
            });
        }

        // -------------------------------------------------
        // CHECK EXISTING ACTIVE ASSIGNMENT
        // -------------------------------------------------

        const [existingAssignments] = await connection.query(
            `
            SELECT
                id,
                shipment_id,
                vehicle_id,
                driver_id,
                status
            FROM assignments
            WHERE
                status IN (
                    'assigned',
                    'accepted',
                    'in_progress'
                )
                AND (
                    shipment_id = ?
                    OR vehicle_id = ?
                    OR driver_id = ?
                )
            FOR UPDATE
            `,
            [
                shipmentId,
                vehicleId,
                driverId,
            ]
        );

        if (existingAssignments.length > 0) {
            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    "Shipment, vehicle or driver is already involved in an active assignment",
                data: existingAssignments,
            });
        }

        // -------------------------------------------------
        // CREATE ASSIGNMENT
        // -------------------------------------------------

        const [result] = await connection.query(
            `
            INSERT INTO assignments
            (
                shipment_id,
                vehicle_id,
                driver_id,
                status
            )
            VALUES (?, ?, ?, 'assigned')
            `,
            [
                shipmentId,
                vehicleId,
                driverId,
            ]
        );

        // -------------------------------------------------
        // UPDATE SHIPMENT
        // -------------------------------------------------

        await connection.query(
            `
            UPDATE shipments
            SET status = 'assigned'
            WHERE id = ?
            `,
            [shipmentId]
        );

        // -------------------------------------------------
        // UPDATE VEHICLE
        // -------------------------------------------------

        await connection.query(
            `
            UPDATE vehicles
            SET status = 'in_transit'
            WHERE id = ?
            `,
            [vehicleId]
        );

        // -------------------------------------------------
        // UPDATE DRIVER
        // -------------------------------------------------

        await connection.query(
            `
            UPDATE drivers
            SET status = 'on_trip'
            WHERE id = ?
            `,
            [driverId]
        );

        // -------------------------------------------------
        // GET CREATED ASSIGNMENT
        // -------------------------------------------------

        const [assignmentRows] = await connection.query(
            `
            SELECT *
            FROM assignments
            WHERE id = ?
            `,
            [result.insertId]
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Assignment created successfully",
            data: assignmentRows[0],
        });

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Rollback error:",
                    rollbackError
                );
            }
        }

        console.error(
            "CREATE ASSIGNMENT ERROR:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "Assignment already exists or conflicts with an existing assignment",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create assignment",
            error: error.message,
            code: error.code,
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// =====================================================
// GET ALL ASSIGNMENTS
// GET /api/assignments
// =====================================================

const getAssignments = async (req, res) => {
    try {
        const {
            shipmentId,
            vehicleId,
            driverId,
            status,
        } = req.query;

        const conditions = [];
        const params = [];

        // -------------------------------------------------
        // SHIPMENT FILTER
        // -------------------------------------------------

        if (shipmentId !== undefined && shipmentId !== "") {
            const id = Number(shipmentId);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid shipmentId",
                });
            }

            conditions.push("shipment_id = ?");
            params.push(id);
        }

        // -------------------------------------------------
        // VEHICLE FILTER
        // -------------------------------------------------

        if (vehicleId !== undefined && vehicleId !== "") {
            const id = Number(vehicleId);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid vehicleId",
                });
            }

            conditions.push("vehicle_id = ?");
            params.push(id);
        }

        // -------------------------------------------------
        // DRIVER FILTER
        // -------------------------------------------------

        if (driverId !== undefined && driverId !== "") {
            const id = Number(driverId);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid driverId",
                });
            }

            conditions.push("driver_id = ?");
            params.push(id);
        }

        // -------------------------------------------------
        // STATUS FILTER
        // -------------------------------------------------

        if (status !== undefined && status !== "") {
            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}`,
                });
            }

            conditions.push("status = ?");
            params.push(status);
        }

        // -------------------------------------------------
        // BUILD QUERY
        // -------------------------------------------------

        let query = `
            SELECT *
            FROM assignments
        `;

        if (conditions.length > 0) {
            query += `
                WHERE ${conditions.join(" AND ")}
            `;
        }

        query += `
            ORDER BY id DESC
        `;

        // -------------------------------------------------
        // EXECUTE QUERY
        // -------------------------------------------------

        const [rows] = await db.query(
            query,
            params
        );

        return res.status(200).json({
            success: true,
            data: rows,
        });

    } catch (error) {
        console.error(
            "GET ASSIGNMENTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch assignments",
            error: error.message,
            code: error.code,
        });
    }
};

// =====================================================
// GET ASSIGNMENT BY ID
// GET /api/assignments/:id
// =====================================================

const getAssignmentById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid assignment ID",
            });
        }

        const [rows] = await db.query(
            `
            SELECT *
            FROM assignments
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0],
        });

    } catch (error) {
        console.error(
            "GET ASSIGNMENT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch assignment",
            error: error.message,
            code: error.code,
        });
    }
};

// =====================================================
// UPDATE ASSIGNMENT STATUS
// PATCH /api/assignments/:id/status
// =====================================================

const updateAssignmentStatus = async (req, res) => {
    let connection;

    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        // -------------------------------------------------
        // VALIDATE ID
        // -------------------------------------------------

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid assignment ID",
            });
        }

        // -------------------------------------------------
        // VALIDATE STATUS
        // -------------------------------------------------

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}`,
            });
        }

        connection = await db.getConnection();

        await connection.beginTransaction();

        // -------------------------------------------------
        // GET + LOCK ASSIGNMENT
        // -------------------------------------------------

        const [assignmentRows] = await connection.query(
            `
            SELECT
                id,
                shipment_id,
                vehicle_id,
                driver_id,
                status
            FROM assignments
            WHERE id = ?
            FOR UPDATE
            `,
            [id]
        );

        if (assignmentRows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        const assignment = assignmentRows[0];
        const currentStatus = assignment.status;

        // -------------------------------------------------
        // SAME STATUS
        // -------------------------------------------------

        if (currentStatus === status) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message:
                    `Assignment is already '${status}'`,
            });
        }

        // -------------------------------------------------
        // CHECK VALID TRANSITION
        // -------------------------------------------------

        const allowedNextStatuses =
            STATUS_TRANSITIONS[currentStatus] || [];

        if (!allowedNextStatuses.includes(status)) {
            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    `Cannot change assignment status from '${currentStatus}' to '${status}'`,
            });
        }

        // -------------------------------------------------
        // UPDATE ASSIGNMENT
        // IMPORTANT:
        // Only update status.
        // No timestamp-column dependency.
        // -------------------------------------------------

        await connection.query(
            `
            UPDATE assignments
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        // -------------------------------------------------
        // UPDATE SHIPMENT
        // -------------------------------------------------

        let shipmentStatus = null;

        if (status === "assigned") {
            shipmentStatus = "assigned";
        } else if (status === "accepted") {
            shipmentStatus = "assigned";
        } else if (status === "in_progress") {
            shipmentStatus = "in_transit";
        } else if (status === "completed") {
            shipmentStatus = "delivered";
        } else if (status === "cancelled") {
            shipmentStatus = "cancelled";
        }

        if (shipmentStatus) {
            await connection.query(
                `
                UPDATE shipments
                SET status = ?
                WHERE id = ?
                `,
                [
                    shipmentStatus,
                    assignment.shipment_id,
                ]
            );
        }

        // -------------------------------------------------
        // UPDATE VEHICLE + DRIVER
        // -------------------------------------------------

        if (
            status === "completed" ||
            status === "cancelled"
        ) {
            // Vehicle becomes available

            await connection.query(
                `
                UPDATE vehicles
                SET status = 'available'
                WHERE id = ?
                `,
                [assignment.vehicle_id]
            );

            // Driver becomes available

            await connection.query(
                `
                UPDATE drivers
                SET status = 'available'
                WHERE id = ?
                `,
                [assignment.driver_id]
            );

        } else {
            // Vehicle remains in transit

            await connection.query(
                `
                UPDATE vehicles
                SET status = 'in_transit'
                WHERE id = ?
                `,
                [assignment.vehicle_id]
            );

            // Driver remains on trip

            await connection.query(
                `
                UPDATE drivers
                SET status = 'on_trip'
                WHERE id = ?
                `,
                [assignment.driver_id]
            );
        }

        // -------------------------------------------------
        // GET UPDATED ASSIGNMENT
        // -------------------------------------------------

        const [updatedRows] = await connection.query(
            `
            SELECT *
            FROM assignments
            WHERE id = ?
            `,
            [id]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message:
                "Assignment status updated successfully",
            data: updatedRows[0],
        });

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Rollback error:",
                    rollbackError
                );
            }
        }

        console.error(
            "UPDATE ASSIGNMENT STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update assignment status",
            error: error.message,
            code: error.code,
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignmentStatus,
};