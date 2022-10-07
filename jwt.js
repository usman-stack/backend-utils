const JWT = require('jsonwebtoken');
const User = require('../models/User');
const constant = require('../constants/ConstantMessages');

module.exports = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({
                status: false,
                message: constant.TOKEN_ERR
            });
        }
        let accessToken = token.split(' ')[1];
        let decoded = JWT.verify(accessToken, process.env.JWT_SECRET);
        // console.log("DECODED:::", new Date(decoded.lastLogin).toString());
        // console.log("DECODED ID:::", decoded);
        let user = await User.findOne({
            _id: decoded.id,
            tokenStatus: true,
            lastLogin: new Date(decoded.lastLogin).toString()
        });
        // console.log("User:::", user);
        if (!user) {
            return res.status(401).send({
                status: false,
                message: constant.UNAUTH
            })
        }
        req.token = decoded;
        req.user = user;
        next();
    } catch (exception) {
        if (exception.name === constant.JWTERROR) {
            return res.status(501).json({
                isTokenExpire: true,
                status: false,
                message: constant.SESSION_EXPIRED
            });
        }
        return res.status(401).json({
            isTokenExpire: false,
            status: false,
            message: exception.message
        });
    }
};