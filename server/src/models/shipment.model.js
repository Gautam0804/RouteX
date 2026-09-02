const db = require("../config/db");

/**
 * Create a new shipment
 */
const createShipment = async (shipment) => {
    const {
        shipmentNumber,
        customerId,
        vehicleId,
        driverId,
        origin,
        destination,
        priority,
        status,
        eta,
        notes,
    } = shipment;

    const [result] = await db.execute(
        `
        INSERT INTO shipments (
            shipment_number,
            customer_id,
            vehicle_id,
            driver_id,
            origin,
            destination,
            priority,
            status,
            eta,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            shipmentNumber,
            customerId,
            vehicleId || null,
            driverId || null,
            origin,
            destination,
            priority || "normal",
            status || "pending",
            eta || null,
            notes || null,
        ]
    );

    return result.insertId;
};


/**
 * Get all shipments
 */
const getAllShipments = async ({
    search = "",
    status = "",
    priority = "",
    page = 1,
    limit = 10,
}) => {

    const offset = (page - 1) * limit;

    const values = [];

    let whereClause = "WHERE 1 = 1";

    if (search) {
        whereClause += `
            AND (
                s.shipment_number LIKE ?
                OR s.origin LIKE ?
                OR s.destination LIKE ?
                OR CONCAT(c.first_name, ' ', c.last_name) LIKE ?
            )
        `;

        const searchValue = `%${search}%`;

        values.push(
            searchValue,
            searchValue,
            searchValue,
            searchValue
        );
    }

    if (status) {
        whereClause += " AND s.status = ?";
        values.push(status);
    }

    if (priority) {
        whereClause += " AND s.priority = ?";
        values.push(priority);
    }

    const [rows] = await db.execute(
        `
        SELECT
            s.id,
            s.shipment_number,
            s.origin,
            s.destination,
            s.priority,
            s.status,
            s.eta,
            s.notes,
            s.created_at,
            s.updated_at,

            c.id AS customer_id,
            CONCAT(c.first_name, ' ', c.last_name)
                AS customer_name,

            v.id AS vehicle_id,
            v.registration_number
                AS vehicle_number,

            d.id AS driver_id,
            CONCAT(d.first_name, ' ', d.last_name)
                AS driver_name

        FROM shipments s

        INNER JOIN customers c
            ON s.customer_id = c.id

        LEFT JOIN vehicles v
            ON s.vehicle_id = v.id

        LEFT JOIN drivers d
            ON s.driver_id = d.id

        ${whereClause}

        ORDER BY s.created_at DESC

        LIMIT ${Number(limit)}
        OFFSET ${Number(offset)}
        `,
        values
    );

    return rows;
};


/**
 * Get shipment by ID
 */
const getShipmentById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT
            s.*,

            c.id AS customer_id,
            CONCAT(c.first_name, ' ', c.last_name)
                AS customer_name,

            v.id AS vehicle_id,
            v.registration_number
                AS vehicle_number,

            d.id AS driver_id,
            CONCAT(d.first_name, ' ', d.last_name)
                AS driver_name

        FROM shipments s

        INNER JOIN customers c
            ON s.customer_id = c.id

        LEFT JOIN vehicles v
            ON s.vehicle_id = v.id

        LEFT JOIN drivers d
            ON s.driver_id = d.id

        WHERE s.id = ?
        `,
        [id]
    );

    return rows[0];
};


/**
 * Update shipment
 */
const updateShipment = async (id, shipment) => {

    const {
        customerId,
        vehicleId,
        driverId,
        origin,
        destination,
        priority,
        status,
        eta,
        notes,
    } = shipment;

    const [result] = await db.execute(
        `
        UPDATE shipments
        SET
            customer_id = ?,
            vehicle_id = ?,
            driver_id = ?,
            origin = ?,
            destination = ?,
            priority = ?,
            status = ?,
            eta = ?,
            notes = ?
        WHERE id = ?
        `,
        [
            customerId,
            vehicleId || null,
            driverId || null,
            origin,
            destination,
            priority,
            status,
            eta || null,
            notes || null,
            id,
        ]
    );

    return result.affectedRows;
};


/**
 * Delete shipment
 */
const deleteShipment = async (id) => {

    const [result] = await db.execute(
        `
        DELETE FROM shipments
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows;
};


module.exports = {
    createShipment,
    getAllShipments,
    getShipmentById,
    updateShipment,
    deleteShipment,
};