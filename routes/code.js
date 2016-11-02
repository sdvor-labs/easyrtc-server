/**/
let express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    Room = require('../models/room'),
    load_user = require('../middleware/load_user'),
    load_menu = require('../middleware/load_menu'),
    load_rooms = require('../middleware/load_rooms'),
    utils = require('../utils.js');
/*GET method of code route*/    
router.get('/', load_user, load_menu, load_rooms, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                                utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document USER with token ${req.cookies.token}. Error message: ${err}.`);
                                res.render('error', err);
                        } else {
                                // TODO: do this like compare
                                Room.find({
                                        company: user.company
                                }, function(err, ourRooms) {
                                        if(err) {
                                                utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document type ROOMS with id ${user.company}. Error message: ${err}.`);   
                                                res.render('error', err);
                                        } else {
                                                res.render('code', {
                                                        user: user,
                                                        rooms: req.rooms,
                                                        ourRooms: ourRooms,
                                                        menuItems: req.menuItems,
                                                        isLogin: true
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