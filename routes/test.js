let express = require('express'),
    router = express.Router();

/* GET about listing. */
router.get('/', function(req, res) {
  res.render('widget', { title: 'Testing widget' });
});

module.exports = router;