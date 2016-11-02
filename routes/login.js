let express = require('express'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    config = require('../config'),
    load_user = require('../middleware/load_user'),
    load_menu = require('../middleware/load_menu'),
    load_rooms = require('../middleware/load_rooms'),
    router = express.Router(),
    utils = require('../utils');
/* GET login method */
router.get('/', load_user, load_menu, load_rooms, function(req, res) {
    if (!req.user) {
        res.render('login', {
                    menuItems: req.menuItems,
                    rooms: req.rooms,
                    isLogin: false});
    } else {
        res.redirect('./profile');
    }
});
/* POST method */
router.post('/', function(req, res){
    let result = 'Successful';
    User.findOne({
        username: req.body.login
    }, function(err, user) {
        if(!err) {
            if (!user) {
                result = 'Unsuccessful';
            }
            else if (user.checkPassword(req.body.password)) {
                let token = jwt.sign({username: user.username}, config.secret, {
                    expiresIn: 60 * 60 * 24});// expires in 24 hours
                user.update({
                    token :token
                }).exec();
                res.cookie('token', token);
            }
            else{
                result = 'Unsuccessful';
            }
            res.redirect('./profile');
        } else {
            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with username - ${req.body.login}. Error message: ${err}.`);
            res.render('error', err);
        }
    });
});

module.exports = router;