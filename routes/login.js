let express = require('express'),
    router = express.Router();

/* GET about listing. */
router.get('/', function(req, res) {
  res.render('login', { title: 'login' });
});

router.post('/', function(req, res){
	res.render('login', {title: 'login'});
});

module.exports = router;