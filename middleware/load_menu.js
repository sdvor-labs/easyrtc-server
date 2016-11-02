let menuItem = require('../models/menu_item');

function loadMenu(req, res, next) {
    menuItem.find({}, function (err, items) {
            if (items) {
                req.menuItems = items;
                next();
            } else {
                req.menuItems = null;
                next();
            }
    });
}

module.exports = loadMenu;