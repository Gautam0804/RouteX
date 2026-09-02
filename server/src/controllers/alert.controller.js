const { pool: db } = require("../config/db");
const { createAuditLog } = require("../utils/auditLog");

// =====================================================
// GET ALL ALERTS
// GET /api/alerts
// =====================================================

const getAlerts = async (req, res, next) => {
    try {
        const [alerts] = await db.execute(`
            SELECT
                a.id,
                a.type,
                a.severity,
                a.title,
                a.description,

                a.shipment_id,
                a.vehicle_id,
                a.driver_id,

                a.status,
                a.resolved_by,
                a.resolved_at,

                a.created_at,
                a.updated_at,

                s.tracking_number,

                v.registration_number,

                CONCAT(
                    d.first_name,
                    ' ',
                    d.last_name
                ) AS driver_name

            FROM alerts a

            LEFT JOIN shipments s
                ON s.id = a.shipment_id

            LEFT JOIN vehicles v
                ON v.id = a.vehicle_id

            LEFT JOIN drivers d
                ON d.id = a.driver_id

            ORDER BY a.created_at DESC
        `);

        return res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts,
        });

    } catch (error) {
        console.error("Get alerts error:", error);
        next(error);
    }
};


// =====================================================
// GET ALERT BY ID
// GET /api/alerts/:id
// =====================================================

const getAlertById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID
        const alertId = Number(id);

        if (!Number.isInteger(alertId) || alertId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid alert ID",
            });
        }

        const [alerts] = await db.execute(`
            SELECT
                a.id,
                a.type,
                a.severity,
                a.title,
                a.description,

                a.shipment_id,
                a.vehicle_id,
                a.driver_id,

                a.status,
                a.resolved_by,
                a.resolved_at,

                a.created_at,
                a.updated_at,

                s.tracking_number,

                v.registration_number,

                CONCAT(
                    d.first_name,
                    ' ',
                    d.last_name
                ) AS driver_name

            FROM alerts a

            LEFT JOIN shipments s
                ON s.id = a.shipment_id

            LEFT JOIN vehicles v
                ON v.id = a.vehicle_id

            LEFT JOIN drivers d
                ON d.id = a.driver_id

            WHERE a.id = ?

            LIMIT 1
        `, [alertId]);

        if (alerts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Alert not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: alerts[0],
        });

    } catch (error) {
        console.error("Get alert by ID error:", error);
        next(error);
    }
};


// =====================================================
// CREATE ALERT
// POST /api/alerts
// =====================================================

const createAlert = async (req, res, next) => {
    try {
        const {
            type,
            severity,
            title,
            description,
            shipmentId = null,
            vehicleId = null,
            driverId = null,
        } = req.body;

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
            !type ||
            !severity ||
            !title ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "type, severity, title and description are required",
            });
        }

        // =================================================
        // VALIDATE TITLE
        // =================================================

        if (String(title).trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Alert title cannot be empty",
            });
        }

        if (String(title).length > 150) {
            return res.status(400).json({
                success: false,
                message: "Alert title cannot exceed 150 characters",
            });
        }

        // =================================================
        // VALID TYPE
        // =================================================

        const allowedTypes = [
            "shipment",
            "vehicle",
            "driver",
            "system",
            "security",
        ];

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid alert type",
            });
        }

        // =================================================
        // VALID SEVERITY
        // =================================================

        const allowedSeverities = [
            "low",
            "medium",
            "high",
            "critical",
        ];

        if (!allowedSeverities.includes(severity)) {
            return res.status(400).json({
                success: false,
                message: "Invalid alert severity",
            });
        }

        // =================================================
        // VALIDATE RELATED IDS
        // =================================================

        const parsedShipmentId =
            shipmentId === null ||
            shipmentId === undefined ||
            shipmentId === ""
                ? null
                : Number(shipmentId);

        const parsedVehicleId =
            vehicleId === null ||
            vehicleId === undefined ||
            vehicleId === ""
                ? null
                : Number(vehicleId);

        const parsedDriverId =
            driverId === null ||
            driverId === undefined ||
            driverId === ""
                ? null
                : Number(driverId);

        if (
            parsedShipmentId !== null &&
            (!Number.isInteger(parsedShipmentId) ||
                parsedShipmentId <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID",
            });
        }

        if (
            parsedVehicleId !== null &&
            (!Number.isInteger(parsedVehicleId) ||
                parsedVehicleId <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID",
            });
        }

        if (
            parsedDriverId !== null &&
            (!Number.isInteger(parsedDriverId) ||
                parsedDriverId <= 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid driver ID",
            });
        }

        // =================================================
        // CHECK RELATED RECORDS
        // =================================================

        if (parsedShipmentId !== null) {
            const [shipments] = await db.execute(
                `
                SELECT id
                FROM shipments
                WHERE id = ?
                LIMIT 1
                `,
                [parsedShipmentId]
            );

            if (shipments.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Shipment not found",
                });
            }
        }

        if (parsedVehicleId !== null) {
            const [vehicles] = await db.execute(
                `
                SELECT id
                FROM vehicles
                WHERE id = ?
                LIMIT 1
                `,
                [parsedVehicleId]
            );

            if (vehicles.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Vehicle not found",
                });
            }
        }

        if (parsedDriverId !== null) {
            const [drivers] = await db.execute(
                `
                SELECT id
                FROM drivers
                WHERE id = ?
                LIMIT 1
                `,
                [parsedDriverId]
            );

            if (drivers.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Driver not found",
                });
            }
        }

        // =================================================
        // CREATE ALERT
        // =================================================

        const [result] = await db.execute(
            `
            INSERT INTO alerts (
                type,
                severity,
                title,
                description,
                shipment_id,
                vehicle_id,
                driver_id,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'open')
            `,
            [
                type,
                severity,
                String(title).trim(),
                String(description).trim(),
                parsedShipmentId,
                parsedVehicleId,
                parsedDriverId,
            ]
        );

        // =================================================
        // AUDIT LOG
        // =================================================

        try {
            await createAuditLog({
                userId: req.user?.sub || null,

                action: "CREATE_ALERT",

                entityType: "alert",

                entityId: result.insertId,

                newValues: {
                    type,
                    severity,
                    title: String(title).trim(),
                    description: String(description).trim(),
                    shipmentId: parsedShipmentId,
                    vehicleId: parsedVehicleId,
                    driverId: parsedDriverId,
                    status: "open",
                },

                ipAddress: req.ip || null,

                userAgent:
                    req.get("user-agent") || null,
            });
        } catch (auditError) {
            // Alert creation should not fail
            // just because audit logging failed.
            console.error(
                "Create alert audit log error:",
                auditError
            );
        }

        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({
            success: true,

            message: "Alert created successfully",

            data: {
                id: Number(result.insertId),

                type,

                severity,

                title: String(title).trim(),

                description:
                    String(description).trim(),

                shipmentId: parsedShipmentId,

                vehicleId: parsedVehicleId,

                driverId: parsedDriverId,

                status: "open",
            },
        });

    } catch (error) {
        console.error("Create alert error:", error);
        next(error);
    }
};


// =====================================================
// UPDATE ALERT STATUS
// PATCH /api/alerts/:id/status
// =====================================================

const updateAlertStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // =================================================
        // VALIDATE ID
        // =================================================

        const alertId = Number(id);

        if (!Number.isInteger(alertId) || alertId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid alert ID",
            });
        }

        // =================================================
        // VALID STATUSES
        // =================================================

        const allowedStatuses = [
            "open",
            "acknowledged",
            "resolved",
        ];

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid alert status",
            });
        }

        // =================================================
        // GET ALERT
        // =================================================

        const [alerts] = await db.execute(
            `
            SELECT
                id,
                type,
                severity,
                title,
                description,
                shipment_id,
                vehicle_id,
                driver_id,
                status,
                resolved_by,
                resolved_at
            FROM alerts
            WHERE id = ?
            LIMIT 1
            `,
            [alertId]
        );

        if (alerts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Alert not found",
            });
        }

        const alert = alerts[0];

        // =================================================
        // SAME STATUS
        // =================================================

        if (alert.status === status) {
            return res.status(400).json({
                success: false,
                message:
                    `Alert is already ${status}`,
            });
        }

        // =================================================
        // STATUS TRANSITIONS
        // =================================================

        const validTransitions = {
            open: [
                "acknowledged",
                "resolved",
            ],

            acknowledged: [
                "resolved",
                "open",
            ],

            resolved: [],
        };

        if (
            !validTransitions[alert.status] ||
            !validTransitions[alert.status].includes(status)
        ) {
            return res.status(409).json({
                success: false,
                message:
                    `Cannot change alert from ${alert.status} to ${status}`,
            });
        }

        // =================================================
        // UPDATE ALERT
        // =================================================

        let resolvedBy = null;

        if (status === "acknowledged") {
            await db.execute(
                `
                UPDATE alerts
                SET
                    status = 'acknowledged'
                WHERE id = ?
                `,
                [alertId]
            );
        }

        // =================================================
        // REOPEN
        // =================================================

        else if (status === "open") {
            await db.execute(
                `
                UPDATE alerts
                SET
                    status = 'open',
                    resolved_by = NULL,
                    resolved_at = NULL
                WHERE id = ?
                `,
                [alertId]
            );
        }

        // =================================================
        // RESOLVE
        // =================================================

        else if (status === "resolved") {
            resolvedBy = req.user?.sub
                ? Number(req.user.sub)
                : null;

            await db.execute(
                `
                UPDATE alerts
                SET
                    status = 'resolved',
                    resolved_by = ?,
                    resolved_at = NOW()
                WHERE id = ?
                `,
                [
                    resolvedBy,
                    alertId,
                ]
            );
        }

        // =================================================
        // AUDIT LOG
        // =================================================

        try {
            await createAuditLog({
                userId: req.user?.sub || null,

                action: "UPDATE_ALERT_STATUS",

                entityType: "alert",

                entityId: alertId,

                oldValues: {
                    status: alert.status,
                },

                newValues: {
                    status,
                },

                ipAddress: req.ip || null,

                userAgent:
                    req.get("user-agent") || null,
            });
        } catch (auditError) {
            console.error(
                "Update alert audit log error:",
                auditError
            );
        }

        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({
            success: true,

            message:
                `Alert ${status} successfully`,

            data: {
                alertId,

                previousStatus:
                    alert.status,

                status,

                resolvedBy,
            },
        });

    } catch (error) {
        console.error(
            "Update alert status error:",
            error
        );

        next(error);
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getAlerts,
    getAlertById,
    createAlert,
    updateAlertStatus,
};