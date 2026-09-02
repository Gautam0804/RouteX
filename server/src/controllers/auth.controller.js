const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { pool } = require("../config/database");


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // =================================================
        // FIND USER
        // =================================================

        const [users] = await pool.execute(
            `
            SELECT
                u.id,
                u.role_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.password_hash,
                u.avatar_url,
                u.status,
                u.last_login_at,
                u.created_at,
                u.updated_at,

                r.name AS role

            FROM users u

            LEFT JOIN roles r
                ON r.id = u.role_id

            WHERE LOWER(u.email) = ?

            LIMIT 1
            `,
            [normalizedEmail]
        );


        // =================================================
        // USER NOT FOUND
        // =================================================

        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });

        }


        const user = users[0];


        // =================================================
        // ACCOUNT STATUS
        // =================================================

        if (user.status !== "active") {

            return res.status(403).json({
                success: false,
                message: "User account is not active",
            });

        }


        // =================================================
        // PASSWORD CHECK
        // =================================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });

        }


        // =================================================
        // JWT SECRET CHECK
        // =================================================

        if (!process.env.JWT_SECRET) {

            throw new Error(
                "JWT_SECRET is not configured in .env"
            );

        }


        // =================================================
        // CREATE JWT
        // =================================================

        const token = jwt.sign(

            {
                sub: Number(user.id),
                userId: Number(user.id),
                email: user.email,
                role: user.role,
                roleId: Number(user.role_id),
            },

            process.env.JWT_SECRET,

            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "1d",
            }

        );


        // =================================================
        // UPDATE LAST LOGIN
        // =================================================

        await pool.execute(
            `
            UPDATE users

            SET last_login_at = NOW()

            WHERE id = ?
            `,
            [user.id]
        );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message: "Login successful",

            data: {

                token,

                user: {

                    id: Number(user.id),

                    firstName:
                        user.first_name,

                    lastName:
                        user.last_name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    avatarUrl:
                        user.avatar_url,

                    status:
                        user.status,

                    role:
                        user.role,

                    roleId:
                        Number(user.role_id),

                },

            },

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        next(error);

    }

};


// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================

const getMe = async (
    req,
    res,
    next
) => {

    try {

        // =================================================
        // GET USER ID FROM JWT
        // =================================================

        const userId =
            req.user?.sub ||
            req.user?.userId;


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token",

            });

        }


        // =================================================
        // FIND CURRENT USER
        // =================================================

        const [users] = await pool.execute(
            `
            SELECT

                u.id,

                u.role_id,

                u.first_name,

                u.last_name,

                u.email,

                u.phone,

                u.avatar_url,

                u.status,

                u.last_login_at,

                u.created_at,

                u.updated_at,

                r.name AS role

            FROM users u

            LEFT JOIN roles r
                ON r.id = u.role_id

            WHERE u.id = ?

            LIMIT 1
            `,
            [Number(userId)]
        );


        // =================================================
        // USER NOT FOUND
        // =================================================

        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found",

            });

        }


        const user = users[0];


        // =================================================
        // CHECK USER STATUS
        // =================================================

        if (user.status !== "active") {

            return res.status(403).json({

                success: false,

                message:
                    "User account is not active",

            });

        }


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            data: {

                id:
                    Number(user.id),

                roleId:
                    Number(user.role_id),

                firstName:
                    user.first_name,

                lastName:
                    user.last_name,

                email:
                    user.email,

                phone:
                    user.phone,

                avatarUrl:
                    user.avatar_url,

                status:
                    user.status,

                role:
                    user.role,

                lastLoginAt:
                    user.last_login_at,

                createdAt:
                    user.created_at,

                updatedAt:
                    user.updated_at,

            },

        });

    } catch (error) {

        console.error(
            "Get current user error:",
            error
        );

        next(error);

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    login,

    getMe,

};