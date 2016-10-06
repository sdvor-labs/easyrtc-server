let User = require('../models/user');

function loadUser(req, res, next) {
    let token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];
    User.findOne({
        token: token
    }, function (err, user) {
        if (user) {
            req.user = user;
            next();
        } else {
            req.user = undefined;
            next();
        }
    });
};

module.exports = loadUser;