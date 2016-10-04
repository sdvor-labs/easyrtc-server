// Load modules
let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js');
/* GET about listing. */
router.get('/:room_name', function(req, res) {
    Room.findOne({'name': req.params.room_name}, function(err, findedRoom){
            if(err) {
                throw err;
            } else {
                if(findedRoom !== null) {
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