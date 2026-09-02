const { pool } = require("../config/db");


// =====================================================
// GET ALL CUSTOMERS
// GET /api/customers
// =====================================================

const getCustomers = async (req, res, next) => {

    try {

        const {
            search,
            status = "active",
            page = 1,
            limit = 20,
        } = req.query;


        const pageNumber =
            Math.max(Number(page) || 1, 1);

        const limitNumber =
            Math.min(
                Math.max(Number(limit) || 20, 1),
                100
            );

        const offset =
            (pageNumber - 1) * limitNumber;


        const conditions = [];
        const values = [];


        // STATUS FILTER

        if (status !== "all") {

            conditions.push(
                "status = ?"
            );

            values.push(status);

        }


        // SEARCH

        if (search) {

            conditions.push(`
                (
                    customer_code LIKE ?
                    OR company_name LIKE ?
                    OR contact_person LIKE ?
                    OR email LIKE ?
                    OR phone LIKE ?
                    OR city LIKE ?
                )
            `);

            const searchValue =
                `%${search}%`;

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
            conditions.length
                ? `WHERE ${conditions.join(" AND ")}`
                : "";


        // ==========================================
        // TOTAL COUNT
        // ==========================================

        const [countResult] =
            await pool.execute(
                `
                SELECT COUNT(*) AS total

                FROM customers

                ${whereClause}
                `,
                values
            );


        const total =
            Number(countResult[0].total);


        // ==========================================
        // CUSTOMERS
        // ==========================================

        const [customers] =
            await pool.execute(
                `
                SELECT

                    id,
                    customer_code,

                    company_name,
                    contact_person,

                    email,
                    phone,

                    address_line1,
                    address_line2,

                    city,
                    state,
                    postal_code,
                    country,

                    status,

                    created_at,
                    updated_at

                FROM customers

                ${whereClause}

                ORDER BY created_at DESC

                LIMIT ${limitNumber}
                OFFSET ${offset}
                `,
                values
            );


        return res.status(200).json({

            success: true,

            data: customers,

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

        next(error);

    }

};


// =====================================================
// GET CUSTOMER BY ID
// GET /api/customers/:id
// =====================================================

const getCustomerById = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;


        const [customers] =
            await pool.execute(
                `
                SELECT

                    id,
                    customer_code,

                    company_name,
                    contact_person,

                    email,
                    phone,

                    address_line1,
                    address_line2,

                    city,
                    state,
                    postal_code,
                    country,

                    status,

                    created_at,
                    updated_at

                FROM customers

                WHERE id = ?

                LIMIT 1
                `,
                [id]
            );


        if (customers.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found",

            });

        }


        return res.status(200).json({

            success: true,

            data: customers[0],

        });

    } catch (error) {

        next(error);

    }

};


// =====================================================
// CREATE CUSTOMER
// POST /api/customers
// =====================================================

const createCustomer = async (
    req,
    res,
    next
) => {

    try {

        const {

            customerCode,
            companyName,
            contactPerson,

            email,
            phone,

            addressLine1,
            addressLine2,

            city,
            state,
            postalCode,

            country = "India",

        } = req.body;


        // ==========================================
        // REQUIRED FIELDS
        // ==========================================

        if (
            !customerCode ||
            !companyName ||
            !contactPerson ||
            !phone ||
            !addressLine1 ||
            !city ||
            !state
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Required customer fields are missing",

            });

        }


        // ==========================================
        // EMAIL VALIDATION
        // ==========================================

        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid email address",

            });

        }


        // ==========================================
        // CREATE CUSTOMER
        // ==========================================

        const [result] =
            await pool.execute(
                `
                INSERT INTO customers (

                    customer_code,

                    company_name,
                    contact_person,

                    email,
                    phone,

                    address_line1,
                    address_line2,

                    city,
                    state,
                    postal_code,

                    country

                )

                VALUES (
                    ?, ?, ?,
                    ?, ?,
                    ?, ?,
                    ?, ?, ?,
                    ?
                )
                `,
                [

                    customerCode,

                    companyName,
                    contactPerson,

                    email || null,
                    phone,

                    addressLine1,
                    addressLine2 || null,

                    city,
                    state,
                    postalCode || null,

                    country,

                ]
            );


        // ==========================================
        // RETURN CREATED CUSTOMER
        // ==========================================

        const [customers] =
            await pool.execute(
                `
                SELECT *

                FROM customers

                WHERE id = ?

                LIMIT 1
                `,
                [result.insertId]
            );


        return res.status(201).json({

            success: true,

            message:
                "Customer created successfully",

            data: customers[0],

        });

    } catch (error) {

        if (
            error.code === "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Customer code, email or phone already exists",

            });

        }


        next(error);

    }

};


// =====================================================
// UPDATE CUSTOMER
// PUT /api/customers/:id
// =====================================================

const updateCustomer = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;


        const {

            customerCode,
            companyName,
            contactPerson,

            email,
            phone,

            addressLine1,
            addressLine2,

            city,
            state,
            postalCode,

            country,

            status,

        } = req.body;


        const allowedStatuses = [

            "active",
            "inactive",

        ];


        // ==========================================
        // STATUS VALIDATION
        // ==========================================

        if (
            status &&
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid customer status",

            });

        }


        // ==========================================
        // EMAIL VALIDATION
        // ==========================================

        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid email address",

            });

        }


        // ==========================================
        // UPDATE
        // ==========================================

        const [result] =
            await pool.execute(
                `
                UPDATE customers

                SET

                    customer_code =
                        COALESCE(
                            ?,
                            customer_code
                        ),

                    company_name =
                        COALESCE(
                            ?,
                            company_name
                        ),

                    contact_person =
                        COALESCE(
                            ?,
                            contact_person
                        ),

                    email =
                        COALESCE(
                            ?,
                            email
                        ),

                    phone =
                        COALESCE(
                            ?,
                            phone
                        ),

                    address_line1 =
                        COALESCE(
                            ?,
                            address_line1
                        ),

                    address_line2 =
                        COALESCE(
                            ?,
                            address_line2
                        ),

                    city =
                        COALESCE(
                            ?,
                            city
                        ),

                    state =
                        COALESCE(
                            ?,
                            state
                        ),

                    postal_code =
                        COALESCE(
                            ?,
                            postal_code
                        ),

                    country =
                        COALESCE(
                            ?,
                            country
                        ),

                    status =
                        COALESCE(
                            ?,
                            status
                        )

                WHERE id = ?
                `,
                [

                    customerCode ?? null,
                    companyName ?? null,
                    contactPerson ?? null,

                    email ?? null,
                    phone ?? null,

                    addressLine1 ?? null,
                    addressLine2 ?? null,

                    city ?? null,
                    state ?? null,
                    postalCode ?? null,

                    country ?? null,

                    status ?? null,

                    id,

                ]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found",

            });

        }


        // ==========================================
        // RETURN UPDATED CUSTOMER
        // ==========================================

        const [customers] =
            await pool.execute(
                `
                SELECT *

                FROM customers

                WHERE id = ?

                LIMIT 1
                `,
                [id]
            );


        return res.status(200).json({

            success: true,

            message:
                "Customer updated successfully",

            data: customers[0],

        });

    } catch (error) {

        if (
            error.code === "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Customer code, email or phone already exists",

            });

        }


        next(error);

    }

};


// =====================================================
// DEACTIVATE CUSTOMER
// DELETE /api/customers/:id
// =====================================================

const deleteCustomer = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;


        const [customers] =
            await pool.execute(
                `
                SELECT id

                FROM customers

                WHERE id = ?

                LIMIT 1
                `,
                [id]
            );


        if (customers.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Customer not found",

            });

        }


        await pool.execute(
            `
            UPDATE customers

            SET status = 'inactive'

            WHERE id = ?
            `,
            [id]
        );


        return res.status(200).json({

            success: true,

            message:
                "Customer deactivated successfully",

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {

    getCustomers,
    getCustomerById,

    createCustomer,
    updateCustomer,

    deleteCustomer,

};