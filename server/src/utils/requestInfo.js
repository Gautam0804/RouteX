const getRequestInfo = (req) => {

    return {

        userId:
            req.user?.sub || null,

        ipAddress:
            req.ip ||
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            null,

        userAgent:
            req.headers["user-agent"] ||
            null,

    };

};


module.exports = {
    getRequestInfo,
};