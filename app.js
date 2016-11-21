/**
 * @author Dmitry Shevelev
 * @author Nikita Kotov
 * @version 0.9 BETA
 * @file ExpressJS application with all requires
 * @description File with code main express app
 */
let express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    utils = require('./utils'),
    mongoExpress = require('mongo-express/lib/middleware'),
    mongoExpressConfig = require('./mongo-config'),
    routes = require('./routes/index'),
    profile = require('./routes/profile'),
    widget = require('./routes/widget'),
    logout = require('./routes/logout'),
    code = require('./routes/code'),
    api = require('./routes/api'),
    login = require('./routes/login'),
    pages = require('./routes/pages'),
    journals = require('./routes/journals');

let mongoose = require('mongoose');
mongoose.connect('mongodb://10.0.16.101/newDB');

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
app.use('/login', login);
app.use('/api', api);
app.use('/widget', widget);
app.use('/profile', profile);
app.use('/logout', logout);
app.use('/widgets-and-code', code);
app.use('/pages', pages);
app.use('/journals', journals);
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
