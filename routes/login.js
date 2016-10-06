let express = require('express'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    app = require('../app'),
    config = require('../config'),
    load_user = require('../middleware/load_user');
    router = express.Router();
/* GET login method */
router.get('/', load_user, function(req, res) {
    if (!req.user){
        res.render('login', {title: 'login'});
    }
        else
            res.redirect('./profile');
});
/* POST method */
router.post('/', function(req, res){
    let result = 'Successful';
    User.findOne({
        username: req.body.login
    }, function(err, user) {
        if (!user) {
            result = 'Unsuccessful';
        }
        else if (user.checkPassword(req.body.password)) {
            let token = jwt.sign({username: user.username}, config.secret, {
                expiresIn: 60 * 60 * 24});// expires in 24 hours
            user.update({token :token
            }).exec();
            res.cookie('token', token);
        }
        else{
            result = 'Unsuccessful';
        }
        res.redirect('./profile');
    });
});

module.exports = router;