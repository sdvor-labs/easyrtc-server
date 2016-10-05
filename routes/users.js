let express = require('express'),
    router = express.Router(),
    utils = require('../utils.js');

/* GET users listing. */
router.get('/', function(req, res) {
  utils.utils('tokenVerifity', req.cookies.token);
  res.send('respond with a resource');
});

module.exports = router;
