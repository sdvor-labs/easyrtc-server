// check header or url parameters or post parameters for token
let User = require('../models/user'),
    jwt = require('jsonwebtoken');

let token_check = function (req, res, next) {


    let token = req.body.token || req.query.token || req.cookies.get('token') || req.headers['x-access-token'];

// decode token
    if (token) {
        let user = User.findOne({
            token: token
        }, function (err, user) {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            }
            // verifies secret and checks exp
            jwt.verify(token, user.salt, function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        });
    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

};

exports.token_check = token_check;