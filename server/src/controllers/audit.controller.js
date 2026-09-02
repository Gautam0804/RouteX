const { pool } = require("../config/database");


// =====================================================
// CREATE AUDIT LOG
// POST /api/audit-logs
// =====================================================

const createAuditLog = async (req, res, next) => {

    try {

        const {
            action,
            entityType,
            entityId,
            oldValues,
            newValues,
        } = req.body || {};


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!action) {

            return res.status(400).json({
                success: false,
                message: "Action is required",
            });

        }


        if (!entityType) {

            return res.status(400).json({
                success: false,
                message: "Entity type is required",
            });

        }


        // ==========================================
        // USER INFORMATION
        // ==========================================

        const userId =
            req.user?.sub || null;

        const ipAddress =
            req.ip ||
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            null;

        const userAgent =
            req.headers["user-agent"] ||
            null;


        // ==========================================
        // INSERT AUDIT LOG
        // ==========================================

        const [result] = await pool.execute(
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

            VALUES (
                ?, ?, ?, ?,
                ?, ?, ?, ?
            )
            `,
            [
                userId,
                action,
                entityType,
                entityId ?? null,

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


        return res.status(201).json({

            success: true,

            message:
                "Audit log created successfully",

            data: {
                id: result.insertId,
            },

        });

    } catch (error) {

        next(error);

    }

};


// =====================================================
// GET ALL AUDIT LOGS
// GET /api/audit-logs
// =====================================================

const getAuditLogs = async (
    req,
    res,
    next
) => {

    try {

        const [logs] = await pool.execute(
            `
            SELECT

                a.id,

                a.user_id,

                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS user_name,

                u.email AS user_email,

                a.action,

                a.entity_type,

                a.entity_id,

                a.old_values,

                a.new_values,

                a.ip_address,

                a.user_agent,

                a.created_at

            FROM audit_logs a

            LEFT JOIN users u
                ON a.user_id = u.id

            ORDER BY
                a.created_at DESC
            `
        );


        return res.status(200).json({

            success: true,

            data: logs,

        });

    } catch (error) {

        next(error);

    }

};


// =====================================================
// GET AUDIT LOG BY ID
// GET /api/audit-logs/:id
// =====================================================

const getAuditLogById = async (
    req,
    res,
    next
) => {

    try {

        const { id } = req.params;


        const [logs] = await pool.execute(
            `
            SELECT

                a.id,

                a.user_id,

                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ) AS user_name,

                u.email AS user_email,

                a.action,

                a.entity_type,

                a.entity_id,

                a.old_values,

                a.new_values,

                a.ip_address,

                a.user_agent,

                a.created_at

            FROM audit_logs a

            LEFT JOIN users u
                ON a.user_id = u.id

            WHERE a.id = ?

            LIMIT 1
            `,
            [id]
        );


        if (logs.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Audit log not found",

            });

        }


        return res.status(200).json({

            success: true,

            data: logs[0],

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {

    createAuditLog,
    getAuditLogs,
    getAuditLogById,

};