let express = require('express'),
    User = require('../models/user'),
//    token_check = require('../middleware/token_check'),
    load_user = require('../middleware/load_user'),
    Room = require('../models/room'),
    Company = require('../models/company'),
    UserType = require('../models/user_type'),
    UserStatus = require('../models/user_status'),
    router = express.Router(),
    utils = require('../utils');
//router.use(token_check.token_check);
router.get('/', load_user, function(req, res) {
    if(req.user) {
        User.findOne({
            token: req.cookies.token
        }, function (err, user) {
                if(err) {
                    utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                    res.render('error', {
                            error: err
                        });
                } else {
                    if (!user){
                        res.redirect('login');
                    } else {
                        Room.find({}, function(err, findedRooms){
                                if(err) {
                                    utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document type ROOM (${req.params.room_name}). Error message: ${err}.`);
                                    res.render('error', {
                                            error: err
                                        });
                                } else {
                                    Company.findOne({'_id': user.company}, function(err, company) {
                                            if(err) {
                                                utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding document type COMPANY with ID(${user.company}). Error message: ${err}.`);
                                                res.render('error', {
                                                        error: err
                                                    });
                                            } else {
                                                res.render('profile', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        company: company,
                                                                        isLogin: true,
                                                                        isActive: 'profile'});   
                                            }
                                        });
                                }
                            });
                    }
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
                    utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                    res.render('error', {
                            error: err
                        });
                } else {
                    if (!user){
                        res.redirect('login');
                    } else {
                        Room.find({}, function(err, findedRooms){
                                if(err) {
                                    utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document type ROOM (${req.params.room_name}). Error message: ${err}.`);
                                    res.render('error', {
                                            error: err
                                        });
                                } else {
                                    Company.findOne({'_id': user.company}, function(err, company) {
                                            if(err) {
                                                utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding document type COMPANY with ID(${user.company}). Error message: ${err}.`);
                                                res.render('error', {
                                                        error: err
                                                    });
                                            } else {
                                                res.render('worker-settings', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        company: company,
                                                                        isLogin: true,
                                                                        isSaved: null,
                                                                        isActive: 'settings'});   
                                            }
                                        });
                                }
                            });
                    }
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
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                                    error: err
                                                });
                        } else {
                            Room.find({}, function(err, findedRooms) {
                                if(err) {
                                    utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document type ROOM (${req.params.room_name}). Error message: ${err}.`);
                                    res.render('error', {
                                                            error: err
                                                        });
                                } else {
                                    user.name = req.body.name;
                                    user.surname = req.body.surname;
                                    user.lastname = req.body.lastname;
                                    user.save(function(err) {
                                    if(err) {
                                        utils.appLogger('fail', 'Fail editing record (user)', `Fail, when app try save editing object USER (${user}). Error message: ${err}.`);
                                        res.render('worker-settings', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        isLogin: true,
                                                                        isSaved: false,
                                                                        isActive: 'settings'});
                                    } else {
                                        utils.appLogger('success', 'Success finding document (room)', `Success save editin document USER(${user}).`);
                                        res.render('worker-settings', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        isLogin: true,
                                                                        isSaved: true,
                                                                        isActive: 'settings'});
                                    }});
                                }
                            });
                        }
                });
        } else {
            res.redirect('/login');
        }
    });
// Create company
router.get('/create-company', load_user, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                    error: err
                                });
                        } else { 
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms) {
                                    if(err) {
                                        utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document type ROOM (${req.params.room_name}). Error message: ${err}.`);
                                        res.render('error', {
                                                                error: err
                                                            });
                                    } else {
                                        res.render('create-company', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        isLogin: true,
                                                                        isSaved: null,
                                                                        isActive: 'create-company'});
                                    }
                                });
                            } else {
                                res.redirect('/profile')
                            }
                        }
                    });
        } else {
            res.redirect('/login');
        }
    });
router.post('/create-company', load_user, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                    if(err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                        res.render('error', {
                                error: err
                            });
                    } else {
                        if(user.admin === true ){
                            Room.find({}, function(err, findedRooms) {
                                    if(err) {
                                        utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document type ROOM (${req.params.room_name}). Error message: ${err}.`);
                                        res.render('error', {
                                                error: err
                                            });
                                    } else {            
                                        let companyToCreate = Company({
                                        name: req.body.name,
                                        address: req.body.address,
                                        site: req.body.site });
                                        Company.findOne({
                                                name: companyToCreate.name
                                            }, function(err, company) {
                                                if(err) {
                                                    utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding document type COMPANY (${companyToCreate}). Error message: ${err}.`);
                                                    res.render('error', {
                                                            error: err
                                                        });
                                                } else {
                                                    if(company === null) {
                                                        companyToCreate.save(function(err) {
                                                                if(err) {
                                                                    utils.appLogger('fail', 'Fail adding document (company)', `Fail, when app try adding document type COMPANY (${companyToCreate}). Error message: ${err}.`);
                                                                    res.render('create-company', {
                                                                            user: user,
                                                                            rooms: findedRooms,
                                                                            isLogin: true,
                                                                            isSaved: false,
                                                                            isActive: 'create-company'
                                                                        });
                                                                } else {
                                                                    utils.appLogger('succcess', 'Succes adding document (company)', `Success adding document type ROOM (${companyToCreate}).`);
                                                                    res.render('create-company', {
                                                                            user: user,
                                                                            rooms: findedRooms,
                                                                            isLogin: true,
                                                                            isSaved: true,
                                                                            isActive: 'create-company'
                                                                        });
                                                                }
                                                            });
                                                    } else {
                                                        utils.appLogger('fail', 'Fail adding document (company)', `Fail, when app try adding document type COMPANY (${req.params.room_name}). Company with this name created early`);
                                                         res.render('create-company', {
                                                                            user: user,
                                                                            rooms: findedRooms,
                                                                            isLogin: true,
                                                                            isSaved: false,
                                                                            isActive: 'create-company'
                                                                        });
                                                    }
                                                }
                                            });
                                    }
                                });
                        } else {
                            res.redirect('/profile');
                        }
                    }
                    });
        } else {
            res.redirect('/login');
        }
    });
// Create room
router.get('/create-room', load_user, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                    error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms) {
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                            res.render('error', {
                                                    error: err
                                                });
                                        } else {
                                            Company.find({}, function(err, companies) {
                                                    if(err) {
                                                        utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                                        res.render('error', {
                                                                error: err
                                                            });
                                                    } else {
                                                        res.render('create-room', {
                                                                user: user,
                                                                rooms: findedRooms,
                                                                companies: companies,
                                                                isLogin: true,
                                                                isSaved: null,
                                                                isActive: 'create-room'
                                                            });
                                                    }
                                                });
                                        }
                                    });
                            } else {
                                res.redirect('/profile');
                            }
                        }
                    });
        } else {
            res.redirect('/login');
        }
    });
router.post('/create-room', load_user, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                    if(err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                        res.render('error', {
                                error: err
                            });
                    } else {
                        if(user.admin === true) {
                            Room.find({}, function(err, findedRooms) {
                                    if(err) {
                                        utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                        res.render('error', {
                                                error: err
                                            });
                                    } else {
                                        Company.find({}, function(err, companies){
                                                if(err) {
                                                    utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                                    res.render('error', {
                                                            error: err
                                                        });
                                                } else {
                                                    
                                                    let roomToCreate = Room({
                                                            name: req.body.name,
                                                            label: req.body.label,
                                                        });
                                                    companies.forEach((e) => {
                                                            if(e.name === req.body.company) {
                                                                roomToCreate.company = e;
                                                            }
                                                        });
                                                    if(req.body.visiability === 'Внутреняя') {
                                                        roomToCreate.visiability = 'private';
                                                    } else {
                                                        roomToCreate.visiability = 'public';
                                                    }
                                                    Room.findOne({
                                                            name: roomToCreate.name
                                                        }, function(err, room){
                                                                if(err) {
                                                                    utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document ROOM(${roomToCreate}). Error message: ${err}.`);
                                                                    res.render('error', {
                                                                            error: err
                                                                        });
                                                                } else {
                                                                    if(room === null) {
                                                                        roomToCreate.save(function(err) {
                                                                            if(err) {
                                                                                utils.appLogger('fail', 'Fail adding document (room)', `Fail, when app try adding document type ROOM(${roomToCreate}). Error message: ${err}.`);
                                                                                res.render('create-room', {
                                                                                        user: user,
                                                                                        rooms: findedRooms,
                                                                                        companies: companies,
                                                                                        isLogin: true,
                                                                                        isSaved: false,
                                                                                        isActive: 'create-room'
                                                                                    });
                                                                            } else {
                                                                                utils.appLogger('success', 'Success adding document (room)', `Success adding document room(${roomToCreate}).`);
                                                                                res.render('create-room', {
                                                                                        user: user,
                                                                                        rooms: findedRooms,
                                                                                        companies: companies,
                                                                                        isLogin: true,
                                                                                        isSaved: true,
                                                                                        isActive: 'create-room'
                                                                                    });
                                                                            }
                                                                        });
                                                                    } else {
                                                                        utils.appLogger('fail', 'Fail adding document', `Fail, when app try adding document type ROOM with name ${roomToCreate.name}. This room alredy exist`);
                                                                        res.render('create-room', {
                                                                                        user: user,
                                                                                        rooms: findedRooms,
                                                                                        companies: companies,
                                                                                        isLogin: true,
                                                                                        isSaved: false,
                                                                                        isActive: 'create-room'
                                                                                    });
                                                                    }
                                                                }
                                                            });
                                                }
                                            });
                                    }
                                });
                        } else {
                            res.redirect('/profile');
                        }
                    }
                });
        } else {
            res.redirect('/login');
        }
    });
// Create user
router.get('/create-user', load_user, function(req, res){
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms){
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                            res.render('error', {
                                                error: err
                                                });                                        
                                        } else {
                                            Company.find({}, function(err, companies) {
                                                if(err) {
                                                    utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                                    res.render('error', {
                                                            error: err
                                                        });
                                                } else {
                                                    UserStatus.find({}, function(err, statuses){
                                                            if(err) {
                                                                utils.appLogger('fail', 'Fail finding document (user_status)', `Fail, when app try finding list all documents with type USER_STATUS. Error message: ${err}.`);
                                                                res.render('error', {
                                                                        error: err
                                                                    });
                                                            } else {
                                                                UserType.find({}, function(err, types) {
                                                                        if(err) {
                                                                            utils.appLogger('fail', 'Fail finding document (user_type)', `Fail, when app try finding list all documents with type USER_TYPE. Error message: ${err}.`);
                                                                            res.render('error', {
                                                                                    error: err
                                                                                });
                                                                        } else {
                                                                            res.render('create-user', {
                                                                                                        user: user,
                                                                                                        rooms: findedRooms,
                                                                                                        companies: companies,
                                                                                                        statuses: statuses,
                                                                                                        types: types,
                                                                                                        isLogin: true,
                                                                                                        isSaved: null,
                                                                                                        isActive: 'create-user'
                                                                                                    });
                                                                        }
                                                                    });
                                                            }
                                                        });
                                                }
                                            });
                                            
                                        }
                                    });
                            } else {
                                res.redirect('/profile');
                            }
                        }
                    });
        } else {
            res.redirect('/login');
        }
    });
// Create user
router.post('/create-user', load_user, function(req, res){
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms){
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                            res.render('error', {
                                                error: err
                                                });                                        
                                        } else {
                                            Company.find({}, function(err, companies) {
                                                if(err) {
                                                    utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                                    res.render('error', {
                                                            error: err
                                                        });
                                                } else {
                                                    UserStatus.find({}, function(err, statuses){
                                                            if(err) {
                                                                utils.appLogger('fail', 'Fail finding document (user_status)', `Fail, when app try finding list all documents with type USER_STATUS. Error message: ${err}.`);
                                                                res.render('error', {
                                                                        error: err
                                                                    });
                                                            } else {
                                                                UserType.find({}, function(err, types) {
                                                                        if(err) {
                                                                            utils.appLogger('fail', 'Fail finding document (user_type)', `Fail, when app try finding list all documents with type USER_TYPE. Error message: ${err}.`);
                                                                            res.render('error', {
                                                                                    error: err
                                                                                });
                                                                        } else {
                                                                            let userToCreate = User({
                                                                                name: req.body.name,
                                                                                surname: req.body.surname,
                                                                                lastname: req.body.lastname,
                                                                                username: req.body.username,
                                                                                admin: false,
                                                                                location: req.body.location,
                                                                                mobile: req.body.mobile,
                                                                                created_at: Date.now(),
                                                                                last_online: null,
                                                                                updated_at: null,
                                                                                token: null,
                                                                                additional_info: req.body.additional_info
                                                                            });
                                                                            statuses.forEach((s) => {
                                                                                if(s.name === 'Офлайн') {
                                                                                    userToCreate.status = s;
                                                                                }
                                                                            });
                                                                            types.forEach((t) => {
                                                                                if(t.name === req.body.user_type) {
                                                                                    userToCreate.user_type = t;
                                                                                }
                                                                            });
                                                                            companies.forEach((c) => {
                                                                                    if(c.name === req.body.company) {
                                                                                        userToCreate.company = c;
                                                                                    }
                                                                                });
                                                                            if(req.body.password === req.body.password1) {
                                                                                userToCreate.password = req.body.password;
                                                                            } else {
                                                                                utils.appLogger('fail', 'Fail adding document (user)', `Fail, when app try adding document with type USER (${userToCreate}). Passwords is similar`);
                                                                                res.render('create-user', {
                                                                                                        user: user,
                                                                                                        rooms: findedRooms,
                                                                                                        companies: companies,
                                                                                                        statuses: statuses,
                                                                                                        types: types,
                                                                                                        isLogin: true,
                                                                                                        isSaved: false,
                                                                                                        isActive: 'create-user'
                                                                                                    });
                                                                            }
                                                                            userToCreate.save(function(err){
                                                                                    if(err) {
                                                                                        utils.appLogger('fail', 'Fail adding document (user)', `Fail, when app try adding document with type USER (${userToCreate}). Error message: ${err}.`);
                                                                                        res.render('create-user', {
                                                                                                        user: user,
                                                                                                        rooms: findedRooms,
                                                                                                        companies: companies,
                                                                                                        statuses: statuses,
                                                                                                        types: types,
                                                                                                        isLogin: true,
                                                                                                        isSaved: false,
                                                                                                        isActive: 'create-user'
                                                                                                    });
                                                                                    } else {
                                                                                        utils.appLogger('success', 'Success adding document (user)', `Success adding document with type USER (${userToCreate}).`);
                                                                                        res.render('create-user', {
                                                                                                        user: user,
                                                                                                        rooms: findedRooms,
                                                                                                        companies: companies,
                                                                                                        statuses: statuses,
                                                                                                        types: types,
                                                                                                        isLogin: true,
                                                                                                        isSaved: true,
                                                                                                        isActive: 'create-user'
                                                                                                    });
                                                                                    }
                                                                                });
                                                                        }
                                                                    });
                                                            }
                                                        });
                                                }
                                            });
                                            
                                        }
                                    });
                            } else {
                                res.redirect('/profile');
                            }
                        }
                    });
        } else {
            res.redirect('/login');
        }
    });
// Companies
router.get('/companies', load_user,function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms){
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                            res.render('error', {
                                                error: err
                                                });                                        
                                        } else {
                                            Company.find({}, function(err, companies) {
                                                if(err) {
                                                    utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                                    res.render('error', {
                                                            error: err
                                                        });
                                                } else {
                                                    res.render('companies', {
                                                                                user: user,
                                                                                rooms: findedRooms,
                                                                                companies: companies,
                                                                                isLogin: true,
                                                                                isActive: 'edit-companies'});
                                                }
                                            });
                                        }
                                });
                            } else {
                                res.redirect('/profile');
                            }
                        }
            });
                                    
        } else {
            res.redirect('/login');
        }
    });
//// Get single room
router.get('/companies/:company_id', load_user, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms){
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                            res.render('error', {
                                                error: err
                                                });                                        
                                        } else {
                                            Company.findOne({
                                                    _id: req.params.company_id
                                                }, function(err, company) {
                                                        if(err) {
                                                            utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY with ID ${req.params.company_id}. Error message: ${err}.`);
                                                            res.render('error', {
                                                                    error: err
                                                                });
                                                        } else {
                                                            res.render('edit-company', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        company: company,
                                                                        isSaved: null,
                                                                        isLogin: true,
                                                                        isActive: 'edit-companies'});
                                                        }
                                                    });
                                        }
                                });
                            } else {
                                res.redirect('/profile');
                            }
                        }
            });
        } else {
            res.redirect('/login');
        }
    });
//// Post single room
router.post('/companies/:company_id', load_user, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms){
                                    utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                        if(err) {
                                            res.render('error', {
                                                error: err
                                                });                                        
                                        } else {
                                            Company.findOne({
                                                    _id: req.params.company_id
                                                }, function(err, company) {
                                                        if(err) {
                                                            utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY with ID ${req.params.company_id}. Error message: ${err}.`);
                                                            res.render('error', {
                                                                    error: err
                                                                });
                                                        } else {
                                                            company.name = req.body.name;
                                                            company.address = req.body.address;
                                                            company.site = req.body.site;
                                                            company.save(function(err) {
                                                                    if(err) {
                                                                        utils.appLogger('fail', 'Fail save document (company)', `Fail, when app try finding in document with type COMPANY with ID ${req.params.company_id} . Error message: ${err}.`);
                                                                        res.render('edit-company', {
                                                                                user: user,
                                                                                rooms: findedRooms,
                                                                                company: company,
                                                                                isSaved: false,
                                                                                isLogin: true,
                                                                                isActive: 'edit-companies'
                                                                            });
                                                                    } else {
                                                                        utils.appLogger('success', 'Success save document (company)', `Success saving document ${company}.`);
                                                                        res.render('edit-company', {
                                                                                user: user, rooms: findedRooms,
                                                                                company: company,
                                                                                isSaved: true,
                                                                                isLogin: true,
                                                                                isActive: 'edit-companies'
                                                                            });   
                                                                    }
                                                                });
                                                        }
                                                    });
                                        }
                                });
                            } else {
                                res.redirect('/profile');
                            }
                        }
            });
        } else {
            res.redirect('/login');
        }
    });
// Rooms
router.get('/rooms', load_user,function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms){
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                            res.render('error', {
                                                error: err
                                                });                                        
                                        } else {
                                            res.render('rooms', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        isLogin: true,
                                                                        isActive: 'edit-rooms'});
                                        }
                                });
                            } else {
                                res.redirect('/profile');
                            }
                        }
            });                       
        } else {
            res.redirect('/login');
        }
    });
//// Get single room
router.get('/rooms/:room_name', load_user,function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms){
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                            res.render('error', {
                                                error: err
                                                });                                        
                                        } else {
                                            let editingRoom = null;
                                            findedRooms.forEach((e) => {
                                                    if(e.name === req.params.room_name) {
                                                        editingRoom = e;
                                                    }
                                                });
                                            Company.find({}, function(err, companies) {
                                                    if(err) {
                                                        utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                                        res.render('error', {
                                                                error: err
                                                            });
                                                    } else {
                                                        res.render('edit-room', {
                                                                    user: user,
                                                                    rooms: findedRooms,
                                                                    room: editingRoom,
                                                                    companies: companies,
                                                                    isSaved: null,
                                                                    isLogin: true,
                                                                    isActive: 'edit-rooms'});
                                                    }
                                                });
                                        }
                                });
                            } else {
                                res.redirect('/profile');
                            }
                        }
            });                       
        } else {
            res.redirect('/login');
        }
    });
//// Post singe room
router.post('/rooms/:room_name', load_user,function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                            res.render('error', {
                                error: err
                                });
                        } else {
                            if(user.admin === true) {
                                Room.find({}, function(err, findedRooms){
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                            res.render('error', {
                                                error: err
                                                });                                        
                                        } else {
                                            let editingRoom = null;
                                            findedRooms.forEach((e) => {
                                                    if(e.name === req.params.room_name) {
                                                        editingRoom = e;
                                                    }
                                                });
                                            Company.find({}, function(err, companies) {
                                                    if(err) {
                                                        utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                                        res.render('error', {
                                                                error: err
                                                            });
                                                    } else {
                                                        editingRoom.name = req.body.name;
                                                        editingRoom.label = req.body.label;
                                                        editingRoom.visiability = req.body.visiability;
                                                        Company.findOne({
                                                                name: req.body.company
                                                            }, function(err, findedCompany) {
                                                                    if(err) {
                                                                        utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding document type COMPANY with name ${req.body.company}. Error message: ${err}.`);
                                                                        res.render('error', {
                                                                                error: err
                                                                            });
                                                                    } else {
                                                                        editingRoom.company = findedCompany;
                                                                        editingRoom.save(function(err) {
                                                                                if(err) {
                                                                                    utils.appLogger('fail', 'Fail save document (room)', `Fail, when app try saved change in document type ROOM (${editingRoom}). Error message: ${err}.`);
                                                                                    res.render('edit-room', {
                                                                                                user: user,
                                                                                                rooms: findedRooms,
                                                                                                room: editingRoom,
                                                                                                companies: companies,
                                                                                                isSaved: false,
                                                                                                isLogin: true,
                                                                                                isActive: 'edit-rooms'});
                                                                                } else {
                                                                                    utils.appLogger('success', 'Success save document (room)', `Succes saved document type ROOM (${editingRoom}). Error message: ${err}.`);
                                                                                    res.render('edit-room', {
                                                                                                user: user,
                                                                                                rooms: findedRooms,
                                                                                                room: editingRoom,
                                                                                                companies: companies,
                                                                                                isSaved: true,
                                                                                                isLogin: true,
                                                                                                isActive: 'edit-rooms'});
                                                                                }
                                                                            });
                                                                    }
                                                                });
                                                    }
                                                });
                                        }
                                });
                            } else {
                                res.redirect('/profile');
                            }
                        }
            });                       
        } else {
            res.redirect('/login');
        }
    });
module.exports = router;