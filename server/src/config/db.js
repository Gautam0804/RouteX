const mysql = require("mysql2/promise");

// =====================================================
// MYSQL CONNECTION POOL
// =====================================================

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

// =====================================================
// TEST DATABASE CONNECTION
// =====================================================

async function testDatabaseConnection() {
    let connection;

    try {
        connection = await pool.getConnection();

        await connection.ping();

        console.log("MySQL database connected successfully");
    } catch (error) {
        console.error(
            "MySQL database connection failed:",
            error.message
        );

        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// =====================================================
// CLOSE DATABASE
// =====================================================

async function closeDatabaseConnection() {
    try {
        await pool.end();

        console.log(
            "MySQL database connection pool closed"
        );
    } catch (error) {
        console.error(
            "Error closing MySQL connection:",
            error.message
        );

        throw error;
    }
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    pool,
    testDatabaseConnection,
    closeDatabaseConnection,
};