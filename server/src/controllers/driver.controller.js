const { pool: db } = require("../config/db");

// =====================================================
// GET ALL DRIVERS
// GET /api/drivers
// =====================================================

const getDrivers = async (req, res, next) => {
    try {
        const {
            status,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Math.max(
            Number.parseInt(page, 10) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(
                Number.parseInt(limit, 10) || 10,
                1
            ),
            100
        );

        const offset = (pageNumber - 1) * limitNumber;

        const conditions = [];
        const values = [];

        // =================================================
        // STATUS FILTER
        // =================================================

        if (status) {
            const allowedStatuses = [
                "available",
                "on_trip",
                "off_duty",
                "inactive",
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid driver status",
                });
            }

            conditions.push("status = ?");
            values.push(status);
        }

        // =================================================
        // SEARCH
        // =================================================

        if (search && search.trim()) {
            const searchValue = `%${search.trim()}%`;

            conditions.push(`
                (
                    employee_code LIKE ?
                    OR first_name LIKE ?
                    OR last_name LIKE ?
                    OR phone LIKE ?
                    OR email LIKE ?
                    OR license_number LIKE ?
                )
            `);

            values.push(
                searchValue,
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

        // =================================================
        // TOTAL COUNT
        // =================================================

        const [countRows] = await db.execute(
            `
            SELECT COUNT(*) AS total
            FROM drivers
            ${whereClause}
            `,
            values
        );

        const total = Number(countRows[0]?.total) || 0;

        const totalPages = Math.max(
            Math.ceil(total / limitNumber),
            1
        );

        // =================================================
        // GET DRIVERS
        // =================================================

        const [drivers] = await db.execute(
            `
            SELECT
                id,
                employee_code,
                first_name,
                last_name,
                phone,
                email,
                license_number,
                license_expiry_date,
                experience_years,
                status,
                rating,
                total_deliveries,
                created_at,
                updated_at
            FROM drivers
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ${limitNumber}
            OFFSET ${offset}
            `,
            values
        );

        return res.status(200).json({
            success: true,
            data: drivers,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages,
            },
        });
    } catch (error) {
        console.error("GET DRIVERS ERROR:", error);
        next(error);
    }
};


// =====================================================
// GET DRIVER BY ID
// GET /api/drivers/:id
// =====================================================

const getDriverById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [drivers] = await db.execute(
            `
            SELECT
                id,
                employee_code,
                first_name,
                last_name,
                phone,
                email,
                license_number,
                license_expiry_date,
                experience_years,
                status,
                rating,
                total_deliveries,
                created_at,
                updated_at
            FROM drivers
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (drivers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: drivers[0],
        });
    } catch (error) {
        console.error("GET DRIVER BY ID ERROR:", error);
        next(error);
    }
};


// =====================================================
// CREATE DRIVER
// POST /api/drivers
// =====================================================

const createDriver = async (req, res, next) => {
    try {
        // Accept BOTH naming conventions.
        // This prevents frontend naming mismatch.
        const employeeCode =
            req.body.employee_code ??
            req.body.employeeCode;

        const firstName =
            req.body.first_name ??
            req.body.firstName;

        const lastName =
            req.body.last_name ??
            req.body.lastName;

        const phone = req.body.phone;

        const email = req.body.email;

        const licenseNumber =
            req.body.license_number ??
            req.body.licenseNumber;

        const licenseExpiryDate =
            req.body.license_expiry_date ??
            req.body.licenseExpiryDate;

        const experienceYears =
            req.body.experience_years ??
            req.body.experienceYears ??
            0;

        const status =
            req.body.status ??
            "available";

        const rating =
            req.body.rating ??
            0;

        // =================================================
        // VALIDATION
        // =================================================

        if (
            !employeeCode ||
            !firstName ||
            !lastName ||
            !phone ||
            !licenseNumber ||
            !licenseExpiryDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Required driver fields are missing",
            });
        }

        // =================================================
        // STATUS VALIDATION
        // =================================================

        const allowedStatuses = [
            "available",
            "on_trip",
            "off_duty",
            "inactive",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid driver status",
            });
        }

        // =================================================
        // RATING VALIDATION
        // =================================================

        const numericRating = Number(rating);

        if (
            Number.isNaN(numericRating) ||
            numericRating < 0 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 0 and 5",
            });
        }

        // =================================================
        // EXPERIENCE VALIDATION
        // =================================================

        const numericExperience =
            Number(experienceYears);

        if (
            Number.isNaN(numericExperience) ||
            numericExperience < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Experience years must be a valid positive number",
            });
        }

        // =================================================
        // LICENSE EXPIRY VALIDATION
        // =================================================

        const expiryDate =
            new Date(licenseExpiryDate);

        if (Number.isNaN(expiryDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid license expiry date",
            });
        }

        if (expiryDate < new Date()) {
            return res.status(400).json({
                success: false,
                message:
                    "License expiry date must be in the future",
            });
        }

        // =================================================
        // CREATE DRIVER
        // =================================================

        const [result] = await db.execute(
            `
            INSERT INTO drivers (
                employee_code,
                first_name,
                last_name,
                phone,
                email,
                license_number,
                license_expiry_date,
                experience_years,
                status,
                rating
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                String(employeeCode).trim(),
                String(firstName).trim(),
                String(lastName).trim(),
                String(phone).trim(),
                email?.trim() || null,
                String(licenseNumber).trim(),
                licenseExpiryDate,
                numericExperience,
                status,
                numericRating,
            ]
        );

        // =================================================
        // RETURN CREATED DRIVER
        // =================================================

        const [drivers] = await db.execute(
            `
            SELECT
                id,
                employee_code,
                first_name,
                last_name,
                phone,
                email,
                license_number,
                license_expiry_date,
                experience_years,
                status,
                rating,
                total_deliveries,
                created_at,
                updated_at
            FROM drivers
            WHERE id = ?
            LIMIT 1
            `,
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Driver created successfully",
            data: drivers[0],
        });
    } catch (error) {
        console.error("CREATE DRIVER ERROR:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "Employee code, phone, email or license number already exists",
            });
        }

        next(error);
    }
};


// =====================================================
// UPDATE DRIVER
// PUT /api/drivers/:id
// =====================================================

const updateDriver = async (req, res, next) => {
    try {
        const { id } = req.params;

        // =================================================
        // READ SNAKE_CASE FROM FRONTEND
        // =================================================

        const {
            first_name,
            last_name,
            phone,
            email,
            license_number,
            license_expiry_date,
            experience_years,
            status,
            rating,
        } = req.body;

        // =================================================
        // CHECK DRIVER EXISTS
        // =================================================

        const [existingDrivers] = await db.execute(
            `
            SELECT
                id,
                status
            FROM drivers
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (existingDrivers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });
        }

        const currentStatus =
            existingDrivers[0].status;

        // =================================================
        // STATUS VALIDATION
        // =================================================

        const allowedStatuses = [
            "available",
            "on_trip",
            "off_duty",
            "inactive",
        ];

        if (
            status !== undefined &&
            status !== null &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid driver status",
            });
        }

        // =================================================
        // PROTECT ON-TRIP DRIVER
        // =================================================

        if (
            currentStatus === "on_trip" &&
            status === "available"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Driver is currently on a trip. Complete or cancel the assignment first.",
            });
        }

        // =================================================
        // RATING VALIDATION
        // =================================================

        if (
            rating !== undefined &&
            rating !== null &&
            rating !== ""
        ) {
            const numericRating = Number(rating);

            if (
                Number.isNaN(numericRating) ||
                numericRating < 0 ||
                numericRating > 5
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Rating must be between 0 and 5",
                });
            }
        }

        // =================================================
        // EXPERIENCE VALIDATION
        // =================================================

        if (
            experience_years !== undefined &&
            experience_years !== null &&
            experience_years !== ""
        ) {
            const numericExperience =
                Number(experience_years);

            if (
                Number.isNaN(numericExperience) ||
                numericExperience < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Experience years must be a valid positive number",
                });
            }
        }

        // =================================================
        // LICENSE EXPIRY VALIDATION
        // =================================================

        if (license_expiry_date) {
            const expiryDate =
                new Date(license_expiry_date);

            if (Number.isNaN(expiryDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid license expiry date",
                });
            }

            if (expiryDate < new Date()) {
                return res.status(400).json({
                    success: false,
                    message:
                        "License expiry date must be in the future",
                });
            }
        }

        // =================================================
        // PREPARE VALUES
        // =================================================

        const firstNameValue =
            typeof first_name === "string"
                ? first_name.trim()
                : null;

        const lastNameValue =
            typeof last_name === "string"
                ? last_name.trim()
                : null;

        const phoneValue =
            typeof phone === "string"
                ? phone.trim()
                : null;

        const emailValue =
            typeof email === "string"
                ? email.trim()
                : null;

        const licenseNumberValue =
            typeof license_number === "string"
                ? license_number.trim()
                : null;

        const experienceValue =
            experience_years === undefined ||
            experience_years === null ||
            experience_years === ""
                ? null
                : Number(experience_years);

        const ratingValue =
            rating === undefined ||
            rating === null ||
            rating === ""
                ? null
                : Number(rating);

        // =================================================
        // UPDATE DRIVER
        // =================================================

        const [updateResult] = await db.execute(
            `
            UPDATE drivers
            SET
                first_name = COALESCE(?, first_name),
                last_name = COALESCE(?, last_name),
                phone = COALESCE(?, phone),
                email = COALESCE(?, email),
                license_number = COALESCE(?, license_number),
                license_expiry_date = COALESCE(?, license_expiry_date),
                experience_years = COALESCE(?, experience_years),
                status = COALESCE(?, status),
                rating = COALESCE(?, rating)
            WHERE id = ?
            `,
            [
                firstNameValue,
                lastNameValue,
                phoneValue,
                emailValue,
                licenseNumberValue,
                license_expiry_date || null,
                experienceValue,
                status ?? null,
                ratingValue,
                id,
            ]
        );

        console.log(
            "DRIVER UPDATE RESULT:",
            updateResult
        );

        // =================================================
        // GET UPDATED DRIVER
        // =================================================

        const [drivers] = await db.execute(
            `
            SELECT
                id,
                employee_code,
                first_name,
                last_name,
                phone,
                email,
                license_number,
                license_expiry_date,
                experience_years,
                status,
                rating,
                total_deliveries,
                created_at,
                updated_at
            FROM drivers
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (drivers.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Driver not found after update",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Driver updated successfully",
            data: drivers[0],
        });

    } catch (error) {
        console.error(
            "UPDATE DRIVER ERROR:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "Phone, email or license number already exists",
            });
        }

        next(error);
    }
};


// =====================================================
// UPDATE DRIVER STATUS
// PATCH /api/drivers/:id/status
// =====================================================

const updateDriverStatus = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "available",
            "on_trip",
            "off_duty",
            "inactive",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid driver status",
            });
        }

        // =================================================
        // GET CURRENT STATUS
        // =================================================

        const [drivers] = await db.execute(
            `
            SELECT status
            FROM drivers
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (drivers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });
        }

        const currentStatus =
            drivers[0].status;

        // =================================================
        // PROTECT ON-TRIP DRIVER
        // =================================================

        if (
            currentStatus === "on_trip" &&
            status === "available"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Driver is currently on a trip. Complete or cancel the assignment first.",
            });
        }

        // =================================================
        // UPDATE STATUS
        // =================================================

        await db.execute(
            `
            UPDATE drivers
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        return res.status(200).json({
            success: true,
            message:
                "Driver status updated successfully",
            data: {
                id: Number(id),
                status,
            },
        });
    } catch (error) {
        console.error(
            "UPDATE DRIVER STATUS ERROR:",
            error
        );

        next(error);
    }
};


// =====================================================
// DELETE / DEACTIVATE DRIVER
// DELETE /api/drivers/:id
// =====================================================

const deleteDriver = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        // =================================================
        // GET CURRENT DRIVER
        // =================================================

        const [drivers] = await db.execute(
            `
            SELECT
                id,
                status
            FROM drivers
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (drivers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Driver not found",
            });
        }

        // =================================================
        // DON'T DEACTIVATE DRIVER ON TRIP
        // =================================================

        if (
            drivers[0].status === "on_trip"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Cannot deactivate a driver currently on a trip",
            });
        }

        // =================================================
        // SOFT DELETE
        // =================================================

        await db.execute(
            `
            UPDATE drivers
            SET status = 'inactive'
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message:
                "Driver deactivated successfully",
        });
    } catch (error) {
        console.error(
            "DELETE DRIVER ERROR:",
            error
        );

        next(error);
    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    updateDriverStatus,
    deleteDriver,
};