let express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.clearCookie('token');
    res.redirect('index');
});

module.exports = router;