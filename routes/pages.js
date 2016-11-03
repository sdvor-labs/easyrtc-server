let express = require('express'),
    router = express.Router(),
    Page = require('../models/page'),
    load_user = require('../middleware/load_user'),
    load_menu = require('../middleware/load_menu'),
    load_rooms = require('../middleware/load_rooms'),
    utils = require('../utils');
/* GET home page. */
router.get('/:page_name', load_user, load_menu, load_rooms, function(req, res) {
    /* Find page */
    Page.findOne({
              name: req.params.page_name
            }, function(err, findedPage){
                /* If error in BD*/
                if(err) {
                  utils.appLogger('fail', 'Fail finding document (page)', `Fail, when app try finding page (index). Error message: ${err}`);
                } else {
                    isLogin = null;
                     if (req.user) {
                        isLogin = true;
                     } else {
                        isLogin = false;
                     }
                    res.render('page', {
                        rooms: req.rooms,
                        isLogin: isLogin,
                        pageContent: findedPage,
                        menuItems: req.menuItems
                    });
                  }
              });
});
/* Export route */
module.exports = router;