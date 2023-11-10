var express = require('express');
var router = express.Router();
const User=require('../models/userModel')
const passport = require("passport");
const LocalStrategy = require("passport-local");
const isLoggedIn = require('./auth')
passport.use(new LocalStrategy(User.authenticate()));

router.get('/showprofile', isLoggedIn, (req, res) => {
    res.render('showprofile', { currentuser: req.user });
  })

module.exports = router;