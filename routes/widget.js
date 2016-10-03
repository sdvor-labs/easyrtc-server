let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js');
/* GET about listing. */
router.get('/:room_name', function(req, res) {
    Room.findOne({'name': req.params.room_name}, function(err, findedRoom){
            if(err) {
                throw err;
            } else {
                console.log(findedRoom);
                res.render('widget', { roomLabel: findedRoom.label,
                                        roomName: req.params.room_name});
            }
        });
});

module.exports = router;