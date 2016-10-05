let express = require('express'),
    User = require('../models/user'),
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
        if (user.checkPassword(req.body.password)) {
            res.cookie('token', user.token, {maxAge: 60 * 60 * 24});
        }
        else{
            result = 'Unsuccessful';
        }
        res.render('login', {title: 'login', message: result});
    });
});

module.exports = router;