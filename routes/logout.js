var express = require('express');
var router = express.Router();
const session = require('express-session')
const User = require('../models/userModel')
var upload = require("../utils/multer").single("dp");
const passport = require("passport");
const LocalStrategy = require("passport-local");
var upload = require("../utils/multer")
const isLoggedIn = require('./auth')
passport.use(new LocalStrategy(User.authenticate()));

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
  module.exports = router;
  