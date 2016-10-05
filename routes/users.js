let express = require('express'),
    router = express.Router(),
    utils = require('../utils.js');

/* GET users listing. */
router.get('/', function(req, res) {
  utils.utils('tokenVerifity', req.cookies.token).then(result=>{
      console.log(result);
  })
  //if(utils.utils('tokenVerifity', req.cookies.token)){
  //  res.send('Auth user!');    
  //} else {
  //  res.send('Nit auth user');
  //}
});

module.exports = router;
