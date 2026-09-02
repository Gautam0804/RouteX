const bcrypt = require("bcryptjs");

const userRepository = require(
    "../repositories/user.repository"
);

const roleRepository = require(
    "../repositories/role.repository"
);

const {
    generateAccessToken,
} = require("../utils/jwt");

async function login(email, password) {

    const user =
        await userRepository.findUserByEmail(
            email
        );

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    if (user.status !== "active") {
        throw new Error(
            "Your account is not active"
        );
    }

    const passwordMatches =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    if (!passwordMatches) {
        throw new Error(
            "Invalid email or password"
        );
    }

    await userRepository.updateLastLogin(
        user.id
    );

    const token =
        generateAccessToken(user);

    return {
        token,

        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            role: user.role_name,
        },
    };
}

async function register({
    firstName,
    lastName,
    email,
    password,
    phone,
    role = "dispatcher",
}) {

    const existingUser =
        await userRepository.findUserByEmail(
            email
        );

    if (existingUser) {
        throw new Error(
            "Email is already registered"
        );
    }

    const roleRecord =
        await roleRepository.findRoleByName(
            role
        );

    if (!roleRecord) {
        throw new Error(
            "Invalid role"
        );
    }

    const passwordHash =
        await bcrypt.hash(
            password,
            12
        );

    const userId =
        await userRepository.createUser({
            roleId: roleRecord.id,
            firstName,
            lastName,
            email,
            passwordHash,
            phone,
        });

    return userRepository.findUserById(
        userId
    );
}

module.exports = {
    login,
    register,
};