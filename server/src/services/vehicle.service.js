const { pool } = require("../config/database");


// =====================================================
// GET ALL VEHICLES
// =====================================================

const getAllVehicles = async ({
    search = "",
    status = "",
    vehicleType = "",
}) => {

    let sql = `
        SELECT
            id,
            vehicle_number,
            registration_number,
            vehicle_type,
            manufacturer,
            model,
            manufacture_year,
            capacity_kg,
            fuel_type,
            status,
            current_latitude,
            current_longitude,
            odometer_km,
            last_service_date,
            created_at,
            updated_at
        FROM vehicles
        WHERE 1 = 1
    `;

    const params = [];


    // SEARCH
    if (search) {

        sql += `
            AND (
                vehicle_number LIKE ?
                OR registration_number LIKE ?
                OR manufacturer LIKE ?
                OR model LIKE ?
            )
        `;

        const value = `%${search}%`;

        params.push(
            value,
            value,
            value,
            value
        );
    }


    // STATUS FILTER
    if (status) {

        sql += `
            AND status = ?
        `;

        params.push(status);
    }


    // VEHICLE TYPE FILTER
    if (vehicleType) {

        sql += `
            AND vehicle_type = ?
        `;

        params.push(vehicleType);
    }


    sql += `
        ORDER BY created_at DESC
    `;


    const [rows] = await pool.execute(
        sql,
        params
    );


    return rows;
};


// =====================================================
// GET VEHICLE BY ID
// =====================================================

const getVehicleById = async (id) => {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            vehicle_number,
            registration_number,
            vehicle_type,
            manufacturer,
            model,
            manufacture_year,
            capacity_kg,
            fuel_type,
            status,
            current_latitude,
            current_longitude,
            odometer_km,
            last_service_date,
            created_at,
            updated_at
        FROM vehicles
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );


    return rows[0] || null;
};


// =====================================================
// CREATE VEHICLE
// =====================================================

const createVehicle = async (vehicle) => {

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
    } = vehicle;


    const [result] = await pool.execute(
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
            status,
            current_latitude,
            current_longitude,
            odometer_km,
            last_service_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            vehicleNumber,
            registrationNumber,
            vehicleType,
            manufacturer || null,
            model || null,
            manufactureYear || null,
            capacityKg || null,
            fuelType || "diesel",
            status || "available",
            currentLatitude || null,
            currentLongitude || null,
            odometerKm ?? 0,
            lastServiceDate || null,
        ]
    );


    return getVehicleById(
        result.insertId
    );
};


// =====================================================
// UPDATE VEHICLE
// =====================================================

const updateVehicle = async (
    id,
    vehicle
) => {

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
    } = vehicle;


    const [result] = await pool.execute(
        `
        UPDATE vehicles
        SET
            vehicle_number = ?,
            registration_number = ?,
            vehicle_type = ?,
            manufacturer = ?,
            model = ?,
            manufacture_year = ?,
            capacity_kg = ?,
            fuel_type = ?,
            status = ?,
            current_latitude = ?,
            current_longitude = ?,
            odometer_km = ?,
            last_service_date = ?
        WHERE id = ?
        `,
        [
            vehicleNumber,
            registrationNumber,
            vehicleType,
            manufacturer || null,
            model || null,
            manufactureYear || null,
            capacityKg || null,
            fuelType,
            status,
            currentLatitude || null,
            currentLongitude || null,
            odometerKm ?? 0,
            lastServiceDate || null,
            id,
        ]
    );


    if (result.affectedRows === 0) {
        return null;
    }


    return getVehicleById(id);
};


// =====================================================
// DELETE VEHICLE
// =====================================================

const deleteVehicle = async (id) => {

    const [result] = await pool.execute(
        `
        DELETE FROM vehicles
        WHERE id = ?
        `,
        [id]
    );


    return result.affectedRows > 0;
};


module.exports = {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
};