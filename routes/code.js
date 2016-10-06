/**/
let express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    Room = require('../models/room'),
    load_user = require('../middleware/load_user');
/*GET method of code route*/    
router.get('/', load_user, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            throw err;
                        } else {
                            Room.find({}, function(err, rooms) {
                                        if(err) {
                                            throw err;
                                        } else {
                                        // TODO: do this like compare
                                            Room.find({
                                                    company: user.company
                                                }, function(err, ourRooms) {
                                                        if(err) {
                                                            throw err;
                                                        } else {
                                                            res.render('code', {
                                                                                user: user,
                                                                                rooms: rooms,
                                                                                ourRooms: ourRooms,
                                                                                isLogin: true
                                                                                });
                                                        }
                                                    });
                                        }
                                    });
                        }
                    });
        } else {
            res.redirect('/login');
        }
    });
// Export route
module.exports = router;