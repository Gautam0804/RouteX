const { pool } = require("../config/database");

async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        `
        SELECT
            u.id,
            u.role_id,
            u.first_name,
            u.last_name,
            u.email,
            u.password_hash,
            u.phone,
            u.avatar_url,
            u.status,
            u.last_login_at,
            r.name AS role_name
        FROM users u
        INNER JOIN roles r
            ON u.role_id = r.id
        WHERE u.email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows[0] || null;
}

async function findUserById(id) {
    const [rows] = await pool.execute(
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
            r.name AS role_name
        FROM users u
        INNER JOIN roles r
            ON u.role_id = r.id
        WHERE u.id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
}

async function createUser({
    roleId,
    firstName,
    lastName,
    email,
    passwordHash,
    phone,
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO users
        (
            role_id,
            first_name,
            last_name,
            email,
            password_hash,
            phone
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            roleId,
            firstName,
            lastName,
            email,
            passwordHash,
            phone || null,
        ]
    );

    return result.insertId;
}

async function updateLastLogin(userId) {
    await pool.execute(
        `
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = ?
        `,
        [userId]
    );
}

async function getAllUsers() {
    const [rows] = await pool.execute(
        `
        SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.status,
            u.last_login_at,
            r.name AS role_name,
            u.created_at
        FROM users u
        INNER JOIN roles r
            ON u.role_id = r.id
        ORDER BY u.created_at DESC
        `
    );

    return rows;
}

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updateLastLogin,
    getAllUsers,
};