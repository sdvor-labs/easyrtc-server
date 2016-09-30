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
