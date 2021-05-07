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
    res.redirect('/users/yaddaPeople');
});

/* unfollow på yaddaPeople */
router.get('/unfollow/:uid', ensureAuthenticated, function(req, res, next) {
    var uid = req.user.uid;
    var follows = req.params.uid;
    userController.follow(req, res, next);
    res.redirect('/users/yaddaPeople');
});

//yaddaPeople
router.get('/yaddaPeople', ensureAuthenticated, async function(req, res) {
    let user = req.user ? req.user.uid: null; // ? er if for det foran ?
    let uid = req.user.uid;
    let users = await userController.getUsers(req, res);
    let follows = await userController.getFollows(req, res);
    res.render('yaddaPeople', {
        title: 'All my yaddapeople',
        user: user, 
        users,
        follows
    });
});

module.exports = router;


// /* follow på aside */
// router.get('/feed/follow/:uid', ensureAuthenticated, function(req, res, next) {
//     var uid = req.user.uid;
//     var follows = req.params.uid;
//     userController.follow(req, res, next);
//     res.redirect('/feed');
// });

// /* unfollow på aside */
// router.get('/unfollow/:uid', ensureAuthenticated, function(req, res, next) {
//     var uid = req.user.uid;
//     var follows = req.params.uid;
//     userController.follow(req, res, next);
//     res.redirect('')
// });
