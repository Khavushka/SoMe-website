//Fra Example A.276. Improved Routing for User Related Purposes, routes/users.js
const express = require('express');
const router = express.Router();
const auth = require("../controllers/authController.js");
const { forwardAuthenticated } = require('../config/auth');

/* registration form  */
router.get('/register', forwardAuthenticated, auth.register);
/* receive registration data  */
router.post('/register', auth.postRegister);

/* login form  */
router.get('/login', forwardAuthenticated, auth.login);
/* handle login */
router.post('/login', auth.postLogin)

/* logout, kills session and redirects to frontpage  */
router.get('/logout', auth.logout);

router.get('/verify/:permalink/:token', function (req, res) {
    // var permalink = req.params.permalink;
    // var token = req.params.token;

    // userSchema.findOne({permalink: permalink}, function (err, user) {
    //     if (user.verify_token == token) {
    //         console.log('that token is correct! Verify the user');

    //         User.findOneAndUpdate({'local.permalink': permalink}, {'local.verified': true}, function (err, resp) {
    //             console.log('The user has been verified!');
    //         });

    //         res.redirect('/login');
    //     } else {
    //         console.log('The token is wrong! Reject the user. token should be: ' + user.local.verify_token);
    //     }
    // });
});
module.exports = router;