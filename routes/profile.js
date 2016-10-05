let express = require('express'),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    app = require('../app'),
    token_check = require('../middleware/token_check'),
    utils = require('../utils'),  
    router = express.Router();
    
router.use(token_check.token_check);

router.get('/', function(req, res) {
    utils.utils('tokenVerifity', req.cookies.token).then(result=>{
        if(result) {
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
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });
});

module.exports = router;