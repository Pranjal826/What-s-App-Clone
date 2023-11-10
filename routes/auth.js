const passport = require("passport");
const User = require('../models/userModel')
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
module.exports= function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  };