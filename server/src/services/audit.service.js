const { pool } = require("../config/database");

const createAuditLog = async ({
    userId = null,
    action,
    entityType,
    entityId = null,
    oldValues = null,
    newValues = null,
    ipAddress = null,
    userAgent = null,
}) => {

    try {

        await pool.execute(
            `
            INSERT INTO audit_logs (
                user_id,
                action,
                entity_type,
                entity_id,
                old_values,
                new_values,
                ip_address,
                user_agent
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                userId,
                action,
                entityType,
                entityId,
                oldValues
                    ? JSON.stringify(oldValues)
                    : null,
                newValues
                    ? JSON.stringify(newValues)
                    : null,
                ipAddress,
                userAgent,
            ]
        );

    } catch (error) {

        console.error(
            "Audit log error:",
            error.message
        );

    }
};

module.exports = {
    createAuditLog,
};