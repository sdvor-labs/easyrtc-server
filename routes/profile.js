let express = require('express'),
    User = require('../models/user'),
//    token_check = require('../middleware/token_check'),
    load_user = require('../middleware/load_user'),
    Room = require('../models/room'),
    Company = require('../models/company'),
    UserType = require('../models/user_type'),
    UserStatus = require('../models/user_status'),
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
                                                                        isSaved: null,
                                                                        isActive: 'settings'});   
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
                            res.render('error', {
                                                        error: err
                                                });
                        } else {
                            Room.find({}, function(err, findedRooms) {
                                if(err) {
                                    res.render('error', {
                                                            error: err
                                                        });
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
                                                                        isSaved: false,
                                                                        isActive: 'settings'});
                                    } else {
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
                        Room.find({}, function(err, findedRooms) {
                            if(err) {
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
                        res.render('error', {
                                error: err
                            });
                    } else {
                        Room.find({}, function(err, findedRooms) {
                                if(err) {
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
                                                res.render('error', {
                                                        error: err
                                                    });
                                            } else {
                                                if(company === null) {
                                                    companyToCreate.save(function(err) {
                                                            if(err) {
                                                                res.render('create-company', {
                                                                        user: user,
                                                                        rooms: findedRooms,
                                                                        isLogin: true,
                                                                        isSaved: false,
                                                                        isActive: 'create-company'
                                                                    });
                                                            } else {
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
                            res.render('error', {
                                    error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms) {
                                    if(err) {
                                        res.render('error', {
                                                error: err
                                            });
                                    } else {
                                        Company.find({}, function(err, companies) {
                                                if(err) {
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
                        res.render('error', {
                                error: err
                            });
                    } else {
                        Room.find({}, function(err, findedRooms) {
                                if(err) {
                                    res.render('error', {
                                            error: err
                                        });
                                } else {
                                    Company.find({}, function(err, companies){
                                            if(err) {
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
                                                                res.render('error', {
                                                                        error: err
                                                                    });
                                                            } else {
                                                                if(room === null) {
                                                                    roomToCreate.save(function(err) {
                                                                        if(err) {
                                                                            res.render('create-room', {
                                                                                    user: user,
                                                                                    rooms: findedRooms,
                                                                                    companies: companies,
                                                                                    isLogin: true,
                                                                                    isSaved: false,
                                                                                    isActive: 'create-room'
                                                                                });
                                                                        } else {
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
                            res.render('error', {
                                error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms){
                                    if(err) {
                                        res.render('error', {
                                            error: err
                                            });                                        
                                    } else {
                                        Company.find({}, function(err, companies) {
                                            if(err) {
                                                res.render('error', {
                                                        error: err
                                                    });
                                            } else {
                                                UserStatus.find({}, function(err, statuses){
                                                        if(err) {
                                                            res.render('error', {
                                                                    error: err
                                                                });
                                                        } else {
                                                            UserType.find({}, function(err, types) {
                                                                    if(err) {
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
                            res.render('error', {
                                error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms){
                                    if(err) {
                                        res.render('error', {
                                            error: err
                                            });                                        
                                    } else {
                                        Company.find({}, function(err, companies) {
                                            if(err) {
                                                res.render('error', {
                                                        error: err
                                                    });
                                            } else {
                                                UserStatus.find({}, function(err, statuses){
                                                        if(err) {
                                                            res.render('error', {
                                                                    error: err
                                                                });
                                                        } else {
                                                            UserType.find({}, function(err, types) {
                                                                    if(err) {
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
                            res.render('error', {
                                error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms){
                                    if(err) {
                                        res.render('error', {
                                            error: err
                                            });                                        
                                    } else {
                                        Company.find({}, function(err, companies) {
                                            if(err) {
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
                            res.render('error', {
                                error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms){
                                    if(err) {
                                        res.render('error', {
                                            error: err
                                            });                                        
                                    } else {
                                        Company.findOne({
                                                _id: req.params.company_id
                                            }, function(err, company) {
                                                    if(err) {
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
                        }
            });
        } else {
            res.render('/login');
        }
    });
//// Post single room
router.post('/companies/:company_id', load_user, function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            res.render('error', {
                                error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms){
                                    if(err) {
                                        res.render('error', {
                                            error: err
                                            });                                        
                                    } else {
                                        Company.findOne({
                                                _id: req.params.company_id
                                            }, function(err, company) {
                                                    if(err) {
                                                        res.render('error', {
                                                                error: err
                                                            });
                                                    } else {
                                                        company.name = req.body.name;
                                                        company.address = req.body.address;
                                                        company.site = req.body.site;
                                                        company.save(function(err) {
                                                                if(err) {
                                                                    res.render('edit-company', {
                                                                            user: user,
                                                                            rooms: findedRooms,
                                                                            company: company,
                                                                            isSaved: false,
                                                                            isLogin: true,
                                                                            isActive: 'edit-companies'
                                                                        });
                                                                } else {
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
                        }
            });
        } else {
            res.render('/login');
        }
    });
// Rooms
router.get('/rooms', load_user,function(req, res) {
        if(req.user) {
            User.findOne({
                    token: req.cookies.token
                }, function(err, user) {
                        if(err) {
                            res.render('error', {
                                error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms){
                                    if(err) {
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
                            res.render('error', {
                                error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms){
                                    if(err) {
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
                            res.render('error', {
                                error: err
                                });
                        } else {
                            Room.find({}, function(err, findedRooms){
                                    if(err) {
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
                                                                    res.render('error', {
                                                                            error: err
                                                                        });
                                                                } else {
                                                                    editingRoom.company = findedCompany;
                                                                    editingRoom.save(function(err) {
                                                                            if(err) {
                                                                                res.render('edit-room', {
                                                                                            user: user,
                                                                                            rooms: findedRooms,
                                                                                            room: editingRoom,
                                                                                            companies: companies,
                                                                                            isSaved: false,
                                                                                            isLogin: true,
                                                                                            isActive: 'edit-rooms'});
                                                                            } else {
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
                        }
            });                       
        } else {
            res.redirect('/login');
        }
    });
module.exports = router;