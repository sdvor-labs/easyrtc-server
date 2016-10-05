// Load models
let User = require('./models/user'),
    Company = require('./models/company'),
    UserStatus = require('./models/user_status'),
    UserType = require('./models/user_type'),
    config = require('./config'),
    Room = require('./models/room'),
    jwt = require('jsonwebtoken');
// Create default room, user_status, user_type if it
// don't created
/// For Company
//// Find all companies
function findCompany() {
    Company.find({}, function(err, lst) {
        // is find without errors
        if(!err){
            // if finding companies equal zero
            if(lst.length === 0 ) {
                // create object defaul company
                let defaultCompany = Company({
                    name: 'Строительный двор',
                    address: 'г.Тюмень, ул. Панфиловцев 86',
                    site: 'sdvor.com',
                    additionsl_information: 'Компания создана автоматически' 
                });
                // save defaule company
                defaultCompany.save(function(err){
                        if(err) throw err;
                        console.log('Default company created!');
                    });
            }
        } else {
            throw err;
        }
    });    
}

function findRooms() {
    ///// Find all rooms
    Room.find({}, function(err, lst) {
            // if find without errors
            if(lst.length === 0) {
                // find default company
                Company.find({name: 'Строительный двор'}, function(err, company) {
                        if(!err) {
                                let defaultRoom = Room({
                                        name: 'testroom',
                                        label: 'Тестовая комната',
                                        visiability: 'private',
                                        company: company
                                    });
                                defaultRoom.save(function() {
                                        if(err) throw err;
                                        console.log('Default room created!');
                                    });
                            } else {
                            throw err;
                        }
                        
                    });
            }
        });
}

///// Fins all status
function findUserStatus() {
    UserStatus.find({}, function(err, lst) {
            if(!err) {
                if(lst.length === 0) {
                    ['Онлайн', 'Офлайн', 'Занят', 'Отошёл'].forEach((i) => {
                            let tmp = UserStatus({
                                    name: i
                                });
                            tmp.save(function(err){
                                    if(err) throw err;
                                    console.log('Добавлен статус ', i);
                                })
                        });
                }
            } else {
                throw err;
            }
        });
}

///// Find all user types
function findUserType() {
    UserType.find({}, function(err, lst){
            if(!err) {
                if(lst.length === 0) {
                    ['клиент', 'сотрудник'].forEach((i) => {
                            let tmp = UserType({
                                    name: i
                                });
                            tmp.save(function(err) {
                                    if(err) throw err;
                                    console.log('Добавлен тип пользователя ', i);
                                });
                        });
                }
            } else {
                throw err;
            }
        });
}

///// Find all users
function findUsers() {
    User.find({}, function(err, lst) {
            if(!err) {
                if(lst.length === 0 ) {
                    Company.find({name: 'Строительный двор'}, function(errc, company) {
                            if(errc) {
                                throw errc;
                            } else {
                                UserStatus.find({name: 'Офлайн'}, function(errs, status) {
                                        if(errs) {
                                            throw errs;
                                        } else {
                                            UserType.find({name: 'сотрудник'}, function(errt, userType) {
                                                    if(errt) {
                                                        throw errt;
                                                    } else {
                                                        let defauleUser = User({
                                                            name: 'Иван',
                                                            surname: 'Иванович',
                                                            lastname: 'Иванов',
                                                            username: 'testuser',
                                                            password: 'testuser123',
                                                            admin: false,
                                                            location: 'Тестовое расположение',
                                                            mobile: '89324700000',
                                                            status: status,
                                                            company: company,
                                                            user_type: userType,
                                                            created_at: Date.now(),
                                                            last_online: null,
                                                            updated_at: null,
                                                            token: null,
                                                            additional_info: 'Пользователь по умолчанию'
                                                        });
                                                        defauleUser.save()
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
    
                }
            } else {
                throw err;
            }
        });
}

let utils = function(command, cookies) {
    if(command === 'firstRun'){
        findCompany();
        findRooms();
        findUserStatus();
        findUserType();
        findUsers();
        return true;
    } else if(command === 'tokenVerifity') {
        console.log('Verifity token function');
        console.log('Hi, this is token: ', cookies);
        if(cookies) {
            User.findOne({
                token: cookies
                }, function(err, user) {
                        if(err) {
                            throw err;
                        } else {
                            if(!user) {
                                return false;
                            } else {
                                jwt.verify(cookies, config.secret, function (erru, decoded) {
                                    if (err) {
                                        console.log('Failed');
                                        return false;
                                    } else {
                                        console.log('Success');
                                        console.log(decoded);
                                        // if everything is good, save to request for use in other routes
                                        return true;
                                    }
                                });
                            }
                        }
                    });
        } else {
            return false;
        }
    }
};

let unless_route = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};


module.exports = {utils, unless_route};