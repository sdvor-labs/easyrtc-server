// Load models
let User = require('./models/user'),
    Company = require('./models/company'),
    UserStatus = require('./models/user_status'),
    UserType = require('./models/user_type'),
    menuItem = require('./models/menu_item'),
    config = require('./config'),
    Room = require('./models/room'),
    jwt = require('jsonwebtoken'),
    logEntryCall = require('./models/log_calls'),
    logEntry = require('./models/log_entry'),
    logAnswers = require('./models/log_answers'),
    question = require('./models/question'),
    EntryConnect = require('./models/log_connect'),
    logFailedTokenize = require('./models/failed_tokenize'),
    missedCalls = require('./models/missed_calls'),
    settingServer = require('./models/settings'),
    Page = require('./models/page');

// Create default room, user_status, user_type if it
// don't created
/// For Company
//// Find all companies
function findCompany() {
    let promise = new Promise((resolve, reject) => {
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
                            resolve(true);
                        });
                } else {
                    resolve(false);
                }
            } else {
                throw err;
            }
        });
    });
    return promise;
}

function findRooms() {
    ///// Find all rooms
    let promise = new Promise((resolve, reject) => {
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
                                        resolve(true);
                                    });
                            } else {
                            throw err;
                        }
                        
                    });
            } else {
                resolve(false);
            }
        });
    });
    return promise;
}

///// Fins all status
function findUserStatus() {
    let promise = new Promise((resolve, reject) => {
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
                                        resolve(true);
                                    });
                            });
                    } else {
                        resolve(false);
                    }
                } else {
                    throw err;
                }
            });
    });
    return promise;
}

// Find all pages
function findPages() {
    let promise = new Promise((resolve, reject) => {
            Page.find({}, function(err, lst) {
                    if(!err) {
                        if(lst.length === 0) {
                            let tmp = Page({
                                    name: 'index',
                                    title: 'Сервис видеочата компании',
                                    subtitle: 'Подзаголовок страницы',
                                    text: 'текст'
                                });
                            tmp.save(function(err) {
                                if(err){
                                    throw err;
                                }else{
                                    console.log('Добавлена главная страница');
                                    resolve(true);
                                }
                            });
                        }else {
                            resolve(false);   
                        }
                    } else {
                        throw err;
                    }
                });
        });
    return promise;
}
///// Find all menus
function findMenuItems() {
    let promise = new Promise((resolve, reject) => {
            menuItem.find({}, function(err, lst) {
                    if(err) {
                        throw err;
                    } else {
                        if(lst.length === 0) {
                            Page.findOne({
                                    name: 'index',
                                }, function(err, findedPage) {
                                        if(err) {
                                            throw err;
                                        } else {
                                            let tmp = menuItem({
                                                name: 'index',
                                                label: 'Главная',
                                                visiability: true,
                                                page: findedPage
                                            });
                                            tmp.save(function(err) {
                                                if(err) {
                                                    throw err;
                                                } else {
                                                    console.log('Добавлен пункт меню для главной страницы');
                                                    resolve(true);
                                                }
                                            });
                                        }
                                    });
                        } else {
                            resolve(false);
                        }
                    }
                });
        });
    return promise;
}
///// Find all user types
function findUserType() {
    let promise = new Promise((resolve, reject) => {
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
                                    resolve(true);
                                });
                        });
                } else {
                    resolve(false);
                }
            } else {
                throw err;
            }
        });
    });
    return promise;
}
///// Find all users
function findUsers() {
    let promise = new Promise((resolve, reject) => {
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
                                                            defauleUser.save(function(err) {
                                                                    if(err) {
                                                                        console.log('Default user not created, error: ', err);
                                                                    } else {
                                                                        console.log('Default user created!');
                                                                        resolve(true);
                                                                    }
                                                                });
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
        
                    } else {
                        resolve(false);
                    }
                } else {
                    throw err;
                }
            });
    });
    return promise;
}
function testingCallLog() {
    let promise = new Promise((resolve, reject) => {
                    logEntryCall.find({}, function(err, lst) {
                            if(err) {
                                throw err;
                            } else {
                                if(lst.length === 0) {
                                    let tmp = logEntryCall({
                                            callStart: Date.now(),
                                            callEnd: Date.now(),
                                            employeeToken: 'Без сотрудника',
                                            customerToken: 'Без клиента',
                                            description: 'Тестовая запись'
                                        });
                                    tmp.save(function(err) {
                                        if(err) {
                                            throw err;
                                        } else {
                                            console.log('Добавлена тестовая запись в журнал звонков');
                                            resolve(true);
                                        }
                                    });
                                } else {
                                    resolve(false);
                                }
                            }
                        });
        });
    return promise;
}
/* Function for testing answer journal */
function testingAnswerJournal() {
    let promise = new Promise((resolve, reject) => {
                    logAnswers.find({}, function(err, lst) {
                            if(err) {
                                throw err;
                            } else {
                                if(lst.length === 0) {
                                    let tmp = logAnswers({
                                            pollsType: 'testing',
                                            date: Date.now(),
                                            answersToPolls: ['Tisting answer!'],
                                            employeeRtcToken: "123",
                                            custometRtcToken: "231" ,
                                            comments: 'Тестовая запись' 
                                        });
                                    tmp.save(function(err) {
                                        if(err) {
                                            throw err;
                                        } else {
                                            console.log('Добавлена тестовая запись в журнал ответов на опоросы');
                                            resolve(true);
                                        }
                                    });
                                } else {
                                    resolve(false);
                                }
                            }
                        });
        });
    return promise;
}
/* Function for testing answer journal */
function testingQuestions() {
    let promise = new Promise((resolve, reject) => {
                    question.find({}, function(err, lst) {
                            if(err) {
                                throw err;
                            } else {
                                if(lst.length === 0) {
                                    let tmp = question({
                                            pollsType: 'testing',
                                            date: Date.now(),
                                            questionText: 'Вы видите текст тестового вопроса?',
                                            answerOne: 'Да',
                                            answerTwo: 'Нет',
                                            answerThree: 'Не знаю',
                                            answerFore: 'Не скажу'
                                        });
                                    tmp.save(function(err) {
                                        if(err) {
                                            throw err;
                                        } else {
                                            console.log('Добавлена тестовая запись в список вопросов');
                                            resolve(true);
                                        }
                                    });
                                } else {
                                    resolve(false);
                                }
                            }
                        });
        });
    return promise;
}
/* Function for test jiurnals connection */
function testConnectionJournal() {
    return new Promise((resolve, reject) => {
            EntryConnect.find({}, function(err, lst) {
                    if(err) {
                        throw err;
                    } else {
                        if(lst.length === 0) {
                            let tmpEntry = EntryConnect({
                                    clientInfo: true,
                                    username: 'anonymous',
                                    userfio: 'Анонимный Пользователь',
                                    city: 'Без города',
                                    easyRtcToken: 'none',
                                    date: Date.now()
                                });
                            tmpEntry.save(function(err) {
                                    if(err){
                                        console.log(err);
                                        resolve(false);
                                    } else {
                                        console.log('Добавлена тестовая запись в журнал соединений');
                                        resolve(true);
                                    }
                                });
                        } else {
                            resolve(false);
                        }
                    }
                });
        });
}


function testFailedTokenize() {
    return new Promise((resolve, reject) => {
            logFailedTokenize.find({}, (err, lst) => {
                    if (err) {
                        throw err;
                    } else {
                        if (lst.length === 0) {
                            let tmpEntry = logFailedTokenize({
                                    userInfo: 'No user info',
                                    date: Date.now(),
                                    userAgent: 'No user agent',
                                    error: 'Test entry'
                                });
                            tmpEntry.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                        resolve(false);
                                    } else {
                                        console.log('Добавлена тестовая запись в журнал неуспешных соединений');
                                        resolve(true);
                                    }
                                });
                        } else {
                            resolve(false);
                        }
                    }
                });
        });
}

function testMissedCallsJournals() {
    return new Promise((resolve, reject) => {
            missedCalls.find({}, (err, lst) => {
                    if (err) {
                        throw err;
                    } else {
                        if (lst.length === 0) {
                            let tmpEntry = missedCalls({
                                    userInfo: 'No user info',
                                    date: Date.now(),
                                    easyRtcToken: 'no token'
                                });
                            tmpEntry.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                        resolve(false);
                                    } else {
                                        console.log('Добавленка тестовая запись в журнал пропущенных звонков');
                                        resolve(true);
                                    }
                                });
                        } else {
                            resolve(false);
                        }
                    }
                });
        });
}

function defaultSettingGeneration() {
    return new Promise((resolve, reject) => {
            settingServer.find({}, (err, lst) => {
                    if (err) {
                        throw err;
                    } else {
                        if (lst.length === 0) {
                            let defaultSettings = settingServer({
                                    name: 'displayWidgets',
                                    value: true
                                });
                            defaultSettings.save(function(err) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log('Добавлены настройки сервера по умолчанию');
                                    resolve(true);
                                }
                            });
                        } else {
                            resolve(false);
                        }
                    }
                });
        });
}

// TODO: Rewrite this on promise all
/* Function for first run */
function doFirstRun() {
    return new Promise((resolve, reject) => {
        findCompany().then((resCompany) => {
                console.log('Need to create company: ', resCompany);
                findRooms().then((resRooms) => {
                        console.log('Need to create room: ', resRooms);
                        findUserStatus().then((resStatus) => {
                                console.log('Need to create statuses: ', resStatus);
                                findUserType().then((resTypes) => {
                                        console.log('Need to create user types: ', resTypes);                      
                                        findUsers().then((resUser) => {
                                                console.log('Need to create default user: ', resUser);
                                                findPages().then((resPages) => {
                                                        console.log('Need to create default page: ', resPages);
                                                        findMenuItems().then((resMenuItem) => {
                                                                console.log('Need to create default menu item: ', resMenuItem);
                                                                testingCallLog().then((resTestingLog) => {
                                                                        console.log('Testing call log (create testing entry): ', resTestingLog);
                                                                        testingAnswerJournal().then((resTestAnswer) => {
                                                                                console.log('Testing answer log (create testing entry): ', resTestAnswer);
                                                                                testingQuestions().then((resTestingQuestion) => {
                                                                                        console.log('Testing question list (create testing entry): ', resTestingQuestion);
                                                                                        testConnectionJournal().then((resTest) => {
                                                                                            console.log('Testing connection journals', resTest);
                                                                                            testFailedTokenize().then((errTokenize) => {
                                                                                                console.log('Testing journal of tokenize error: ', errTokenize);
                                                                                                testMissedCallsJournals().then((errMissedCalls) => {
                                                                                                        console.log('Testing journal of index call: ', errMissedCalls);
                                                                                                        defaultSettingGeneration().then((errSettings) => {
                                                                                                                console.log('Default server settings: ', errSettings);
                                                                                                                resolve(true);
                                                                                                            });
                                                                                                    });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                            });
                                                                    });
                                                            });
                                                });
                                            });
                                    });
                            });
                    });
            });
    });
}

function doVerifityToken(token, callback, res) {
    let promise = new Promise((resolve, reject) => {
            if(token) {
                User.findOne({
                    token: token
                }, function(err, user) {
                    if(err) {
                        resolve(err);
                    } else {
                        if(!user) {
                            resolve(false);
                        } else {
                            jwt.verify(token, config.secret, function (erru, decoded) {
                                if (erru) {
                                    resolve(false);
                                } else {
                                    if(decoded) {
                                        resolve(true);
                                    } else {
                                        resolve(false);
                                    }
                                }
                            });
                        }
                    }
                });
                } else {
                    resolve(false);
                }
            });
    return promise;
}

let utils = function(command, cookies) {
    if(command === 'firstRun'){
        return doFirstRun();
    } else if(command === 'tokenVerifity') {
        return doVerifityToken(cookies);
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

let appLogger = function(type ,action, description) {
    console.log('<LOGGER>: Adding entry to log');
    let logEntryToCreate = logEntry({
            type_error: type, 
            date: Date.now(),
            action: action,
            description: description
        });
    logEntryToCreate.save(function(err) {
            if(err) {
                console.log('<LOGGER>: WARNING!!!! Server app can not create log entry in database!');
            } else {
                console.log('<LOGGER>: Log entry added.');
            }
        });
};


module.exports = {utils, unless_route, appLogger};