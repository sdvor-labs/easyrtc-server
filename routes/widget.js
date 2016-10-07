// Load modules
let express = require('express'),
    router = express.Router(),
    util = require('util'),
    Room = require('../models/room.js'),
    load_user = require('../middleware/load_user');
/* GET about listing. */
router.get('/:room_name', load_user, function (req, res) {
    Room.findOne({'name': req.params.room_name}, function (err, findedRoom) {
        if (err) {
            throw err;
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
                    userType = 'client'
                }
                if (findedRoom.visiability == 'private')
                    if (req.user)
                        res.render('widget', {
                            roomLabel: findedRoom.label,
                            roomName: req.params.room_name,
                            onload: onloadText,
                            userType: userType
                        });
                    else
                        res.redirect('/login');
                else
                    res.render('widget', {
                        roomLabel: findedRoom.label,
                        roomName: req.params.room_name,
                        onload: onloadText,
                        userType: userType
                    });
            } else {
                res.render('error-room');
            }
        }
    });
});
// Module exports
module.exports = router;