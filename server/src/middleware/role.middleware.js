// =====================================================
// ROLE AUTHORIZATION MIDDLEWARE
// =====================================================

const requireRoles = (...allowedRoles) => {

    return (req, res, next) => {

        try {

            // ---------------------------------------------
            // CHECK AUTHENTICATION
            // ---------------------------------------------

            if (!req.user) {

                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });

            }


            // ---------------------------------------------
            // GET USER ROLE
            // ---------------------------------------------

            const userRole = req.user.role;


            // ---------------------------------------------
            // CHECK ROLE
            // ---------------------------------------------

            if (!allowedRoles.includes(userRole)) {

                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to perform this action",
                });

            }


            // ---------------------------------------------
            // ACCESS GRANTED
            // ---------------------------------------------

            next();

        } catch (error) {

            next(error);

        }

    };

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    requireRoles,
};