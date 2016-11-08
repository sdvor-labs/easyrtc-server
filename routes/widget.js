// Load modules
let express = require('express'),
    router = express.Router(),
    util = require('util'),
    utils = require('../utils'),
    Room = require('../models/room'),
    load_user = require('../middleware/load_user'),
    Question = require('../models/question'),
    User = require('../models/user');
/* GET about listing. */
router.get('/:room_name', load_user, function (req, res) {
    let clientData = {};
    
    if(req.param('clientInfo')) {
        clientData.clientInfo = true;
        clientData.username = req.param('username');
        clientData.userfio = req.param('fio');
        clientData.city = req.param('city');
    } else {
        clientData.clientInfo = false;
        clientData.username = 'anonymous';
        clientData.userfio = 'Анонимный Пользователь';
        clientData.city =req.param('city');
    }
    
    Room.findOne({'name': req.params.room_name}, function (err, findedRoom) {
        if (err) {
            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document type ROOM (${req.params.room_name}). Error message: ${err}.`);
            res.render('error', {
                    error: err
                });
        } else {
            if (findedRoom !== null) {
                //"easyrtc.setUsername(%s);easyrtc.setCredential({'user_id': %s});
                let onloadText =util.format("%s clientInit();");
                let userType = null;
                if (req.user) {
                    onloadText = util.format(onloadText, util.format("easyrtc.setUsername('%s');easyrtc.setCredential({'user_id': '%s', 'room_id': '%s'});", req.user.username, req.user.id, findedRoom.id));
                    userType = 'worker';
                }
                else {
                    onloadText = util.format(onloadText, util.format("easyrtc.setUsername('%s');easyrtc.setCredential({'room_id': '%s'});", "client", findedRoom.id));
                    userType = 'client';
                }
                if (findedRoom.visiability == 'private') {
                    if (req.user) {
                        res.render('widget', {
                            roomLabel: findedRoom.label,
                            roomName: req.params.room_name,
                            onload: onloadText,
                            userType: userType,
                            needCheck: req.param('need_check') || 'not-need'
                        });
                    } else {
                        res.redirect('/login');
                    }
                } else {
                    Question.find({
                            pollsType: userType
                        }, function(err, questions) {
                            if(err) {
                                utils.appLogger('fail', 'Fail finding documents (questions)', `Fail, when app try finding document type QUESTIONS. Error message: ${err}.`);
                            } else {
                                res.render('widget', {
                                    clientData: clientData,
                                    myQuestions: questions,
                                    roomLabel: findedRoom.label,
                                    roomName: req.params.room_name,
                                    onload: onloadText,
                                    userType: userType,
                                    needCheck: req.param('need_check') || 'not-need'
                                });   
                            }
                    });
                }
            } else {
                res.render('error-room');
                utils.appLogger('fail', 'Fail opening room', `User can not opening room with name - ${req.params.room_name}`);
            }
        }
    });
});
// add view with token
router.get('/:room_name/:token', function(req, res) {
    User.findOne({token: req.params.token}, function(err, findedUser){
            if(err) {
                utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with token (${req.params.token}). Error message: ${err}.`);
                res.render('error', {
                        error: err
                    });
            } else {
                Room.findOne({name: req.params.room_name}, function(err, findedRoom){
                        if(err){
                            utils.appLogger('fail', 'Fail finding document (room)', `Fail, when app try finding document type ROOM (${req.params.room_name}). Error message: ${err}.`);
                            res.render('error', {
                                    error: err
                                });
                        }else{
                            let userType = 'worker';
                            let onloadText = util.format("%s clientInit();");
                            onloadText = util.format(onloadText, util.format("easyrtc.setUsername('%s');easyrtc.setCredential({'user_id': '%s', 'room_id': '%s'});", findedUser.username, findedUser.id, findedRoom.id));
                            res.render('widget', {
                                roomLabel: findedRoom.label,
                                roomName: req.params.room_name,
                                onload: onloadText,
                                userType: userType,
                                needChack: 'not-need'
                            });        
                        }
                    });
            }
        });
});
// Module exports
module.exports = router;