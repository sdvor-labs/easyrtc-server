let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js'),
    load_user = require('../middleware/load_user');

/* GET about listing. */
router.get('/', load_user,function(req, res) {
  if(req.user) {
    Room.find({}, function(err, roomsList){
      if(err) {
        res.render('about', { rooms: 'Null' });
      } else {
        res.render('about', {
                              rooms: roomsList,
                              isLogin: true  });
      }
    });
  } else {
    Room.find({visiability: 'public'}, function(err, roomList) {
      if(err){
        res.render('about', {rooms: 'Null'});
      } else {
        res.render('about', {
                              rooms: roomList,
                              isLogin: false}); 
      }
    });
  }
});

module.exports = router;