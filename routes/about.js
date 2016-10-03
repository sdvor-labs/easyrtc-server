let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js');

/* GET about listing. */
router.get('/', function(req, res) {
  Room.find({}, function(err, roomsList){
      if(err) {
          res.render('about', { rooms: 'Null' });
      } else {
          console.log('Finded rooms: ', roomsList);
          res.render('about', { rooms: roomsList }); 
      }
    });
});

module.exports = router;