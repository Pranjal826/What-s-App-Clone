var express = require('express');
var router = express.Router();
const session = require('express-session')
const User = require('../models/userModel')
const passport = require("passport");
const LocalStrategy = require("passport-local");
const isLoggedIn = require('./auth')

passport.use(new LocalStrategy(User.authenticate()));

router.get('/delete', isLoggedIn, async (req, res) => {
  const currentuser = req.user;
  try {
    await User.findByIdAndRemove(currentuser._id);
    req.session.destroy();

    // Display SweetAlert for successful deletion
    return res.send(`
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          try {
            Swal.fire({
              icon: "success",
              title: "Account Deleted",
              text: "Your account has been successfully deleted.",
            }).then(() => {
              window.location.href = "/login";
            });
          } catch (error) {
            console.error(error);
          }
        });
      </script>
    `);
  } catch (error) {
    console.error(error);

    // Display SweetAlert for deletion error
    return res.send(`
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          try {
            Swal.fire({
              icon: "error",
              title: "Error Deleting Account",
              text: "An error occurred while deleting your account. Please try again later.",
            }).then(() => {
              window.location.href = "/";
            });
          } catch (error) {
            console.error(error);
          }
        });
      </script>
    `);
  }
});

module.exports = router;
