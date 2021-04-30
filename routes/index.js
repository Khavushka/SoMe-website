// fra modelløsning A.s71
var express = require('express');
var router = express.Router();
const auth = require("../controllers/authController.js");
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.user ? req.user.uid : null;   
    res.render('index', {
        title: 'Frontpage',
        user: user
    });
});

// til post
router.get('/post', ensureAuthenticated, function(req, res, next) {
    let user = req.user ? req.user.uid: !null; // ? er if for det foran ?
    //let verified = req.role.unverified ? req.role.unverified: null;
    res.render('post', {
        title: 'New post',
        user: user
    });
    
});
router.post('/post', ensureAuthenticated);


module.exports = router;