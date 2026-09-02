const {
    body,
} = require("express-validator");

const loginValidator = [

    body("email")
        .trim()
        .isEmail()
        .withMessage(
            "Valid email is required"
        )
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage(
            "Password is required"
        ),
];


const registerValidator = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage(
            "First name is required"
        ),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage(
            "Last name is required"
        ),

    body("email")
        .trim()
        .isEmail()
        .withMessage(
            "Valid email is required"
        )
        .normalizeEmail(),

    body("password")
        .isLength({
            min: 8,
        })
        .withMessage(
            "Password must contain at least 8 characters"
        ),

    body("phone")
        .optional()
        .trim(),

    body("role")
        .optional()
        .isIn([
            "super_admin",
            "fleet_manager",
            "dispatcher",
            "driver",
        ])
        .withMessage(
            "Invalid role"
        ),
];

module.exports = {
    loginValidator,
    registerValidator,
};