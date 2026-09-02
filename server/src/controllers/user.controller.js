const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const { createAuditLog } = require("../utils/auditLog");


// =====================================================
// GET ALL USERS
// GET /api/users
// =====================================================

const getUsers = async (req, res, next) => {

    try {

        const {
            status,
            roleId,
            search,
        } = req.query;


        let query = `
            SELECT
                u.id,
                u.role_id,
                r.name AS role_name,
                r.description AS role_description,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.avatar_url,
                u.status,
                u.last_login_at,
                u.created_at,
                u.updated_at

            FROM users u

            INNER JOIN roles r
                ON r.id = u.role_id

            WHERE 1 = 1
        `;


        const params = [];


        // =================================================
        // STATUS FILTER
        // =================================================

        if (status) {

            const allowedStatuses = [
                "active",
                "inactive",
                "suspended",
            ];

            if (!allowedStatuses.includes(status)) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid user status",

                });

            }

            query += `
                AND u.status = ?
            `;

            params.push(status);

        }


        // =================================================
        // ROLE FILTER
        // =================================================

        if (roleId) {

            const parsedRoleId =
                Number(roleId);

            if (
                !Number.isInteger(parsedRoleId) ||
                parsedRoleId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid role ID",

                });

            }

            query += `
                AND u.role_id = ?
            `;

            params.push(parsedRoleId);

        }


        // =================================================
        // SEARCH
        // =================================================

        if (search) {

            query += `
                AND (
                    u.first_name LIKE ?
                    OR u.last_name LIKE ?
                    OR u.email LIKE ?
                    OR u.phone LIKE ?
                )
            `;

            const searchValue =
                `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );

        }


        query += `
            ORDER BY u.created_at DESC
        `;


        const [users] =
            await pool.execute(
                query,
                params
            );


        return res.status(200).json({

            success: true,

            count: users.length,

            data: users,

        });

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );

        next(error);

    }

};


// =====================================================
// GET USER BY ID
// GET /api/users/:id
// =====================================================

const getUserById = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            Number(req.params.id);


        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user ID",

            });

        }


        const [users] =
            await pool.execute(
                `
                SELECT

                    u.id,
                    u.role_id,

                    r.name AS role_name,
                    r.description AS role_description,

                    u.first_name,
                    u.last_name,
                    u.email,
                    u.phone,
                    u.avatar_url,
                    u.status,
                    u.last_login_at,
                    u.created_at,
                    u.updated_at

                FROM users u

                INNER JOIN roles r
                    ON r.id = u.role_id

                WHERE u.id = ?

                LIMIT 1
                `,
                [userId]
            );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        return res.status(200).json({

            success: true,

            data: users[0],

        });

    } catch (error) {

        console.error(
            "Get user error:",
            error
        );

        next(error);

    }

};


// =====================================================
// CREATE USER
// POST /api/users
// =====================================================

const createUser = async (
    req,
    res,
    next
) => {

    try {

        const {
            roleId,
            firstName,
            lastName,
            email,
            password,
            phone = null,
            avatarUrl = null,
            status = "active",
        } = req.body || {};


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !roleId ||
            !firstName ||
            !lastName ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "roleId, firstName, lastName, email and password are required",

            });

        }


        const parsedRoleId =
            Number(roleId);


        if (
            !Number.isInteger(parsedRoleId) ||
            parsedRoleId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid role ID",

            });

        }


        const allowedStatuses = [
            "active",
            "inactive",
            "suspended",
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user status",

            });

        }


        if (password.length < 8) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 8 characters",

            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // =================================================
        // CHECK ROLE
        // =================================================

        const [roles] =
            await pool.execute(
                `
                SELECT
                    id,
                    name

                FROM roles

                WHERE id = ?

                LIMIT 1
                `,
                [parsedRoleId]
            );


        if (roles.length === 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Role not found",

            });

        }


        // =================================================
        // CHECK EMAIL
        // =================================================

        const [existingUsers] =
            await pool.execute(
                `
                SELECT id

                FROM users

                WHERE email = ?

                LIMIT 1
                `,
                [normalizedEmail]
            );


        if (existingUsers.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "Email is already registered",

            });

        }


        // =================================================
        // HASH PASSWORD
        // =================================================

        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );


        // =================================================
        // INSERT USER
        // =================================================

        const [result] =
            await pool.execute(
                `
                INSERT INTO users (

                    role_id,
                    first_name,
                    last_name,
                    email,
                    password_hash,
                    phone,
                    avatar_url,
                    status

                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    parsedRoleId,
                    firstName.trim(),
                    lastName.trim(),
                    normalizedEmail,
                    passwordHash,
                    phone,
                    avatarUrl,
                    status,
                ]
            );


        // =================================================
        // AUDIT
        // =================================================

        await createAuditLog({

            userId:
                req.user?.id || null,

            action:
                "CREATE_USER",

            entityType:
                "user",

            entityId:
                result.insertId,

            newValues: {

                roleId:
                    parsedRoleId,

                firstName:
                    firstName.trim(),

                lastName:
                    lastName.trim(),

                email:
                    normalizedEmail,

                phone,

                avatarUrl,

                status,

            },

            ipAddress:
                req.ip || null,

            userAgent:
                req.get("user-agent") || null,

        });


        return res.status(201).json({

            success: true,

            message:
                "User created successfully",

            data: {

                id:
                    result.insertId,

                roleId:
                    parsedRoleId,

                firstName:
                    firstName.trim(),

                lastName:
                    lastName.trim(),

                email:
                    normalizedEmail,

                phone,

                avatarUrl,

                status,

            },

        });

    } catch (error) {

        console.error(
            "Create user error:",
            error
        );

        next(error);

    }

};


// =====================================================
// UPDATE USER
// PUT /api/users/:id
// =====================================================

const updateUser = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            Number(req.params.id);


        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user ID",

            });

        }


        const {
            roleId,
            firstName,
            lastName,
            email,
            password,
            phone,
            avatarUrl,
            status,
        } = req.body || {};


        // =================================================
        // GET CURRENT USER
        // =================================================

        const [users] =
            await pool.execute(
                `
                SELECT *

                FROM users

                WHERE id = ?

                LIMIT 1
                `,
                [userId]
            );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        const currentUser =
            users[0];


        // =================================================
        // PREPARE VALUES
        // =================================================

        let newRoleId =
            currentUser.role_id;

        let newFirstName =
            currentUser.first_name;

        let newLastName =
            currentUser.last_name;

        let newEmail =
            currentUser.email;

        let newPhone =
            currentUser.phone;

        let newAvatarUrl =
            currentUser.avatar_url;

        let newStatus =
            currentUser.status;

        let newPasswordHash =
            currentUser.password_hash;


        if (roleId !== undefined) {

            newRoleId =
                Number(roleId);

            if (
                !Number.isInteger(newRoleId) ||
                newRoleId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid role ID",

                });

            }

        }


        if (firstName !== undefined) {

            if (!String(firstName).trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "First name cannot be empty",

                });

            }

            newFirstName =
                String(firstName).trim();

        }


        if (lastName !== undefined) {

            if (!String(lastName).trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Last name cannot be empty",

                });

            }

            newLastName =
                String(lastName).trim();

        }


        if (email !== undefined) {

            newEmail =
                String(email)
                    .trim()
                    .toLowerCase();

        }


        if (phone !== undefined) {

            newPhone =
                phone || null;

        }


        if (avatarUrl !== undefined) {

            newAvatarUrl =
                avatarUrl || null;

        }


        if (status !== undefined) {

            const allowedStatuses = [
                "active",
                "inactive",
                "suspended",
            ];

            if (!allowedStatuses.includes(status)) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid user status",

                });

            }

            newStatus =
                status;

        }


        // =================================================
        // PASSWORD
        // =================================================

        if (password !== undefined) {

            if (password.length < 8) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 8 characters",

                });

            }

            newPasswordHash =
                await bcrypt.hash(
                    password,
                    12
                );

        }


        // =================================================
        // CHECK ROLE
        // =================================================

        if (newRoleId !== currentUser.role_id) {

            const [roles] =
                await pool.execute(
                    `
                    SELECT id

                    FROM roles

                    WHERE id = ?

                    LIMIT 1
                    `,
                    [newRoleId]
                );


            if (roles.length === 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Role not found",

                });

            }

        }


        // =================================================
        // CHECK EMAIL
        // =================================================

        if (newEmail !== currentUser.email) {

            const [existingUsers] =
                await pool.execute(
                    `
                    SELECT id

                    FROM users

                    WHERE email = ?
                    AND id != ?

                    LIMIT 1
                    `,
                    [
                        newEmail,
                        userId,
                    ]
                );


            if (existingUsers.length > 0) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Email is already registered",

                });

            }

        }


        // =================================================
        // UPDATE
        // =================================================

        await pool.execute(
            `
            UPDATE users

            SET

                role_id = ?,
                first_name = ?,
                last_name = ?,
                email = ?,
                password_hash = ?,
                phone = ?,
                avatar_url = ?,
                status = ?

            WHERE id = ?
            `,
            [
                newRoleId,
                newFirstName,
                newLastName,
                newEmail,
                newPasswordHash,
                newPhone,
                newAvatarUrl,
                newStatus,
                userId,
            ]
        );


        // =================================================
        // AUDIT
        // =================================================

        await createAuditLog({

            userId:
                req.user?.id || null,

            action:
                "UPDATE_USER",

            entityType:
                "user",

            entityId:
                userId,

            oldValues: {

                roleId:
                    currentUser.role_id,

                firstName:
                    currentUser.first_name,

                lastName:
                    currentUser.last_name,

                email:
                    currentUser.email,

                phone:
                    currentUser.phone,

                avatarUrl:
                    currentUser.avatar_url,

                status:
                    currentUser.status,

            },

            newValues: {

                roleId:
                    newRoleId,

                firstName:
                    newFirstName,

                lastName:
                    newLastName,

                email:
                    newEmail,

                phone:
                    newPhone,

                avatarUrl:
                    newAvatarUrl,

                status:
                    newStatus,

            },

            ipAddress:
                req.ip || null,

            userAgent:
                req.get("user-agent") || null,

        });


        return res.status(200).json({

            success: true,

            message:
                "User updated successfully",

        });

    } catch (error) {

        console.error(
            "Update user error:",
            error
        );

        next(error);

    }

};


// =====================================================
// CHANGE USER STATUS
// PATCH /api/users/:id/status
// =====================================================

const updateUserStatus = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            Number(req.params.id);

        const {
            status
        } = req.body || {};


        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user ID",

            });

        }


        const allowedStatuses = [
            "active",
            "inactive",
            "suspended",
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user status",

            });

        }


        const [users] =
            await pool.execute(
                `
                SELECT
                    id,
                    status

                FROM users

                WHERE id = ?

                LIMIT 1
                `,
                [userId]
            );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        const oldStatus =
            users[0].status;


        if (oldStatus === status) {

            return res.status(409).json({

                success: false,

                message:
                    `User is already ${status}`,

            });

        }


        await pool.execute(
            `
            UPDATE users

            SET status = ?

            WHERE id = ?
            `,
            [
                status,
                userId,
            ]
        );


        await createAuditLog({

            userId:
                req.user?.id || null,

            action:
                "UPDATE_USER_STATUS",

            entityType:
                "user",

            entityId:
                userId,

            oldValues: {

                status:
                    oldStatus,

            },

            newValues: {

                status,

            },

            ipAddress:
                req.ip || null,

            userAgent:
                req.get("user-agent") || null,

        });


        return res.status(200).json({

            success: true,

            message:
                `User ${status} successfully`,

            data: {

                id:
                    userId,

                status,

            },

        });

    } catch (error) {

        console.error(
            "Update user status error:",
            error
        );

        next(error);

    }

};


// =====================================================
// DELETE USER
// DELETE /api/users/:id
// =====================================================

const deleteUser = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            Number(req.params.id);


        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user ID",

            });

        }


        // =================================================
        // CHECK USER
        // =================================================

        const [users] =
            await pool.execute(
                `
                SELECT

                    id,
                    role_id,
                    first_name,
                    last_name,
                    email,
                    status

                FROM users

                WHERE id = ?

                LIMIT 1
                `,
                [userId]
            );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        const user =
            users[0];


        // =================================================
        // PROTECT CURRENT USER
        // =================================================

        if (
            req.user?.id &&
            Number(req.user.id) === userId
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot delete your own account",

            });

        }


        // =================================================
        // DELETE
        // =================================================

        await pool.execute(
            `
            DELETE FROM users

            WHERE id = ?
            `,
            [userId]
        );


        // =================================================
        // AUDIT
        // =================================================

        await createAuditLog({

            userId:
                req.user?.id || null,

            action:
                "DELETE_USER",

            entityType:
                "user",

            entityId:
                userId,

            oldValues: user,

            ipAddress:
                req.ip || null,

            userAgent:
                req.get("user-agent") || null,

        });


        return res.status(200).json({

            success: true,

            message:
                "User deleted successfully",

        });

    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        next(error);

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,

};