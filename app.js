/* variables declaration block */
// Load express modules
let express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser');
// Mongo-express
let mongoExpress = require('mongo-express/lib/middleware'),
    mongoExpressConfig = require('./mongo_express_config');
// Load routes
let routes = require('./routes/index'),
    users = require('./routes/users'),
    about = require('./routes/about'),
    widget = require('./routes/widget'),
    test = require('./routes/test'),
    login = require('./routes/login');
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
/* end of variables declaration block */



/* express app routes, modules etc. */
// Sessions enable
app.set('trust proxy', 1);
app.use(session({
    secret: 'very secret secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
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
app.use('/widget', widget);
/* end of express app routes, modules etc. */
// For first run
let utils = require('./utils.js');
console.log('Is first run', utils('firstRun'));
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
