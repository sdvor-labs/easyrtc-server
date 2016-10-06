// Load modules
let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js'),
    load_user = require('../middleware/load_user');
/* GET about listing. */
router.get('/:room_name', load_user, function(req, res) {
    Room.findOne({'name': req.params.room_name}, function(err, findedRoom){
            if(err) {
                throw err;
            } else {
                if(findedRoom !== null) {
                    if (findedRoom.visiability == 'private')
                        if (req.user)
                            res.render('widget', { roomLabel: findedRoom.label,
                                                 roomName: req.params.room_name});
                        else
                            res.redirect('/login');
                    else
                        res.render('widget', { roomLabel: findedRoom.label,
                            roomName: req.params.room_name});
                } else {
                    res.render('error-room');
                }        
            }
        });
});
// Module exports
module.exports = router;