const { pool } = require("../config/database");


// =====================================================
// GET DASHBOARD OVERVIEW
// GET /api/dashboard/overview
// =====================================================

const getOverview = async (req, res, next) => {

    try {

        // =================================================
        // SHIPMENT STATISTICS
        // =================================================

        const [shipmentStats] = await pool.execute(`
            SELECT

                COUNT(*) AS total_shipments,

                SUM(IF(s.status = 'pending', 1, 0))
                    AS pending_shipments,

                SUM(IF(s.status = 'assigned', 1, 0))
                    AS assigned_shipments,

                SUM(IF(s.status = 'picked_up', 1, 0))
                    AS picked_up_shipments,

                SUM(IF(s.status = 'in_transit', 1, 0))
                    AS in_transit_shipments,

                SUM(IF(s.status = 'out_for_delivery', 1, 0))
                    AS out_for_delivery_shipments,

                SUM(IF(s.status = 'delivered', 1, 0))
                    AS delivered_shipments,

                SUM(IF(s.status = 'delayed', 1, 0))
                    AS delayed_shipments,

                SUM(IF(s.status = 'cancelled', 1, 0))
                    AS cancelled_shipments

            FROM shipments s
        `);


        // =================================================
        // VEHICLE STATISTICS
        // =================================================

        const [vehicleStats] = await pool.execute(`
            SELECT

                COUNT(*) AS total_vehicles,

                SUM(IF(v.status = 'available', 1, 0))
                    AS available_vehicles,

                SUM(IF(v.status = 'in_transit', 1, 0))
                    AS in_transit_vehicles,

                SUM(IF(v.status = 'maintenance', 1, 0))
                    AS maintenance_vehicles,

                SUM(IF(v.status = 'inactive', 1, 0))
                    AS inactive_vehicles

            FROM vehicles v
        `);


        // =================================================
        // DRIVER STATISTICS
        // =================================================

        const [driverStats] = await pool.execute(`
            SELECT

                COUNT(*) AS total_drivers,

                SUM(IF(d.status = 'available', 1, 0))
                    AS available_drivers,

                SUM(IF(d.status = 'on_trip', 1, 0))
                    AS on_trip_drivers,

                SUM(IF(d.status = 'off_duty', 1, 0))
                    AS off_duty_drivers,

                SUM(IF(d.status = 'inactive', 1, 0))
                    AS inactive_drivers

            FROM drivers d
        `);


        // =================================================
        // ALERT STATISTICS
        // =================================================

        const [alertStats] = await pool.execute(`
            SELECT

                COUNT(*) AS total_alerts,

                SUM(IF(a.status = 'open', 1, 0))
                    AS open_alerts,

                SUM(IF(a.status = 'acknowledged', 1, 0))
                    AS acknowledged_alerts,

                SUM(IF(a.status = 'resolved', 1, 0))
                    AS resolved_alerts,

                SUM(
                    IF(
                        a.severity = 'critical'
                        AND a.status != 'resolved',
                        1,
                        0
                    )
                ) AS critical_alerts

            FROM alerts a
        `);


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            data: {

                shipments: {

                    total: Number(
                        shipmentStats[0].total_shipments || 0
                    ),

                    pending: Number(
                        shipmentStats[0].pending_shipments || 0
                    ),

                    assigned: Number(
                        shipmentStats[0].assigned_shipments || 0
                    ),

                    pickedUp: Number(
                        shipmentStats[0].picked_up_shipments || 0
                    ),

                    inTransit: Number(
                        shipmentStats[0].in_transit_shipments || 0
                    ),

                    outForDelivery: Number(
                        shipmentStats[0].out_for_delivery_shipments || 0
                    ),

                    delivered: Number(
                        shipmentStats[0].delivered_shipments || 0
                    ),

                    delayed: Number(
                        shipmentStats[0].delayed_shipments || 0
                    ),

                    cancelled: Number(
                        shipmentStats[0].cancelled_shipments || 0
                    ),

                },


                vehicles: {

                    total: Number(
                        vehicleStats[0].total_vehicles || 0
                    ),

                    available: Number(
                        vehicleStats[0].available_vehicles || 0
                    ),

                    inTransit: Number(
                        vehicleStats[0].in_transit_vehicles || 0
                    ),

                    maintenance: Number(
                        vehicleStats[0].maintenance_vehicles || 0
                    ),

                    inactive: Number(
                        vehicleStats[0].inactive_vehicles || 0
                    ),

                },


                drivers: {

                    total: Number(
                        driverStats[0].total_drivers || 0
                    ),

                    available: Number(
                        driverStats[0].available_drivers || 0
                    ),

                    onTrip: Number(
                        driverStats[0].on_trip_drivers || 0
                    ),

                    offDuty: Number(
                        driverStats[0].off_duty_drivers || 0
                    ),

                    inactive: Number(
                        driverStats[0].inactive_drivers || 0
                    ),

                },


                alerts: {

                    total: Number(
                        alertStats[0].total_alerts || 0
                    ),

                    open: Number(
                        alertStats[0].open_alerts || 0
                    ),

                    acknowledged: Number(
                        alertStats[0].acknowledged_alerts || 0
                    ),

                    resolved: Number(
                        alertStats[0].resolved_alerts || 0
                    ),

                    critical: Number(
                        alertStats[0].critical_alerts || 0
                    ),

                },

            },

        });

    } catch (error) {

        console.error(
            "Dashboard overview error:",
            error
        );

        next(error);

    }

};


// =====================================================
// GET RECENT SHIPMENTS
// GET /api/dashboard/recent-shipments
// =====================================================

const getRecentShipments = async (req, res, next) => {

    try {

        const [shipments] = await pool.execute(`
            SELECT

                s.id,

                s.tracking_number,

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

                s.created_at,

                s.updated_at,

                c.customer_code,

                c.company_name AS customer_name,

                c.contact_person AS customer_contact

            FROM shipments s

            LEFT JOIN customers c
                ON c.id = s.customer_id

            ORDER BY s.created_at DESC

            LIMIT 10
        `);


        return res.status(200).json({

            success: true,

            count: shipments.length,

            data: shipments,

        });

    } catch (error) {

        console.error(
            "Recent shipments error:",
            error
        );

        next(error);

    }

};


// =====================================================
// GET ACTIVE ASSIGNMENTS
// GET /api/dashboard/active-assignments
// =====================================================

const getActiveAssignments = async (req, res, next) => {

    try {

        const [assignments] = await pool.execute(`
            SELECT

                a.id AS assignment_id,

                a.status AS assignment_status,

                a.assigned_at,

                a.started_at,

                a.notes,

                s.id AS shipment_id,

                s.tracking_number,

                s.origin_city,

                s.destination_city,

                s.priority AS shipment_priority,

                s.status AS shipment_status,

                d.id AS driver_id,

                d.employee_code,

                d.first_name AS driver_first_name,

                d.last_name AS driver_last_name,

                d.phone AS driver_phone,

                d.rating AS driver_rating,

                v.id AS vehicle_id,

                v.vehicle_number,

                v.registration_number,

                v.vehicle_type,

                v.status AS vehicle_status

            FROM assignments a

            INNER JOIN shipments s
                ON s.id = a.shipment_id

            INNER JOIN drivers d
                ON d.id = a.driver_id

            INNER JOIN vehicles v
                ON v.id = a.vehicle_id

            WHERE a.status IN (
                'assigned',
                'accepted',
                'in_progress'
            )

            ORDER BY a.assigned_at DESC
        `);


        return res.status(200).json({

            success: true,

            count: assignments.length,

            data: assignments,

        });

    } catch (error) {

        console.error(
            "Active assignments error:",
            error
        );

        next(error);

    }

};


// =====================================================
// GET RECENT ALERTS
// GET /api/dashboard/recent-alerts
// =====================================================

const getRecentAlerts = async (req, res, next) => {

    try {

        const [alerts] = await pool.execute(`
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

                a.updated_at

            FROM alerts a

            WHERE a.status != 'resolved'

            ORDER BY

                CASE
                    WHEN a.severity = 'critical' THEN 1
                    WHEN a.severity = 'high' THEN 2
                    WHEN a.severity = 'medium' THEN 3
                    WHEN a.severity = 'low' THEN 4
                    ELSE 5
                END,

                a.created_at DESC

            LIMIT 10
        `);


        return res.status(200).json({

            success: true,

            count: alerts.length,

            data: alerts,

        });

    } catch (error) {

        console.error(
            "Recent alerts error:",
            error
        );

        next(error);

    }

};


// =====================================================
// GET DASHBOARD SUMMARY
// GET /api/dashboard/summary
// =====================================================

const getSummary = async (req, res, next) => {

    try {

        // =================================================
        // TOTAL ASSIGNMENTS
        // =================================================

        const [assignmentStats] = await pool.execute(`
            SELECT

                COUNT(*) AS total,

                SUM(
                    IF(status = 'assigned', 1, 0)
                ) AS assigned,

                SUM(
                    IF(status = 'accepted', 1, 0)
                ) AS accepted,

                SUM(
                    IF(status = 'in_progress', 1, 0)
                ) AS in_progress,

                SUM(
                    IF(status = 'completed', 1, 0)
                ) AS completed,

                SUM(
                    IF(status = 'cancelled', 1, 0)
                ) AS cancelled

            FROM assignments
        `);


        // =================================================
        // TOTAL CUSTOMERS
        // =================================================

        const [customerStats] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM customers
        `);


        // =================================================
        // TOTAL USERS
        // =================================================

        const [userStats] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM users
        `);


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            data: {

                assignments: {

                    total: Number(
                        assignmentStats[0].total || 0
                    ),

                    assigned: Number(
                        assignmentStats[0].assigned || 0
                    ),

                    accepted: Number(
                        assignmentStats[0].accepted || 0
                    ),

                    inProgress: Number(
                        assignmentStats[0].in_progress || 0
                    ),

                    completed: Number(
                        assignmentStats[0].completed || 0
                    ),

                    cancelled: Number(
                        assignmentStats[0].cancelled || 0
                    ),

                },

                customers: {

                    total: Number(
                        customerStats[0].total || 0
                    ),

                },

                users: {

                    total: Number(
                        userStats[0].total || 0
                    ),

                },

            },

        });

    } catch (error) {

        console.error(
            "Dashboard summary error:",
            error
        );

        next(error);

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getOverview,

    getRecentShipments,

    getActiveAssignments,

    getRecentAlerts,

    getSummary,

};