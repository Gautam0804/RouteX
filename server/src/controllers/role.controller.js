const roleRepository = require(
    "../repositories/role.repository"
);

async function getRoles(
    req,
    res,
    next
) {

    try {

        const roles =
            await roleRepository.getAllRoles();

        res.status(200).json({
            success: true,
            data: roles,
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getRoles,
};