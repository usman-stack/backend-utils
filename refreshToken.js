const JWT = require('jsonwebtoken');
const constant = require('../constants/ConstantMessages');

module.exports = async (req, res, next) => {
    try {
        let token = req.headers['authorization']
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ msg: constant.TOKEN_ERR });
        }
        var accessToken = token.split(' ')[1];
        req.accessToken = accessToken;
        let secret;
        process.env.NODE_ENV === 'production' ? secret = process.env.jwtSecret : secret = 'secret';
        const decoded = JWT.verify(accessToken, secret);
        if (decoded) {
            return res.status(444).json({ msg: constant.TOKEN_NOT_EXPIRE });
        } else {
            return res.status(401).json({ msg: constant.TOKEN_INVALID })
        }
    } catch (error) {
        if (error.name && error.name == constant.JWTERROR) {
            req.token = JWT.decode(accessToken);
            next()
        } else {
            res.status(500).json({ msg: error.message })
        }
    }
};