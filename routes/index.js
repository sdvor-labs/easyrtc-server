let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js'),
    load_user = require('../middleware/load_user');
//    utils = require('../utils');
/* GET home page. */
router.get('/', load_user, function(req, res) {
  if(req.user) {
    Room.find({}, function(err, roomsList){
        if(err) {
          res.render('index', { rooms: 'Null' });
        } else {
          res.render('index', {
                                rooms: roomsList,
                                isLogin: true });
        }
      });
  } else {
    Room.find({visiability: 'public'}, function(err, roomList) {
        if(err){
          res.render('index', {rooms: 'Null'});
        } else {
          res.render('index', {
                                rooms: roomList,
                                isLogin: false
                              }); 
        }
      });
  }
});
// Export route
module.exports = router;
