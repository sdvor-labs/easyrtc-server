let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js'),
    utils = require('../utils');

/* GET about listing. */
router.get('/', function(req, res) {
  utils.utils('tokenVerifity', req.cookies.token).then(result=>{
      if(result) {
          Room.find({}, function(err, roomsList){
            if(err) {
              res.render('about', { rooms: 'Null' });
              } else {
                res.render('about', {
                                rooms: roomsList,
                                isLogin: true  
                              });
              }
            });
      } else {
          Room.find({visiability: 'public'}, function(err, roomList) {
              if(err){
                res.render('about', {rooms: 'Null'});
              } else {
                res.render('about', {
                                    rooms: roomList,
                                    isLogin: false
                                    }); 
              }
            });
        }
  });
});

module.exports = router;