// fra modelløsning A.s71
var express = require('express');
var router = express.Router();
const auth = require("../controllers/authController.js");
const yaddaController = require('../controllers/yaddaController.js');
const userController = require('../controllers/userController.js');
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.user ? req.user.uid : null; // ? er if for det foran ?
    res.render('index', {
        title: 'Frontpage',
        user: user
    });
});
// Feed/
router.get('/feed', ensureAuthenticated, async function(req, res, next) { //ensureAuthenticated sikrer, at man er logged ind
    let user = req.user ? req.user.uid: null; // ? er if for det foran ?
    let uid = req.user.uid;
    console.log(req.user);
    let users = await userController.getUsers(req, res);
    let follows = await userController.getFollows(req, res);
    //let yaddas = await yaddaController.getYaddas({});
    res.render('feed', {
        title: 'The feed',
        user: user,
        users,
        follows
        //yaddas 
    });
    
});

// til post
router.get('/post', ensureAuthenticated, async function(req, res, next) {
    let users = await userController.getUsers(req, res);
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
router.get('/yaddaForm/', ensureAuthenticated, async function(req, res) {
    let users = await userController.getUsers(req, res);
    let user = req.user ? req.user.uid: null;
    res.render('yaddaForm', {
        users,
        title: 'New post',
        user: user
    });
});

// get yaddaform med uid fra 
router.get('/yaddaForm/:uid', ensureAuthenticated, async function(req, res) {
    let user = req.user ? req.user.uid: null;
    let users = await userController.getUsers(req, res);
    let uid = req.params.uid;
    let friend = await yadda.gotoYaddaform(req, res); // friend fordi at vi snakker om en vi sender besked til. SÅ derfor ikke follow
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

//Dark/Light mode - SPØRG NIELS
router.get('/dashboard', ensureAuthenticated, async function(req, res) {
    res.render('dashboard');
});

module.exports = router;