// fra modelløsning A.s71
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.user ? req.user.uid : null;
    res.render('index', {
        title: 'Frontpage',
        user: user
    });
});

module.exports = router;