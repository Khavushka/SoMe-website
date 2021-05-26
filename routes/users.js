//Fra Example A.276. Improved Routing for User Related Purposes, routes/users.js
const express = require('express');
const router = express.Router();
const auth = require("../controllers/authController.js");
const userController = require('../controllers/userController.js');

const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

/* registration form */
router.get('/register', forwardAuthenticated, auth.register);
/* receive registration data */
router.post('/register', auth.postRegister);

/* login form */
router.get('/login', forwardAuthenticated, auth.login);
/* handle login */
router.post('/login', auth.postLogin);

/* logout, kills session and redirects to frontpage */
router.get('/logout', auth.logout);

//Til at vise avatar frem
router.get('/getimage/:uid', ensureAuthenticated, userController.lookupAvatar, async function(req, res) {
    let query = req.params.uid; 
}); 

router.get('/verify/:permalink/:token', async function (req, res) {
/* verify email */
    var permalink = req.params.permalink;
    var token = req.params.token;
    auth.verify(req, res);
});

/* follow på yaddaPeople */
router.get('/follow/:uid', ensureAuthenticated, function(req, res, next) {
    var uid = req.user.uid;
    var follows = req.params.uid;
    userController.follow(req, res, next);
});

/* unfollow på yaddaPeople */
router.get('/unfollow/:uid', ensureAuthenticated, function(req, res, next) {
    var uid = req.user.uid;
    var follows = req.params.uid;
    userController.unfollow(req, res, next);
});

//yaddaPeople som viser follows
router.get('/showsfollows', ensureAuthenticated, async function(req, res) {
    let user = req.user ? req.user.uid: null; 
    let uid = req.user.uid;
    let showsfollows = true;
    let users = await userController.getUsers(req, res);
    let follows = await userController.getFollows(req, res);
    res.render('yaddaPeople', {
        title: 'All my yaddapeople',
        showsfollows,
        user: user, 
        follows,
        users
    });
});

//yaddaPeople som viser andre end follows

router.get('/showsall', ensureAuthenticated, async function(req, res) {
    let user = req.user ? req.user.uid: null; 
    let uid = req.user.uid;
    let showsfollows = false;
    let follows = await userController.getFollows(req, res);
    let users = await userController.getUsers(req, res);
    res.render('yaddaPeople', {
        title: 'Some yaddapeople you might know',
        showsfollows,
        user: user, 
        users,
        follows
    });
});

// router til lookup user
router.get('/lookup/:userId', ensureAuthenticated, async function(req, res) {
    let userid = req.params.userId;
    let user = req.user ? req.user.uid: null;
    let uid = req.user.uid;
    let showsfollows = false;
    let follows = await userController.getFollows(req, res);
    let users = await userController.getUsers(req, res);
    res.render('yaddaPeople', {
        title: 'Some yaddapeople you might know',
        showsfollows,
        user: user, 
        users,
        follows
    });
});


module.exports = router;
