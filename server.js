#!/usr/bin/nodejs
let Room = require('./models/room.js'),
    logEntry = require('./models/log_entry'),
    app = require('./app'),
    fs = require('fs'),
    http = require('http'),
    UserRtcToken = require('./models/user_rtc_token'),
    https = require('https'),
    privateKey = fs.readFileSync('key.pem', 'utf8'),
    certificate = fs.readFileSync('cert.pem', 'utf8'),
    credentials = {
        key: privateKey,
        cert: certificate
    },
    socketIo = require('socket.io'),
    easyrtc = require('../'),
    utils = require('./utils.js'),
    httpServer = http.createServer(app).listen(3000),
    httpsServer = https.createServer(credentials, app).listen(8080),
// Start socket.io so it attaches itself to Express server
    socketServer = socketIo.listen(httpsServer, {'log level': 1}, function() {
        utils.appLogger('run', 'Start cocket-server', `Success starting socketIo server`);
    });

easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function (socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function (err, connectionObj) {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            utils.appLogger('error', 'EasyRTC connect', `Fail, when app try auth  user on EasyRTC server (${connectionObj}). Error message: ${err}.`);
            return;
        }
        connectionObj.setField("credential", msg.msgData.credential, {"isShared": false});
        console.log("[" + easyrtcid + "] Credential saved!", connectionObj.getFieldValueSync("credential"));
        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function (connectionObj, roomName, roomParameter, callback) {
    connectionObj.getEasyrtcid();
    let token = connectionObj.getEasyrtcid();
    UserRtcToken.findOne({
        $or: [
              {user: connectionObj.getFieldValueSync("credential").user_id},
              {username: connectionObj.getUsername()}
             ],
        room: connectionObj.getFieldValueSync("credential").room_id
    }, function (err, user_rtc) {
        if(err) {
            utils.appLogger('error', 'Finding document', `Error, when app finding document. Error message: ${err}.`);
        } else {
            if (!user_rtc) {
                let user = UserRtcToken({
                    rtc_token: token,
                    room: connectionObj.getFieldValueSync("credential").room_id,
                    username: connectionObj.getUsername(),
                    user: connectionObj.getFieldValueSync("credential").user_id,
                });
                user.save(function(err) {
                        if(err) {
                            utils.appLogger('fail', 'Fail adding document', `Fail, when app try adding UserRtcRoken ${user}. Error message: ${err}.`);
                        } else {
                            utils.appLogger('success', 'Success adding document', `Success, when server try adding UserRtcRoken ${user}.`);
                        }
                    });
            }
            else {
                user_rtc.update({rtc_token: token}).exec(function(err){
                        if(err) {
                            utils.appLogger('fail', 'Fail update document', `Fail, when app try update UserRtcRoken ${user_rtc}. Error message: ${err}.`);
                        } else {
                            utils.appLogger('success', 'Success adding document', `Success adding UserRtcRoken ${user_rtc}.`);     
                        }
                    });
            }
        }
    });
    
    if(connectionObj.getFieldValueSync("credential").user_id) {
        utils.appLogger('success', 'Join room', `Success join in room ${connectionObj.getFieldValueSync("credential").room_id} with user ID ${connectionObj.getFieldValueSync("credential").user_id}.`);
    }
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});


easyrtc.events.on("roomLeave", function (connectionObj, roomName, roomParameter, callback) {
    let token = connectionObj.getEasyrtcid();
    UserRtcToken.findOne({
        $or: [
              {user: connectionObj.getFieldValueSync("credential").user_id},
              {username: connectionObj.getUsername()}
              ],
        room: connectionObj.getFieldValueSync("credential").room_id
    }, function (err, user_rtc) {
        if(err) {
            utils.appLogger('fail', 'Finding document', `Error, when app finding document. Error message: ${err}.`);
        } else {
            user_rtc.update({rtc_token: null}).exec(function(err) {
                    if(err) {
                        utils.appLogger('fail', 'Fail adding document', `Fail, when app try adding UserRtcRoken ${user_rtc}. Error message: ${err}.`);
                    } else {
                        utils.appLogger('success', 'Success adding document', `Success adding UserRtcRoken ${user_rtc}.`);
                    }
                });
        }
    });
    easyrtc.events.defaultListeners.roomLeave(connectionObj, roomName, roomParameter, callback);
});


// Start EasyRTC server
let easyercServer = easyrtc.listen(app, socketServer, null, function (err, rtc) {
        if(err) {
            utils.appLogger('error', 'EasyRTC start', `Error, when server tre start EasyRTC app. Error message: ${err}`);
        } else {
            console.log("Initialized EasyRTC server");
            console.log('Creatiing new EasyRTC App...');
            rtc.createApp(
                'easyrtc.videochat',
                {
                    'roomAutoCreateEnable': false,
                    'roomDefaultEnable': false
                },
                myEasyrtcApp
            );
            utils.appLogger('success', 'EasyRTC server start', `EasyRTC server starting`);
        }
    }
);

let myEasyrtcApp = function (err, appObj) {
    Room.find({}, function (err, roomsList) {
        if (err) {
            utils.appLogger('error', 'Finding rooms', `Error, when server try search all rooms. Error message: ${err}`);
        } else {
            roomsList.forEach((item) => {
                appObj.createRoom(item.name, null, function (err, roomObj) {
                    if(err) {
                        utils.appLogger('error', 'Adding room', `Error, when server try adding room ${item.name}. Error message: ${err}`);
                    } else {
                        utils.appLogger('success', 'Adding room', `${item.name} room added. `);
                    }
                });
            });
        }
    });
};

// Listen http & https servers on different ports
httpServer.listen(3000, '10.0.46.83', function () {
    utils.appLogger('run', 'Starting HTTP server', 'Run http server & listener');
    console.log('<SERVER>: Listening on http://10.0.46.83:3000');
});
httpsServer.listen(8080, '10.0.46.83', function () {
    utils.appLogger('run','Starting HTTPS server', 'Run http server & listener');
    console.log('<SERVER>: Listening on https://10.0.46.83:8080')
});