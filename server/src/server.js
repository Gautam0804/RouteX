require("dotenv").config();

const app = require("./app");

const {
    testDatabaseConnection,
} = require("./config/db");

const PORT = Number(
    process.env.PORT || 5000
);


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

    try {

        // =================================================
        // TEST DATABASE CONNECTION
        // =================================================

        await testDatabaseConnection();


        // =================================================
        // START EXPRESS SERVER
        // =================================================

        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log("");

                console.log(
                    "======================================"
                );

                console.log(
                    "       ROUTEX FLEET OPERATIONS"
                );

                console.log(
                    "======================================"
                );

                console.log(
                    `Environment : ${
                        process.env.NODE_ENV ||
                        "development"
                    }`
                );

                console.log(
                    `Server      : http://localhost:${PORT}`
                );

                console.log(
                    `Health      : http://localhost:${PORT}/api/health`
                );

                console.log(
                    "======================================"
                );

                console.log("");

            }
        );

    } catch (error) {

        console.error(
            "Failed to start RouteX server."
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}


// =====================================================
// RUN SERVER
// =====================================================

startServer();