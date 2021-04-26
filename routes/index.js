var express = require('express');
var router = express.Router();
const TITLE = 'SoMe website';
const handleLogin = require('../models/user/handleLogin');
const handleUser = require('../models/user/handleUser');
const session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index', {
                title: TITLE, 
                subtitle: 'Front Page',
                authenticated: req.session && req.session.authenticated
              });
});


/*----------Register-----------*/
router.get('/register', async function(req, res, next) {
  res.render('register', {
    title: TITLE,
    subtitle: 'Register form',
    authenticated: req.session && req.session.authenticated
    });
});

router.post('/register', async function(req, res, next) {
  handleUser.postUsers(req, res, next);
  res.redirect('/');
});


/*-------------- Login-----------*/
router.get('/', function(req, res, next){
  res.render('handleLogin', {title: TITLE, subtitle: 'Login'});
});

router.post('/', async function(req, res, next) {
handleLogin.getLogin(req)
  .then( function (rc) {
    if (!rc)
      res.render('index', { title: 'Login', tf: "User not found", returnCode: rc }); // tf hvis bruger ikke findes = misery
    else	
      res.render('index', { title: 'Login', tf: "Logged in successfully",  returnCode: rc });
  });
});

router.post('/', async function(req, res, next) {
await login.getLogin(req)
  .then( function (rc) {
    if (!rc)
      res.render('index', { title: 'Login', tf: "Login failed", returnCode: rc });
    else  
      res.render('index', { title: 'Login', tf: "Logged in successfully", 
      authenticated: req.session && req.session.authenticated, returnCode: rc
         });
      });
});

/*------------Logud-----------*/
router.get('/logout', function(req, res, next){
  req.session.destroy();
  res.render('logout');
});

/*------------User-----------*/
// router.get('/', async function(req, res, next) {
//   let users = await handleuser.getUsers({}, {sort: {title: 1}});
//   res.render('', { title: TITLE, subtitle: 'Display User', users });
// });

// router.post('/', async function(req, res, next) {
//   let users = await handleuser.getUsers();
// });


module.exports = router;