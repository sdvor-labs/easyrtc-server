/* variables declaration block */
// Load express modules
let express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    morgan = require('morgan'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    config = require('./config');
// Mongo-express
let mongoExpress = require('mongo-express/lib/middleware'),
    mongoExpressConfig = require('./mongo_express_config');
// Load routes
let routes = require('./routes/index'),
    users = require('./routes/users'),
    about = require('./routes/about'),
    profile = require('./routes/profile'),
    widget = require('./routes/widget'),
    logout = require('./routes/logout'),
    code = require('./routes/code'),
    api = require('./routes/api'),
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
// TODO: move to config
app.locals.secret = config.secret;
/* end of variables declaration block */



/* express app routes, modules etc. */
// Sessions enable
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Application settings
app.use(favicon());
app.use(logger('dev'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// MongoConfig
app.use('/mongoadmin', mongoExpress(mongoExpressConfig));
//app.use('/mongo_express', mongoExpressConfig);
// Import routes
app.use('/', routes);
app.use('/users', users);
app.use('/about', about);
app.use('/login', login);
app.use('/api', api);
app.use('/widget', widget);
app.use('/profile', profile);
app.use('/logout', logout);
app.use('/widgets-and-code', code);
/* end of express app routes, modules etc. */
// For first run
let utils = require('./utils.js');
utils.utils('firstRun').then((resRun) => {
        console.log('First run function: ', resRun); 
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
