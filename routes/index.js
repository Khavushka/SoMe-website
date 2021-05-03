// fra modelløsning A.s71
var express = require('express');
var router = express.Router();
const auth = require("../controllers/authController.js");
const yadda = require('../controllers/yaddaController.js');
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.user ? req.user.uid : null;   
    res.render('index', {
        title: 'Frontpage',
        user: user
    });
});
// feed
router.get('/feed', ensureAuthenticated, async function(req, res, next) {
    let users = await yadda.getUsers({});
    console.log(users);
    let user = req.user ? req.user.uid: null; // ? er if for det foran ?
    res.render('feed', {
        title: 'The feed',
        user: user,
        users
    });
    
});

// til post
router.get('/post', ensureAuthenticated, async function(req, res, next) {
    let users = await yadda.getUsers({});
    let user = req.user ? req.user.uid: null; // ? er if for det foran ?
    res.render('post', {
        title: 'New post',
        user: user,
        users
    });
    
});
router.post('/post', ensureAuthenticated);

//Henter brugere til aside listen
router.get('/', ensureAuthenticated, function(req, res) {

});


module.exports = router;