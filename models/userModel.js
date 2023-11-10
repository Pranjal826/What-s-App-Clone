const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    validate: {
      validator: function (password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(password);
      },
      message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*). Minimum length is 6 characters.',
    },
  },
  dp: String,
  phone: {
    type: Number,
    unique: true,
  },
  resetPasswordOtp: {
    type: Number,
    default: -1,
  },
});

userSchema.plugin(plm);
const User = mongoose.model('User', userSchema);

module.exports = User;
