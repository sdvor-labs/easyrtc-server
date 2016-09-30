// Load express modules
let express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
// Mongo-express
let mongoExpress = require('mongo-express/lib/middleware'),
    mongoExpressConfig = require('./mongo_express_config');
// Load routes
let routes = require('./routes/index'),
    users = require('./routes/users'),
    about = require('./routes/about'),
    test = require('./routes/test');
// Load Mongoose ODM
var mongoose = require('mongoose');
mongoose.connect('mongodb://10.0.16.101/newDB');
// Load models
var User = require('./models/user'),
    Company = require('./models/company'),
    UserStatus = require('./models/user_status'),
    UserType = require('./models/user_type'),
    Room = require('./models/room');
// Set process name
process.title = 'node-easyrtc';
// Create express application
let app = express();
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Application settings
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// MongoConfig
app.use('/mongoadmin', mongoExpress(mongoExpressConfig));
//app.use('/mongo_express', mongoExpressConfig);
// Import routes
app.use('/', routes);
app.use('/users', users);
app.use('/about', about);
app.use('/test', test);
// Create default room, user_status, user_type if it
// don't created
/// For Company
//// Find all companies
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
///// Find all rooms
Room.find({}, function(err, lst) {
        // if find without errors
        if(lst.length === 0) {
            // find default company
            Company.find({name: 'Строительный двор'}, function(err, company) {
                    if(!err) {
                            let defaultRoom = Room({
                                    name: 'Тестовая комната',
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
///// Fins all status
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
///// Find all user types
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
///// Find all users
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
/// Catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
// Export module app to node,js
module.exports = app;
