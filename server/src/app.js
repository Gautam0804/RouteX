const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/auth.routes");
const shipmentRoutes = require("./routes/shipment.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const driverRoutes = require("./routes/driver.routes");
const customerRoutes = require("./routes/customer.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const trackingRoutes = require("./routes/tracking.routes");
const alertRoutes = require("./routes/alert.routes");
const auditRoutes = require("./routes/audit.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const userRoutes = require("./routes/user.routes");

// =====================================================
// CREATE EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// SECURITY
// =====================================================

app.use(helmet());

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://routex-peach.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without an Origin header
            // Example: Postman, server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,
    })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true,
    })
);

// =====================================================
// HEALTH CHECK
// GET /api/health
// =====================================================

app.get(
    "/api/health",
    (req, res) => {

        return res.status(200).json({

            success: true,

            message:
                "RouteX API is running",

            timestamp:
                new Date().toISOString(),

        });

    }
);

// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use(
    "/api/auth",
    authRoutes
);

// Shipments
app.use(
    "/api/shipments",
    shipmentRoutes
);

// Vehicles
app.use(
    "/api/vehicles",
    vehicleRoutes
);

// Drivers
app.use(
    "/api/drivers",
    driverRoutes
);

// Customers
app.use(
    "/api/customers",
    customerRoutes
);

// Assignments
app.use(
    "/api/assignments",
    assignmentRoutes
);

// Tracking
app.use(
    "/api/tracking",
    trackingRoutes
);

// Alerts
app.use(
    "/api/alerts",
    alertRoutes
);

// Audit Logs
app.use(
    "/api/audit-logs",
    auditRoutes
);

// Dashboard
app.use(
    "/api/dashboard",
    dashboardRoutes
);

// Users
app.use(
    "/api/users",
    userRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use(
    (req, res) => {

        return res.status(404).json({

            success: false,

            message:
                "API endpoint not found",

            path:
                req.originalUrl,

        });

    }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Global Error:",
            error
        );

        const statusCode =
            error.statusCode ||
            error.status ||
            500;

        return res.status(statusCode).json({

            success: false,

            message:
                error.message ||
                "Internal server error",

            ...(process.env.NODE_ENV === "development" && {
                error: error.message,
                stack: error.stack,
            }),

        });

    }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = app;