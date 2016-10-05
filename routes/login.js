let express = require('express'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    app = require('../app'),
    config = require('../config'),
    router = express.Router();
/* GET about listing. */
router.get('/', function(req, res) {
    User.findOne({
        token: req.cookies.token
        },
        function(err, user){
        if (!user)
            res.render('login', { title: 'login' });
        else
            res.redirect('profile');
    });
});

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
        res.render('profile', {'user': user});
    });
});

module.exports = router;