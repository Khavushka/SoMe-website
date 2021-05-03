//fra Example A.280. Authentication Config, config/auth.js

module.exports = {
    ensureAuthenticated: function(req, res, next) { //den tjekker om du er logget ind
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/users/login');
    },

    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/feed');
    }
};