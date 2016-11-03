let Room = require('../models/room');

function loadRooms(req, res, next) {
    Room.find({}, function (err, rooms) {
            if (rooms) {
                req.rooms = rooms;
                next();
            } else {
                req.rooms = rooms;
                next();
            }
    });
}

module.exports = loadRooms;