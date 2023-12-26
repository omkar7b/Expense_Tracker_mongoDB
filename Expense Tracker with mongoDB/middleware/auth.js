const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        const decoded = jwt.verify(token, 'secretkey');
       // console.log('>>>',decoded);
        const user = await User.findById(decoded.userId);
            req.user = user;
            next();
       // console.log('>>',req.user);
    } catch(err) {
        console.log('error at authentication>>',err);
        return res.Status(401).json({success: false})
    }
}

module.exports = {
    authenticate
}