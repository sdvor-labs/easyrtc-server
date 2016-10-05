let express = require('express'),
    router = express.Router(),
    Room = require('../models/room.js'),
    utils = require('../utils');
/* GET home page. */
router.get('/', function(req, res) {
  utils.utils('tokenVerifity', req.cookies.token).then(result=>{
      if(result) {
          Room.find({}, function(err, roomsList){
            if(err) {
              res.render('index', { rooms: 'Null' });
              } else {
                res.render('index', {
                                rooms: roomsList,
                                isLogin: true  
                              });
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
});

module.exports = router;
