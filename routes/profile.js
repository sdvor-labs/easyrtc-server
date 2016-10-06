let express = require('express'),
    User = require('../models/user'),
//    token_check = require('../middleware/token_check'),
    load_user = require('../middleware/load_user'),
    Room = require('../models/room'),
    Company = require('../models/company'),
    router = express.Router();
    
//router.use(token_check.token_check);
router.get('/', load_user, function(req, res) {
    if(req.user) {
        User.findOne({
            token: req.cookies.token
        }, function (err, user) {
                if(err) {
                    throw err;
                } else {
                    if (!user){
                        res.redirect('login');
                    } else {
                        Room.find({}, function(err, findedRooms){
                                if(err) {
                                    throw err;
                                } else {
                                    Company.findOne({'_id': user.company}, function(err, company) {
                                            if(err) {
                                                throw err;
                                            } else {
                                                res.render('profile', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        company: company,
                                                                        isLogin: true});   
                                            }
                                        });
                                }
                            });
                    };
                }
            });
        } else {
            res.redirect('/login');
        }
});
// User settings
router.get('/settings', load_user, function(req, res) {
    if(req.user) {
        User.findOne({
            token: req.cookies.token
        }, function (err, user) {
                if(err) {
                    throw err;
                } else {
                    if (!user){
                        res.redirect('login');
                    } else {
                        Room.find({}, function(err, findedRooms){
                                if(err) {
                                    throw err;
                                } else {
                                    Company.findOne({'_id': user.company}, function(err, company) {
                                            if(err) {
                                                throw err;
                                            } else {
                                                res.render('worker-settings', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        company: company,
                                                                        isLogin: true,
                                                                        isSaved: null});   
                                            }
                                        });
                                }
                            });
                    };
                }
            });
        } else {
            res.redirect('/login');
        }
});
router.post('/settings', load_user, function(req, res){
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            
                            throw err;
                        } else {
                            Room.find({}, function(err, findedRooms) {
                                if(err) {
                                    throw err;
                                } else {
                                    user.name = req.body.name;
                                    user.surname = req.body.surname;
                                    user.lastname = req.body.lastname;
                                    user.save(function(err) {
                                    if(err) { 
                                        res.render('worker-settings', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        isLogin: true,
                                                                        isSaved: false});
                                    } else {
                                        res.render('worker-settings', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        isLogin: true,
                                                                        isSaved: true});
                                    }});
                                }
                            });
                        }
                });
        } else {
            res.redirect('/login');
        }
    });

module.exports = router;