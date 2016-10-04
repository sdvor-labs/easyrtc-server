let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js');
/* GET home page. */
router.get('/', function(req, res) {
  Room.find({}, function(err, roomsList){
      if(err) {
          res.render('index', { rooms: 'Null' });
      } else {
          console.log('Finded rooms: ', roomsList);
          res.render('index', {
                                rooms: roomsList,
                                test: 'test'  
                              }); 
      }
    });
});

module.exports = router;
