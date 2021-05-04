// fra modelløsning A.s71
var express = require('express');
var router = express.Router();
const auth = require("../controllers/authController.js");
const yadda = require('../controllers/yaddaController.js');
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.user ? req.user.uid : null; // ? er if for det foran ?
    res.render('index', {
        title: 'Frontpage',
        user: user
    });
});
// Feed/dashboard
router.get('/feed', ensureAuthenticated, async function(req, res, next) { //ensureAuthenticated sikrer, at man er logged ind
    let users = await yadda.getUsers({});
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


// get yaddaform - hvor man som bruger indtaster selv i formular, hvem der skal sendes til
router.get('/yaddaForm/', ensureAuthenticated);

// get yaddaform med uid fra 
router.get('/yaddaForm/:uid', ensureAuthenticated, async function(req, res) {
    let users = await yadda.getUsers({});
    let uid = req.params.uid;
    let user = req.user ? req.user.uid: null;
    let friend = await yadda.gotoYaddaform(req, uid, {}
        // ,{name: this.name,
        // avatar: this.avatar}
    );
    res.render('yaddaForm', {
        users,
        friend,
        title: 'yadda to ' + friend.name, // måske friend hvis user ikke virker
        user: user
    });
});

// post yaddaform
router.post('/yaddaForm', async function() {
    res.render('yaddaForm');
})

module.exports = router;