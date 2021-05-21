//fra Example A.280. Authentication Config, config/auth.js

//Sikrer at alle routes til interne get/post requests er med en bruger som er logget ind
module.exports = {
    ensureAuthenticated: function(req, res, next) { //Middleware - den tjekker og sikrer at du er logget ind
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