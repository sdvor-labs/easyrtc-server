/**
 * @author Dmitry Shevelev
 * @author Nikita Kotov
 * @version 0.9 BETA
 * @file ExpressJS application with all requires
 * @description File with code main express app
 */

/**
 * ExpressJS - NodeJS web-framework
 * @require express
 * @see {@link http://expressjs.com/}
 */
let express = require('express'),
/**
 * Standart NodeJS package
 * @requires path
 */ 
    path = require('path'),
/**
 * Standart NodeJS package
 * @requires favicon
 */
    favicon = require('static-favicon'),
/**
 * HTTP request logger middleware for node.js
 * @requires morgan
 */
    logger = require('morgan'),
/**
 * Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
 * @requires cookie-parser
 */
    cookieParser = require('cookie-parser'),
/**
 * Standart express package for work with session
 * @requires express-session
 */
    session = require('express-session'),
/**
 * An implementation of JSON Web Tokens. This was developed against draft-ietf-oauth-json-web-token-08. It makes use of node-jws
 * @requires jsonwebtoken
 */
    jwt = require('jsonwebtoken'),
/**
 * Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
 * @requires body-parser
 */
    bodyParser = require('body-parser'),
/**
 * Require config file
 * @external config
 */
    config = require('./config'),
/**
 * External file with helper functions
 * @external utils
 */
    utils = require('./utils'),
/**
 * Require monge-express NodeJS package
 * @requires mongo-express
 */
    mongoExpress = require('mongo-express/lib/middleware'),
/**
 * Require external config file with settings connect to MongoDB for mongoadmin
 * @external middlware
 */
    mongoExpressConfig = require('./mongo_express_config'),
/**
 * External file with router 'index'
 * @external index
 */
    routes = require('./routes/index'),
/**
 *External file with router 'users'
 * @external users
 * @todo Delete this router
 */
    users = require('./routes/users'),
 /**
  * External file with router 'about'
  * @external about
  */
    about = require('./routes/about'),
/**
 * External file with router 'profile'
 * @external profile
 */
    profile = require('./routes/profile'),
/**
 * External file with router 'widget'
 * @external widget
 */
    widget = require('./routes/widget'),
/**
 * External file with router 'logout'
 * @external logout
 */ 
    logout = require('./routes/logout'),
/**
 * External file with router 'code' (generatiob code of widgets)
 * @external code
 */
    code = require('./routes/code'),
/**
 * External file with router 'api' (all open to big world funtions)
 * @external api
 */
    api = require('./routes/api'),
/**
 * External file with router 'login'
 * @external login
 */
    login = require('./routes/login');
/**
 * Require mongoose NodeJS package & connect to database
 * @requires mogoose
 */
let mongoose = require('mongoose');
mongoose.connect('mongodb://10.0.16.101/newDB');
/**
 * External file with model for users (workers)
 * @external user
 */
let User = require('./models/user'),
/**
 * External file with model for companies 
 * @external company
 */
    Company = require('./models/company'),
/**
 * External file with model for user statuses
 * @external user_status
 */
    UserStatus = require('./models/user_status'),
/**
 * External file with model for users types
 * @external user_type
 */
    UserType = require('./models/user_type'),
/**
 * External file with model for users rtc tokens
 * @external user_rtc_token
 */
    UserRtcToken = require('./models/user_rtc_token'),
/**
 * External file with model for rooms
 * @external room
 */
    Room = require('./models/room'),
/**
 * External file with model for logs entries
 * @external log_entry
 */
    logEntry = require('./models/log_entry');
/* Set title EasyRTC server*/
process.title = 'node-easyrtc';
/* Create express application */
let app = express();
/* @todo move to config */
app.locals.secret = config.secret;
/* Session enable */
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
/* *Application settings */
app.use(favicon());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
/* MongoConfig for mongoadmin */
app.use('/mongoadmin', mongoExpress(mongoExpressConfig));
/* Import routes */
app.use('/', routes);
app.use('/users', users);
app.use('/about', about);
app.use('/login', login);
app.use('/api', api);
app.use('/widget', widget);
app.use('/profile', profile);
app.use('/logout', logout);
app.use('/widgets-and-code', code);
/**
 * @function
 * @name utils
 * @param {string} - what do
 * @description This function create collections in MongoDB when application run first time
 */
utils.utils('firstRun').then((resRun) => {
        console.log('First run function: ', resRun); 
    });
/**
 * Catch 404 and forwarding to error handler
 * @function
 * @param {object} - object request
 * @param {object} - object response
*/
app.use(function(req, res, next) {
    utils.appLogger('error', 'ERROR 404', `Error 404 (Not found). Error message: ${err}.`);        
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/* Error handlers (development error handler). Will print stacktrace */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        utils.appLogger('error', `ERROR ${err.status}`, `Error 404 (${err.message}). Error message: ${err}.`);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
/* Production error handler, no stacktraces leaked to user */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    utils.appLogger('error', `ERROR ${err.status}`, `Error 404 (${err.message}). Error message: ${err}.`);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
/**
 * ExpressJS application object
 * @exports app
 */
module.exports = app;