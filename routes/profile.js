let express = require('express'),
    User = require('../models/user'),
    load_user = require('../middleware/load_user'),
    load_menu = require('../middleware/load_menu'),
    load_rooms = require('../middleware/load_rooms'),
    Room = require('../models/room'),
    Company = require('../models/company'),
    UserType = require('../models/user_type'),
    UserStatus = require('../models/user_status'),
    Page = require('../models/page'),
    menuItem = require('../models/menu_item'),
    question = require('../models/question'),
    router = express.Router(),
    logAnswers = require('../models/log_answers'),
    logEntryCall = require('../models/log_calls'),
    EntryConnect = require('../models/log_connect'),
    missedCalls = require('../models/missed_calls'),
    logFailedTokenize = require('../models/failed_tokenize'),
    json2csv = require('json2csv'),
    logEntry = require('../models/log_entry'),
    utils = require('../utils');
//router.use(token_check.token_check);
router.get('/', load_user, load_menu, load_rooms,function(req, res) {
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
                        Company.findOne({'_id': user.company}, function(err, company) {
                            if(err) {
                                utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding document type COMPANY with ID(${user.company}). Error message: ${err}.`);
                                res.render('error', {
                                                        error: err
                                                    });
                            } else {
                                res.render('profile', {
                                                menuItems: req.menuItems,
                                                user: user,
                                                rooms: req.rooms,
                                                company: company,
                                                isLogin: true,
                                                isActive: 'profile',
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
router.get('/settings', load_user, load_menu, load_rooms, function(req, res) {
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
                        Company.findOne({
                            '_id': user.company
                            }, function(err, company) {
                                    if(err) {
                                        utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding document type COMPANY with ID(${user.company}). Error message: ${err}.`);
                                        res.render('error', {
                                            error: err
                                        });
                                    } else {
                                        res.render('worker-settings', {
                                                user: user,
                                                menuItems: req.menuItems,
                                                rooms: req.rooms,
                                                company: company,
                                                isLogin: true,
                                                isSaved: null,
                                                isActive: 'settings'});   
                                    }
                            });
                    }
                }
            });
        } else {
            res.redirect('/login');
        }
});
router.post('/settings', load_user, load_menu, load_rooms, function(req, res){
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
                            user.name = req.body.name;
                            user.surname = req.body.surname;
                            user.lastname = req.body.lastname;
                            user.save(function(err) {
                                    let isSaved = false;
                                    if(err) {
                                        utils.appLogger('fail', 'Fail editing record (user)', `Fail, when app try save editing object USER (${user}). Error message: ${err}.`);
                                    } else {
                                        utils.appLogger('success', 'Success saving document (user)', `Success save editin document USER(${user}).`);
                                        isSaved = true;
                                    }
                                    res.render('worker-settings', {
                                                                        user: user,
                                                                        menuItems: req.menuItems,
                                                                        rooms: req.rooms,
                                                                        isLogin: true,
                                                                        isSaved: isSaved,
                                                                        isActive: 'settings'});
                                });
                        }
                });
        } else {
            res.redirect('/login');
        }
    });
// Create company
router.get('/create-company', load_user, load_menu,load_rooms, function(req, res) {
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
                                res.render('create-company', {
                                        menuItems: req.menuItems,
                                        user: user,
                                        rooms: req.rooms,
                                        isLogin: true,
                                        isSaved: null,
                                        isActive: 'create-company'});
                            } else {
                                res.redirect('/profile');
                            }
                        }
                    });
        } else {
            res.redirect('/login');
        }
    });
router.post('/create-company', load_user, load_menu, load_rooms, function(req, res) {
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
                                                                let isSaved = false;
                                                                if(err) {
                                                                    utils.appLogger('fail', 'Fail adding document (company)', `Fail, when app try adding document type COMPANY (${companyToCreate}). Error message: ${err}.`);
                                                                } else {
                                                                    utils.appLogger('succcess', 'Succes adding document (company)', `Success adding document type ROOM (${companyToCreate}).`);
                                                                    isSaved = true;
                                                                }
                                                                res.render('create-company', {
                                                                            menuItems: req.menuItems,
                                                                            user: user,
                                                                            rooms: req.rooms,
                                                                            isLogin: true,
                                                                            isSaved: isSaved,
                                                                            isActive: 'create-company'
                                                                        });
                                                            });
                                                    } else {
                                                        utils.appLogger('fail', 'Fail adding document (company)', `Fail, when app try adding document type COMPANY (${req.params.room_name}). Company with this name created early`);
                                                        res.render('create-company', {
                                                                            menuItems: req.menuItems,
                                                                            user: user,
                                                                            rooms: req.rooms,
                                                                            isLogin: true,
                                                                            isSaved: false,
                                                                            isActive: 'create-company'
                                                                        });
                                                    }
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
router.get('/create-room', load_user, load_menu, load_rooms, function(req, res) {
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
                                Company.find({}, function(err, companies) {
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                            res.render('error', {
                                                    error: err
                                            });
                                        } else {
                                            res.render('create-room', {
                                                menuItems: req.menuItems,
                                                user: user,
                                                rooms: req.rooms,
                                                companies: companies,
                                                isLogin: true,
                                                isSaved: null,
                                                isActive: 'create-room'
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
router.post('/create-room', load_user, load_menu, load_rooms, function(req, res) {
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
                                                        let isSaved = false;
                                                        if(err) {
                                                            utils.appLogger('fail', 'Fail adding document (room)', `Fail, when app try adding document type ROOM(${roomToCreate}). Error message: ${err}.`);
                                                        } else {
                                                            utils.appLogger('success', 'Success adding document (room)', `Success adding document room(${roomToCreate}).`);
                                                            isSaved = true;
                                                        }
                                                        res.render('create-room', {
                                                                        menuItems: req.menuItems,
                                                                        user: user,
                                                                        rooms: req.rooms,
                                                                        companies: companies,
                                                                        isLogin: true,
                                                                        isSaved: isSaved,
                                                                        isActive: 'create-room'
                                                                    });
                                                    });
                                                } else {
                                                    utils.appLogger('fail', 'Fail adding document', `Fail, when app try adding document type ROOM with name ${roomToCreate.name}. This room alredy exist`);
                                                        res.render('create-room', {
                                                                        menuItems: req.menuItems,
                                                                        user: user,
                                                                        rooms: req.rooms,
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
router.get('/create-user', load_user, load_menu, load_rooms,function(req, res){
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
                                                                        menuItems: req.menuItems,
                                                                        user: user,
                                                                        rooms: req.rooms,
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
router.post('/create-user', load_user, load_menu, load_rooms, function(req, res){
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
                                                                                menuItems: req.menuItems,
                                                                                user: user,
                                                                                rooms: req.rooms,
                                                                                companies: companies,
                                                                                statuses: statuses,
                                                                                types: types,
                                                                                isLogin: true,
                                                                                isSaved: false,
                                                                                isActive: 'create-user'
                                                                });
                                                        }
                                                        
                                                        userToCreate.save(function(err){
                                                            isSaved = false;
                                                            if(err) {
                                                                utils.appLogger('fail', 'Fail adding document (user)', `Fail, when app try adding document with type USER (${userToCreate}). Error message: ${err}.`);
                                                            } else {
                                                                utils.appLogger('success', 'Success adding document (user)', `Success adding document with type USER (${userToCreate}).`);
                                                                isSaved = true;
                                                            }
                                                            res.render('create-user', {
                                                                                menuItems: req.menuItems,
                                                                                user: user,
                                                                                rooms: req.rooms,
                                                                                companies: companies,
                                                                                statuses: statuses,
                                                                                types: types,
                                                                                isLogin: true,
                                                                                isSaved: isSaved,
                                                                                isActive: 'create-user'
                                                                });
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
router.get('/companies', load_user, load_menu, load_rooms, function(req, res) {
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
                                Company.find({}, function(err, companies) {
                                    if(err) {
                                        utils.appLogger('fail', 'Fail finding document (company)', `Fail, when app try finding list all documents with type COMPANY. Error message: ${err}.`);
                                        res.render('error', {
                                                        error: err
                                                    });
                                    } else {
                                        res.render('companies', {
                                                        menuItems: req.menuItems,
                                                        user: user,
                                                        rooms: req.rooms,
                                                        companies: companies,
                                                        isLogin: true,
                                                        isActive: 'edit-companies'});
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
router.get('/companies/:company_id', load_user, load_menu, load_rooms, function(req, res) {
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
                                                        menuItems: req.menuItems,
                                                        user: user,
                                                        rooms: req.rooms,
                                                        company: company,
                                                        isSaved: null,
                                                        isLogin: true,
                                                        isActive: 'edit-companies'});
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
router.post('/companies/:company_id', load_user, load_menu, load_rooms, function(req, res) {
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
                                                                isSaved = false;
                                                                if(err) {
                                                                    utils.appLogger('fail', 'Fail save document (company)', `Fail, when app try finding in document with type COMPANY with ID ${req.params.company_id} . Error message: ${err}.`);
                                                                } else {
                                                                    utils.appLogger('success', 'Success save document (company)', `Success saving document ${company}.`);
                                                                       
                                                                }
                                                                res.render('edit-company', {
                                                                                    menuItems: req.menuItems,
                                                                                    user: user,
                                                                                    rooms: req.rooms,
                                                                                    company: company,
                                                                                    isSaved: true,
                                                                                    isLogin: true,
                                                                                    isActive: 'edit-companies'
                                                                    });
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
router.get('/rooms', load_user, load_menu, load_rooms, function(req, res) {
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
                                if(err) {
                                    utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding list all documents with type ROOM. Error message: ${err}.`);
                                    res.render('error', {
                                                    error: err
                                        });                                        
                                } else {
                                    res.render('rooms', {
                                            menuItems: req.menuItems,
                                            user: user,
                                            rooms: req.rooms,
                                            isLogin: true,
                                            isActive: 'edit-rooms'});
                                }
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
router.get('/rooms/:room_name', load_user, load_menu, load_rooms,function(req, res) {
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
                                let editingRoom = null;
                                
                                req.rooms.forEach((e) => {
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
                                                        menuItems: req.menuItems,
                                                        user: user,
                                                        rooms: req.rooms,
                                                        room: editingRoom,
                                                        companies: companies,
                                                        isSaved: null,
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
//// Post singe room
router.post('/rooms/:room_name', load_user, load_menu, load_rooms,function(req, res) {
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
                                let editingRoom = null;
                                
                                req.rooms.forEach((e) => {
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
                                                        let isSaved = false;
                                                        
                                                        if(err) {
                                                            utils.appLogger('fail', 'Fail save document (room)', `Fail, when app try saved change in document type ROOM (${editingRoom}). Error message: ${err}.`);
                                                        } else {
                                                            utils.appLogger('success', 'Success save document (room)', `Succes saved document type ROOM (${editingRoom}).`);
                                                            isSaved = true;                            
                                                        }
                                                        
                                                        res.render('edit-room', {
                                                                        menuItems: req.menuItems,
                                                                        user: user,
                                                                        rooms: req.rooms,
                                                                        room: editingRoom,
                                                                        companies: companies,
                                                                        isSaved: isSaved,
                                                                        isLogin: true,
                                                                        isActive: 'edit-rooms'});
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
/* Create question */
router.get('/create-question', load_user, load_menu, load_rooms,function(req, res) {
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
                                res.render('create-question', {
                                        menuItems: req.menuItems,
                                        user: user,
                                        rooms: req.rooms,
                                        isSaved: null,
                                        isLogin: true,
                                        isActive: 'create-question'
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

/* Create page */
router.get('/create-page', load_user, load_menu, load_rooms,function(req, res) {
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
                                res.render('create-page', {
                                        menuItems: req.menuItems,
                                        user: user,
                                        rooms: req.rooms,
                                        isSaved: null,
                                        isLogin: true,
                                        isActive: 'create-page'
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
router.post('/create-question', load_user, load_menu, load_rooms,function(req, res) {
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
                                let tmpQuestion = question({
                                        pollsType: req.body.pollsType,
                                        date: Date.now(),
                                        questionText: req.body.questionText,
                                        answerOne: req.body.answerOne,
                                        answerTwo: req.body.answerTwo,
                                        answerThree: req.body.answerThree,
                                        answerFore: req.body.answerFore
                                    });
                                tmpQuestion.save(function(err) {
                                        isSaved = false;
                                        
                                        if(err) {
                                            utils.appLogger('fail', 'Fail save document (question)', `Fail, when app try save document type QUESTION (${tmpQuestion}). Error message: ${err}.`);
                                        } else {
                                            utils.appLogger('success', 'Success save document (question)', `Succes saved document type QUESTION (${tmpQuestion}).`);
                                            isSaved = true;
                                        }
                                                                                
                                                                        
                                        res.render('create-question', {
                                                        menuItems: req.menuItems,
                                                        user: user,
                                                        rooms: req.rooms,
                                                        isSaved: isSaved,
                                                        isLogin: true,
                                                        isActive: 'create-question'
                                        });
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

// Create pages
router.post('/create-page', load_user, load_menu, load_rooms,function(req, res) {
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
                                let tmpPage = Page({
                                        name:req.body.name,
                                        title: req.body.title,
                                        subtitle: req.body.subtitle,
                                        text: req.body.text
                                    });
                                tmpPage.save(function(err) {
                                        isSaved = false;
                                        
                                        if(err) {
                                            utils.appLogger('fail', 'Fail save document (page)', `Fail, when app try save document type PAGE (${tmpPage}). Error message: ${err}.`);
                                        } else {
                                            utils.appLogger('success', 'Success save document (page)', `Succes saved document type PAGE (${tmpPage}).`);
                                            isSaved = true;
                                        }
                                        
                                        let tmpMenuItem = new menuItem({
                                                name: tmpPage.name,
                                                label: tmpPage.title,
                                                visiability: true,
                                                page: null
                                            });
                                        
                                        Page.findOne({
                                                name: tmpPage.name
                                            }, function(err, page) {
                                                    if(err) {
                                                        utils.appLogger('fail', 'Fail finding document (page)', `Fail, when app try find document type PAGE with name ${tmpPage.namae}. Error message: ${err}`);
                                                    } else {
                                                        tmpMenuItem.page = page;
                                                        tmpMenuItem.save(function(err) {
                                                                        if(err) {
                                                                            utils.appLogger('fail', 'Fail save document (menu_item)', `Fail, when app try save document type MENU_ITEM (${tmpMenuItem}). Error message: ${err}.`);
                                                                            isSaved = false;
                                                                        } else {
                                                                            utils.appLogger('success', 'Success save document (menu_item)', `Succes saved document type MENU_ITEM (${tmpMenuItem}).`);
                                                                            isSaved = true;
                                                                        }
                                                                        
                                                                        res.render('create-page', {
                                                                                        menuItems: req.menuItems,
                                                                                        user: user,
                                                                                        rooms: req.rooms,
                                                                                        isSaved: isSaved,
                                                                                        isLogin: true,
                                                                                        isActive: 'create-page'
                                                                                    });
                                                            });
                                                    }
                                            });
                                        
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
/* All questions */
router.get('/questions', load_user, load_menu, load_rooms,function(req, res) {
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
                            question.find({}, function(err, questions) {
                                    if(err) {
                                        utils.appLogger('fail', 'Fail finding documents (questoin)', `Fail, when app try finding all documents with type QUESTION. Error message: ${err}.`);
                                        res.render('error', {
                                            error: err
                                        });
                                    } else {
                                        if(user.admin === true) {
                                            res.render('questions', {
                                                    menuItems: req.menuItems,
                                                    user: user,
                                                    rooms: req.rooms,
                                                    questions: questions,
                                                    isSaved: null,
                                                    isLogin: true,
                                                    isActive: 'edit-question'
                                            });
                                        } else {
                                            res.redirect('/profile');
                                        }
                                    }
                                });
                        }
                    });
        } else {
            res.redirect('/login');
        }
    });
/* All pages */
router.get('/pages', load_user, load_menu, load_rooms,function(req, res) {
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
                            Page.find({}, function(err, pages) {
                                    if(err) {
                                        utils.appLogger('fail', 'Fail finding documents (pages)', `Fail, when app try finding all documents with type PAGES. Error message: ${err}.`);
                                        res.render('error', {
                                            error: err
                                        });
                                    } else {
                                        if(user.admin === true) {
                                            res.render('pages', {
                                                    menuItems: req.menuItems,
                                                    user: user,
                                                    rooms: req.rooms,
                                                    pages: pages,
                                                    isSaved: null,
                                                    isLogin: true,
                                                    isActive: 'edit-page'
                                            });
                                        } else {
                                            res.redirect('/profile');
                                        }
                                    }
                                });
                        }
                    });
        } else {
            res.redirect('/login');
        }
    });
/* Edit question */
router.get('/questions/:question_id', load_user, load_menu, load_rooms,function(req, res) {
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
                                question.findOne({
                                    _id: req.params.question_id
                                }, function(err, thisQuestion) {
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (question)', `Fail, when app try finding document type QUESTION with ID (${req.params.question_id}). Error message: ${err}.`);
                                            res.render('error', {
                                                            error: err
                                                        });
                                        } else {
                                            res.render('edit-question', {
                                                            menuItems: req.menuItems,
                                                            user: user,
                                                            rooms: req.rooms,
                                                            question: thisQuestion,
                                                            isSaved: null,
                                                            isLogin: true,
                                                            isActive: 'edit-question'
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
router.post('/questions/:question_id', load_user, load_menu, load_rooms,function(req, res) {
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
                                question.findOne({
                                    _id: req.params.question_id
                                }, function(err, thisQuestion) {
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (question)', `Fail, when app try finding document type QUESTION with ID (${req.params.question_id}). Error message: ${err}.`);
                                            res.render('error', {
                                                            error: err
                                                        });
                                        } else {
                                            thisQuestion.pollsType = req.body.pollsType;
                                            thisQuestion.date = Date.now();
                                            thisQuestion.questionText = req.body.questionText;
                                            thisQuestion.answerOne = req.body.answerOne;
                                            thisQuestion.answerTwo = req.body.answerTwo;
                                            thisQuestion.answerThree = req.body.answerThree;
                                            thisQuestion.answerFore = req.body.answerFore;
                                            
                                            thisQuestion.save(function(err) {
                                                    let isSaved = false;
                                                    
                                                    if(err) {
                                                        utils.appLogger('fail', 'Fail saved document (question)', `Fail, when app try finding document type QUESTION with ID (${req.params.question_id}). Error message: ${err}.`);
                                                    } else {
                                                        utils.appLogger('success', 'Success saved document (page)', `Success saving document type QUESTION with ID (${req.params.question_id}).`);
                                                        isSaved = true;
                                                    }
                                                    
                                                    res.render('edit-question', {
                                                            menuItems: req.menuItems,
                                                            user: user,
                                                            rooms: req.rooms,
                                                            question: thisQuestion,
                                                            isSaved: isSaved,
                                                            isLogin: true,
                                                            isActive: 'edit-question'
                                                        });
                                                    
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

/* Edit page */
router.get('/pages/:page_name', load_user, load_menu, load_rooms,function(req, res) {
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
                                Page.findOne({
                                    name: req.params.page_name
                                }, function(err, thisPage) {
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (page)', `Fail, when app try finding document type USER with page (${req.params.page_name}). Error message: ${err}.`);
                                            res.render('error', {
                                                            error: err
                                                        });
                                        } else {
                                            res.render('edit-page', {
                                                            menuItems: req.menuItems,
                                                            user: user,
                                                            rooms: req.rooms,
                                                            page: thisPage,
                                                            isSaved: null,
                                                            isLogin: true,
                                                            isActive: 'edit-page'
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
/* Edit page */
router.post('/pages/:page_name', load_user, load_menu, load_rooms,function(req, res) {
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
                                Page.findOne({
                                    name: req.params.page_name
                                }, function(err, thisPage) {
                                        if(err) {
                                            utils.appLogger('fail', 'Fail finding document (page)', `Fail, when app try finding document type PAGE with name (${req.params.page_name}). Error message: ${err}.`);
                                            res.render('error', {
                                                            error: err
                                                        });
                                        } else {
                                            thisPage.name = req.body.name;
                                            thisPage.title = req.body.title;
                                            thisPage.subtitle = req.body.subtitle;
                                            thisPage.text = req.body.text;
                                            
                                            thisPage.save(function(err){
                                                    let isSaved = false;
                                                
                                                    if(err) {
                                                        utils.appLogger('fail', 'Fail saved document (page)', `Fail, when app try finding document type Page with name (${req.params.page_name}). Error message: ${err}.`);
                                                    } else {
                                                        utils.appLogger('success', 'Success saved document (page)', `Success saving document type Page with name (${req.params.page_name}).`);
                                                        isSaved = true;
                                                    }
                                                    
                                                    res.render('edit-page', {
                                                            menuItems: req.menuItems,
                                                            user: user,
                                                            rooms: req.rooms,
                                                            page: thisPage,
                                                            isSaved: isSaved,
                                                            isLogin: true,
                                                            isActive: 'edit-page'
                                                        });
                                                    
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
/* REPORTING */
/* Report to answers */
router.get('/reporting/report-polls', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                          if (user.admin === true) {
                            let dateObject = {},
                                date = null,
                                dateEnd = null,
                                filterObject = {};

                            if (req.param('filterYear'))
                                dateObject.year = parseInt(req.param('filterYear'));
                            if (req.param('filterMonth'))
                                dateObject.month = '' + (parseInt(req.param('filterMonth')) - 1);
                            if (req.param('filterDay'))
                               dateObject.day = req.param('filterDay');
                            if (req.param('filterYearEnd'))
                                dateObject.yearEnd = req.param('filterYearEnd');
                            if (req.param('filterMonthEnd'))
                                dateObject.monthEnd = '' + (parseInt(req.param('filterMonthEnd')) - 1);
                            if (req.param('filterDayEnd'))
                                dateObject.dayEnd = req.param('filterDayEnd');
                            
                            console.log(dateObject);
                            
                            if (Object.keys(dateObject).length === 6) {                                
                                date = new Date(dateObject.year, dateObject.month, dateObject.day);
                                dateEnd = new Date(dateObject.yearEnd, dateObject.monthEnd, dateObject.dayEnd);
                            }
                            // db.reservations.find({ dateTime: { '$gte': new Date("Tue, 31 Mar 2015 02:30:00 GMT"), '$lte': new Date("Tue, 31 Mar 2015 03:30:00 GMT") }, minParty: { '$lte': 2 }, maxParty: { '$gte': 2 }, _user: { '$exists': false } })

                            if (date !== null && date !== undefined && dateEnd !== null && dateEnd !== undefined) {
                                filterObject.date = {
                                    '$gte': date,
                                    '$lte': dateEnd
                                    };
                            } else {
                                let tmpDate = new Date();
                                filterObject.date = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            }
                            
                            console.log(filterObject);
                            
                            logAnswers.find(filterObject, (errAnswers, answers) => {
                                    if (errAnswers) {
                                        utils.appLogger('fails', 'Fail finding document (log_answers)', `Fail, when app try finding all documents with type LOG_ANSWERS. Error message: ${errAnswers}`);
                                    } else {
                                        res.render('report-polls', {
                                                menuItems: req.menuItems,
                                                user: user,
                                                rooms: req.rooms,
                                                answers: answers,
                                                isLogin: true,
                                                isActive: 'report-polls',
                                                filters: dateObject,
                                                dateFrom: date,
                                                dateTo: dateEnd
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

router.get('/downloads/answers/:date_from/:date_to', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                        
                        if (user.admin === true) {
                            
                            let filterObject = {};
                            if (req.params.date_from === 'null' || req.params.date_to === 'null') {
                                console.log(filterObject);
                            } else {
                                filterObject.date = {
                                    '$gte': req.params.date_from,
                                    '$lte': req.params.date_to
                                };
                            }
                            
                            logAnswers.find(filterObject, (errAnswers, answers) => {
                                    if (errAnswers) {
                                        utils.appLogger('fails', 'Fail finding document (log_answers)', `Fail, when app try finding all documents with type LOG_ANSWERS. Error message: ${errAnswers}`);
                                    } else {
                                        let resultat = [],
                                            tmp = null,
                                            fields = ['Тип опроса', 'Дата', 'Токен сотрудника', 'Токен клиента', 'Комментарии', 'Ответы'];
                                        answers.forEach(e => {
                                                tmp = {
                                                    'Тип опроса': e.pollsType,
                                                    'Дата': e.date,
                                                    'Токен сотрудника': e.employeeRtcToken,
                                                    'Токен клиента': e.custometRtcToken,
                                                    'Комментарии': e.comments,
                                                    'Ответы': e.answersToPolls
                                                };
                                                resultat.push(tmp);
                                            });
                                        json2csv({ data: resultat, fields: fields}, function(err, csv) {
                                           if (err) console.log(err);
                                            console.log(csv);
                                            res.attachment('polls.csv');
                                            res.send(csv);
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
/* Reports to server*/
router.get('/reporting/report-server', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                          if (user.admin === true) {
                            let dateObject = {},
                                date = null,
                                dateEnd = null,
                                filterObject = {};

                            if (req.param('filterYear'))
                                dateObject.year = parseInt(req.param('filterYear'));
                            if (req.param('filterMonth'))
                                dateObject.month = '' + (parseInt(req.param('filterMonth')) - 1);
                            if (req.param('filterDay'))
                               dateObject.day = req.param('filterDay');
                            if (req.param('filterYearEnd'))
                                dateObject.yearEnd = req.param('filterYearEnd');
                            if (req.param('filterMonthEnd'))
                                dateObject.monthEnd = '' + (parseInt(req.param('filterMonthEnd')) - 1);
                            if (req.param('filterDayEnd'))
                                dateObject.dayEnd = req.param('filterDayEnd');
                            
                            if (Object.keys(dateObject).length === 6) {                                
                                date = new Date(dateObject.year, dateObject.month, dateObject.day);
                                dateEnd = new Date(dateObject.yearEnd, dateObject.monthEnd, dateObject.dayEnd);
                            }
                            
                            if (date !== null && date !== undefined && dateEnd !== null && dateEnd !== undefined) {
                                filterObject.date = {
                                    '$gte': date,
                                    '$lte': dateEnd
                                    };
                            } else {
                                let tmpDate = new Date();
                                filterObject.date = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            }
                            
                            console.log(filterObject);
                            
                            logEntry.find(filterObject, (errEntries, entries) => {
                                    if (errEntries) {
                                        utils.appLogger('fails', 'Fail finding document (log_entry)', `Fail, when app try finding all documents with type LOG_ENTRY. Error message: ${errEntries}`);
                                    } else {
                                        
                                        res.render('report-server', {
                                                menuItems: req.menuItems,
                                                user: user,
                                                rooms: req.rooms,
                                                entries: entries,
                                                isLogin: true,
                                                isActive: 'report-server',
                                                filters: dateObject,
                                                dateFrom: date,
                                                dateTo: dateEnd
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
router.get('/downloads/server/:date_from/:date_to', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                        
                        if (user.admin === true) {
                             let filterObject = {};
                            if (req.params.date_from === 'null' || req.params.date_to === 'null') {
                                let tmpDate = new Date();
                                filterObject.date = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            } else {
                                filterObject.date = {
                                    '$gte': req.params.date_from,
                                    '$lte': req.params.date_to
                                };
                            }
                            
                            console.log(filterObject);

                            logEntry.find(filterObject, (errEntry, entries) => {
                            
                                    if (errEntry) {
                                        utils.appLogger('fails', 'Fail finding document (log_entry)', `Fail, when app try finding all documents with type LOG_ENTRY. Error message: ${errAnswers}`);
                                    } else {
                                        let resultat = [],
                                            tmp = null,
                                            fields = ['Тип события', 'Дата', 'Действие', 'Описание'];
                                            
                                        console.log(entries);
                                        
                                        entries.forEach(e => {
                                                tmp = {
                                                    'Тип события': e.type_error,
                                                    'Дата': e.date,
                                                    'Дейстие': e.action,
                                                    'Описание': e.description,
                                                };
                                                resultat.push(tmp);
                                            });
                                        json2csv({ data: resultat, fields: fields}, function(err, csv) {
                                           if (err) console.log(err);
                                            console.log(csv);
                                            res.attachment('server.csv');
                                            res.send(csv);
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
/* Reports to fail tokenization*/
router.get('/reporting/report-error-tokenize', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                          if (user.admin === true) {
                            let dateObject = {},
                                date = null,
                                dateEnd = null,
                                filterObject = {};

                            if (req.param('filterYear'))
                                dateObject.year = parseInt(req.param('filterYear'));
                            if (req.param('filterMonth'))
                                dateObject.month = '' + (parseInt(req.param('filterMonth')) - 1);
                            if (req.param('filterDay'))
                               dateObject.day = req.param('filterDay');
                            if (req.param('filterYearEnd'))
                                dateObject.yearEnd = req.param('filterYearEnd');
                            if (req.param('filterMonthEnd'))
                                dateObject.monthEnd = '' + (parseInt(req.param('filterMonthEnd')) - 1);
                            if (req.param('filterDayEnd'))
                                dateObject.dayEnd = req.param('filterDayEnd');
                            
                            if (Object.keys(dateObject).length === 6) {                                
                                date = new Date(dateObject.year, dateObject.month, dateObject.day);
                                dateEnd = new Date(dateObject.yearEnd, dateObject.monthEnd, dateObject.dayEnd);
                            }
                            
                            if (date !== null && date !== undefined && dateEnd !== null && dateEnd !== undefined) {
                                filterObject.date = {
                                    '$gte': date,
                                    '$lte': dateEnd
                                    };
                            } else {
                                let tmpDate = new Date();
                                filterObject.date = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            }
                            
                            logFailedTokenize.find(filterObject, (errEntries, entries) => {
                                    if (errEntries) {
                                        utils.appLogger('fails', 'Fail finding document (failed_tokenize)', `Fail, when app try finding all documents with type FAILED_TOKENIZE. Error message: ${errEntries}`);
                                    } else {
                                        
                                        res.render('report-error-tokenize', {
                                                menuItems: req.menuItems,
                                                user: user,
                                                rooms: req.rooms,
                                                entries: entries,
                                                isLogin: true,
                                                isActive: 'report-error-tokenize',
                                                filters: dateObject,
                                                dateFrom: date,
                                                dateTo: dateEnd
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
router.get('/downloads/tokenize/:date_from/:date_to', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                        
                        if (user.admin === true) {
                             let filterObject = {};
                            if (req.params.date_from === 'null' || req.params.date_to === 'null') {
                                let tmpDate = new Date();
                                filterObject.date = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            } else {
                                filterObject.date = {
                                    '$gte': req.params.date_from,
                                    '$lte': req.params.date_to
                                };
                            }
                            

                            logFailedTokenize.find(filterObject, (errEntry, entries) => {
                            
                                    if (errEntry) {
                                        utils.appLogger('fails', 'Fail finding document (failed_tokenize)', `Fail, when app try finding all documents with type FAILED_TOKENIZR. Error message: ${errAnswers}`);
                                    } else {
                                        let resultat = [],
                                            tmp = null,
                                            fields = ['Пользователь', 'Дата', 'Обрудование','Ошибка'];
                                            
                                        console.log(entries);
                                        
                                        entries.forEach(e => {
                                                tmp = {
                                                    'Пользователь': e.userInfo,
                                                    'Дата': e.date,
                                                    'Оборудование': e.userAgent,
                                                    'Ошибка': e.error
                                                };
                                                resultat.push(tmp);
                                            });
                                        json2csv({ data: resultat, fields: fields}, function(err, csv) {
                                           if (err) console.log(err);
                                            console.log(csv);
                                            res.attachment('tokenize.csv');
                                            res.send(csv);
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
/* Reports to missed calls*/
router.get('/reporting/report-missed-calls', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                          if (user.admin === true) {
                            let dateObject = {},
                                date = null,
                                dateEnd = null,
                                filterObject = {};

                            if (req.param('filterYear'))
                                dateObject.year = parseInt(req.param('filterYear'));
                            if (req.param('filterMonth'))
                                dateObject.month = '' + (parseInt(req.param('filterMonth')) - 1);
                            if (req.param('filterDay'))
                               dateObject.day = req.param('filterDay');
                            if (req.param('filterYearEnd'))
                                dateObject.yearEnd = req.param('filterYearEnd');
                            if (req.param('filterMonthEnd'))
                                dateObject.monthEnd = '' + (parseInt(req.param('filterMonthEnd')) - 1);
                            if (req.param('filterDayEnd'))
                                dateObject.dayEnd = req.param('filterDayEnd');
                            
                            if (Object.keys(dateObject).length === 6) {                                
                                date = new Date(dateObject.year, dateObject.month, dateObject.day);
                                dateEnd = new Date(dateObject.yearEnd, dateObject.monthEnd, dateObject.dayEnd);
                            }
                            
                            if (date !== null && date !== undefined && dateEnd !== null && dateEnd !== undefined) {
                                filterObject.date = {
                                    '$gte': date,
                                    '$lte': dateEnd
                                    };
                            } else {
                                let tmpDate = new Date();
                                filterObject.date = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            }
                            
                            missedCalls.find(filterObject, (errEntries, entries) => {
                                    if (errEntries) {
                                        utils.appLogger('fails', 'Fail finding document (missed_calls)', `Fail, when app try finding all documents with type MISSED_CALLS. Error message: ${errEntries}`);
                                    } else {
                                        
                                        res.render('report-missed-calls', {
                                                menuItems: req.menuItems,
                                                user: user,
                                                rooms: req.rooms,
                                                entries: entries,
                                                isLogin: true,
                                                isActive: 'report-missed-calls',
                                                filters: dateObject,
                                                dateFrom: date,
                                                dateTo: dateEnd
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
router.get('/downloads/missed/:date_from/:date_to', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                        
                        if (user.admin === true) {
                             let filterObject = {};
                            if (req.params.date_from === 'null' || req.params.date_to === 'null') {
                                let tmpDate = new Date();
                                filterObject.date = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            } else {
                                filterObject.date = {
                                    '$gte': req.params.date_from,
                                    '$lte': req.params.date_to
                                };
                            }
                            

                            missedCalls.find(filterObject, (errEntry, entries) => {
                            
                                    if (errEntry) {
                                        utils.appLogger('fails', 'Fail finding document (missed_call)', `Fail, when app try finding all documents with type MISSED_CALL. Error message: ${errAnswers}`);
                                    } else {
                                        let resultat = [],
                                            tmp = null,
                                            fields = ['Пользователь', 'Дата', 'Токен'];
                                            
                                        console.log(entries);
                                        
                                        entries.forEach(e => {
                                                tmp = {
                                                    'Пользователь': e.userInfo,
                                                    'Дата': e.date,
                                                    'Дейстие': e.easyRtcToken,
                                                };
                                                resultat.push(tmp);
                                            });
                                        json2csv({ data: resultat, fields: fields}, function(err, csv) {
                                           if (err) console.log(err);
                                            console.log(csv);
                                            res.attachment('missed.csv');
                                            res.send(csv);
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
/* Reports to connections */
router.get('/reporting/report-connections', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                          if (user.admin === true) {
                            let dateObject = {},
                                date = null,
                                dateEnd = null,
                                filterObject = {};

                            if (req.param('filterYear'))
                                dateObject.year = parseInt(req.param('filterYear'));
                            if (req.param('filterMonth'))
                                dateObject.month = '' + (parseInt(req.param('filterMonth')) - 1);
                            if (req.param('filterDay'))
                               dateObject.day = req.param('filterDay');
                            if (req.param('filterYearEnd'))
                                dateObject.yearEnd = req.param('filterYearEnd');
                            if (req.param('filterMonthEnd'))
                                dateObject.monthEnd = '' + (parseInt(req.param('filterMonthEnd')) - 1);
                            if (req.param('filterDayEnd'))
                                dateObject.dayEnd = req.param('filterDayEnd');
                            
                            
                            if (Object.keys(dateObject).length === 6) {                                
                                date = new Date(dateObject.year, dateObject.month, dateObject.day);
                                dateEnd = new Date(dateObject.yearEnd, dateObject.monthEnd, dateObject.dayEnd);
                            }
                            
                            if (date !== null && date !== undefined && dateEnd !== null && dateEnd !== undefined) {
                                filterObject.date = {
                                    '$gte': date,
                                    '$lte': dateEnd
                                    };
                            } else {
                                let tmpDate = new Date();
                                filterObject.date = {
                                        '$gte': tmpDate.setHours(0,0,0,0),
                                        '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            }
                        
                            
                            EntryConnect.find(filterObject, (errConnect, entries) => {
                                    if (errConnect) {
                                        utils.appLogger('fails', 'Fail finding document (log_connect)', `Fail, when app try finding all documents with type LOG_CONNETCT. Error message: ${errAnswers}`);
                                    } else {
                                        
                                        console.log(entries);
                                        
                                        res.render('report-connections', {
                                                menuItems: req.menuItems,
                                                user: user,
                                                rooms: req.rooms,
                                                entries: entries,
                                                isLogin: true,
                                                isActive: 'report-connections',
                                                filters: dateObject,
                                                dateFrom: date,
                                                dateTo: dateEnd
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
router.get('/downloads/connections/:date_from/:date_to', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                        
                        if (user.admin === true) {
                             let filterObject = {};
                            if (req.params.date_from === 'null' || req.params.date_to === 'null') {
                                let tmpDate = new Date();
                                filterObject.date = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            } else {
                                filterObject.date = {
                                    '$gte': req.params.date_from,
                                    '$lte': req.params.date_to
                                };
                            }
                            
                            
                            EntryConnect.find(filterObject, (errEntry, entries) => {
                            
                                    if (errEntry) {
                                        utils.appLogger('fails', 'Fail finding document (log_connect)', `Fail, when app try finding all documents with type LOG_CONNECT. Error message: ${errAnswers}`);
                                    } else {
                                        let resultat = [],
                                            tmp = null,
                                            fields = ['Username', 'ФИО', 'Город', 'Токен', 'Дата'];
                                            
                                        
                                        entries.forEach(e => {
                                                tmp = {
                                                    'Username': e.username,
                                                    'ФИО': e.userfio,
                                                    'Город': e.city,
                                                    'Токен': e.easyRtcToken,
                                                    'Дата': e.date
                                                };
                                                resultat.push(tmp);
                                            });
                                        json2csv({ data: resultat, fields: fields}, function(err, csv) {
                                           if (err) console.log(err);
                                            console.log(csv);
                                            res.attachment('connections.csv');
                                            res.send(csv);
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


/* Reports to calls*/
router.get('/reporting/report-calls', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                          if (user.admin === true) {
                            let dateObject = {},
                                date = null,
                                dateEnd = null,
                                filterObject = {};

                            if (req.param('filterYear'))
                                dateObject.year = parseInt(req.param('filterYear'));
                            if (req.param('filterMonth'))
                                dateObject.month = '' + (parseInt(req.param('filterMonth')) - 1);
                            if (req.param('filterDay'))
                               dateObject.day = req.param('filterDay');
                            if (req.param('filterYearEnd'))
                                dateObject.yearEnd = req.param('filterYearEnd');
                            if (req.param('filterMonthEnd'))
                                dateObject.monthEnd = '' + (parseInt(req.param('filterMonthEnd')) - 1);
                            if (req.param('filterDayEnd'))
                                dateObject.dayEnd = req.param('filterDayEnd');
                            
                            
                            if (Object.keys(dateObject).length === 6) {                                
                                date = new Date(dateObject.year, dateObject.month, dateObject.day);
                                dateEnd = new Date(dateObject.yearEnd, dateObject.monthEnd, dateObject.dayEnd);
                            }
                            
                            if (date !== null && date !== undefined && dateEnd !== null && dateEnd !== undefined) {
                                filterObject.callStart = {
                                    '$gte': date,
                                    '$lte': dateEnd
                                    };
                            } else {
                                let tmpDate = new Date();
                                filterObject = {
                                    '$gte': tmpDate.setHours(0,0,0,0),
                                    '$lte': tmpDate.setHours(24,0,0,0)
                                };
                            }
                            
                            
                            logEntryCall.find(filterObject, (errAnswers, calls) => {
                                    if (errAnswers) {
                                        utils.appLogger('fails', 'Fail finding document (log_answers)', `Fail, when app try finding all documents with type LOG_ANSWERS. Error message: ${errAnswers}`);
                                    } else {
                                        let correctCalls = [],
                                            tmp = null;
                                        
                                        calls.forEach(c => {
                                                tmp = c;
                                                if(c.callStart !== null && c.callStart !== undefined) {
                                                    tmp.callStart = new Date(parseInt(c.callStart));
                                                }
                                                if (c.callEnd !== null && c.callEnd !== undefined) {
                                                    tmp.callEnd = new Date(parseInt(c.callEnd));
                                                }
                                                correctCalls.push(tmp);
                                            });                                        
                                        res.render('report-calls', {
                                                menuItems: req.menuItems,
                                                user: user,
                                                rooms: req.rooms,
                                                calls: correctCalls,
                                                isLogin: true,
                                                isActive: 'report-calls',
                                                filters: dateObject,
                                                dateFrom: date,
                                                dateTo: dateEnd
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

router.get('/downloads/report-calls/:date_from/:date_to', load_user, load_menu, load_rooms, (req, res) => {
    if (req.user) {
        User.findOne({
                token: req.cookies.token
            }, function (err, user) {
                    if (err) {
                        utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.cookies.token}). Error message: ${err}.`);
                    } else {
                        
                        if (user.admin === true) {
                             let filterObject = {};
                            if (req.params.date_from === 'null' || req.params.date_to === 'null') {
                                let tmpDate = new Date();
                                filterObject = {
                                        '$gte': tmpDate.setHours(0,0,0,0),
                                        '$lte': tmpDate.setHours(24,0,0,0)
                                    };
                            } else {
                                filterObject.callStart = {
                                    '$gte': req.params.date_from,
                                    '$lte': req.params.date_to
                                };
                            }
                            logEntryCall.find(filterObject, (errCalls, calls) => {
                                    if (errCalls) {
                                        utils.appLogger('fails', 'Fail finding document (log_calls)', `Fail, when app try finding all documents with type LOG_CALLS. Error message: ${errAnswers}`);
                                    } else {
                                        let resultat = [],
                                            tmp = null,
                                            fields = ['Начало звонка', 'Конец звонка', 'Токен сотрудника', 'Токен клиента'];
                                        calls.forEach(e => {
                                                tmp = {
                                                    'Начало звонка': e.callStart,
                                                    'Конец звонка': e.callEnd,
                                                    'Токен сотрудника': e.employeeToken,
                                                    'Токен клиента': e.customerToken,
                                                };
                                                resultat.push(tmp);
                                            });
                                        json2csv({ data: resultat, fields: fields}, function(err, csv) {
                                           if (err) console.log(err);
                                            res.attachment('calls.csv');
                                            res.send(csv);
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