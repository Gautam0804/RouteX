const express = require("express");

const {
    getRoles,
} = require(
    "../controllers/role.controller"
);

const {
    authenticate,
    authorize,
} = require(
    "../middleware/auth.middleware"
);

const router =
    express.Router();


router.get(
    "/",
    authenticate,
    authorize("super_admin"),
    getRoles
);


module.exports = router;