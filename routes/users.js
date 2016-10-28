let express = require('express'),
    router = express.Router(),
    utils = require('../utils');

/* GET users listing. */
router.get('/', function(req, res) {
  utils.utils('tokenVerifity', req.cookies.token).then(result=>{
      if(result) {
        res.send('Auth user!');
      } else {
        res.send('Nit auth user');
      }
  });
});

module.exports = router;
