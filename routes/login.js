let express = require('express'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    router = express.Router();

/* GET about listing. */
router.get('/', function(req, res) {
  res.render('login', { title: 'login' });
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
            let token = jwt.sign({username: user.username}, user.salt, {
                expiresIn: 60 * 60 * 24});// expires in 24 hours
            user.update({token :token
            }).exec();
            res.cookie('token', token, {maxAge: 60 * 60 * 24});
        }
        else{
            result = 'Unsuccessful';
        }
        res.render('login', {title: 'login', message: result});
    });
});

module.exports = router;