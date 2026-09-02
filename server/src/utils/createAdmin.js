require("dotenv").config();

const bcrypt = require("bcryptjs");

const {
    pool,
} = require("../config/database");


async function createAdmin() {

    const password =
        "Admin@12345";

    const passwordHash =
        await bcrypt.hash(
            password,
            12
        );

    const [roles] =
        await pool.execute(
            `
            SELECT id
            FROM roles
            WHERE name = 'super_admin'
            LIMIT 1
            `
        );

    if (!roles.length) {

        throw new Error(
            "super_admin role does not exist"
        );
    }

    const roleId =
        roles[0].id;


    const [existing] =
        await pool.execute(
            `
            SELECT id
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [
                "admin@routex.com",
            ]
        );


    if (existing.length) {

        console.log(
            "Admin user already exists."
        );

        await pool.end();

        return;
    }


    await pool.execute(
        `
        INSERT INTO users
        (
            role_id,
            first_name,
            last_name,
            email,
            password_hash,
            phone,
            status
        )
        VALUES
        (?, ?, ?, ?, ?, ?, 'active')
        `,
        [
            roleId,
            "Admin",
            "Manager",
            "admin@routex.com",
            passwordHash,
            "+91-9000000000",
        ]
    );


    console.log(
        "Admin user created successfully."
    );

    console.log(
        "Email: admin@routex.com"
    );

    console.log(
        "Password: Admin@12345"
    );

    await pool.end();
}


createAdmin()
    .catch(async (error) => {

        console.error(
            "Failed to create admin:",
            error.message
        );

        await pool.end();

        process.exit(1);
    });