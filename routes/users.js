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

/* follow */
router.get('/follow/:uid', ensureAuthenticated, async function(req, res) {
    var user = req.user.uid;
    var follows = req.params.uid;
    await userController.follow(req, res);
});

module.exports = router;