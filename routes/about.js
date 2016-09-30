let express = require('express'),
    router = express.Router();

/* GET about listing. */
router.get('/', function(req, res) {
  res.render('about', { title: 'About' });
});

module.exports = router;