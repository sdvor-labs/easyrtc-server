let express = require('express'),
    router = express.Router(),
    Page = require('../models/page'),
    load_user = require('../middleware/load_user'),
    load_menu = require('../middleware/load_menu'),
    load_rooms = require('../middleware/load_rooms'),
    utils = require('../utils');
/* GET home page. */
router.get('/', load_user, load_menu, load_rooms, function(req, res) {
  if(req.user) {
    Page.findOne({
              name: 'index'
            }, function(err, findedPage){
                if(err) {
                  utils.appLogger('fail', 'Fail finding document (page)', `Fail, when app try finding page (index). Error message: ${err}`);
                } else {
                  res.render('page', {
                                        rooms: req.rooms,
                                        isLogin: true,
                                        pageContent: findedPage,
                                        menuItems: req.menuItems
                                      });
                  }
              });
  } else {
    Page.findOne({
        name: 'index'
      }, function(err, findedPage){
                if(err) {
                  utils.appLogger('fail', 'Fail finding document (page)', `Fail, when app try finding page (index). Error message: ${err}`);
                } else {
                  res.render('page', {
                      rooms: req.rooms,
                      isLogin: true,
                      pageContent: findedPage,
                      menuItems: req.menuItems
                    });
                }
          });
  }
});
// Export route
module.exports = router;