let express = require('express'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    app = require('../app'),
    token_check = require('../middleware/token_check'),
    router = express.Router();
router.use(token_check.token_check);

router.get('/', function(req, res) {
    User.findOne({
        username: req.decoded.username
    }, function (err, user) {
        if (!user){
            res.redirect('login');
        }
        else {
            res.render('profile', {'user': user});
        };
    });
});

module.exports = router;