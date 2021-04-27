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

module.exports = router;