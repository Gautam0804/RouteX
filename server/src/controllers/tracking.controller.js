const { pool: db } = require("../config/db");

// =====================================================
// CREATE TRACKING LOCATION
// POST /api/tracking
// =====================================================

const createTracking = async (req, res, next) => {
    try {
        const {
            assignmentId,
            latitude,
            longitude,
            speedKmh,
            heading,
            address,
        } = req.body || {};

        // -----------------------------
        // Validation
        // -----------------------------

        if (
            !assignmentId ||
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "assignmentId, latitude and longitude are required",
            });
        }

        const assignmentIdNumber = Number(assignmentId);
        const latitudeNumber = Number(latitude);
        const longitudeNumber = Number(longitude);

        const speedNumber =
            speedKmh !== undefined && speedKmh !== null
                ? Number(speedKmh)
                : null;

        const headingNumber =
            heading !== undefined && heading !== null
                ? Number(heading)
                : null;

        // -----------------------------
        // Validate numbers
        // -----------------------------

        if (
            !Number.isInteger(assignmentIdNumber) ||
            assignmentIdNumber <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "assignmentId must be a valid positive integer",
            });
        }

        if (
            !Number.isFinite(latitudeNumber) ||
            latitudeNumber < -90 ||
            latitudeNumber > 90
        ) {
            return res.status(400).json({
                success: false,
                message: "Latitude must be between -90 and 90",
            });
        }

        if (
            !Number.isFinite(longitudeNumber) ||
            longitudeNumber < -180 ||
            longitudeNumber > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Longitude must be between -180 and 180",
            });
        }

        if (
            speedNumber !== null &&
            (!Number.isFinite(speedNumber) || speedNumber < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "speedKmh must be a valid non-negative number",
            });
        }

        if (
            headingNumber !== null &&
            (!Number.isFinite(headingNumber) ||
                headingNumber < 0 ||
                headingNumber > 360)
        ) {
            return res.status(400).json({
                success: false,
                message: "heading must be between 0 and 360",
            });
        }

        // -----------------------------
        // Check assignment
        // -----------------------------

        const [assignments] = await db.execute(
            `
            SELECT
                id,
                status,
                vehicle_id,
                driver_id,
                shipment_id
            FROM assignments
            WHERE id = ?
            LIMIT 1
            `,
            [assignmentIdNumber]
        );

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        const assignment = assignments[0];

        // -----------------------------
        // Check assignment status
        // -----------------------------

        const allowedStatuses = [
            "assigned",
            "accepted",
            "in_progress",
        ];

        if (!allowedStatuses.includes(assignment.status)) {
            return res.status(409).json({
                success: false,
                message:
                    `Tracking is not allowed for assignment with status ${assignment.status}`,
            });
        }

        // -----------------------------
        // Insert tracking
        // -----------------------------

        const [result] = await db.execute(
            `
            INSERT INTO tracking (
                assignment_id,
                latitude,
                longitude,
                speed_kmh,
                heading,
                address
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                assignmentIdNumber,
                latitudeNumber,
                longitudeNumber,
                speedNumber,
                headingNumber,
                address ?? null,
            ]
        );

        // -----------------------------
        // Update vehicle location
        // -----------------------------

        await db.execute(
            `
            UPDATE vehicles
            SET
                current_latitude = ?,
                current_longitude = ?
            WHERE id = ?
            `,
            [
                latitudeNumber,
                longitudeNumber,
                assignment.vehicle_id,
            ]
        );

        // -----------------------------
        // Response
        // -----------------------------

        return res.status(201).json({
            success: true,
            message: "Tracking location recorded successfully",
            data: {
                id: result.insertId,
                assignmentId: assignmentIdNumber,
                latitude: latitudeNumber,
                longitude: longitudeNumber,
                speedKmh: speedNumber,
                heading: headingNumber,
                address: address ?? null,
            },
        });
    } catch (error) {
        console.error("Create tracking error:", error);
        next(error);
    }
};


// =====================================================
// GET TRACKING HISTORY
// GET /api/tracking/assignment/:assignmentId
// =====================================================

const getTrackingByAssignment = async (req, res, next) => {
    try {
        const assignmentIdNumber = Number(req.params.assignmentId);

        // -----------------------------
        // Validate ID
        // -----------------------------

        if (
            !Number.isInteger(assignmentIdNumber) ||
            assignmentIdNumber <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid assignment ID",
            });
        }

        // -----------------------------
        // Check assignment
        // -----------------------------

        const [assignments] = await db.execute(
            `
            SELECT
                id
            FROM assignments
            WHERE id = ?
            LIMIT 1
            `,
            [assignmentIdNumber]
        );

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        // -----------------------------
        // Get tracking history
        // -----------------------------

        const [tracking] = await db.execute(
            `
            SELECT
                id,
                assignment_id,
                latitude,
                longitude,
                speed_kmh,
                heading,
                address,
                recorded_at
            FROM tracking
            WHERE assignment_id = ?
            ORDER BY recorded_at DESC, id DESC
            LIMIT 100
            `,
            [assignmentIdNumber]
        );

        return res.status(200).json({
            success: true,
            count: tracking.length,
            data: tracking,
        });
    } catch (error) {
        console.error("Get tracking error:", error);
        next(error);
    }
};


// =====================================================
// GET LATEST TRACKING
// GET /api/tracking/assignment/:assignmentId/latest
// =====================================================

const getLatestTracking = async (req, res, next) => {
    try {
        const assignmentIdNumber = Number(req.params.assignmentId);

        if (
            !Number.isInteger(assignmentIdNumber) ||
            assignmentIdNumber <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid assignment ID",
            });
        }

        // -----------------------------
        // Check assignment
        // -----------------------------

        const [assignments] = await db.execute(
            `
            SELECT id
            FROM assignments
            WHERE id = ?
            LIMIT 1
            `,
            [assignmentIdNumber]
        );

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        // -----------------------------
        // Get latest location
        // -----------------------------

        const [tracking] = await db.execute(
            `
            SELECT
                id,
                assignment_id,
                latitude,
                longitude,
                speed_kmh,
                heading,
                address,
                recorded_at
            FROM tracking
            WHERE assignment_id = ?
            ORDER BY recorded_at DESC, id DESC
            LIMIT 1
            `,
            [assignmentIdNumber]
        );

        if (tracking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tracking location found",
            });
        }

        return res.status(200).json({
            success: true,
            data: tracking[0],
        });
    } catch (error) {
        console.error("Latest tracking error:", error);
        next(error);
    }
};


// =====================================================
// GET LIVE TRACKING
// GET /api/tracking/live
// =====================================================

const getLiveTracking = async (req, res, next) => {
    try {
        const [tracking] = await db.execute(
            `
            SELECT
                a.id AS assignment_id,
                a.status AS assignment_status,
                a.assigned_at,
                a.started_at,
                a.completed_at,

                s.id AS shipment_id,
                s.tracking_number,
                s.origin_city,
                s.destination_city,
                s.status AS shipment_status,
                s.priority AS shipment_priority,

                d.id AS driver_id,
                d.first_name AS driver_first_name,
                d.last_name AS driver_last_name,
                d.phone AS driver_phone,

                v.id AS vehicle_id,
                v.vehicle_number,
                v.registration_number,
                v.vehicle_type,
                v.status AS vehicle_status,
                v.current_latitude,
                v.current_longitude,

                t.latitude,
                t.longitude,
                t.speed_kmh,
                t.heading,
                t.address,
                t.recorded_at

            FROM assignments a

            INNER JOIN shipments s
                ON s.id = a.shipment_id

            INNER JOIN drivers d
                ON d.id = a.driver_id

            INNER JOIN vehicles v
                ON v.id = a.vehicle_id

            LEFT JOIN tracking t
                ON t.id = (
                    SELECT t2.id
                    FROM tracking t2
                    WHERE t2.assignment_id = a.id
                    ORDER BY t2.recorded_at DESC, t2.id DESC
                    LIMIT 1
                )

            WHERE a.status IN (
                'assigned',
                'accepted',
                'in_progress'
            )

            ORDER BY a.assigned_at DESC
            `
        );

        return res.status(200).json({
            success: true,
            count: tracking.length,
            data: tracking,
        });
    } catch (error) {
        console.error("Live tracking error:", error);
        next(error);
    }
};


// =====================================================
// GET SHIPMENT TRACKING
// GET /api/tracking/shipment/:trackingNumber
// =====================================================

const getShipmentTracking = async (req, res, next) => {
    try {
        const trackingNumber = req.params.trackingNumber?.trim();

        // -----------------------------
        // Validation
        // -----------------------------

        if (!trackingNumber) {
            return res.status(400).json({
                success: false,
                message: "Tracking number is required",
            });
        }

        // -----------------------------
        // Get shipment + assignment
        // -----------------------------

        const [shipments] = await db.execute(
            `
            SELECT
                s.id AS shipment_id,
                s.tracking_number,
                s.origin_address,
                s.origin_city,
                s.destination_address,
                s.destination_city,
                s.package_description,
                s.package_count,
                s.weight_kg,
                s.priority,
                s.status AS shipment_status,
                s.estimated_delivery_at,
                s.actual_delivery_at,

                a.id AS assignment_id,
                a.status AS assignment_status,
                a.assigned_at,
                a.started_at,

                d.id AS driver_id,
                d.first_name AS driver_first_name,
                d.last_name AS driver_last_name,
                d.phone AS driver_phone,

                v.id AS vehicle_id,
                v.vehicle_number,
                v.registration_number,
                v.vehicle_type

            FROM shipments s

            LEFT JOIN assignments a
                ON a.shipment_id = s.id

            LEFT JOIN drivers d
                ON d.id = a.driver_id

            LEFT JOIN vehicles v
                ON v.id = a.vehicle_id

            WHERE s.tracking_number = ?

            ORDER BY a.assigned_at DESC

            LIMIT 1
            `,
            [trackingNumber]
        );

        if (shipments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found",
            });
        }

        const shipment = shipments[0];

        // -----------------------------
        // Get tracking history
        // -----------------------------

        let trackingHistory = [];

        if (shipment.assignment_id) {
            const [history] = await db.execute(
                `
                SELECT
                    id,
                    assignment_id,
                    latitude,
                    longitude,
                    speed_kmh,
                    heading,
                    address,
                    recorded_at
                FROM tracking
                WHERE assignment_id = ?
                ORDER BY recorded_at DESC, id DESC
                LIMIT 100
                `,
                [shipment.assignment_id]
            );

            trackingHistory = history;
        }

        // Newest record because query is DESC
        const latestLocation =
            trackingHistory.length > 0
                ? trackingHistory[0]
                : null;

        // -----------------------------
        // Response
        // -----------------------------

        return res.status(200).json({
            success: true,

            data: {
                shipment: {
                    id: shipment.shipment_id,
                    trackingNumber: shipment.tracking_number,
                    originAddress: shipment.origin_address,
                    originCity: shipment.origin_city,
                    destinationAddress: shipment.destination_address,
                    destinationCity: shipment.destination_city,
                    packageDescription: shipment.package_description,
                    packageCount: shipment.package_count,
                    weightKg: shipment.weight_kg,
                    priority: shipment.priority,
                    status: shipment.shipment_status,
                    estimatedDeliveryAt:
                        shipment.estimated_delivery_at,
                    actualDeliveryAt:
                        shipment.actual_delivery_at,
                },

                assignment: shipment.assignment_id
                    ? {
                        id: shipment.assignment_id,
                        status: shipment.assignment_status,
                        assignedAt: shipment.assigned_at,
                        startedAt: shipment.started_at,
                    }
                    : null,

                driver: shipment.driver_id
                    ? {
                        id: shipment.driver_id,
                        firstName:
                            shipment.driver_first_name,
                        lastName:
                            shipment.driver_last_name,
                        phone:
                            shipment.driver_phone,
                    }
                    : null,

                vehicle: shipment.vehicle_id
                    ? {
                        id: shipment.vehicle_id,
                        vehicleNumber:
                            shipment.vehicle_number,
                        registrationNumber:
                            shipment.registration_number,
                        vehicleType:
                            shipment.vehicle_type,
                    }
                    : null,

                latestLocation,
                trackingHistory,
            },
        });
    } catch (error) {
        console.error("Shipment tracking error:", error);
        next(error);
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createTracking,
    getTrackingByAssignment,
    getLatestTracking,
    getLiveTracking,
    getShipmentTracking,
};