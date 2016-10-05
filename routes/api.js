let express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    app = require('../app'),
    token_check = require('../middleware/token_check'),
    utils = require('../utils'),
    User = require('../models/user');

// route to show a random message (GET http://localhost:8080/api/)
router.use(utils.unless_route('/authenticate/', token_check.token_check));

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});


router.post('/authenticate', function(req, res) {

    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.checkPassword(req.body.password)) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                    // if user is found and password is right
                    // create a token
                let token = jwt.sign({username: user.username}, user.salt, {
                    expiresIn: 60 * 60 * 24});// expires in 24 hours
                    user.update({token :token
                    }).exec();
                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});
module.exports = router;
