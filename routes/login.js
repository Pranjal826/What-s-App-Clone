const isLoggedIn = require('./auth');
const passport = require("passport");
const User = require('../models/userModel')
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
const session = require('express-session')
var express = require('express');
var router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { admin: req.user });
  });
  
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error during login.');
      }
  
      if (!user) {
        // Modified line to send an alert and redirect
        return res.send('<script>alert("Username or Password is incorrect"); window.location="/login";</script>');
      }
  
      req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error during login.');
        }
        return res.send(`
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script>
          document.addEventListener('DOMContentLoaded', function () {
            try {
              Swal.fire({
                icon: "success",
                title: "Welcome ${req.user.username}!",
              }).then(() => {
                window.location.href = "/";
              });
            } catch (error) {
              console.error(error);
            }
          });
        </script>
      `);
      });      
    })(req, res, next);
  });
module.exports = router;
