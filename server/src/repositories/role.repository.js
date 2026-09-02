const { pool } = require("../config/database");

async function findRoleByName(name) {
    const [rows] = await pool.execute(
        `
        SELECT id, name, description
        FROM roles
        WHERE name = ?
        LIMIT 1
        `,
        [name]
    );

    return rows[0] || null;
}

async function getAllRoles() {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            description,
            created_at
        FROM roles
        ORDER BY id ASC
        `
    );

    return rows;
}

module.exports = {
    findRoleByName,
    getAllRoles,
};